/*
    a.js is an attempt to wrap our own api around the JavaScript Google api
    to simplify using the Google Drive api
*/

/*global gapi*/
/*global m*/
/*global v*/
/*global c*/

var a = {};
a.authToken = {
    client_id: '637721329784-nm1n6dd1m05hgbc2o10e8hjj2md5ft59.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.install https://www.googleapis.com/auth/drive.file',
    immediate: null
};
a.authorized = true;
a.musicFolderExists = null;
//most recently saved music file (which hopefully contains a picture)
a.savedFile = "";
a.musicFolderId = null;

a.createFolder = function(folderName){
    folderName = folderName || "music";
    
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', createFolder);
    }
    function createFolder(){
        //http://stackoverflow.com/questions/34905363/create-file-with-google-drive-api-v3-javascript
        var fileMetadata = {
            'name' : folderName,
            'mimeType' : 'application/vnd.google-apps.folder',
            'parents': ['appDataFolder']
        };
        var request = gapi.client.drive.files.create({
            resource: fileMetadata,
            fields: 'id'
        });
        request.execute(function(resp, raw_resp) {
            a.musicFolderId = resp.id;
            a.showFiles();
        });        
    }//--| END of internal 'createFolder' | ---/
};

a.showFiles = function (filepath ="dummy/path"){
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', showFiles);
    }
    function showFiles(){
        var fileMetadata = {
            'spaces': 'appDataFolder',            
            'pageSize': 50,
            'fields': "nextPageToken, files(id, name)",
            'parents' : ['appDataFolder']
        };
        var request = gapi.client.drive.files.list(fileMetadata);
        function handleResponse(response){
            v.filesInfo.innerHTML = "<center>FILES &  FOLDERS: </center><br>";
            //var filesArray = response.files;
            response.files.forEach(file=>{
                v.filesInfo.innerHTML += `Filename: ${file.name}<br>FileID: ${file.id}<br><br> `;
            });            
        }
        request.execute(handleResponse);
    }
};

a.getFile = function(filepath = "dummy/path/filename"){
    //-----| callback for getting file |----//
    //var token = gapi.auth.getToken().access_token;
    function getFile(){
        alert("Token: \n" + token);
    }
    //--------------------------------------------//
    a.authorizeAndPerform(getFile);
};
a.saveFile = function(filepath, file){
    a.authorizeAndPerform(saveFile);
    //-----| callback for saving file |----//
    function saveFile(){
        //alert("You are Authorized to SAVE A FILE: " + filepath);
        gapi.client.drive.files.create({ "name" : filepath, "parents" : [a.musicFolderId] })
            .execute(function(file) { a.showFiles(); });
            //.execute(function(file) { alert("Created file " + filepath + " id: " + file.id); });
    /*
        1. Assume user is authenticated (immediate = true)
        2. Verify an existing music folder
            if not, create a folder
        3. save file to music folder
    */        
    }
    //--------------------------------------------//

};
a.deleteFile = function(filepath = "dummy/path/filename"){

    //-----| callback for deleting a file |----//
    function deleteFile(){
        alert("You are Authorized to DELETE A FILE: " + filepath);
    }
    //--------------------------------------------//
    a.authorizeAndPerform(deleteFile);
};
a.handleAuthResult = function(authResult, callBack){
    if(authResult && ! authResult.error){
        //alert("you are authorized.");
        a.authorized = true;
        v.authMsg.innerHTML = "";
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


