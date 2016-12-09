/*
    x.js is an attempt to wrap our own api around the JavaScript Google api
    to simplify using the Google Drive api
*/
/*global gapi*/
/*global m*/
/*global v*/
/*global c*/

var x = {};

x.createFolder = function(folderpath="dummy/path/foldername"){
    //assume immediate authorization
    //if not, ask permission
    alert(folderpath);
};

x.showFiles = function (path="dummy/path"){
    alert(path);
};

x.getFile = function(filepath = "dummy/path/filename"){
    alert(filepath);
};

x.saveFile = function(filepath = "dummy/path/filename"){
    /*
        1. Assume user is authenticated (immediate = true)
            if not, request authentication
        2. Verify an existing music folder
            if not, create a folder
        3. save file to music folder
    */

    var authToken = {
        client_id: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.appfolder',
        immediate: true
    }
    authToken.immediate = false;    
    alert(authToken.client_id +", "+ authToken.scope +", " + authToken.immediate);
    gapi.auth.authorize(authToken, x.handleAuthResult);
    
    //alert(filepath);
};

x.deleteFile = function(filepath = "dummy/path/filename"){
    alert(filepath);
};

x.handleAuthResult = function(authResult){
    if(authResult && ! authResult.error){
        alert("you are authorized already");
    }
    else{
        alert("you need authorization");
    }
};
//aliases, etc.
x.makeFolder = x.createFolder;


