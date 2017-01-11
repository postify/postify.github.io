/**
<button id="btnDeleteFile"> Delete File</button> <input id="txtDeleteFile" type="text"><br>
<button id="btnGetFile"> Get File </button> <input id="txtGetFile" type="text"  ><br>
<button id="btnCreateFolder"> Create Folder </button> <input id="txtCreateFolder" type="text" ><br>
<button id="https://drive.google.com/uc?export=download&id="> Show Files </button><br>
*/
//====================================//
//==========| START OF APP |==========//
//====================================//
// 0BzFXj3py69BBZTNqeFlkOFpMdHM
/*
<audio controls="controls" src="https://drive.google.com/uc?export=download&id=0BzFXj3py69BBcUFNV3BsWkNJQk0" type='audio/mp3'>
</audio>
*/
// https://developers.google.com/drive/v2/reference/files/get
// http://stackoverflow.com/questions/37860901/how-to-use-google-drive-api-to-download-files-with-javascript
// http://sourcey.com/html5-video-streaming-from-google-drive/
// https://developers.google.com/web/fundamentals/getting-started/primers/promises
// http://www.itgo.me/a/689792261276346750/overwrite-an-image-file-with-google-apps-script/36806395
// https://developers.google.com/apis-explorer/#p/drive/v3/
// https://developers.google.com/drive/v3/web/manage-uploads
// https://developers.google.com/drive/v3/web/savetodrive
// http://stackoverflow.com/questions/10317638/inserting-file-to-google-drive-through-api
// https://developers.google.com/drive/v3/web/appdata
// http://stackoverflow.com/questions/13736532/google-drive-api-list-multiple-mime-types
// http://gappstips.com/google-drive/find-specific-file-types-in-google-drive/
// https://advancedweb.hu/2015/05/26/accessing-google-drive-in-javascript/
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
m.googleMusicSource = "https://drive.google.com/uc?export=download&id=";
m.tuneToPixFilename = "tuneToPix.txt"

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

//=============================//
//=======| CONTROLLER |========//
//=============================//
var c = {};
c.initialize = function initialize(){
    //Attach to the view all elements with an id.
    //Their property names will be the same as their ids.
    v.attachAllElementsById(v);
    v.window = this;
    v.window.id = "window";
    
    v.clearAllText();
    v.initialize(verifyFolders);
    function verifyFolders(){
        //alert("first authorization request.");
        a.showFiles(function(){
            var requiredFolders = a.allFilesArray.filter(file=>{
                var properFolder = !!(file.name === a.musicFolderName || file.name === a.pictureFolderName);
                return properFolder;
            });
            const bothFoldersExist =    requiredFolders.some(file=>file.name === a.musicFolderName) &&
                                        requiredFolders.some(file=>file.name === a.pictureFolderName);
            const musicFolderMissing =  !requiredFolders.some(file=>file.name === a.musicFolderName) &&
                                        requiredFolders.some(file=>file.name === a.pictureFolderName);
            const pictureFolderMissing= requiredFolders.some(file=>file.name === a.musicFolderName) &&
                                        !requiredFolders.some(file=>file.name === a.pictureFolderName);
            const bothFoldersMissing =  !requiredFolders.some(file=>file.name === a.musicFolderName) &&
                                        !requiredFolders.some(file=>file.name === a.pictureFolderName);
            if ( bothFoldersExist ){
                v.showAllButtons();
                a.showFiles();
                recordFolderIds();
            }
            else if ( musicFolderMissing ){
                v.createFolder(a.musicFolderName, recordFolderIds);
            }
            else if ( pictureFolderMissing ){
                v.createFolder(a.pictureFolderName, recordFolderIds);  
            }
            else if( bothFoldersMissing ){
                v.createFolder(a.musicFolderName, recordFolderIds);
                v.createFolder(a.pictureFolderName, recordFolderIds);
            }

            function recordFolderIds(){
                //capture the folder IDs so we can save files to those folders
                requiredFolders.forEach(file=>{
                    if(file.name === a.musicFolderName){v.musicFolderId = file.id}
                    if(file.name === a.pictureFolderName){v.pictureFolderId = file.id}
                });
                //-----------------------------------
                a.allFilesArray.forEach(file=>{
                    if(file.name === m.tuneToPixFilename){
                        a.tuneToPixFileId = file.id;
                        //alert("a.tuneToPixFileId = " + file.id);
                    }
                });
                //-----------------------------------
            }
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
    m.musicFolderExists;//???
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

    function deleteOLdTuneToPix(callback){
        a.allFilesArray.forEach(file=>{
            if(file.name === m.tuneToPixFilename){
                a.deleteFile(file.id);
            }
        });
        callback(getNewTuneToPixFileId);
    }    
    
    function saveNewTuneToPix (callback){
        a.tuneToPix[m.chosenMusicFilename] = m.chosenPictureFilename;
        //-----| test for, and save to localStorage |-------//
        if(window.localStorage){
            window.localStorage.setItem(a.tuneToPixFilename, JSON.stringify(a.tuneToPix));
        }
        //-------------------------------------------------//
        var blob = new window.Blob([JSON.stringify(a.tuneToPix)], {type : 'application/json'});
        a.uploadFile(blob, m.tuneToPixFilename, a.musicFolderId);
        a.showFiles(callback);
    }    
    
    function getNewTuneToPixFileId(){
        a.allFilesArray.forEach(file=>{
            if(file.name === m.tuneToPixFilename){
                a.tuneToPixFileId = file.id;
            }
        });
    }
    //buttons
    if(type === "mousedown"){
        if (source === v.btnShowFiles){
            v.showFiles();
        }
        else if (source === v.btnSaveFiles){
            if(v.txtMusicFile.value !== ""){
                m.chosenMusicFilename = v.txtMusicFile.value;
            }
            if(v.txtPictureFile.value !== ""){
                m.chosenPictureFilename = v.txtPictureFile.value;
            }
            v.saveMusicFile(m.chosenMusicFile);
            v.savePictureFile(m.chosenPictureFile);
            
            /**
                Use the functions defined above:
                a.) deleteOldToPix to delete the old version(s) of file(s)
                b.) then execute the callback saveNewTuneToPix to replace them
                c.) then execute the next callback getNewTuneToPixFileId to record the new fileId
            */
            deleteOLdTuneToPix(saveNewTuneToPix);
          
        }
        else if(source === v.btnChooseMusic){
            v.musicFileElement.click();
        }
        else if(source === v.btnChoosePicture){
            v.pictureFileElement.click();
        }
        else if(source === v.btnGetFileContents){
            //setTimeout(function(){
                a.getFileContents(v.txtFileContentId.value);                
            //},2000);
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
        else if(id === "pictureFileElement"){
            m.chosenPictureFile = v.pictureFileElement.files[0];
            m.chosenPictureFilename = v.pictureFileElement.files[0].name;
            v.txtPictureFile.value = m.chosenPictureFilename;
        }
        if(id === "chooser"){
            if(v.chooser.selectedIndex !== 0){
                v.player.src = m.googleMusicSource + v.chooser.options[v.chooser.selectedIndex].value;
                v.player.play();
            }
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