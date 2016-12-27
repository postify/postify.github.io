//====================//
//=====| MODEL |======//
//====================//
var m = {};


//====================//
//======| VIEW |======//
//====================//
/*global a*/ 
var v = a; //'a' is our personal api library
/*
v. = //
v. = //
v. = //
v. = //
*/
""; //dummy DOM element
v.attachDomObjects();


//=========================//
//=====| CONTROLLER |======//
//=========================//
var c = {};
c.initialize = function initialize(){};
c.updateModel = function updateModel(event, updateView){};
c.updateView = function updateView(){};


//======================//
//=====| STARTUP |======//
//======================//
c.initialize();
window.addEventListener("load", function(){
    ["click","change"].forEach(eventType=>{
        window.addEventListener(eventType, function(event){
            c.updateModel(event, c.updateView);
        });
    });
});

//=========================//
//=====| END OF APP |======//
//=========================//