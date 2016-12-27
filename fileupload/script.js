// wrapper for a long method name
function id(idString){
    return document.getElementById(idString);
}

//====| gather all the players |====//
var fileElement = id("fileElement");
var progressBar = id("progressBar");
var message = id("message");
// create an xhr agent
var ajax = new XMLHttpRequest();

//====| handle all events |====//
ajax.onload = showMessage;
ajax.upload.onprogress = showProgress;
fileElement.onchange = sendFile;


//====| event handler functions |====//
//handler to show server's message
function showMessage(e){
    message.innerHTML = ajax.response;
    progressBar.style.borderLeft = "0 solid red";
    progressBar.style.width = "100%";
}
//handler to upload a file
function sendFile(e){
    try{
        /*
            get the chosen file and its name
        */
        var file = fileElement.files[0];
        var filename = file.name;
        
        /*
            Open a communication channel to POST to the server,
            set a filename header, and
            send the file.
        */
        ajax.open("POST", "getFile.php");
        ajax.setRequestHeader("filename", filename );
        ajax.send(file);         
    }
    catch(err){
        //blocking error from browser when there is no file
        throw new Error("Ha, ha! We caught it first.");
    }
}
//handler that shows progress of the upload 
function showProgress(e){
    // e (above) is the event object
    if(e.lengthComputable){
        var top = e.loaded;
        var bottom = e.total;
        var fraction = top / bottom;
        var pct = parseInt(100 * fraction, 10);
       
        //show percentage uploaded   
        message.innerHTML = pct + " %";
        
        //show progress on progressBar
        var barWidth = window.innerWidth;
        progressBar.style.borderLeft = fraction * barWidth + "px solid red";
        var otherFraction = (1 -  fraction);
        progressBar.style.width = otherFraction * barWidth + "px";  
    }
}