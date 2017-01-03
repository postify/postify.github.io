/*
    a.js is an attempt to wrap our own api around the JavaScript Google api
    to simplify using the Google Drive api
*/

/*global gapi*/
/*global v*/
/*global m*/

var a = {};
a.authToken = {
    client_id: '637721329784-nm1n6dd1m05hgbc2o10e8hjj2md5ft59.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file',
    immediate: null
};
a.musicFolderName = "__music-diymusic";
a.pictureFolderName = "__pictures-diymusic";
a.firstAuthRequest = true;
a.authorized = true;
a.musicFolderExists = null;
a.pictureFolderExists = null;
//most recently saved music file (which hopefully contains a picture)
a.savedPictureFile = "";
a.musicFolderId = null;
a.pictureFolderId = null;
a.allFilesArray = [];

a.initialize = function initialize(callback){
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', showFiles);
    }
    function showFiles(){
        var fileMetadata = {
            //'spaces': 'appDataFolder',            
            'fields': "nextPageToken, files(id, name)",
            //'parents' : ['appDataFolder']
        };
        var request = gapi.client.drive.files.list(fileMetadata);
        request.execute(handleResponse);        
        function handleResponse(response){
            a.allFilesArray = [];             
            v.filesInfo.innerHTML = "";
            response.files.forEach(file=>{
                a.allFilesArray.push(file);
            });
            if ( callback ){
                setTimeout(function(){
                    callback();                    
                },2000);
            }
        }
    }
};

a.createFolder = function(folderName, callback){
    folderName = folderName || "New Folder";
    
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', createFolder);
    }
    function createFolder(){
        //http://stackoverflow.com/questions/34905363/create-file-with-google-drive-api-v3-javascript
        var fileMetadata = {
            'name' : folderName,
            'mimeType' : 'application/vnd.google-apps.folder',
            //'parents': ['appDataFolder']
        };
        var request = gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        });
        request.execute(function(resp, raw_resp) {
            if(folderName === a.musicFolderName){
                a.musicFolderId = resp.id;
                a.musicFolderExists = true;
            }
            else if(folderName === a.pictureFolderName){
                a.pictureFolderId = resp.id;
                a.pictureFolderExists = true;
                v.showAllButtons();                
            }
            v.showAllButtons();
            v.clearAllText();            
            a.showFiles();
        });
        setTimeout(function(){
            if(callback){callback();}
        },2000);
    }//--| END of internal 'createFolder' | ---/
};

a.showFiles = function (callback){
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', showFiles);
    }
    function showFiles(){
        var fileMetadata = {
            //'spaces': 'appDataFolder',            
            //'pageSize': 50,
            'fields': "nextPageToken, files(id, name)",
            //'parents' : ['appDataFolder']
        };
        var request = gapi.client.drive.files.list(fileMetadata);
        request.execute(handleResponse);        
        function handleResponse(response){
            a.allFilesArray = [];             
            v.filesInfo.innerHTML = "<center>FILES &  FOLDERS: </center><br>";
            response.files.forEach(file=>{
                a.allFilesArray.push(file);
                v.filesInfo.innerHTML += `Filename: ${file.name}<br>FileID: ${file.id}<br><br>`;
            });
        }
        if(callback){
            callback();
        }
    }
};
a.getAuthToken = function getAuthToken(){
    return (gapi.auth.getToken().access_token);
};
a.getFile = function(filename = "dummy/path/filename"){
    a.authorizeAndPerform(getFile);    
    //-----| callback for getting file |----//
    //var token = gapi.auth.getToken().access_token;
    function getFile(){
        //alert("Token: \n" + token);
        alert("Token: NO TOKEN");
    }
};
a.saveMusicFile = function(filename, rawFile){
    if(filename){
        a.authorizeAndPerform(saveMusicFile);        
    }
    //-----| callback for saving file |----//
    function saveMusicFile(rawFile){
        // "mimeType": "audio/mpeg"
        gapi.client.drive.files.create({ "name" : filename, "parents" : [a.musicFolderId] })
            .execute(function(file, rawResponse) {
            //===================================//
                var id = file.id;
                a.addFileContent(id, rawFile);
                a.showFiles();
            //===================================//
            });
        v.showAllButtons();            
        v.clearAllText();            
    }
};

a.addFileContent = function addFileContent(id, content){
    uploadAudioFile(id, m.chosenMusicFile);
    /*
    gapi.client.drive.files.update
    ( { 
     'fileId': id,
     'body': content
     }).execute(function(x, rawResponse){
         m.chosenMusicFilename = "";
         m.chosenMusicFile = "";
         m.chosenPictureFilename = "";
         m.chosenPictureFile = "";
         alert(rawResponse);
     });
     */
                    
};

a.savePictureFile = function(filename, rawFile){
    if(filename){
        a.authorizeAndPerform(savePictureFile);
    }
    function savePictureFile(rawFile){
        //alert("You are Authorized to SAVE PICTURE FILE: " + filename);
        gapi.client.drive.files.create({ "name" : filename, "parents" : [a.pictureFolderId] })
            .execute(function(file) {
            //===================================//
                var id = file.id;
                a.addFileContent(id, rawFile);
                a.showFiles();
            //===================================//
            });
        v.showAllButtons();    
        v.clearAllText();
    }
};

a.deleteFile = function(fileId){
    a.authorizeAndPerform(deleteFile);
    function deleteFile(){
        var request = gapi.client.drive.files.delete({
            'fileId': fileId
        });
        request.execute(function(response) {
            if(response && !response.error){
                v.clearAllText();
            }
            else{
                alert("Trouble deleting file.");
            }
            a.showFiles();
        });        
    }
};

a.handleAuthResult = function(authResult, callBack){
    if(authResult && ! authResult.error){
        //alert("you are authorized.");
        if(a.firstAuthRequest){
            a.firstAuthRequest = false;
        }        
        a.authorized = true;
        v.authMsg.innerHTML = "";
        v.showAllButtons();
        callBack();
    }
    else{
        a.authorized = false;
        a.authorizeAndPerform(callBack);       
    }
};

a.authorizeAndPerform = function authorizeAndPerform(callBack){
    if(a.authorized){
        a.authToken.immediate = true;
    }
    else{
        a.authToken.immediate = false;        
    }
    
    gapi.auth.authorize(a.authToken, function(authResult){
        a.handleAuthResult(authResult, callBack);
    });

};
//aliases, etc.
a.makeFolder = a.createFolder;
//POST /upload/drive/v3/files?uploadType=media HTTP/1.1
function uploadAudioFile(id, CONTENT){
    alert(CONTENT);
  //function gd_updateFile(fileId, folderId, text, callback) {
    var blob = new window.Blob( [ CONTENT ], { type: 'audio/mpeg' } );
    var fileId = id;

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var contentType = "audio/mpeg";
    var metadata = {'mimeType': contentType,};

    var multipartRequestBody =
        delimiter +  'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter + 'Content-Type: ' + contentType + '\r\n' + '\r\n' +
        CONTENT +
        close_delim;

    //if (!callback) { callback = function(file, raw) { console.log("Result: " + raw) }; }
    var callback = function(file, raw) { console.log("Result: " + raw) }; 

    gapi.client.request({
        'path': '/upload/drive/v3/files/'+ a.musicFolderId +"?fileId="+fileId+"&uploadType=media",
        'method': 'POST',
        'params': {'fileId': fileId, 'uploadType': 'multipart'},
        //'headers': {'Content-Type': 'multipart/form-data; boundary="' + boundary + '"'},
        'body': blob,   //multipartRequestBody,
        callback:callback,
    });
    /*
    var blob = new window.Blob( [ CONTENT ], { type: 'audio/mpeg' } );
    var authToken = a.getAuthToken();
    var fileId = id;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.googleapis.com/drive/v3/files/" + fileId , true);
    xhr.setRequestHeader('Authorization','Bearer '+ authToken);
    xhr.onload = function(){
        alert(xhr.reponseText);
    };
    xhr.send(blob); 
    */
 
  /*
  var blob = new window.Blob([CONTENT], {type: 'audio/*'});
  var blobUrl = window.URL.createObjectURL(blob);
  var authToken = a.getAuthToken();    
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var metadata = { 
      description : 'fucking horrible google docs',
      'mimeType': 'audio/mpeg'
  };  

  var multipartRequestBody =
    delimiter +  'Content-Type: audio/mpeg\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter + 'Content-Type: audio/mpeg\r\n\r\n' +
    blob +
    close_delim;

  gapi.client.request
    ( { 
     'path': '/upload/drive/v3/files/' + id,
     'method': 'PATCH',
     'params': {'fileId': id, 'uploadType': 'multipart'},
     'headers': { 'Content-Type': 'multipart/form-data; boundary="' + boundary + '"', 'Authorization': 'Bearer ' + authToken },
     'body': multipartRequestBody 
     }).execute(function(file, raw) { alert(raw); }); 
  */     
}