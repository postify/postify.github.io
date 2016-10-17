/*global $*/
var view = $;
//================//
//====| VIEW |====//
//================//
//---| attach all DOM-related items |---//
view.holder =  // outer div of the project
view.app =     // the app div
view.slider = // range type inpuit slider
view.msg = //div that holds results of tests, etc.
//view.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
view.attachDomObjects();
view.initialize = function initialize(){
    view.adjustRem(8, 30);
    $.slider.value = 0;
    $.player = model.player;
    $.player.setAttribute("id","player");
    $.player.src = model.musicSource;
    $.player.volume = 0;
    $.player.play();
};

//=================//
//====| MODEL |====//
//=================//
//Anugama - Silk Tree.mp3
var model = {
     windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,resized: false    
    ,player: document.createElement('audio')
    ,musicSource: "https://HussMalik.github.io/music/Chicago - Introduction.mp3"
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
            controller.updateModel(nextEventObject);
         }
     }
    ,updateModel: function updateModel(e){
        model.updateModelBusy = true;        
        //---------------------------//
        if(e.type === "resize"){
            model.windowWidth = window.innerWidth;
            model.windowHeight = window.innerHeight;
            model.resized = true;
        }
        model.eventCount += 1;         
        //---------------------------//
        controller.updateView(e);            
        model.updateModelBusy = false;

    }
    ,updateView: function updateView(evt){
        if(!(evt.type === "mousemove" && evt.target.id === 'slider')){        
            $(view.msg).html(evt.target.id + ": "+ evt.type);
           
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

//=====================//
//====| APP START |====//
//=====================//
view(window).on("load", function(){
    
    view.initialize();
    /**
        After initializing:
        1.) Catch all user-generated event objects
            of interest at a high level of the DOM element tree. Here we 
            catch them all at the window (global) object.
        2.) Catch all audio player generated events at the player.
        3.) That's it. Let the controller do all the work:
                a.) Register all event objects in a "wait your turn" queue (an array).
                b.) RegisterEvent calls upddateModel, which "calls back" updateView.
    */
    controller.monitoredDomEvents.forEach(eventType=>{
        $(window).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing its own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down the DOM tree)
     });
     
    controller.monitoredAudioEvents.forEach(eventType=>{
        $($.player).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing its own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down the DOM tree)
     }); 
     
});//================//
//====| APP END |====//
//===================//