
/*global x*/
//========================//
//======| MODEL |=========//
//========================//
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

//========================//
//=======| VIEW |=========//
//========================//
/*
<div id="app">
    <button id="btnCreateFolder">Create Folder</button> <input id="txtCreateFolder"type="text" size="30"><br><br>
    <button id="btnShowFiles">Show Files</button> <input id="txtShowFiles" type="text" size="30"><br><br>
    <button id="btnSaveFile">Save File</button> <input id="txtSaveFile" type="text" size="30"><br><br>
    <button id="btnGetFile">Get File</button> <input id="txtGetFile" type="text" size="30"><br><br>
    <button id="btnDeleteFile"> Delete File</button> <input id="txtDeleteFile" type="text" size="30">           
</div>
*/
var v = {};
v.id = function(idString){
    return document.getElementById(idString);
};
v.btnShowFiles=v.id("btnShowFiles");
v.btnSaveFile=v.id("btnSaveFile");
v.btnGetFile=v.id("btnGetFile");
v.btnDeleteFile=v.id("btnDeleteFile");
v.app = v.id("app");


//========================//
//====| CONTROLLER |======//
//========================//
var c = {};
c.handler = function(e){
    var target = e.target;//source of the event
    var id = target.id; //id of event source
    var type = e.type; //type of event
    
    if (target === v.btnShowFiles){
        x.showFiles("asdfasdfsadfafasdf");
    }
    else if (target === v.btnSaveFile){
        x.saveFile();
    }
    else if (target === v.btnGetFile){
        x.getFile();
    }
    else if (target === v.btnDeleteFile){
        x.deleteFile("kill this file!!!");
    }
    
    /*
    if(target !== v.app){
        alert(type + ": "+ id);        
    }
    */
};

//========================//
//======| STARTUP|========//
//========================//
window.addEventListener("load", function(e){
    window.addEventListener("click", c.handler);
    //window.addEventListener("mouseover", c.handler);
    
});    
