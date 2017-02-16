/*global L*/
//==============================//
//=========| MODEL |============//
//==============================//
let m = {};
//State variables and constants
m.UP = "up";
m.DOWN = "down";
m.autoFlipping = false;
m.fingerFlipping = false;
m.busyFlipping = false;
m.started = m.DOWN;
m.direction = m.UP;
m.firmlyPressed = false;
m.pressed = false;
m.currentAngle = 1; // in degrees
m.currentY = 0;
m.priorY = 0;
m.appWidthMax = 500; // in pixels
//m.autoStartY = 0;
m.autoY = 0;

//constants in camel case:
m.flipTransitionTime = 10; //10; //in milliseconds
m.stepAngle = 4; //in degrees
m.linearStepFraction = 1/100;
m.flipTimerInterval = (m.stepAngle / 180) * m.flipTransitionTime; // in milliseconds:
m.flipperTimerId = 0 ; //id of flipper interval timer for auto flipping
m.debounceTimerId = 0 ;
m.debounceDelayTime = 100;// in milliseconds

//temp vars for testing:
m.modifiedFraction = 0;

//==============================//
//=========| VIEW |=============//
//==============================//
let v = {};

//==============================//
//=======| CONTROLLER |=========//
//==============================//
let c = {};


//===| controller methods |========//
c.adjustForScreenSize = function adjustForScreenSize(eventObject){
    if(eventObject.type === 'resize'){
        if(window.innerWidth < m.appWidthMax){
            L(v.app).styles("width: 100%");
            L.adjustRemByArea();
        }
        else if(window.innerWidth >= 500){
            L(v.app).styles("width: " + m.appWidthMax + "px");
            L.adjustRemByArea('','', m.appWidthMax);            
        }
    }
};


c.flipAutomatically = function flipAutomatically(eventObject){
    if ( !m.autoFlipping  || m.busyFlipping){return;}
    m.busyFlipping = true;
    let screenHeight = window.innerHeight;
    m.autoY = m.currentY;
    
     /**
        1.) if started up and moving up: continue up
        2.) if started up and moving down
            a.) if angle <= 120, keep going down
            b.) if angle > 120, fall back up
        3.) if started down and moving down: continue down
        4.) if started down and moving up
            a.) if angle > 60, keep going up
            b.) if angle <= 60, fall back down
    */
    
    m.flipperTimerId = setInterval(function(){
        if(m.started === m.UP){
            if ( m.direction === m.UP){
                //m.currentAngle += m.stepAngle;
                //-------------------------------//
                m.autoY -= m.linearStepFraction * screenHeight;
                m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);
                //-------------------------------//
                c.flipAndShade();                    
                if (m.currentAngle >= 180){
                    m.currentAngle = 180;
                    clearInterval(m.flipperTimerId);
                    m.busyFlipping = false;
                    m.autoFlipping = false;
                }
            }
            else if ( m.direction === m.DOWN){
                if(m.currentAngle <= 120){
                    //m.currentAngle -= m.stepAngle;
                    //-------------------------------//
                    m.autoY += m.linearStepFraction * screenHeight;
                    m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);                    
                    //-------------------------------//                     
                    c.flipAndShade();                    
                    if (m.currentAngle <=0){
                        m.currentAngle = 0;
                        clearInterval(m.flipperTimerId);
                        m.busyFlipping = false;
                        m.autoFlipping = false;                        
                    }
                }
                else if(m.currentAngle > 120){
                    //m.currentAngle += m.stepAngle;
                    //-------------------------------//
                    m.autoY -= m.linearStepFraction * screenHeight;
                    m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);                    
                    //-------------------------------//                    
                    c.flipAndShade();                    
                    if (m.currentAngle >= 180){
                        m.currentAngle = 180;
                        clearInterval(m.flipperTimerId);
                        m.busyFlipping = false;
                        m.autoFlipping = false;                                                
                    }
                }
            }
        }
        //-----------------------------
        if(m.started === m.DOWN){
            if ( m.direction === m.DOWN){
                //m.currentAngle -= m.stepAngle;
                //-------------------------------//
                m.autoY += m.linearStepFraction * screenHeight;
                m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);                    
                //-------------------------------//                
                c.flipAndShade();                    
                if (m.currentAngle <= 0){
                    m.currentAngle = 0;
                    clearInterval(m.flipperTimerId);
                    m.busyFlipping = false;
                    m.autoFlipping = false;                                            
                }
            }
            else if ( m.direction === m.UP){
                if(m.currentAngle > 60){
                    //m.currentAngle += m.stepAngle;
                    //-------------------------------//
                    m.autoY -= m.linearStepFraction * screenHeight;
                    m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);                    
                    //-------------------------------//                    
                    c.flipAndShade();                    
                    if (m.currentAngle >= 180){
                        m.currentAngle = 180;
                        clearInterval(m.flipperTimerId);
                        m.busyFlipping = false;
                        m.autoFlipping = false;                                                
                    }
                }
                else if ( m.currentAngle <= 60){
                    //m.currentAngle -= m.stepAngle;
                    //-------------------------------//
                    m.autoY += m.linearStepFraction * screenHeight;
                    m.currentAngle = c.clientYToDeg(m.autoY, screenHeight);                    
                    //-------------------------------//                    
                    c.flipAndShade();                    
                    if (m.currentAngle <= 0){
                        m.currentAngle = 0;
                        clearInterval(m.flipperTimerId);
                        m.busyFlipping = false;
                        m.autoFlipping = false;                                                
                    }
                }
            }            
            
        }
        /**
            3.) if started down and moving down: continue down
            4.) if started down and moving up
                a.) if angle > 60, keep going up
                b.) if angle <= 60, fall back down
        */
    }, m.flipTimerInterval);
    //--------------------------//

}


c.moveFlipperWithFinger = function(){
    if(m.fingerFlipping){
        m.currentAngle = c.clientYToDeg(m.currentY, window.innerHeight);
        c.flipAndShade();
    }
};
c.flipAndShade = function flipAndShade(){
    //flip it:
    L(v.flipper)
        .styles
            ("transform: rotateX("+ m.currentAngle  +"deg)")
    ; 
    
    //color the page below:
    c.shadePage(m.currentAngle); 
    
    //flip contents if above the fold or below:
    if ( m.currentAngle >= 90 && m.currentAngle <= 180 ){
        L(v.flipperContentHolder).styles("transform: rotateX(180deg)");
    }
    else if ( m.currentAngle < 90 && m.currentAngle >= 0 ){
        L(v.flipperContentHolder).styles("transform: rotateX(0deg)");
    }
 };
//--------| Handle under-shading |----------------//
c.shadePage = function shadePage(degrees){
    if(degrees >= 90 && degrees <=180){
        let fraction =  ( 180 - degrees )  / 90;
        let fudgeFactor = 0.95;
        m.modifiedFraction = fudgeFactor * fraction + 0.45;
        L(v.topHalf).styles("background: hsl(0, 0%, "+ (m.modifiedFraction * 100) +"%)" );
        let f = 1.75 - fraction;
        if( f < 0 ){ f = 0 }
        else if(f >1 ){f = 1}   
        L(v.flipper).styles("background: hsl(0, 0%, " + ( f * 100 ) +"%)" );
        L(v.bottomHalf).styles("background: hsl(0, 0%,"+ 100 +"%)" ); 
    }
    else if (degrees < 90 && degrees >=0){
        let fraction = (degrees / 90);
        let fudgeFactor = 0.95;
        m.modifiedFraction = fudgeFactor * fraction + 0.45;
        L(v.bottomHalf).styles("background: hsl(0, 0%, "+ m.modifiedFraction * 100 +"%)" );
        let f = 1.75 - fraction;
        if( f < 0 ){ f = 0 }
        else if(f >1 ){f = 1}        
        L(v.flipper).styles("background: hsl(0, 0%, " + f * 100 +"%)" );            
        L(v.topHalf).styles("background: hsl(0, 0%, "+ 100 +"%)" );
    }
};
c.showEvent = function showEvent(eventObject, here){
	here.innerHTML = '<br><center>'+ eventObject.target.id +", "+eventObject.type +'</center><br><br><br><br><br><br>' ;

};

c.showModelStates = function showModelStates(targetContainer){
    let currentStates = `
        <br>
        <b>autoFlipping:</b>  ${m.autoFlipping} <br>
        <b>fingerFlipping:</b>  ${m.fingerFlipping} <br>
        <b>started:</b>  ${m.started} <br>

        <b>firmlyPressed:</b>  ${m.firmlyPressed} <br>
        <b>pressed:</b>  ${m.pressed} <br>
        <b>currentAngle:</b>  ${m.currentAngle}&deg; <br>
        <b>currentY:</b>  ${m.currentY} <br>
        <b>priorY:</b>  ${m.priorY} <br>
        <b>direction:</b>  ${m.direction} <br>
        <b>modifiedFraction:</b> ${m.modifiedFraction}
    `;
    targetContainer.innerHTML = currentStates;
};

//--------------------//
c.clientYToDeg = function clientYToDeg(currentY, screenHeight){
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


//========| possible to re-use some previous ideas below |===========//
/*
//--------------------//
c.setDirectionAndPosition = function setDirectionAndPosition(eventObject){

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
        
        c.addContentToFlipper();
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
            c.browserPrefix.forEach(prefix=>{
                L(v.bottom).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
            });
            c.browserPrefix.forEach(prefix=>{
                L(v.top).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
            });            
            //------------------------------------------//
            
        }, 100);
        
        L(v.flipper).styles("background-color: " + m.BACKGROUND_COLOR);
        L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);        
    }    
};

//------------------------------//
c.moveFlipper = function moveFlipper(eventObject){
    let type = eventObject.type;
    if (type === "mousemove" || type === "touchmove" ){
        if(m.pressed){
            m.finalPosition = false;
            L(v.flipper).styles("background-color: " + m.COLOR_WHILE_FLIPPING);
            let degrees = c.clientYToDeg(m.currentY, window.innerHeight, m.direction);
            m.currentAngle = degrees;
            L(v.flipper)
                .styles
                    ("transform: rotateX(" + degrees +"deg)")
            ;
            c.shadePage(degrees);
            if(degrees >= 90 && degrees <= 180 ){
                L(v.flipperContent).styles("transform: rotateX(180deg)");
                m.flipperPosition = m.UP;
            }
            else if( degrees < 90 && degrees >=0){
                L(v.flipperContent).styles("transform: rotateX(0deg)");
                m.flipperPosition = m.DOWN;
            } 
            c.addContentToFlipper();
        }
        //if no longer pressed:
        
        else if(!m.pressed){
            m.finalPosition = true;
            L(v.flipper).styles("background-color: " + m.BACKGROUND_COLOR);
            L(v.flipperContent).styles("background-color: " + m.CONTENT_COLOR);
            c.addContentToFlipper();            
        }
        
    }    
};

//--| Handle positioning flipper to top or bottom when screen is touched|--//
c.positionFlipper = function positionFlipper(eventObject){
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
            c.addContentToFlipper();
         }
        else if ( source === v.bottomPane ){
            L(v.flipper).styles("transform: rotateX(0deg)");
            m.flipperPosition = m.DOWN;
            c.addContentToFlipper();
        }
        c.addContentToFlipper();
    }
};

c.addContentToFlipper = function addContentToFlipper(){
    L(v.flipperContent).attribs("class=bottomContentStyle");     
    if(m.flipperPosition === m.UP){
        v.flipperContent.innerHTML = "";
        c.addBackgroundImageTop("img/BoatsAerialView-1.jpg", L.flipperContent);
    }
    else if(m.flipperPosition === m.DOWN){
        c.addBackgroundImageTop("", L.flipperContent); 
        L(v.flipperContent).styles("width: 85%");
        v.flipperContent.innerHTML = m.bottomContent;
    }
};

//========| Add background image |=========//
c.addBackgroundImageTop = function addBackgroundImageTop(url, target){
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
c.addBackgroundImageBottom = function addBackgroundImageBottom(url, target){
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
//-------------| Handle screen resizing |------------//
c.handleResize = function handleResize(maxWidth){
    if(typeof maxWidth != 'number'){
        console.log("A number is required for maximum app width.");
        return;
    }
    if(window.innerWidth <= maxWidth){
        L(v.app).styles("width: 100%");
        L(v.topPane).styles("width: 100%");
        L(v.bottomPane).styles("width: 100%");
        c.adjustRemByArea();            
    }else{
        L(v.app).styles("width: "+ maxWidth +"px");
        L(v.topPane).styles("width: "+ maxWidth +"px");
        L(v.bottomPane).styles("width: "+ maxWidth +"px");            
        L.adjustRemByArea("", "", maxWidth);
    }
};
//--------| Handling undershading |----------------//
c.shadePage = function shadePage(degrees){
    if(degrees >= 90 && degrees <=180){
        let fraction =   0.55 + ((180 - degrees)  / 90);
        L.browserPrefix.forEach(prefix=>{
            L(v.topHalf).styles("background-color: hsl(0, 0%,"+ fraction * 100 +"%)" );
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.bottomHalf).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        }); 
    }
    else if (degrees < 90 && degrees >=0){
        let fraction = 0.55 + (degrees / 90) ;
        L.browserPrefix.forEach(prefix=>{
            L(v.bottomHalf).styles("background-color: hsl(0, 0%,"+ fraction * 100 +"%)" );
            
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.topHalf).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        });        
    }
};

*/