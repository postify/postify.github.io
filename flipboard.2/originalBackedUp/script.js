//https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android
/*global L*/
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
 	'resize',
 	'orientationchange'
  ].forEach(eventType=>{
  	window.addEventListener(eventType, eventObject=>{
  	    eventObject.preventDefault();
  		eventObject.stopPropagation();
		c.updateModel(eventObject, c.updateView);
  	}, true);
  });
 };
 
//==============================//
//=========| MODEL |============//
//==============================//
let m = {};
m.UP = "up";
m.DOWN = "down";
m.direction = m.UP;
m.pressed = false;
m.priorY = window.innerHeight;
m.currentY = m.priorY;
m.currentAngle = 0; //in degrees
m.flipperPosition = m.DOWN;
m.finalPosition = true;
m.BACKGROUND_COLOR = "white";
m.CONTENT_COLOR =  "transparent";
m.COLOR_WHILE_FLIPPING = "ededed";
m.FLIP_TIME = 0.33;
m.topContent = document.getElementById("topContent").innerHTML;
m.bottomContent = document.getElementById("bottomContent").innerHTML;
m.APP_WIDTH_MAX = 500;

//==============================//
//=========| VIEW |=============//
//==============================//
let v = {};

//==============================//
//=======| CONTROLLER |=========//
//==============================//
let c = {};
//-----| INITIALIZE |------//
c.initialize = function (){
	L.attachAllElementsById(v);
    L.adjustRemByArea(11,25);
	L.handleResize(m.APP_WIDTH_MAX);
  
    L.addBackgroundImageBottom("img/BoatsAerialView-2.jpg", v.bottomContent);
    v.bottomContent.innerHTML = "";
    v.flipperContent.innerHTML = m.bottomContent;    
    
    //just in case words appear upsidedown
    setInterval(function(){
        L(v.flipper).styles("transition: all 0.0s ease");           // 'zero' seconds
        L(v.flipperContent).styles("transition: all 0.0s ease");    // zero seconds         
        if(m.flipperPosition === m.DOWN) {
            L(v.flipperContent).styles('transform: rotateX(0deg)');
        }
        else if(m.flipperPosition === m.UP ) { 
            L(v.flipperContent).styles('transform: rotateX(180deg)');
        }
        if(m.finalPosition){
            L(v.flipper).styles("background-color: " + m.BACKGROUND_COLOR);
            L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);
        }
    },50);
    
};

//-----| UPDATE MODEL |------//
c.updateModel = function updateModel(eventObject, updateView){
    let source = eventObject.target;
    let type = eventObject.type;
    
    // check on pressed
    if(
        (type === "mousedown" || type === "touchstart") &&
        (source === v.flipper || source === v.flipperContent)
    )
    {
        m.pressed = true;
        L(v.flipperContent).attribs("class=bottomContentStyle");        
    }
    
    // Check on movement
    if(type === "mousemove" || type === "touchmove"){
        let y;
        try{
            y = eventObject.clientY || eventObject.touches[0].clientY;  
        }catch(e){}
      
        m.priorY = m.currentY;
        m.currentY = y;
        m.currentAngle = L.clientYToDeg(m.currentY, window.innerHeight);
        if(m.currentY < m.priorY){
            m.direction= m.UP;
        }
        else if(m.currentY > m.priorY){
            m.direction = m.DOWN;
        }
    }
    else if(false){}
    else if(false){}

	updateView(eventObject);
};

//-----| UPDATE VIEW |------//
c.updateView = function updateView(eventObject){
    let type = eventObject.type;
    
    //---------------------------------------------------// 	
    //---------| Option to display current event |-------//
    //---------------------------------------------------//    
 	//L.showEvent(eventObject, v.flipperContent);
 	
    //---------------------------------------------------// 	
    //---------| Handle flip request ending 	|--------//
    //---------------------------------------------------//
    L.setDirectionAndPosition(eventObject);
    
    //---------------------------------------------------// 	
    //------------| Handle flipper movement |------------//
    //---------------------------------------------------//   
    L.moveFlipper(eventObject);
    
    //---------------------------------------------------// 	
    //--| Handle positioning flipper to top or bottom |--//
    //---------------------------------------------------//     
    L.positionFlipper(eventObject);
    
    //----------------------------------------------------// 	
    //-------------|  Handle screen resizing |------------//
    //----------------------------------------------------//
    L.handleResize(m.APP_WIDTH_MAX);
};

//======================================//
//=======| *** END OF APP *** |=========//
//======================================//


//===============================//
//=========| APPENDIX |==========//
//===============================//

//--------------------------------------------------//
//-------| helper methods added to library |--------//
//--------------------------------------------------//

L.showEvent = function showEvent(eventObject, here){
    let degrees = L.clientYToDeg(m.currentY, window.innerHeight).toFixed(2) + '&deg;';   
	here.innerHTML = eventObject.target.id +", "+eventObject.type + 
	'<br>' + m.direction +
	"<br>Angle: " + degrees;

};

//--------------------//
L.clientYToDeg = function clientYToDeg(currentY, screenHeight){
    if(currentY > screenHeight){
        currentY = screenHeight;
    }
    else if(currentY < 0){
        currentY = 0;
    }
    let rawSin = 1 - (2 * currentY / screenHeight);
    let radians = Math.asin(rawSin);
    let offsetAngle = 90;
    let degrees = 180 * radians / Math.PI  + offsetAngle;

    return degrees;
};

//--------------------//
L.setDirectionAndPosition = function setDirectionAndPosition(eventObject){

    let type = eventObject.type;

    if(type === "mouseup" || type === "touchend"){
        L(v.flipperContent).attribs("class=bottomContentStyle");

        //If flipper is slid enough, continue to flip, otherwise back-off 
        
        // Go up
        if(m.pressed && m.direction === m.UP &&  m.currentAngle > 60){
            L(v.flipper).styles("transform: rotateX(180deg)")("transition: all "+ m.FLIP_TIME +"s ease");
            L(v.flipperContent).styles("transform: rotateX(180deg)");
            m.currentAngle = 180;
            m.flipperPosition = m.UP;
        }
        // Stay Down
        else if(m.pressed && m.direction === m.UP &&  m.currentAngle <= 60) {
            L(v.flipper).styles("transform: rotateX(0deg)")("transition: all "+ m.FLIP_TIME +"s ease");
            L(v.flipperContent).styles("transform: rotateX(0deg)");
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;
        }
        // Go Down
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle < 120){
            L(v.flipper).styles("transform: rotateX(0deg)")("transition: all "+ m.FLIP_TIME +"s ease");
            L(v.flipperContent).styles('transform: rotateX(0deg)');
            m.currentAngle = 0;
            m.flipperPosition = m.DOWN;
        }
        // Stay Up
        else if(m.pressed && m.direction === m.DOWN &&  m.currentAngle >= 120){
            L(v.flipper).styles("transform: rotateX(180deg)")("transition: all "+ m.FLIP_TIME +"s ease");
            L(v.flipperContent).styles('transform: rotateX(180deg)');
            m.currentAngle = 180;
            m.flipperPosition = m.UP; 
        }
        
        L.addContentToFlipper();
        m.pressed = false; 
        m.finalPosition = true;        
        
        
        setTimeout(function(){
            L(v.flipper).styles("transition: all 0.0s ease");           // 'zero' seconds
            L(v.flipperContent).styles("transition: all 0.0s ease");    // zero seconds 
            // you're either UP ...
            if(m.finalPosition && m.currentAngle >= 90 && m.currentAngle <= 180  && m.flipperPosition === m.UP ){
                L(v.flipperContent).styles('transform: rotateX(180deg)');
                L(v.flipperContent).attribs("class=bottomContentStyle");
                m.currentAngle = 180;
                m.flipperPosition = m.UP;
                //v.flipperContent.innerHTML = m.topContent;
            }
            // or you're DOWN ...
            if(m.finalPosition && m.currentAngle < 90  && m.currentAngle >= 0 && m.flipperPosition === m.DOWN){
                L(v.flipperContent).styles('transform: rotateX(0deg)');
                L(v.flipperContent).attribs("class=bottomContentStyle");
                m.currentAngle = 0;
                m.flipperPosition = m.DOWN;
                //v.flipperContent.innerHTML = m.bottomContent;
            }
            //------------------------------------------//
            L.browserPrefix.forEach(prefix=>{
                L(v.bottom).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
            });
            L.browserPrefix.forEach(prefix=>{
                L(v.top).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
            });            
            //------------------------------------------//
            
        }, 100);
        
        L(v.flipper).styles("background-color: " + m.BACKGROUND_COLOR);
        L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);        
    }    
};

//------------------------------//
L.moveFlipper = function moveFlipper(eventObject){
    let type = eventObject.type;
    if (type === "mousemove" || type === "touchmove" ){
        if(m.pressed){
            m.finalPosition = false;
            L(v.flipper).styles("background-color: " + m.COLOR_WHILE_FLIPPING);
            let degrees = L.clientYToDeg(m.currentY, window.innerHeight, m.direction);
            m.currentAngle = degrees;
            L(v.flipper)
                .styles
                    ("transform: rotateX(" + degrees +"deg)")
            ;
            L.shadePage(degrees);
            if(degrees >= 90 && degrees <= 180 ){
                L(v.flipperContent).styles("transform: rotateX(180deg)");
                m.flipperPosition = m.UP;
            }
            else if( degrees < 90 && degrees >=0){
                L(v.flipperContent).styles("transform: rotateX(0deg)");
                m.flipperPosition = m.DOWN;
            } 
            L.addContentToFlipper();
        }
        //if no longer pressed:
        
        else if(!m.pressed){
            m.finalPosition = true;
            L(v.flipper).styles("background-color: " + m.BACKGROUND_COLOR);
            L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);
            L.addContentToFlipper();            
        }
        
    }    
};

//--| Handle positioning flipper to top or bottom when screen is touched|--//
L.positionFlipper = function positionFlipper(eventObject){
    let source = eventObject.target;
    let type = eventObject.type;
    
    let paneTouched = source === v.topPane || source === v.bottomPane;
    
    if (type === 'mousedown' || type === 'touchstart'){
        if (paneTouched){
            m.finalPosition = false;
            m.pressed = true;
        }
        if( source === v.topPane ){
            L(v.flipper).styles("transform: rotateX(180deg)");
            m.flipperPosition = m.UP;
            L.addContentToFlipper();
         }
        else if ( source === v.bottomPane ){
            L(v.flipper).styles("transform: rotateX(0deg)");
            m.flipperPosition = m.DOWN;
            L.addContentToFlipper();
        }
        L.addContentToFlipper();
    }
};
//====| END of adjustRemByArea |====//

L.addContentToFlipper = function addContentToFlipper(){
    L(v.flipperContent).attribs("class=bottomContentStyle");     
    if(m.flipperPosition === m.UP){
        v.flipperContent.innerHTML = "";
        L.addBackgroundImageTop("img/BoatsAerialView-1.jpg", L.flipperContent);
    }
    else if(m.flipperPosition === m.DOWN){
        L.addBackgroundImageTop("", L.flipperContent); 
        L(v.flipperContent).styles("width: 85%");
        v.flipperContent.innerHTML = m.bottomContent;
    }
};

//========| Add background image |=========//
L.addBackgroundImageTop = function addBackgroundImageTop(url, target){
    L(v.flipperContent).attribs("class=bottomContentStyle");     
    let padding = 100;
    if(url === ""){
        padding = 0;
    }
    L(target)
        .styles
            ("background: url("+ url +") no-repeat bottom")
            ("background-size: contain")
            ("width: 100%")
            ("padding-top: " + padding + "%")
    ;       
};
L.addBackgroundImageBottom = function addBackgroundImageBottom(url, target){
    L(v.flipperContent).attribs("class=bottomContentStyle");     
    let padding = 100;
    if(url === ""){
        padding = 0;
        L(v.flipperContent).attribs("class=bottomContentStyle");          
    }    
    L(target)
        .styles
            ("background: url("+ url +") no-repeat top")
            ("background-size: contain")
            ("width: 100%")
            ("padding-bottom: " + padding + "%")            
    ;     
};

//====| adjustRemBySpace(min,max, optionalWindowWidth) called when app loads & when screen size changes |====//
L.minimumRem = 11.5;
L.maximumRem = 25;

L.adjustRemByArea = function adjustRemByArea(min, max, optionalWindowWidth){
    if(typeof min === 'number' && typeof max === 'number' && max >= min){
        L.minimumRem = min;
        L.maximumRem = max;
    }
    const maxArea = 1920 * 900;
    const fudgeFactor = 0.6;//0.7
    var windowHeight = window.innerHeight;
    var windowArea;
    var windowWidth;
    if(optionalWindowWidth !== undefined && typeof optionalWindowWidth === 'number'){
        windowWidth = optionalWindowWidth;
    }
    else{
        windowWidth = window.innerWidth;
    }
    windowArea = windowWidth * windowHeight;
    var rootEm = (L.minimumRem + (L.maximumRem - L.minimumRem)* windowArea / (maxArea * fudgeFactor) );
    document.documentElement.style.fontSize = rootEm + "px";
    return rootEm;
};
//-------------| Handle screen resizing |------------//
L.handleResize = function handleResize(maxWidth){
    if(typeof maxWidth != 'number'){
        console.log("A number is required for maximum app width.");
        return;
    }
    if(window.innerWidth <= maxWidth){
        L(v.app).styles("width: 100%");
        L(v.topPane).styles("width: 100%");
        L(v.bottomPane).styles("width: 100%");
        L.adjustRemByArea();            
    }else{
        L(v.app).styles("width: "+ maxWidth +"px");
        L(v.topPane).styles("width: "+ maxWidth +"px");
        L(v.bottomPane).styles("width: "+ maxWidth +"px");            
        L.adjustRemByArea("", "", maxWidth);
    }
};
//--------| Handling undershading |----------------//
L.shadePage = function shadePage(degrees){
    if(degrees >= 90 && degrees <=180){
        let fraction =   0.55 + ((180 - degrees)  / 90);
        let expFraction = (1-Math.exp(-fraction/0.30));
        L.browserPrefix.forEach(prefix=>{
            L(v.top).styles("background-color: hsl(0, 0%,"+ fraction * 100 +"%)" );
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.bottom).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        }); 
    }
    else if (degrees < 90 && degrees >=0){
        let fraction = 0.55 + (degrees / 90) ;
        let expFraction = (1-Math.exp(-fraction/0.30));
        L.browserPrefix.forEach(prefix=>{
            L(v.bottom).styles("background-color: hsl(0, 0%,"+ fraction * 100 +"%)" );
            
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.top).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        });        
    }
};

//====================================//
//========| END OF APPENDIX |=========//
//====================================//
 
 
 