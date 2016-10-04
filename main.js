/*global $*/
//====| Gather DOM elements, then make a global data model for the app |====//
$.holder =  // outer div of the project
$.app =     // the app div
$.btnAuth = // buttonto authorize google drive
//$.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
$.attachDomObjects();

//====| Make the global data model object that holds the app's state variables |====//
var model = {
     windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,resized: false
    
};
$.initialize = function initialize(){
    $.adjustRem(1, 100);
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
    $(window).on("mousedown", function(e){
        var targetId = e.target.id;
        if(targetId === "btnAuth"){document.location.assign("quickstart.html");}
    });

    //=====| update the view (GUI) with this polling timer |====//
    /* 
        Note: the real handlers are in updateView,
        which checks the model for changes, and updates the GUI accordingly
    */
    setInterval(updateView, 16.667); // polls the model at 60 frames/second
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
