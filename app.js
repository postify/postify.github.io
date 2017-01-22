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
 *  To keep the global namespace sparseLy populated,
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
 *  4.) My small library of helper methods:
 *      "L"
 * 
 *  5.) The MODEL, VIEW,  and CONTROLLER object for this app:
 *      "m", "v", and "c"
 * 
 *  That adds up to eight global variables:
 *  gapi, a, StyleFix, PrefixFree, L, m, v, and c.
 * 
 *  This app.js file wil not directly access gapi, StyleFix, or PrefixFree
 */
/*global a*/ 
/*global L*/
//============================================//
//============|     MODEL     |===============//
//============================================//
var m = {};
m.player = L("#player").getElement();

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
    //See if all "L"ibrary methods got atteched:
    Object.keys(L).forEach(key=>{
        var type = Object.prototype.toString.call(L[key]);
        console.log(`${key}, Type: ${type }`);
    });
    c.adjustSizes();

};
c.updateModel = function updateModel(eventObject, updateView){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;
    //update model here
    //-------------------
    updateView(eventObject);
};
c.updateView = function updateView(eventObject){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;
    //update view here:
    
    if(type === "resize"){
        c.adjustSizes();
    }
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    else if(false){}
    
    
};
c.adjustSizes = function adjustSizes(min, max, optionalWidowWidth){
    L.adjustRem(min, max, optionalWidowWidth);
    closeChooserPlayerGap();
    
    //--------| helpers |--------//
    function closeChooserPlayerGap(){
        var playerHeight = v.player.getBoundingClientRect().height;
        L('#chooser')
            .styles
                ("bottom: " + playerHeight + "px")
            ;
    }
    
    //----| END of helpers |----//
};
c.showEventInfo = function showEvent(eventObject, viewDiv){
    var source = eventObject.target;
    var id = source.id;
    var type = eventObject.type;
    
    var eventInfo = `${id}, ${type}`;
    viewDiv.innerHTML = eventInfo;
};

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
        "resize"
    ].forEach(eventType=>{
        window.addEventListener(eventType, function(eventObject){
            eventObject.stopPropagation();            
            //Show most rescent event info: Target id and event type:
            c.showEventInfo(eventObject, v.divEventInfo);
            c.updateModel(eventObject, c.updateView);
        }, true);  //true => attempt to capture event object at the earliest time
    });
};

//============================================//
//============|   END OF APP  |===============//
//============================================//














