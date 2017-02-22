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
    
    //Fill the JSON array m.contents
    let getter = new XMLHttpRequest();
    let index = 0;
    
    function fetch(index){
        getter.open("GET","contents/page." + index + "/page" + index +".json" );
        getter.send();        
    }
    
    fetch(index);
    getter.onload = function(){
        if(this.status === 200){
            m.contents.push(JSON.parse(this.response));
            index++;
            fetch(index);
        }else{
            let topUrls = "";
            m.contents.forEach(page=>{
                topUrls += page.topHalf.type + "\n";
            });
            m.numberOfPages = m.contents.length;
            c.fillPage(m.currentPage);
        }
    };
    getter.onerror = function(){
        alert("Table of Contents fetch complete: " + m.contents.length + " pages.");
        m.numberOfPages = m.contents.length;        
        c.fillPage(m.currentPage);        
    };

    //Simulate resizing:
    L.adjustRemByArea(9.5,20.5);//10,20 works well
    let fakeEventObject = {};
    fakeEventObject.type = 'resize';
    c.adjustForScreenSize(fakeEventObject);
    
    //Hide the flipper:
    L(v.flipper).styles("visibility: hidden");

    //Continually show the model's state variables:
    setTimeout(()=>{
        setInterval(()=>{
            c.showModelStates(v.flipperContentHolder);//provide target element
            //update model
            let fakeEventObject = {};
            fakeEventObject.type = "foobar";
            fakeEventObject.target = document.body;
            c.updateModel(fakeEventObject, c.updateView);
        },100);
    }, 500);

    
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

    //----------------------------------------------------// 	
    //--------|  Handle flipper crossing center |---------//
    //----------------------------------------------------//
    if(m.flipperCrossedCenter ){
        setTimeout(()=>{
            m.flipperCrossedCenter = false;
        },3000);
    }

};
//======================================//
//=======| *** END OF APP *** |=========//
//======================================//

 
 
 