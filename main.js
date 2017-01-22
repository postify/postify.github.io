/*global a*/
/*global L*/

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
m.tuneToPixFilename = "tuneToPix.txt";

//=============================//
//==========| VIEW |===========//
//=============================//
//make v (our view) an alias for our api a
var v = {}; // "a" is our api object from file a.js loaded with index.html
L.attachAllElementsById(v);
v.window = this;
v.window.id = "window";
v.clearAllText = function clearAllText(){
    v.txtMusicFile.value = "";
    v.txtMusicFile.value = "";
    v.txtDeleteFile.value = "";    
    v.filesInfo.innerHTML = "";
};

//=============================//
//=======| CONTROLLER |========//
//=============================//
var c = {};
c.initialize = function initialize(){
    //------| check for, and use localstorage |-------//
    if(window.localStorage){
        if(!!window.localStorage.getItem(m.tuneToPixFilename)){
            a.tuneToPix = JSON.parse(window.localStorage.getItem(m.tuneToPixFilename));
        }
        setTimeout(function(){
            var tunes = Object.keys(a.tuneToPix);
            tunes.forEach(tune=>{
                console.log(
                   `Tune: ${tune}, 
                    Pix: ${a.tuneToPix[tune]}`);
            });
        },2000);
    }
    //-----------------------------------------------//  
    a.initialize(verifyFolders);
    function verifyFolders(){
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
                a.showFiles();
                recordFolderIds();
            }
            else if ( musicFolderMissing ){
                a.createFolder(a.musicFolderName, recordFolderIds);
            }
            else if ( pictureFolderMissing ){
                a.createFolder(a.pictureFolderName, recordFolderIds);  
            }
            else if( bothFoldersMissing ){
                a.createFolder(a.musicFolderName, recordFolderIds);
                a.createFolder(a.pictureFolderName, recordFolderIds);
            }

            function recordFolderIds(){
                //capture the folder IDs so we can save files to those folders
                requiredFolders.forEach(file=>{
                    if(file.name === a.musicFolderName){a.musicFolderId = file.id}
                    if(file.name === a.pictureFolderName){a.pictureFolderId = file.id}
                });
                //-----------------------------------
                a.allFilesArray.forEach(file=>{
                    if(file.name === m.tuneToPixFilename){
                        a.tuneToPixFileId = file.id;
                    }
                });
                //-----------------------------------
            }
        });
    }     
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
        if (source === v.btnSaveFiles){
            if(v.txtMusicFile.value !== ""){
                m.chosenMusicFilename = v.txtMusicFile.value;
            }
            if(v.txtPictureFile.value !== ""){
                m.chosenPictureFilename = v.txtPictureFile.value;
            }
            a.saveMusicFile(m.chosenMusicFile);
            a.savePictureFile(m.chosenPictureFile);
            
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
        else if(source === v.btnGetMetaData){
            a.getFilesMetaData(a.localFileMetaDataName, function(data){
                var list = "";
                data.forEach(dataObject=>{
                    list += dataObject.name + '\n';
                });
                console.log(list);
            });           
        }
        else if(source === v.btnSetMetaData){
            a.setFilesMetaData(a.localFileMetaDataName, function(data){
                var list = "";
                data.forEach(dataObject=>{
                    list += dataObject.name + '\n';
                });
                console.log(list);
            });           
        }
        else if(source === v.btnDeleteFile){
            a.deleteFile(v.txtDeleteFile.value);
            v.clearAllText();
        }
    }//----| END of mousedown handlers |----//
    
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
