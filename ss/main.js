
//From file L.js:
/*global L*/

//From file mvc.js:
/*global m*/
/*global v*/
/*global c*/

//From file controllerMerhods.js methods are added to global variable "c"

//=====================================//
//==========| *** STARTUP ***|=========//
//=====================================//
window.onload = function(){
    
 //set
 c.initialize();
 
 //collection of monitored event types:
 [  'touchstart',
 	'touchend',
  	'touchmove',
	'mousedown',
 	'mouseup',
 	'mousemove',
 	'resize'
  ].forEach(eventType=>{
  	window.addEventListener(eventType, eventObject=>{
  	    eventObject.preventDefault();
  		eventObject.stopPropagation();
		c.updateModel(eventObject, c.updateView);
  	}, true);
  });
};
//-----| END of window on-load handler |---------//

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
   
  
    
};
//======================================//
//=======| *** END OF APP *** |=========//
//======================================//
