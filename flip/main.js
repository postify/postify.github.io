/*
    Author: Abbas Abdulmalik
    Created: February 15, 2017
    Revised: (N/A)
    Title:  Flipboard Simulation
    Purpose: To create a Flipboard-like evironment
    for publishing content on a Flipboard magazine and get a 
    real flipboard effect when "scrolling." The Flipboard
    website does this only for the "big boys," and not for
    regular articles blog posts.

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
 c.initialize();
 [
 	'touchstart',
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
 };//-----| END of window on-load handler |---------//

 //-----| INITIALIZE |------// 
c.initialize = function initialize(){
    //Refer to all elements with ids by name in the view object v.    
    L.attachAllElementsById(v);
    
    //Simulate resizing:
    L.adjustRemByArea(9.5,20.5);//10,20 works well
    let fakeEventObject = {};
    fakeEventObject.type = 'resize';
    c.adjustForScreenSize(fakeEventObject);
    
    //Hide the flipper:
    L(v.flipper).styles("visibility: hidden");

    //Add initial content for testing purposes:
    /*
    let urlTop = m.contents[m.currentPage].topHalf.content;    
    L(v.topContentHolder)
        .styles
            ("background: url(img/" + urlTop + ") no-repeat bottom")
            ("background-size: contain")
            ("height: 100%")
            ("top-padding: 100%");
    v.topContentHolder.innerHTML = "";    
    let urlBottom = m.contents[m.currentPage].bottomHalf.content;
    L(v.bottomContentHolder)
        .styles
            ("background: url(img/" + urlBottom + ") no-repeat top")
            ("background-size: contain")
            ("height: 100%")
            ("top-padding: 100%");          
    v.bottomContentHolder.innerHTML = ""; 
    */
    //Continually show the model's state variables:
    setInterval(()=>{
        c.showModelStates(v.flipperContentHolder);//provide target element
    },10);    
};
//-----| END of INITIALIZE |------// 

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
   
    //---------------------------------------------------// 	
    //---------| Option to display current event |-------//
    //---------------------------------------------------//    
 	//c.showEvent(eventObject, v.topContentHolder);

    //---------------------------------------------------// 	
    //------------|  Handle finger flipping  |-----------//
    //---------------------------------------------------//   
    c.moveFlipperWithFinger(eventObject);    
 	
    //---------------------------------------------------// 	
    //------------| Handle auto-flipping 	|------------//
    //---------------------------------------------------//
    c.flipAutomatically(eventObject);
    
    //---------------------------------------------------// 	
    //--| Handle positioning flipper to top or bottom |--//
    //---------------------------------------------------//     
    //c.positionFlipper(eventObject);
    
    //----------------------------------------------------// 	
    //-------------|  Handle screen resizing |------------//
    //----------------------------------------------------//
    c.adjustForScreenSize(eventObject);


};
//======================================//
//=======| *** END OF APP *** |=========//
//======================================//

 
 
 