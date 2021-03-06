//===================================//
//==========| START OF APP|==========//
//===================================//

// https://developers.google.com/drive/v3/web/savetodrive
// http://stackoverflow.com/questions/10317638/inserting-file-to-google-drive-through-api
// https://developers.google.com/drive/v3/web/appdata
// http://stackoverflow.com/questions/13736532/google-drive-api-list-multiple-mime-types
// http://gappstips.com/google-drive/find-specific-file-types-in-google-drive/

// "a" is our api object from file a.js loaded with index.html
/*global a*/

//=============================//
//=========| MODEL |===========//
//=============================//
var m = {};
m.songListJson = {};
m.chosenMusicFile = "";
m.chosenPictureFile = "";
m.chosenMusicFilename = "";
m.chosenPictureFilename = "";


//=============================//
//==========| VIEW |===========//
//=============================//
//make v (our view) an alias for our api a
var v = a; // "a" is our api object from file a.js loaded with index.html
v.id = function(idString){
    return document.getElementById(idString);
};
v.clearAllText = function clearAllText(){
    document.querySelectorAll("input[type=text]").forEach(element=>{
        element.value = "";
    });
};
v.showAllButtons = function showAllButtons(){
    var allButtons = document.querySelectorAll("button, input[type=button]");
    allButtons.forEach(button=>{
        button.style.visibility = "visible";
    });
};
v.attachAllElementsById = function attachAllElementsById(attachHere){
    var allElements = document.getElementsByTagName('*');
    [].forEach.call(allElements,function(element){
        attachHere[element.id] = element;
    });
};
/*
v.musicFileElement = v.id("musicFileElement");
v.pictureFileElement = v.id("pictureFileElement");
v.btnChooseMusic = v.id("btnChooseMusic");
v.btnChoosePicture = v.id("btnChoosePicture");
v.btnSaveFiles = v.id("btnSaveFiles");
v.btnShowFiles = v.id("btnShowFiles");
v.btnGetFile = v.id("btnGetFile");
v.btnCreateFolder = v.id("btnCreateFolder");
v.btnDeleteFile = v.id("btnDeleteFile");
v.txtMusicFile = v.id("txtMusicFile");
v.txtPictureFile = v.id("txtPictureFile");
v.txtGetFile = v.id("txtGetFile");
v.txtDeleteFile = v.id("txtDeleteFile");
v.txtCreateFolder = v.id("txtCreateFolder");
v.filesInfo = v.id("filesInfo");
v.msg = v.id("msg");
v.app = v.id("app");
v.authMsg = v.id("authMsg");
*/
v.attachAllElementsById(v);


v.window = this;
v.window.id = "window";



//=============================//
//=======| CONTROLLER |========//
//=============================//
var c = {};
c.initialize = function initialize(){
    v.clearAllText();
    v.initialize(verifyFolders);
    function verifyFolders(){
        //alert("first authorization request.");
        a.showFiles(function(){
            var requiredFolders = a.allFilesArray.filter(file=>{
                var properFolder = !!(file.name === "music" || file.name === "pictures");
                return properFolder;
            });
            if ( requiredFolders.some(file=>file.name === "music") && 
                 requiredFolders.some(file=>file.name === "pictures") ){
                v.btnShowFiles.style.visibility = "visible";
                a.showFiles();
                //capture the folder IDs sowm we can svae files to those folders
                requiredFolders.forEach(file=>{
                    if(file.name === "music"){v.musicFolderId = file.id}
                    if(file.name === "pictures"){v.pictureFolderId = file.id}
                });
                
            }            
            if ( requiredFolders.some(file=>file.name === "music") ){
                requiredFolders.forEach(file=>{
                    if(file.name === "music"){v.musicFolderId = file.id}
                });
            }
            else{
                v.createFolder("music", verifyPictureFolder);                
            }//----------------
            function verifyPictureFolder(){
                if ( requiredFolders.some(file=>file.name === "pictures") ){
                    v.btnShowFiles.style.visibility = "visible";
                    a.showFiles();
                    requiredFolders.forEach(file=>{
                        if(file.name === "pictures"){v.pictureFolderId = file.id}
                        
                    });
                }
                else{
                    v.createFolder("pictures");                
                }
            }
            //-----------------
        });
    }     
    //get authorized to verify a folder on the site named "music"
    //else get authorized to create one, save some intro music files there, and ...
    //welcome new user
};

//-----| UPDATE model |---//

c.updateModel = function(e, updateView){
    var source = e.target;//source of the event
    var id = source.id; //id of event source
    var type = e.type; //type of event
    
    showEvent(e);
    updateView(e);
    m.musicFolderExists;
    //----| helpers |----//
    function showEvent(e){
        v.msg.innerHTML = `${id}, ${type}`;
    }
};

//-----| UPDATE view |----//

c.updateView = function(e){
    var keyCode = e.which;
    var enter = 13;
    var source = e.target;
    var id = source.id; //id of event source    
    var type = e.type;
    
    //buttons
    if(type === "mousedown"){
        if (source === v.btnShowFiles){
            v.showFiles();
        }
        else if (source === v.btnSaveFiles){
            v.saveMusicFile(v.txtMusicFile.value);
            v.savePictureFile(v.txtPictureFile.value);
        }
        else if (source === v.btnGetFile){
            v.getFile(v.txtGetFile.value);
        }
        else if (source === v.btnDeleteFile){
            v.deleteFile(v.txtDeleteFile.value);
        }
        else if (source === v.btnCreateFolder){
            v.createFolder(v.txtCreateFolder.value);
        }
        else if(source === v.btnChooseMusic){
            v.musicFileElement.click();
        }
        else if(source === v.btnChoosePicture){
            v.pictureFileElement.click();
        }
    }
    
    //keycode
    if(keyCode && keyCode === enter){
        if (source === v.txtSaveFile){
            v.saveFile(v.txtSaveFile.value, m.chosenFile);
        }
        else if (source === v.txtGetFile){
            v.getFile(v.txtGetFile.value);
        }
        else if (source === v.txtDeleteFile){
            v.deleteFile(v.txtDeleteFile.value);
        }
        else if (source === v.txtCreateFolder){
            v.createFolder(v.txtCreateFolder.value);
        }
    }
    
    //file chosen
    if(type == "change"){
        if (id == "musicFileElement"){
            m.chosenMusicFile = v.musicFileElement.files[0];
            m.chosenMusicFilename = v.musicFileElement.files[0].name;
            v.txtMusicFile.value = m.chosenMusicFilename;    
        }
        else if(id == "pictureFileElement"){
            m.chosenPictureFile = v.pictureFileElement.files[0];
            m.chosenPictureFilename = v.pictureFileElement.files[0].name;
            v.txtPictureFile.value = m.chosenPictureFilename;
        }
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
     "resize",
     "keypress",
     "change"].forEach(eventType=>{
        window.addEventListener(eventType, function(event){
           c.updateModel(event, c.updateView);
        });        
    });
};
//=================================//
//==========| END OF APP|==========//
//=================================//