//object that holds most relevant google drive methods
/*global $*/
/*global view*/
/*global model*/
/*global gapi*/
var userdrive = {
    clientId: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com'
    ,scope: 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.appdata'
    ,showMetaData: function showMetaData(arg){
        alert(arg);
    }
    ,mkDir: function mkDir(arg){
        alert(arg);        
    }
    ,rmFile: function rmFile(arg){
        alert(arg);        
    }
    ,saveFiles: function saveFiles(arg){
        alert(arg);        
    }
    ,authorizeUser: function authorizeUser(gapi, booleanImmediate, handleAuthResult){
        var authObject = {
            'client_id': this.clientId
            ,'scope': this.scope
            ,'immediate': booleanImmediate
        };
        gapi.auth.authorize(authObject, handleAuthResult);
        return false;
    }
    ,handleLoginAttempt: function handleLoginAttempt(authResult){
        var authorized = authResult && ! authResult.error;
        if(authorized){
            $($.shroud).styles
                ("opacity: 0")
                ("visibility: hidden")                   
            ;
        }else{
            $($.shroud).styles
                ("opacity: 1")               
                ("visibility: visible")
            ;
            userdrive.authorizeUser(gapi, false, userdrive.handleLoginAttempt);
        }         
    }
};