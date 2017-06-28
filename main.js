/*global a*/
/*global L*/

//=============================//
//==========| VIEW |===========//
//=============================//
var v = {}; 
v.window = this;
v.window.id = "window";
L.attachAllElementsById(v);

v.clearAllText = function clearAllText(){
    v.txtMusicFile.value = "";
    v.txtPictureFile.value = "";
    v.txtDeleteFile.value = "";    
    v.filesInfo.innerHTML = "";
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
     "ended",
     "change"].forEach(eventType=>{
        window.addEventListener(eventType, function(event){
           c.updateModel(event, c.updateView);
        });        
    });
    
    v.player.addEventListener('ended', e =>{
        let maxIndex = v.chooser.options.length - 1;
        if(v.chooser.selectedIndex === maxIndex){
            v.chooser.selectedIndex = 1;
        }
        else{
           v.chooser.selectedIndex += 1; 
        }
        v.player.src = m.googleMusicSource + v.chooser.options[v.chooser.selectedIndex].value;
        v.player.play();
    });

};

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
m.metaDataArray = [];
m.chooserPrompt = "Select a Song";


//=============================//
//=======| CONTROLLER |========//
//=============================//
var c = {};
c.showEvent = function showEvent(e){
    let id = e.target.id;
    let type = e.type;
    v.msg.innerHTML = `${id}, ${type}`;
};
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
    //============| load music list in dropdown chooser |===================//
        m.metaDataArray = []; //clear old metadata from array
        a.getFilesMetaData(a.localFileMetaDataName, function(data){
            var list = "";
            data.forEach(dataObject=>{
                //list += dataObject.name + '\n';
                var objectInfo = `name: ${dataObject.name}\nid: ${dataObject.id}\nalbumart: ${dataObject.description}\n\n`;
                list += objectInfo;
                m.metaDataArray.push({
                    filename: dataObject.name,
                    fileId: dataObject.id,
                    relatedFilename: dataObject.description
                });
            });
            console.log(list);
            L.fillMusicChooser();
        });    
    //=====================================================================//
};

//-----| UPDATE model |---//

c.updateModel = function(e, updateView){
    var source = e.target;//source of the event
    var id = source.id; //id of event source
    var type = e.type; //type of event
 
    m.musicFolderExists;//???
    if(type === "ended"){
        alert("song ended");
    }
    if(type === "ended" && source === v.player){
        let maxIndex = v.chooser.options.length - 1;
        if(v.chooser.selectedIndex === maxIndex){
            v.chooser.selectedIndex = 1;
        }
        else{
           v.chooser.selectedIndex += 1; 
        }
        v.player.src = m.googleMusicSource + v.chooser.options[v.chooser.selectedIndex].value;
        v.player.play();
    }
    //----| helpers |----//
    c.showEvent = function showEvent(e){
        v.msg.innerHTML = `${id}, ${type}`;
    };
    //----------------------------//
   c.showEvent(e);    
   updateView(e);    
    
};

//-----| UPDATE view |----// 
c.updateView = function(e){
    var keyCode = e.which;
    var enter = 13;
    var source = e.target;
    var id = source.id; //id of event source    
    var type = e.type;

    function deleteOldTuneToPix(callback){
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
            deleteOldTuneToPix(saveNewTuneToPix);
          
        }
        else if(source === v.btnChooseMusic){
            v.musicFileElement.click();
        }
        else if(source === v.btnChoosePicture){
            v.pictureFileElement.click();
        }
        else if(source === v.btnGetFileContents){
            a.getFileContents(v.txtFileContentId.value, function(response, raw){
                alert('response: ' + response + '\nraw data: '+ raw);
                var musicContent = new window.Blob([response.result],{type: "audio/mp3"});
                var url = window.URL.createObjectURL(musicContent);
                alert('response keys: ' + Object.keys(response));
                c.getPictureFromMp3(musicContent, function(pictureData){
                    L(v.image)
                        .styles
                            ("background: url(" + pictureData + ") no-repeat center")
                            ("background-size: cover")
                    ;
                }); 
            }); 
        }
        else if(source === v.btnGetMetaData){
            m.metaDataArray = []; //clear old metadata from array
            a.getFilesMetaData(a.localFileMetaDataName, function(data){
                var list = "";
                data.forEach(dataObject=>{
                    //list += dataObject.name + '\n';
                    var objectInfo = `name: ${dataObject.name}\nid: ${dataObject.id}\nalbumart: ${dataObject.description}\n\n`;
                    list += objectInfo;
                    m.metaDataArray.push({
                        filename: dataObject.name,
                        fileId: dataObject.id,
                        relatedFilename: dataObject.description
                    });
                    
                });
                console.log(list);
                L.fillMusicChooser();
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
                let musicFile = m.googleMusicSource + v.chooser.options[v.chooser.selectedIndex].value;
                v.player.src = musicFile;
                v.player.play();
                //----------------------//
                /*                
                var musicBlob = new window.Blob([musicFile],{type: "audio/*"});
                let src = window.URL.createObjectURL(musicBlob);
                c.getPictureFromMp3(src, function(picture, base64String){
                   v.image.src = picture;
                });
                */
                //=======================| try to get the actual file contents |====================//
                //"https://drive.google.com/uc?export=download&id=";
                const contentsPath = 'https://www.googleapis.com/drive/v3/files/' +
                v.chooser.options[v.chooser.selectedIndex].value +
                'music?alt=media';
                let contentsGetter = new XMLHttpRequest();
                contentsGetter.open("GET", contentsPath);
                contentsGetter.send();
                //contentsGetter.onload = ()=>{alert(contentsGetter.status)};//403 error: forbidden access!
                //==================================================================================//
            }
        }
    }
};

//=================================//
//==========| END OF APP|==========//
//=================================//


/**
 * appending methods to L for this app
 * 
*/

L.fillMusicChooser = ()=>{
    v.chooser.innerHTML = "";
    var option = document.createElement('option');
    var textNode = document.createTextNode(m.chooserPrompt);
    option.appendChild(textNode);
    v.chooser.appendChild(option);
    m.metaDataArray.forEach(dataObject=>{
        let validMusicFile = dataObject.filename.match(/\.mp3$/i);
        if(validMusicFile){
            var option = document.createElement('option');
            option.value = dataObject.fileId;
            var textNode = document.createTextNode(dataObject.filename);
            option.appendChild(textNode);
            v.chooser.appendChild(option);
        }
    });
};

//==================================================//
c.getPictureFromMp3 = function(url, yea, nay){
  var jsmediatags = window.jsmediatags  ;
  if(!jsmediatags){
    console.log("Can't find the 'jsmediatags' object.");
    console.log("Try https://github.com/aadsm/jsmediatags/tree/master/dist");
    return;
  }
  // url from local host
  jsmediatags.read(url, {
    onSuccess: function(tag) {
      console.log(tag);
      let tags = tag.tags;
      //========================//
      var image = tags.picture;
      if (image) {
        var base64String = "";
        image.data.forEach(function (datum){ base64String += String.fromCharCode(datum) });
        var pictureData = "data:" + image.format + ";base64," + window.btoa(base64String);
        if(yea){yea(pictureData, base64String);}
      }
      else{//no image
        if(nay){nay();}
      }       
      //=========================//
    },
    onError: function(error) {
      console.log(error);
      return null;
    }
  });
};
//======| END getPictureFromMp3 |=================//