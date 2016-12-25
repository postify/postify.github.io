//===================================//
//==========| START OF APP|==========//
//===================================//

// "a" is our api object from file a.js loaded with index.html
/*global a*/

//=============================//
//=========| MODEL |===========//
//=============================//
var m = {
    CLIENT_ID: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com',
    SCOPE: 'https://www.googleapis.com/auth/drive.appfolder',
    IMMEDIATE: true,
    authToken: {
        client_id: this.CLIENT_ID,
        scope: this.SCOPE,
        immediate: this.IMMEDIATE
    },
    musicFolderExists: false,
    songListJson: {},
    savedFile: "", //most recently saved music file (which hopefully contains a picture)
};

//=============================//
//==========| VIEW |===========//
//=============================//
//make v (our view) an alias for our api a
var v = a; // "a" is our api object from file a.js loaded with index.html
v.id = function(idString){
    return document.getElementById(idString);
};
v.btnShowFiles=v.id("btnShowFiles");
v.btnSaveFile=v.id("btnSaveFile");
v.btnGetFile=v.id("btnGetFile");
v.btnDeleteFile=v.id("btnDeleteFile");
v.msg = v.id("msg");
v.app = v.id("app");
v.authMsg = v.id("authMsg");
v.window = this;
v.window.id = "window";


//=============================//
//=======| CONTROLLER |========//
//=============================//
var c = {};
c.initialize = function initialize(){
    //get authorized to verify a folder on the site named "music"
    //else get authorized to create one, and ...
    //welcome noew user
    
};
//------------------------//
//-----| UPDATE MODEL |---//
//------------------------//
c.updateModel = function(e, updateView){
    var target = e.target;//source of the event
    var id = target.id; //id of event source
    var type = e.type; //type of event
    showEvent(e);
    updateView(e);
    m.musicFolderExists;
    //----| helpers |----//
    function showEvent(e){
        v.msg.innerHTML = `${id}, ${type}`;
    }
};
//------------------------//
//-----| UPDATE VIEW |----//
//------------------------//
c.updateView = function(e){

    if (e.target === v.btnShowFiles && e.type === "mousedown"){
        v.showFiles("asdfasdfsadfafasdf");
    }
    else if (e.target === v.btnSaveFile && e.type === "mousedown"){
        v.saveFile();
    }
    else if (e.target === v.btnGetFile && e.type === "mousedown"){
        v.getFile();
    }
    else if (e.target === v.btnDeleteFile && e.type === "mousedown"){
        v.deleteFile("kill this file!!!");
    }
};

//=============================//
//=========| STARTUP|==========//
//=============================//
window.onload = function(){
    c.initialize();
    
    ["mousedown",
     "mouseup",
     "mouseover",
     "mouseout",
     "resize"].forEach(eventType=>{
        window.addEventListener(eventType, function(event){
           c.updateModel(event, c.updateView);
        });        
    });
};
//=================================//
//==========| END OF APP|==========//
//=================================//