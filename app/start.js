/*
  Author: Abbas Abdulmalik
  Created: June 16, 2017
  Updated: August 1, 2017
  Title: sweetspot
  Purpose: join sweet-spot-music ui with postify.gthub.io
  music player-uploader to google drive, using
  the latest advanced template
*/

/*global c*/
window.addEventListener("load", function(eventObject){  
  c.initialize(eventObject);
  //here are all of the important event types
  [ 
    //common events 
    'change',
    'keyup',
    'keydown',
    //"click",
    "mousedown",
    "touchstart",
    "mousemove",
    "touchmove",
    "mouseup",
    "touchend",
    "resize",
    "online",
    "offline",
    //player events
    "input",
    "playing",
    'play',
    "pause",
    "volumechange",
    "timeupdate",
    "durationchange",
    "ended",
    //custom event
    'hidecontrols'    
  ].forEach(haveWindowListen);  
  function haveWindowListen(eventType){
    window.addEventListener(eventType, c.updateState, true);
  }
});