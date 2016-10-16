/*global $*/
var view = $;

//================//
//====| VIEW |====//
//================//
//---| attach all DOM-related items |---//
view.holder =  // outer div of the project
view.app =     // the app div
view.msg = // place where test results are explained
view.folderName = // user's type sht name of the folder here
view.slider = //range type input
//view.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
view.attachDomObjects();


//=================//
//====| MODEL |====//
//=================//
//Anugama - Silk Tree.mp3
var model = {
     windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,player: document.createElement('audio')
    ,musicSource: "https://HussMalik.github.io/music/Chicago - Introduction.mp3"
    ,resized: false
    ,pendingEvents: []
    ,updateModelBusy: false
    ,eventCount: 0
    ,sliderMaximum: 10000
};

//======================//
//====| CONTROLLER |====//
//======================//
var controller = {
     registerEvent: function registerEvent(e){
         model.pendingEvents.push(e);
         while(model.pendingEvents.length !== 0 && !model.updateModelBusy){
            let nextEventObject = model.pendingEvents.shift();
            controller.updateModel(nextEventObject, controller.updateView);
         }
     }
    ,updateModel: function updateModel(e, updateView){
        model.updateModelBusy = true;        
        //---------------------------//
        // update model here
        if(e.type === "resize"){
            model.windowWidth = window.innerWidth;
            model.windowHeight = window.innerHeight;
            model.resized = true;
        }
        model.eventCount += 1;         
        //---------------------------//
        updateView(e);            
        model.updateModelBusy = false;

    }
    ,updateView: function updateView(evt){
        if(!(evt.type === "mousemove" && evt.target.id === 'slider')){        
            $(view.msg).html(evt.target.id + ": "+ evt.type);
            view.folderName.value = model.eventCount;            
        }
        if(evt.type === "timeupdate" && evt.target.id === 'player'){
            if(model.player.duration !== 0 && !isNaN( model.player.duration) ){
                let fraction = model.player.currentTime / model.player.duration;
                $.slider.value = fraction * model.sliderMaximum;   
            }
        }
        if(evt.type === "input" && evt.target.id === "slider"){
           if(model.player.duration !== 0 && !isNaN( model.player.duration) ){
               let fraction = 1*$.slider.value / model.sliderMaximum;
               model.player.currentTime = model.player.duration * fraction;
           }
        }
        if(evt.type === 'ended' && evt.target.id === 'player'){
            $.player.currentTime = 0;
            $.slider.value = 0;
        }
        if(model.resized){
            $.adjustRem();
        }
    }
    ,monitoredDomEvents: [
         "keydown"
        ,"keyup"
        ,"mousedown"
        ,"mouseup"
        ,"mouseover"
        ,"mouseout"
        ,"resize"
        ,"focus"
        ,"mousemove"
        ,"input"
        //music player events

    ]
    ,monitoredAudioEvents: [
         "timeupdate"
        ,"ended"
        ,"volumechange"
        ,"progress"
        ,"error"
        
    ]
};

view.initialize = function initialize(){
    view.adjustRem(8, 30);
    $.slider.value = 0;
    $.player = model.player;
    $.player.src = model.musicSource;
    $.player.setAttribute("controls", "controls");
    $.player.setAttribute("id", "player");
    $.player2 = document.createElement('audio');
    $.player2.src = model.musicSource;
    $.player2.volume = 0.5;
    $.player.play();
    /*
    setTimeout(function(){
        $.player2.play();
    },48000);
    */
    //etc.
};

//====| app "starts" here |====//
view(window).on("load", function(){
    
    view.initialize();
    
    controller.monitoredDomEvents.forEach(eventType=>{
        $(window).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing it own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down)
     });
     
    controller.monitoredAudioEvents.forEach(eventType=>{
        $($.player).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing it own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down)
     }); 
     
    controller.monitoredAudioEvents.forEach(eventType=>{
        $($.player2).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing it own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down)
     });      
});
//====| app "ends" here |====//
