
/*global a*/
/*global gapi*/
//=============================//
//=========| MODEL |===========//
//=============================//
var m = {
    CLIENT_ID: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com',
    SCOPE: 'https://www.googleapis.com/auth/drive.appfolder',
    IMMEDIATE: false,
    authToken: {
        client_id: this.CLIENT_ID,
        scope: this.SCOPE,
        immediate: this.IMMEDIATE
    },
    musicFolderExists: false,
    songListJason: {},
    savedFile: "", //most recently saved music file (which hopefully contains a picture)
};

//=============================//
//==========| VIEW |===========//
//=============================//
//make v (our view) an alias for our api a
var v = a;
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
//------------------------//
//-----| UPDATE MODEL |---//
//------------------------//
c.updateModel = function(e, updateView){
    var target = e.target;//source of the event
    var id = target.id; //id of event source
    var type = e.type; //type of event
    showEvent(e);
    updateView(e);
    //----| helpers |----//
    function showEvent(e){
        v.msg.innerHTML = `${id}, ${type}`;
    }
};
//------------------------//
//-----| UPDATE VIEW |---//
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


window.addEventListener("load", function(e){

    //window.addEventListener("mouseover", c.handler);
    
});    
