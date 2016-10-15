/*global $*/
//====| Gather DOM elements, then make a global data model for the app |====//
$.holder =  // outer div of the project
$.app =     // the app div
$.player =  //audio player
$.timeMsg =     // div to shows time update events
$.progressMsg = // div that shows progress events
$.eventsList = // will list all audio events
//$.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
$.attachDomObjects();
$.possibleAudioevents = [
    "abort"
    ,"canplay"
    ,"canplaythrough"
    ,"durationchange"
    ,"emptied"
    ,"ended"
    ,"error"
    ,"loadeddata"
    ,"loadedmetadata"
    ,"loadstart"
    ,"pause"
    ,"play"
    ,"playing"
    ,"progress"
    ,"ratechange"
    ,"seeked"
    ,"seeking"
    ,"stalled"
    ,"suspend"
    ,"timeupdate"
    ,"volumechange"
    ,"waiting"
];

//====| Make the global data model object that holds the app's state variables |====//
var model = {
     windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,resized: false
    ,timeupdateCounter: 0
    ,progressCounter: 0
    ,programStartTime: Date.now()
    
};
$.initialize = function initialize(){
    $.adjustRem(5, 50);
    //etc.
};

//====| app "starts" here |====//
$(window).on("load", function(){
    $.initialize();
    //====| write short handlers for dom events: only change model data |====//
    // Note: handlers should only change model flags and model data, not the DOM.
    $(window).on("resize", function(){
        model.windowWidth = window.innerWidth;
        model.windowHeight = window.innerHeight;
        model.resized = true;
    });
    $($.player).on("timeupdate", function(){
        model.timeupdateCounter += 1;
        $($.timeMsg).html("timeupdate events: "+ model.timeupdateCounter);
    });
    $($.player).on("progress", function(){
        model.progressCounter += 1;
        $($.progressMsg).html("progress events: "+ model.progressCounter);
    });
    
    $.possibleAudioevents.forEach(possibleEvent=>{
        $($.player).on(possibleEvent, function(eventObject){
            var time = parseInt( (Date.now() - model.programStartTime)/1000, 10 );
            var type = eventObject.type;
            if(type !== 'timeupdate' && type !== 'progress'){
                let eventsSoFar = $.eventsList.value;
                eventsSoFar = `${type}, ${time} seconds\n${eventsSoFar}`;
                $($.eventsList).html(eventsSoFar);                
            }
        });
    });

    //=====| update the view (GUI) with this polling timer |====//
    /* 
        Note: the real handlers are in updateView,
        which checks the model for changes, and updates the GUI accordingly
    */
    setInterval(updateView, 100); // polls the model at 60 frames/second
    function updateView(){
        if(model.resized){
            $.adjustRem();
            model.resized = false;
        }
        if(true){}
        if(true){}
        if(true){}
        if(true){}
        if(true){}
        //etc.
    };
});
//====| app "ends" here |====//
