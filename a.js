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
    scope: 'https://www.googleapis.com/auth/drive.appfolder',
    immediate: null
};
a.authorized = true;
a.musicFolderExists = null;
//most recently saved music file (which hopefully contains a picture)
a.savedFile = "";
a.musicFolderId = null;

a.createFolder = function(folderName = "music"){
    function createFolder(){
        gapi.client.load('drive', 'v2', function() {
           //Create request object
            var request = gapi.client.request({
                'path': '/',
                'method': 'POST',
                'body': {
                    "title" : folderName,
                    "mimeType" : "application/vnd.google-apps.folder",
                    "description" : "Main music folder"
                }
            });//---| END of creating request object |---//
         
          //execute request. The response should be the file id or folder id
          request.execute( function(resp){
              a.musicFolderId = resp;
              alert(a.musicFolderId); 
          });
       });        
    }//--| END of internal 'createFolder' | ---/
    a.authorizeAndPerform(createFolder);   
};

a.showFiles = function (filepath ="dummy/path"){
    //-----| callback for showing files |----//
    function showFiles(){
        alert("You are Authorized to SHOW FILES: " + filepath);
    }
    //--------------------------------------------//
    a.authorizeAndPerform(showFiles);
};

a.getFile = function(filepath = "dummy/path/filename"){
    //-----| callback for getting file |----//
    function getFile(){
        alert("You are Authorized to GET A FILE: " + filepath);
    }
    //--------------------------------------------//
    a.authorizeAndPerform(getFile);
};
a.saveFile = function(filepath = "dummy/path/filename"){

    //-----| callback for saving file |----//
    function saveFile(){
        alert("You are Authorized to SAVE A FILE: " + filepath);
    /*
        1. Assume user is authenticated (immediate = true)
        2. Verify an existing music folder
            if not, create a folder
        3. save file to music folder
    */        
    }
    //--------------------------------------------//
    a.authorizeAndPerform(saveFile);
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


