/*
    a.js is an attempt to wrap our own api around the JavaScript Google api
    to simplify using the Google Drive api
*/

/*global gapi*/
/*global v*/

var a = {};
a.authToken = {
    client_id: '637721329784-nm1n6dd1m05hgbc2o10e8hjj2md5ft59.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file',
    immediate: null
};
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
                callback();
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
            if(folderName === "A0-music-diymusic"){
                a.musicFolderId = resp.id;
                a.musicFolderExists = true;
            }
            else if(folderName === "A0-pictures-diymusic"){
                a.pictureFolderId = resp.id;
                a.pictureFolderExists = true;
                v.btnShowFiles.style.visibility = "visible";
                v.showAllButtons();                
            }
            v.showAllButtons();
            v.clearAllText();            
            a.showFiles();
        });
        setTimeout(function(){
            if(callback){callback();}
        },1500);
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

a.getFile = function(filename = "dummy/path/filename"){
    a.authorizeAndPerform(getFile);    
    //-----| callback for getting file |----//
    //var token = gapi.auth.getToken().access_token;
    function getFile(){
        //alert("Token: \n" + token);
        alert("Token: NO TOKEN");
    }
};
a.saveMusicFile = function(filename, file){
    if(filename){
        a.authorizeAndPerform(saveMusicFile);        
    }
    //-----| callback for saving file |----//
    function saveMusicFile(){
        //alert("You are Authorized to SAVE MUSIC FILE: " + filename);
        gapi.client.drive.files.create({ "name" : filename, "parents" : [a.musicFolderId] })
            .execute(function(file) {
                a.showFiles();
            });
        v.showAllButtons();            
        v.clearAllText();            
    }
};

a.savePictureFile = function(filename, file){
    if(filename){
        a.authorizeAndPerform(savePictureFile);
    }
    function savePictureFile(){
        //alert("You are Authorized to SAVE PICTURE FILE: " + filename);
        gapi.client.drive.files.create({ "name" : filename, "parents" : [a.pictureFolderId] })
            .execute(function(file) {
                a.showFiles();
            });
        v.showAllButtons();    
        v.clearAllText();
    }
};

a.deleteFile = function(filename = "dummy/path/filename"){
    a.authorizeAndPerform(deleteFile);
    function deleteFile(){
        alert("You are Authorized to DELETE A FILE: " + filename);
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

