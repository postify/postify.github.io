//https://developers.google.com/drive/v3/reference/files/get
//https://developers.google.com/drive/v3/reference/files#resource
//https://gusclass.com/blog/2014/08/18/using-page-tokens-to-retrieve-extended-results-from-google-apis/
/**
 * 
 * Author:  Abbas Abdulmalik
 * Created: January 22, 2017
 * Revised: N/A
 * Purpose: To demonstrate a music player that uses Google Drive to:
 *              a.) authenticate the app for the user's Google Drive
 *              b.) authenticate the user
 *              c.) store he song and album art files
            all completely from the client, with no server code.
            
 * Notes:
 *  To keep the global namespace sparsely populated,
 *  only a few objects will be placed there:
 * 
 *  1.) Google's JavaScript Client API:
 *      "gapi"
 * 
 *  2.) My wrapper for gapi with methods that make it simpler:
 *      "a"
 * 
 *  3.) Lea Verou's Prefixfree library adds:
 *      "StyleFix," and "PrefixFree"
 * 
 *  4.) My small library (L.js) of helper methods:
 *      "L"
 * 
 *  5.) The MODEL, VIEW,  and CONTROLLER object for this app:
 *      "m", "v", and "c"
 * 
 *  That adds up to eight (8) global variables:
 *  gapi, a, StyleFix, PrefixFree, L, m, v, and c.
 * 
 *  This app.js file wil not directly access gapi, StyleFix, or PrefixFree
 */
/*global a*/ 
/*global L*/
//============================================//
//============|    STARTUP    |===============//
//============================================//
window.onload = function(){
    c.initialize();
    //Listen for, and handle these DOM event types:
    [   "mouseover",
        "mousedown",
        "change",
        "input",
        "resize",
        "touchstart",
        "touchend",
        "touchmove"
    ].forEach(eventType=>{
        window.addEventListener(eventType, function(eventObject){
            eventObject.stopPropagation();            
            //Show most rescent event info: Target id and event type:
            c.showEventInfo(eventObject, v.divEventInfo);
            c.updateModel(eventObject, c.updateView);
        }, true);  //true => attempt to capture event object at the earliest time
    });
    
    //Listen for, and handle these audio element event types:
    [
        "durationchange",        
        "ended",        
        "error",
        "pause",
        "play",
        "playing",
        "timeupdate",
        "volumechange"
    ].forEach(eventType=>{
        m.player.addEventListener(eventType, function(eventObject){
            eventObject.stopPropagation();             
            //Show most rescent event info: Target id and event type:
            c.showEventInfo(eventObject, v.divEventInfo);
            c.updateModel(eventObject, c.updateView);            
        }, true);
    });
};
//============================================//
//============|     MODEL     |===============//
//============================================//
var m = {};
/**
 * The audio player is added to the model
 * because the player has so many state variables
 * of its own.
 */
m.player = L("#player").getElement();
m.makePictureLarge = false;
m.metaDataArray = [];

//============================================//
//============|     VIEW      |===============//
//============================================//
var v = {};
v.window = window;
v.window.id = "window";
L.attachAllElementsById(v);

//============================================//
//============|   CONTROLLER  |===============//
//============================================//
var c = {};
c.initialize = function initialize(){
    c.adjustSizes();
    a.authorizeAndPerform(c.showSplashScreens);
    L.updateLocalStorage();
    L.updateMusicList();
    
    //list properties and methods of gapi qrapper "a2":
    Object.keys(a).sort().forEach(key=>{
        console.log(key + ", type: " + {}.toString.call(a[key]) + "\n");
    });
    //------| Helpers for inititalize |------//
    //---| END of Helpers for initialize |---//
};
c.updateModel = function updateModel(eventObject, updateView){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;
    //update model here:
    
    //mousedown events handled:
    if(type === "mousedown" || type === "touchend"){
        //Enlarge or reduce picture size:
        if(source === v.divLargePicture){
            m.makePictureLarge = false;
        }
        else if(source === v.divPicture){
            m.makePictureLarge = true;
        }
        //other mousedown events
        else if(false){}
        else if(false){}
    }
    //other events
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}    
    //-------------------
    updateView(eventObject);
};
c.updateView = function updateView(eventObject){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;

    //Adjust when window resizes
    if(type === "resize" && source === window){
        c.adjustSizes();
    }
    //Enlarge or reduce picture size:
    if(m.makePictureLarge){
        L(v.app)
            .styles
                ("visibility: hidden")
                ("opacity: 0")
        ;
        L(v.divLargePicture)
            .styles
                ("visibility: visible")
                ("opacity: 1")
        ;
    }
    else{
        L(v.app)
            .styles
                ("visibility: visible")
                ("opacity: 1")
        ;
        L(v.divLargePicture)
            .styles
                ("visibility: hidden")
                ("opacity: 0")
        ;            
    }
    
    //source events handled:
    if(source === v.menu){
        if(type === "touchstart" || type === "mousedown"){
            L.toggleBackground(v.menu, "red", 100);
            L.showBigMenu();
        }
        else if(false){}
        else if(false){}
        else if(false){}
        else if(false){}
        else if(false){}
        
    }
    else if(source === v.menuExit){
        if(type === "touchstart" || type === "mousedown"){
            L.hideBigMenu();
        }           
    }
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    
    
};
c.adjustSizes = function adjustSizes(min, max, optionalWidowWidth){
    //L.adjustRem(min, max, optionalWidowWidth);
    closeComponentsGaps();
    fillSmallScreensNotLargeOnes();
    
    //--------| helpers |--------//

    function closeComponentsGaps(){
        var chooserHeight = v.chooser.getBoundingClientRect().height;
        L('#player').styles("bottom: " + chooserHeight + "px");
        var playerHeight = v.player.getBoundingClientRect().height;
        L('#menu').styles("bottom: " + (playerHeight + chooserHeight) + "px");
    }    
    //----------------------------//
    function fillSmallScreensNotLargeOnes(){
        var windowWidth = window.innerWidth;
        if( windowWidth <= 360){
            L(v.app)
                .styles
                    ("width: 100%")
                    ("height: 100%")
            ;
            L(v.menuItems)
                .styles
                    ("width: 100%")
                    ("height: 100%")
            ;
            
            L.adjustRem(10, 30, 320); //should be 360?
        }
        else if(windowWidth > 360 && windowWidth <= 640){
            L(v.app)
                .styles
                    ("width: 100%")
                    ("height: 100%")
            ;
            L(v.menuItems)
                .styles
                    ("width: 100%")
                    ("height: 100%")
            ;
            
            L.adjustRem(10,30);
        }
        else if(windowWidth > 640){
            L(v.app)
                .styles
                    ("width: 60%")
                    ("height: 80%")
            ;
            L(v.menuItems)
                .styles
                    ("width: 60%")
                    ("height: 80%")
            ;
            
            L.adjustRem(10,30);            
        }
    }
    //---------------------------------//

    
    //----| END of helpers for c.adjustSizes() |----//
};
c.showEventInfo = function showEvent(eventObject, viewDiv){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;
    
    var eventInfo = `${id}, ${type}`;
    viewDiv.innerHTML = eventInfo;
};
c.showSplashScreens = function showSplashScreens(){
    var t1= 2; 
    var t2 = 1.3*t1, t3 = 2.2*t1, t4=2.7*t1;
    setTimeout(function(){
        L(v.splash1)
            .styles
                ("visibility: hidden")
                ("opacity: 0")
        ;                    
    },t1*1000);
    setTimeout(function(){
        L(v.splash2)
            .styles
                ("visibility: visible")
                ("opacity: 1")
        ;             
    },t2*1000);
    setTimeout(function(){
        L(v.splash2)
            .styles
                ("visibility: hidden")
                ("opacity: 0")
        ;
    },t3*1000);
    setTimeout(function(){
        L(v.controls)
            .styles
                ("visibility: visible")
                ("opacity: 1")
        ;
        L(v.divEventInfo)
            .styles
                ("opacity: 1")
        ;
        L(v.app)
            .styles
                ("visibility: visible")
                ("opacity: 1")
        ;
        L(v.divPicture)
            .styles
                ("background: url(whofront.jpg) no-repeat bottom")
                ("background-size: contain")
                ("opacity: 1")
                ("visibility: visible")
        ;        
    },t4*1000);
};



//============================================//
//============|   END OF APP  |===============//
//============================================//

/*
 * appending "global" helper methods to the L library
 * 
*/
L.toggleBackground = (target, color, duration)=>{
    L(target)
        .styles
            ("background-color " + color)
            ("background: " + color)            
    ;
    setTimeout(()=>{
    //http://stackoverflow.com/questions/3506050/how-to-reset-the-style-properties-to-their-css-defaults-in-javascript    
       target.style.background = "";
       target.style.backgroundColor = "";
    }, duration);
};

L.hideBigMenu = ()=>{
    L(v.bigMenu)
        .styles
            ("opacity: 0")
            ("visibility: hidden")
    ;            
};

L.showBigMenu = () =>{
    L(v.bigMenu)
        .styles
            ("opacity: 0.97")
            ("visibility: visible")
    ;     
};

L.fillMusicChooser = ()=>{
    v.chooser.innerHTML = "";
    var option = document.createElement('option');
    var textNode = document.createTextNode(m.chooserPrompt);
    option.appendChild(textNode);
    v.chooser.appendChild(option);
    m.metaDataArray.forEach(dataObject=>{
        let validMusicFile = dataObject.filename.match(/\.mp3$/i);
        if(validMusicFile){
            var option = document.createElement('option');
            option.value = dataObject.fileId;
            var textNode = document.createTextNode(dataObject.filename);
            option.appendChild(textNode);
            v.chooser.appendChild(option);
        }
    });
};

L.updateMusicList = function updateMusicList(){
    m.metaDataArray = []; //clear old metadate=a from array
    a.getFilesMetaData(a.localFileMetaDataName, function(data){
        var list = "";
        data.forEach(dataObject=>{
            //list += dataObject.name + '\n';
            var objectInfo = `name: ${dataObject.name}\nid: ${dataObject.id}\nalbumart: ${dataObject.description}\n\n`;
            list += objectInfo;
            m.metaDataArray.push({
                filename: dataObject.name,
                fileId: dataObject.id,
                relatedFilename: dataObject.description
            });
            
        });
        L.fillMusicChooser();                
        console.log(list);
    });    
};

//to be called when app first starts
L.updateLocalStorage  = function updateLocalStorage(){
    a.setFilesMetaData(a.localFileMetaDataName, function(data){
        var list = "";
        data.forEach(dataObject=>{
            list += dataObject.name + '\n';
        });
        console.log(list);
    });     
};





