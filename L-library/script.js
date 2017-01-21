/**
 Inteded global variable list:
 L = our little library of methods loaded by index.html:
 
 The objects introduce on this page
 m = our MODEL object
 v = or VIEW object
 c = our CONTROLLER object
 
 If prefixfree is loaded, it adds these two global objects:
  StyleFix, PrefixFree
 
 If Google Javascript Client is loaded, it adds globsal object:
  gapi
*/
/*global L*/
/*global StyleFix*/
/*global PrefixFree*/
/*global gapi*/
//==============================================//
//=================| STARTUP |==================//
//==============================================//
window.onload = function(){
//===============================================//
  
  c.initialize();
  
  //common DOM events:
  [ "mouseover",
    "mousedown",
    "mouseup",
    "input",
    "keyup",
    "keydown",
    "resize",
    "change"].forEach(eventType=>{
      window.addEventListener(eventType, function(eventObject){
        c.updateModel(eventObject, c.updateView);
      });
  });
  
  //common audio events
  ["play",
  "pause",
  "playing",
  "ended",
  "timeupdate",
  "volumechange",
  "durationchange"].forEach(eventType=>{
       m.player.addEventListener(eventType, function(eventObject){
        c.updateModel(eventObject, c.updateView);
      });
  });

//=============================================//
};
//==============================================//
//==============| END ofSTARTUP |===============//
//==============================================//

//==============================================//
//==================| MODEL |===================//
//==============================================//
var m = {};
m.player = document.createElement('audio');
m.player.src = 'http://HussMalik.github.io/music/Anugama - Silk Tree.mp3';


//==============================================//
//===================| VIEW |===================//
//==============================================//
var v = {};
L.attachAllElementsById(v);

v.body = document.body;
v.body.id = "body";

v.window = window;
v.window.id = "window";

v.html = document.documentElement;
v.html.id = "root";

//==============================================//
//=================| CONTROLLER |===============//
//==============================================//
var c = {};
//-------| initialzation method |-----------//
c.initialize = function initialize(){
  L.adjustRem();
  
  document.body.appendChild(m.player);
  L(m.player)
    .attribs
      ("class=wide")
      ("controls=true")
      ("id=player")
  ;

  L(".wide")
    .styles
      ("width: 98%")
      ("left: 0")
      ("border: 1px solid teal")
      ("border-radius: 0.25rem")
      ("padding: 0.5%")
  ;
  
  L(v.msg.id)
    .styles
      ("color: white")
      ("font-family: sans-serif")
      ("font-weight: bold")
  ;        
  
  L("#text").getElement().value = "This is a test";
  v.text.value += " of the emergency ...";
  L("#text")
    .styles
      ("color: red")
      ("value: this is a test")
      ("background: lightblue")
      ("text-shadow: 0 0.5px 0 white")
  ;
  
};//-----| END of c.initialize |--------//

//---------------------------------------//
//-------| updateModel method |----------//
//---------------------------------------//
c.updateModel = function updateModel(eventObject, updateView){
  var source = eventObject.target;
  var type = eventObject.type;
  var id = source.id;  
  
  if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){} 
  
  updateView(eventObject);
};//-----| END of updateModel |----------//

//---------------------------------------//
//-------| updateView method |-----------//
//---------------------------------------//
c.updateView = function updateView(eventObject){
  var source = eventObject.target;
  var type = eventObject.type;
  var id = source.id;
  
  //show event source id and type oef event:
  v.msg.innerHTML = `${id}, ${type}`;  
  
  if(source === window && type === "resize" ){
    L.adjustRem();
  }
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  else if(false){}
  
};//-----| END of updateView |----------//



