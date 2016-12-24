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
    immediate: false
};
a.authorized = false;

a.createFolder = function(folderpath="dummy/path/foldername"){
    //assume immediate authorization
    //if not, ask permission
    alert(folderpath);
};

a.showFiles = function (path="dummy/path"){
    alert(path);
};

a.getFile = function(filepath = "dummy/path/filename"){
    alert(filepath);
};

a.saveFile = function(filepath = "dummy/path/filename"){
    /*
        1. Assume user is authenticated (immediate = true)
            if not, request authentication
        2. Verify an existing music folder
            if not, create a folder
        3. save file to music folder
    */
    if(a.authorized){
        a.authToken.immediate = true;
    }
    else{
        a.authToken.immediate = false;        
    }
    gapi.auth.authorize(a.authToken, a.handleAuthResult);
    
    //alert(filepath);
};

a.deleteFile = function(filepath = "dummy/path/filename"){
    alert(filepath);
};

a.handleAuthResult = function(authResult){
    //helper
    function dummy(authResult){
        v.btnSaveFile.innerHTML = "Click Again to Authorize";
    }    
    if(authResult && ! authResult.error){
      //  alert("you are authorized.");
        a.authorized = true;
        v.btnSaveFile.value = "Save File";
    }
    else{
        a.authorized = false;
        gapi.auth.authorize(a.authToken, dummy);
    }
};
//aliases, etc.
a.makeFolder = a.createFolder;


