/*global $*/
/*global gapi*/
var view = $;
//================//
//====| VIEW |====//
//================//
//---| attach all DOM-related items |---//
view.holder =  // outer div of the project
view.app =     // the app div
view.msg = // place where test results are explained
view.folderName = // user's type sht name of the folder here
//view.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
view.attachDomObjects();
view.initialize = function initialize(){
    view.adjustRem(8, 30);
};


//=================//
//====| MODEL |====//
//=================//
//Anugama - Silk Tree.mp3
var model = {
     resized: false 
    ,pendingEvents: []
    ,updateModelBusy: false
    ,sliderMaximum: 10000
    //drive info
    ,folderName: ""
    ,folderId: ""
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
            model.resized = true;
        }
        //====| KEYUP for drive name |====//
        if(e.type === "keyup"){
            if(e.keyCode === 13){
                model.folderName = view.folderName.value.trim();
                //gapi.client.load('drive', 'v3', this.createFolder);
                this.createFolder();
            }
        }
        //---------------------------//
        controller.updateView(e);            
        model.updateModelBusy = false;

    }
    ,updateView: function updateView(evt){
        if(!(evt.type === "mousemove" && evt.target.id === 'slider')){        
            $(view.msg).html(evt.target.id + ": "+ evt.type);
        }
        if(model.resized){
            $.adjustRem();
        }

        /*
        if(evt.type === "timeupdate" && evt.target.id === 'player'){
            if(model.player.duration !== 0 && !isNaN( model.player.duration) ){
                let fraction = model.player.currentTime / model.player.duration;
                //etc.
            }
        }
        if(evt.type === "input" && evt.target.id === "slider"){
           if(model.player.duration !== 0 && !isNaN( model.player.duration) ){
               let fraction = 1*$.slider.value / model.sliderMaximum;
               //etc.
            }
        }
        */

    }
    ,createFolder: function createFolder(){
        //http://stackoverflow.com/questions/12698541/how-to-create-a-folder-on-google-drive-using-javascript
       var request = gapi.client.files.insert({
           'path': '/drive/v3/files/',
           'method': 'POST',
           'headers': {
               'Content-Type': 'application/json'
           },   
           'body':{
               "title" : model.folderName,
               "mimeType" : "application/vnd.google-apps.folder",
           }
       });
       request.execute( function(response) { 
            alert(response);
       });
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
     /*
    controller.monitoredAudioEvents.forEach(eventType=>{
        $($.player).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing its own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down the DOM tree)
     }); 
     */
     
});//================//
//====| APP END |====//
//===================//