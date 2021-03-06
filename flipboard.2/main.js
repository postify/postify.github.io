/**
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
c.initialize = function (){
    //all elements which have ids; refer to them by name in the view object v.
    L.attachAllElementsById(v);
    
    L.adjustRemByArea(10,20);
    let fakeEventObject = {};
    fakeEventObject.type = 'resize'
    c.adjustForScreenSize(fakeEventObject);
    
    //Continually show the model state
    setInterval(()=>{
        c.showModelStates(v.flipperContentHolder);
    },10);
};
//-----| UPDATE MODEL |------//
c.updateModel = function updateModel(eventObject, updateView){
    /*
       Should check to modify all state variables in the MODEL
       before updateView is is invoked
    */
    let source = eventObject.target;
    let type = eventObject.type;
    
    let globallyPressed = (type === 'mousedown' || type === 'touchstart');
    let globallyMoved = (type === 'mousemove' || type === 'touchmove');
    let globallyReleased = (type === 'mouseup' || type === 'touchend');
    let validSource = ( source === v.topHalf ||
                        source === v.bottomHalf ||
                        source === v.flipper ||
                        source === v.flipperContentHolder ||
                        source === v.topContentHolder ||
                        source === v.bottomContentHolder                        
                      );
    let finalAngle = (m.currentAngle === 0 || m.currentAngle === 180);

    //Set or clear m.pressed
    if(globallyPressed && validSource){
        m.pressed = true;
        m.debounceTimerId = setTimeout(()=>{
            if(m.pressed){
                m.firmlyPressed = true;
                //this is where the flipping can start
                let height = window.innerHeight;
                let y = height;
                if(eventObject.touches){
                    y = eventObject.touches[0].clientY;
                }
                else{
                    y = eventObject.clientY;
                }
                m.started =  ( (y / height) <= 0.5 ) ? m.UP : m.DOWN ;
            }
        }, m.debounceDelayTime);            
    }
    else if(globallyReleased){
        m.pressed = false;
        m.firmlyPressed = false;
        clearTimeout(m.debounceTimerId);
    }
    
    //Set or clear finger flipping
    if(m.firmlyPressed && globallyMoved){
        m.fingerFlipping = true;  
    }
    else if(globallyReleased){
        //m.fingerMoving = false;
        m.fingerFlipping = false;
    }
    
    //check to auto flip
    if( !m.pressed && !finalAngle && !m.fingerFlipping){
        m.autoFlipping = true;
    }else{
         m.autoFlipping = false; 
    }

    //Set position and direction
    if(globallyMoved){
        m.priorY = m.currentY;
        try{
            m.currentY =  eventObject.clientY  || eventObject.touches[0].clientY;            
        }
        catch(error){}
        m.direction = (m.currentY >= m.priorY) ? m.DOWN : m.UP;        
    }

    if(false){}
    if(false){}
    if(false){}
    if(false){}
    

	//---| now callback updateView() |----//
    updateView(eventObject);
};//-------| END of updateModel |--------//

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
   
    //---------------------------------------------------// 	
    //---------| Option to display current event |-------//
    //---------------------------------------------------//    
 	c.showEvent(eventObject, v.topContentHolder);

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

 
 
 