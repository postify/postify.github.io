//====================//
//=====| MODEL |======//
//====================//
var m = {};


//====================//
//======| VIEW |======//
//====================//
/*global a*/ 
var v = a; //'a' is our personal api library
v.imageFileElement = //
v.musicFileElement = //
v.btnImageFile = //
v.btnMusicFile = //
""; //dummy DOM element
v.attachDomObjects();


//=========================//
//=====| CONTROLLER |======//
//=========================//
var c = {};
c.initialize = function initialize(){};
c.updateModel = function updateModel(event, updateView){
    //code here, then ...
    updateView(event);
};
c.updateView = function updateView(event){
    var source = event.target;
    var id = source.id;
    var type = event.type;

    // call file browser indirectly
    if(source == v.btnMusicFile){
        v.musicFileElement.click();
    }
    else if(source == v.btnImageFile){
        v.imageFileElement.click();
    }
};


//======================//
//=====| STARTUP |======//
//======================//
c.initialize();
window.addEventListener("load", function(){
    ["mousedown","click","change"].forEach(eventType=>{
        window.addEventListener(eventType, function(event){
            c.updateModel(event, c.updateView);
        });
    });
});

//=========================//
//=====| END OF APP |======//
//=========================//