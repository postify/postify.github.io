//object that holds most relevant google drive methods
window.userdrive = {
    userid: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com'
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
};