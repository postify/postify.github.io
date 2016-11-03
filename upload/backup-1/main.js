alert("Abbas");
//====================//
//=====| MODEL |======//
//====================//
var model = {
    USERNAME: "",
    PASSWORD: ""
};


//====================//
//======| VIEW |======//
//====================//
var view = {};

//=========================//
//=====| CONTROLLER |======//
//=========================//
var ctrl = {
    init: function init(){},
    eventList: [
        "click"
        ,"change"
        ,"mousedown"
        ,"mouseup"
    ],
    eventHandler: function eventHandler(e){
        e.stopPropagation();
        alert(e.type);   
    }
};


/**
//======================//
//=====| STARTUP |======//
//======================//
*/
window.addEventListener("load", function(){
    ctrl.init();
    ctrl.eventList.forEach(function(eventType){
        window.addEventListener(eventType, ctrl.eventHandler, true);
    });
    
});//====================//
//======| END of App |===//
//=======================//
