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
    L.handleFlipperCrossedCenter(eventObject);

    //----------------------------------------------------// 	
    //------------|  Handle flipper closing |-------------//
    //----------------------------------------------------// 
    c.handleFipperClosed(eventObject);

    //------------------------------------------------------// 	
    //---|  Give flipper content when page touched |----//
    //----------------------------------------------------//     
    c.handlePageTouched(eventObject);
    
};
//======================================//
//=======| *** END OF APP *** |=========//
//======================================//

//---|  Give flipper proper content when touched |----//
c.handlePageTouched = function handlePageTouched(eventObject){
    
    let source = eventObject.target;
    let type = eventObject.type;
    let topSource = (source === v.topHalf || source === v.topContentHolder);
    let bottomSource = (source === v.bottomHalf || source === v.bottomContentHolder);
    let properSource = topSource || bottomSource;
    let pressed = (type === "touchstart" || type === "mousedown");
    let notFlipping = !m.autoFlipping || !m.fingerFlipping;
    let okToSetContent = properSource && pressed && notFlipping;
    
    if(okToSetContent){
        if(topSource){
            L(v.flipper)
                .styles
                    ("transform: rotateX(180deg)")
                    ("background-location: bottom");
            L(v.flipperContentHolder)
                .styles
                    ("transform: rotateX(180deg)")
                    ("background-location: bottom");
            L.fillTop(m.currentPage, v.flipperContentHolder);
        }
        else if(bottomSource){
            L(v.flipper)
                .styles
                    ("transform: rotateX(0deg)")
                    ("background-location: top"); 
            L(v.flipperContentHolder)
                .styles
                    ("transform: rotateX(0deg)")
                    ("background-location: top");                
            L.fillBottom(m.currentPage, v.flipperContentHolder);  
        }
    }
    
};

L.handleFlipperCrossedCenter = function handleFlipperCrossedCenter(){
    if(m.flipperCrossedCenter ){
        m.flipperCrossedCenter = false;
        if(m.started === m.DOWN && m.currentLocation === m.UP){
            //Moving UP: show NEXT page top on flipper
            L.fillTop(c.nextPage(), v.flipperContentHolder);            
        }
        else if(m.started === m.UP && m.currentLocation === m.DOWN){
            //Moving DOWN: show PRIOR page bottom on flipper
            L.fillBottom(c.priorPage(), v.flipperContentHolder);
        }
    }
    
};
//=======| add indicated page top  |======================//
L.fillTop = function fillTop(index, target){
    let topUrl = m.contents[index].topHalf.content;
    let topType = m.contents[index].topHalf.type;

    //ask about the bottom
    if(topType === "text"){
        let urlPrefix = "contents/page." + index +"/";
        let url = urlPrefix + topUrl;
        get(url, fill);
    }
    else if(topType === "halfGraphic"){
        let urlPrefix = "img/";
        let url = urlPrefix + topUrl;
        setTopBackground(url, target);
    }
    //----------------------helpers---------------------//
    function get(url, fillTarget){
        let getter = new XMLHttpRequest();
        getter.open("GET", url);
        getter.send();
        
        //handle response and error;            
        getter.onload = function(){
            let response = getter.responseText;                
            if(fillTarget){fillTarget(response);}                
        };
        getter.onerror = function(){};
    }
    function fill(text){
        target.innerHTML = text;
        L(target)
            .styles
                ("background: none")
                ("width: 85%")
                ("padding-top: 0")                    
        ;         
    }
    function setTopBackground(url, target){
        target.innerHTML = "";
        L(target)
            .styles
                ("background: black url("+ url +") no-repeat bottom")
                ("background-size: contain")
                ("width: 100%")
                ("padding-top: 100%")                    
        ;                    
    }
};
//=======| add indicated page bottom  |===================//
L.fillBottom = function fillBottom(index, target){
    let bottomUrl = m.contents[index].bottomHalf.content;
    let bottomType = m.contents[index].bottomHalf.type;

    //ask about the bottom
    if(bottomType === "text"){
        let urlPrefix = "contents/page." + index +"/";
        let url = urlPrefix + bottomUrl;
        //v.bottomContentHolder.innerHTML = get(urlPrefix + bottomUrl, fillBottom);
        get(url, fill);
    }
    else if(bottomType === "halfGraphic"){
        let urlPrefix = "img/";
        let url = urlPrefix + bottomUrl;
        setBottomBackground(url, target);
    }
    //----------------------helpers---------------------//
    function get(url, fillTarget){
        let getter = new XMLHttpRequest();
        getter.open("GET", url);
        getter.send();
        
        //handle response and error;            
        getter.onload = function(){
            let response = getter.responseText;                
            if(fillTarget){fillTarget(response);}                
        };
        getter.onerror = function(){};
    }
    function fill(text){
        target.innerHTML = text;
        L(target)
            .styles
                ("background: none")
                ("width: 85%")
                ("padding-top: 0")                    
        ;         
    }
    function setBottomBackground(url, target){
        target.innerHTML = "";
        L(target)
            .styles
                ("background: black url("+ url +") no-repeat top")
                ("background-size: contain")
                ("width: 100%")
                ("padding-top: 100%")                    
        ;                    
    }
};



