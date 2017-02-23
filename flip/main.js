/*
    Author: Abbas Abdulmalik
    Created: February 15, 2017
    Revised: Februrary 22, 2017
    Title:  Flipboard Simulation
    Purpose: To create a Flipboard-like evironment
    for publishing content to get a 
    real flipboard effect when "scrolling." The Flipboard
    website and app does this only for the "big boys,"
    and not for regular articles blog posts.
*/

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
   
    //---------------------------------------------------// 	
    //---------| Option to display current event |-------//
    //---------------------------------------------------//    
 	//c.showEvent(eventObject, v.flipperFooter);
 	//c.showEvent(eventObject, v.pageFooter);

    //---------------------------------------------------// 	
    //------------|  Handle finger flipping  |-----------//
    //---------------------------------------------------//   
    c.moveFlipperWithFinger(eventObject);    
 	
    //---------------------------------------------------// 	
    //------------| Handle auto-flipping 	|------------//
    //---------------------------------------------------//
    c.flipAutomatically(eventObject);

    //----------------------------------------------------// 	
    //-------------|  Handle screen resizing |------------//
    //----------------------------------------------------//
    c.adjustForScreenSize(eventObject);

    //----------------------------------------------------// 	
    //--------|  Handle flipper crossing center |---------//
    //----------------------------------------------------//
    if(m.flipperCrossedCenter ){
        m.flipperCrossedCenter = false;
        //handle crossing here:
        //change flipper content
    }

    //----------------------------------------------------// 	
    //------------|  Handle flipper closing |-------------//
    //----------------------------------------------------// 
    c.handleFipperClosed(eventObject);
};
//======================================//
//=======| *** END OF APP *** |=========//
//======================================//