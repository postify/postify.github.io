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
a.localFileMetaDataName = "diymusicFileMetaData";

a.tuneToPix = {};
a.tuneToPixFileId = null; //if first time, else

a.initialize = function initialize(callback){
    a.authorizeAndPerform(loadDriveApi);     
    function loadDriveApi(){
        gapi.client.load('drive', 'v3', showFiles);
    }
    function showFiles(){
        var fileMetadata = {
            'fields': "nextPageToken, files(id, name, description)"
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
            }
            v.clearAllText();            
            a.showFiles();
        });
        setTimeout(function(){
            if(callback){callback();}
        },1000);
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
            'fields': "nextPageToken, files(id, name, description)",
            //'parents' : ['appDataFolder']
        };
        var request = gapi.client.drive.files.list(fileMetadata);
        request.execute(handleResponse);        
        function handleResponse(response){
            a.allFilesArray = response.files;//[];             
            v.filesInfo.innerHTML = "<center>FILES &  FOLDERS: </center><br>";
            response.files.forEach(file=>{
                //a.allFilesArray.push(file);
                v.filesInfo.innerHTML += `Filename: ${file.name}<br>FileID: ${file.id}<br> Album Art: ${file.description}<br><br>`;
            });
            //------| check for, and use localstorage |-------//
            if(window.localStorage){
                if(!!window.localStorage.getItem(m.tuneToPixFilename)){
                    a.tuneToPix = JSON.parse(window.localStorage.getItem(m.tuneToPixFilename));
                }
                var tunes = Object.keys(a.tuneToPix);
                tunes.forEach(tune=>{
                    console.log(`Tune: ${tune}, Pix: ${a.tuneToPix[tune]}`);
                });
            }
            //-----------------------------------------------//
        }
        if(callback){
            callback();
        }
    }
};
a.getAuthToken = function getAuthToken(){
    return (gapi.auth.getToken().access_token);
};

a.getFile = function(ID = "dummyID"){
    a.authorizeAndPerform(getFile);    
    //-----| callback for getting file |----//
    //var token = gapi.auth.getToken().access_token;
    function getFile(){
        var request = gapi.client.drive.files.get({
            'fileId': ID
        });
        request.execute(function(response, raw) {
            //v.txtGetFile.value = ('Description: ' + response.description);
            console.log(raw);
        });
    }
};

a.getFileContents = function(ID = "dummyID"){
    a.authorizeAndPerform(getFile);    
    //-----| callback for getting file |----//
    //var token = gapi.auth.getToken().access_token;
    function getFile(){
        var request = gapi.client.drive.files.get({
            'fileId': ID,
            'alt': 'media'
        });
        request.execute(function(response, raw) {
            v.txtFileContentId.value = "";
            console.log(
            `Raw Data: ${raw}
             Response: ${response}`);
        });
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
                a.showFiles(a.setFilesMetaData(a.localFileMetaDataName,function(x){}));
            }
            else{
                alert("Trouble deleting file.");
            }
           
        });        
    }
};

a.handleAuthResult = function(authResult, callBack){
    if(authResult && ! authResult.error){
        if(a.firstAuthRequest){
            a.firstAuthRequest = false;
            a.initialize();
        }        
        a.authorized = true;
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

a.saveMusicFile = function(rawFile){
    a.uploadFile(rawFile, m.chosenMusicFilename, a.musicFolderId);
};

a.savePictureFile = function(rawFile){
    a.uploadFile(rawFile, m.chosenPictureFilename, a.pictureFolderId);
};

a.uploadFile = function uploadFile( CONTENT, filename, parentFolder ){
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(CONTENT);
    reader.onload = function (event) {//"event" is unused
        var contentType = CONTENT.type || 'application/octet-stream';
        var metadata = {
            'name': filename,
            'mimeType': contentType,
            "description": getDesription(contentType),
            "parents": [parentFolder]
        };
        var base64Data = window.btoa(reader.result); //the window element's build-in binary-to-ascii method
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;
        var request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody});
        request.execute(function(file, raw){
            console.log(`'${file.name}', ${file.id}, ${metadata.description}`);
            a.setFilesMetaData(a.localFileMetaDataName,function(){});
            if(file.name === m.tuneToPixFilename){
                a.tuneToPixFileId = file.id;
            }
            v.clearAllText();
            a.showFiles();
            a.setFilesMetaData(a.localFileMetaDataName, function(data){
                var list = "";
                data.forEach(dataObject=>{
                    list += dataObject.name + '\n';
                });
            }); 
        });
    };
    //======helper======//
    function getDesription(type){
        var associateFilename = "";
        if(type.indexOf("audio") == -1){
            associateFilename = m.chosenMusicFilename;
        }
        else if(type.indexOf("image") == -1){
            associateFilename = m.chosenPictureFilename;
        }
        return associateFilename;
    }
};

//==============================================================================//
//==========| Attempt at adding a more useful superset of methods |=============//
//==============================================================================//
a.filesMetaData = {};
/**
    "getFilesMetaData" first checks localStorage,
    failing that, goes to googleDrive for the files metadata
    for this app, stores it in a.filesMetaData as well as in localStorage
    If the metaDate comes from local storage, JSON.parse() must first be applied
    since it is assumed it was placed there after JSON.stringify();
*/
a.getFilesMetaData = function (localStorageName, actOnMetaData){
    //-----------------------------    
    function getFilesMetaData(){
         gapi.client.load('drive', 'v3', performRequest);
         function performRequest(){
            var request = gapi.client.drive.files.list( {'fields': "nextPageToken, files(id, name, description)"} );
            request.execute(function(response){
                a.filesMetaData = response.files;
                if(window.localStorage){
                    window.localStorage.setItem(localStorageName, JSON.stringify(response.files));
                }
                if(actOnMetaData){actOnMetaData(response.files)}
            });
         }    
    }
    //---------------------------     
    if(!!window.localStorage){
        if(window.localStorage.getItem(localStorageName)){
            if(actOnMetaData){
                actOnMetaData(  JSON.parse(window.localStorage.getItem(localStorageName))  );
            }
        }else{
            a.authorizeAndPerform(getFilesMetaData);
        }
    }else{
        a.authorizeAndPerform(getFilesMetaData);
    }
    //--------------------------
};

/**
    setFilesMetaData retreives this app's files metaData from
    Google Drive, applies JSON.stringify() and stores it
    to localStorage under the name supplied, and also
    stores it to a.filesMetaData
*/
a.setFilesMetaData = function (localStorageName, actOnMetaData){
    //-----------------------------    
    function setFilesMetaData(){
         gapi.client.load('drive', 'v3', performRequest);
         function performRequest(){
            var request = gapi.client.drive.files.list( {'fields': "nextPageToken, files(id, name, description)"} );
            request.execute(function(response){
                a.filesMetaData = response.files;
                if(window.localStorage){
                    window.localStorage.setItem(localStorageName, JSON.stringify(response.files));
                }
                if(actOnMetaData){actOnMetaData(response.files)}
            });
         }    
    }
    //---------------------------
    a.authorizeAndPerform(setFilesMetaData);
};

