/*global $*/
var view = $;

//================//
//====| VIEW |====//
//================//
view.holder =  // outer div of the project
view.app =     // the app div
view.msg = // place where test results are explained
view.folderName = // user's type sht name of the folder here
view.slider = //range type input
//view.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
view.attachDomObjects();
//---| attach all DOM-related items |---//
view.initialize = function initialize(){
    view.adjustRem(8, 20);
    //etc.
};

//=================//
//====| MODEL |====//
//=================//
var model = {
     windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,resized: false
    ,pendingEvents: []
    ,updateModelBusy: false
    ,eventCount: 0
};

//======================//
//====| CONTROLLER |====//
//======================//
var controller = {
     registerEvent: function registerEvent(e){
         model.pendingEvents.push(e);
         model.eventCount += 1;
         while(model.pendingEvents.length !== 0 && !model.updateModelBusy){
            model.updateModelBusy = true;             
            let nextEventObject = model.pendingEvents.shift();
            controller.updateModel(nextEventObject, controller.updateView);
         }
     }
    ,updateModel: function updateModel(e, updateView){

        //---------------------------//
        // update model here
        if(e.type === "resize"){
            model.windowWidth = window.innerWidth;
            model.windowHeight = window.innerHeight;
            model.resized = true;
        }
        //---------------------------//
        setTimeout(function(){
            updateView(e);            
            model.updateModelBusy = false;
        },1);
    }
    ,updateView: function updateView(evt){
        $(view.msg).html(evt.target.id + ": "+ evt.type);
        view.folderName.value = model.eventCount;
        
        if(model.resized){
            $.adjustRem();
        }
    }
    ,monitoredEvents: [
        ,"keydown"
        ,"keyup"
        ,"mousedown"
        ,"mouseup"
        ,"mouseover"
        ,"mouseout"
        ,"resize"
        ,"focus"
        ,"mousemove"
        ,"input"
    ]
};

//====| app "starts" here |====//
view(window).on("load", function(){
    
    view.initialize();
    
    controller.monitoredEvents.forEach(eventType=>{
        $(window).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing it own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down)
     });
});
//====| app "ends" here |====//
