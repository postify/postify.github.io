/*global L*/
//==============================//
//=========| MODEL |============//
//==============================//
let m = {};
//State variables and constants
m.autoFlipping = false;
m.fingerFlipping = false;
m.busyFlipping = false;
m.flipperClosed = true;
m.flipperClosedHandled = false;
m.started = m.DOWN;
m.currentLocation = m.DOWN;
m.direction = m.UP;
m.firmlyPressed = false;
m.pressed = false;
m.currentAngle = 0; // in degrees
m.priorAngle = 0; //in degrees
m.currentY = 0;
m.priorY = 0;
m.currentPage = 0;
m.numberOfPages = 0;
m.urlTop = "";
m.urlBottom = "";
m.flipperCrossedCenter = false;
m.crossingDirection = m.UP;

//constants, most in camel case:
m.testVersion = 26;
m.UP = "up";
m.DOWN = "down";
m.appWidthMax = 450; // in pixels
m.flipTransitionTime = 150; //150 in milliseconds
m.angularStep = 4; //in degrees
m.flipTimerInterval = (m.angularStep / 180) * m.flipTransitionTime; // in milliseconds
m.offsetAngle = 40; //to keep cursor within the page (not at the edge) while finger flipping
m.flipperTimerId = 0 ; //id of flipper interval timer for auto flipping
m.debounceTimerId = 0 ;
m.debounceDelayTime = 100;// in milliseconds
m.splashTime = 2; // in seconds

//contents:
m.contents = [];

//==============================//
//=========| VIEW |=============//
//==============================//
let v = {};

//==============================//
//=======| CONTROLLER |=========//
//==============================//
let c = {};

c.nextPage = function nextPage(){
    let pageNumber;
    //if the next page exceeds the largest index, point to page 0
    if(m.currentPage +1 >= m.numberOfPages){
        pageNumber = 0;
    }
    else{
        pageNumber = m.currentPage +1;
    }
    return pageNumber;
};

c.priorPage = function priorPage(){
    let pageNumber;
    //if the prior page goes negative, point to final page
    if(m.currentPage - 1 < 0){
        pageNumber = m.numberOfPages -1;
    }
    else{
        pageNumber = m.currentPage - 1;
    }
    return pageNumber;
};

//===| controller methods |========//

//-----| INITIALIZE |------// 
c.initialize = function initialize(){
    //Refer to all elements with ids by name in the view object v:    
    L.attachAllElementsById(v);    
    
    //Simulate resizing:
    L.adjustRemByArea(9.5,20.5);//10,20 works well
    let fakeEventObject = {};
    fakeEventObject.type = 'resize';
    fakeEventObject.target = {};
    fakeEventObject.target.id = 'snafoo';
    c.adjustForScreenSize(fakeEventObject);    
    
    //Fill the JSON array m.contents
    c.getContentsMetaData();
    
    //fade splash page (shroud)
    setTimeout(function(){
        L(v.shroud)
            .styles
                ("opacity: 0")
                ("visibility: hidden")
        ;
    }, m.splashTime * 1000);
    
    //Hide the flipper:
    L(v.flipper).styles("visibility: hidden");

    //Continually show the model's state variables:
    setTimeout(()=>{
        L(v.flipper).styles("visibility: hidden");        
        setInterval(()=>{
            if(m.fingerFlipping || m.autoFlipping){
                //put proper half of page in the flipper:
                if(m.started === m.UP && m.currentLocation === m.UP){
                    L.fillTop(m.currentPage, v.flipperContentHolder);
                    L.fillTop(c.priorPage(), v.topContentHolder);
                }
                else if(m.started === m.DOWN && m.currentLocation === m.DOWN){
                    L.fillBottom(m.currentPage, v.flipperContentHolder);
                    L.fillBottom(c.nextPage(), v.bottomContentHolder);
                }
                L(v.flipper).styles("visibility: visible");
                //c.showModelStates(v.flipperContentHolder);//provide target element                
            }else{
                L(v.flipper).styles("visibility: hidden");
            }
            //update model
            let fakeEventObject = {};
            fakeEventObject.type = "foobar";
            fakeEventObject.target = document.body;
            c.updateModel(fakeEventObject, c.updateView);
        },100);
    }, 500);
    
};
//-----| END of INITIALIZE |------// 

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
                        source === v.topContentHolder ||    
                        source === v.bottomHalf ||
                        source === v.bottomContentHolder ||                        
                        source === v.flipper ||
                        source === v.flipperContentHolder ||
                        source === v.pageFooter || 
                        source === v.flipperFooter    
                      );
    let finalAngle = (m.currentAngle === 0 || m.currentAngle === 180);
    
    //Record flipper crossing
    
    let halfHeight = window.innerHeight/2;
    if (m.currentY > halfHeight && m.priorY <= halfHeight && (m.firmlyPressed || m.autoFlipping)){
        m.flipperCrossedCenter = true;
        m.crossingDirection = m.DOWN;
    }
    else if (m.currentY <= halfHeight && m.priorY > halfHeight && (m.firmlyPressed || m.autoFlipping)){
        m.flipperCrossedCenter = true;
        m.crossingDirection = m.UP;
    }
    
    if ( m.currentAngle < 90 && m.priorAngle >=90  && (m.firmlyPressed || m.autoFlipping)){
        m.flipperCrossedCenter = true;
        m.crossingDirection = m.DOWN;
    }
    else if ( m.currentAngle >= 90 && m.priorAngle < 90 && (m.firmlyPressed || m.autoFlipping)){
        m.flipperCrossedCenter = true;
        m.crossingDirection = m.UP;
    }  

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
        m.fingerFlipping = false;
    }
    
    //check to auto flip
    if( !m.pressed && !finalAngle && !m.fingerFlipping){
        m.autoFlipping = true;
    }else{
         m.autoFlipping = false; 
    }

    //Set position and direction
    if(globallyMoved && !m.autoFlipping){
        m.priorY = m.currentY;
        try{
            m.currentY =  eventObject.clientY  || eventObject.touches[0].clientY;            
        }
        catch(error){}
        m.direction = (m.currentY >= m.priorY) ? m.DOWN : m.UP;        
    }

    //determine current location
    if(m.currentAngle >= 90 ){
        m.currentLocation = m.UP;
    }
    else{
        m.currentLocation = m.DOWN;
    }
    
    //set final position:
    if(m.currentAngle === 0 || m.currentAngle === 180){
        m.flipperClosed = true;
    }else{
        m.flipperClosed = false;
        m.flipperClosedHandled = false;
    }
    
    
   
    if(false){}
    if(false){}
    if(false){}
    

	//---| now callback updateView() |----//
    updateView(eventObject);
};//-------| END of updateModel |--------//

c.hideFlipper = function hideFlipper(){
    L(v.flipper).styles("visibility: hidden");
};

c.showFlipper = function showFlipper(){
    L(v.flipper).styles("visibility: visible");
};

//======| get all app page meta data content |==========//
c.getContentsMetaData = function getContentsMetaData(){
    let getter = new XMLHttpRequest();
    let index = 0;
    function fetch(index){
        getter.open("GET","contents/page." + index + "/page" + index +".json" );
        getter.send();        
    }
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
    fetch(index);

};//======| END getting app meta data  |==========//

c.adjustForScreenSize = function adjustForScreenSize(eventObject){
    if(eventObject.type === 'resize'){
        if(window.innerWidth < m.appWidthMax){
            L(v.app).styles("width: 100%");
            L.adjustRemByArea();
        }
        else if(window.innerWidth >= m.appWidthMax){
            L(v.app).styles("width: " + m.appWidthMax + "px");
            L.adjustRemByArea('','', m.appWidthMax);            
        }
    }
};

c.flipAutomatically = function flipAutomatically(eventObject){
    if ( !m.autoFlipping  || m.busyFlipping ){return;}
    m.busyFlipping = true;

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
                m.priorAngle = m.currentAngle;
                m.currentAngle += m.angularStep;
                c.flipAndShade();                    
                if (m.currentAngle >= 180){
                    m.priorAngle = m.currentAngle;                    
                    m.currentAngle = 180;
                    c.flipAndShade();                    
                    clearInterval(m.flipperTimerId);
                    c.setFinalFLipperStatus();
                }
            }
            else if ( m.direction === m.DOWN){
                if(m.currentAngle <= 120){
                    m.priorAngle = m.currentAngle;                    
                    m.currentAngle -= m.angularStep;
                    c.flipAndShade();                    
                    if (m.currentAngle <=0){
                        m.priorAngle = m.currentAngle;                        
                        m.currentAngle = 0;
                        c.flipAndShade();                        
                        clearInterval(m.flipperTimerId);
                        c.setFinalFLipperStatus();                        
                    }
                }
                else if(m.currentAngle > 120){
                    m.priorAngle = m.currentAngle;                    
                    m.currentAngle += m.angularStep;
                    c.flipAndShade();                    
                    if (m.currentAngle >= 180){
                        m.priorAngle = m.currentAngle;                        
                        m.currentAngle = 180;
                        c.flipAndShade();                        
                        clearInterval(m.flipperTimerId);
                        c.setFinalFLipperStatus();                       
                    }
                }
            }
        }
        //-----------------------------
        if(m.started === m.DOWN){
            if ( m.direction === m.DOWN){
                m.priorAngle = m.currentAngle;                
                m.currentAngle -= m.angularStep;
                c.flipAndShade();                    
                if (m.currentAngle <= 0){
                    m.priorAngle = m.currentAngle;
                    m.currentAngle = 0;
                    c.flipAndShade();                    
                    clearInterval(m.flipperTimerId);
                    c.setFinalFLipperStatus();                   
                }
            }
            else if ( m.direction === m.UP){
                if(m.currentAngle > 60){
                    m.priorAngle = m.currentAngle;                    
                    m.currentAngle += m.angularStep;
                    c.flipAndShade();                    
                    if (m.currentAngle >= 180){
                        m.priorAngle = m.currentAngle;                        
                        m.currentAngle = 180;
                        c.flipAndShade();
                        clearInterval(m.flipperTimerId);
                        c.setFinalFLipperStatus();                        
                    }
                }
                else if ( m.currentAngle <= 60){
                    m.priorAngle = m.currentAngle;                    
                    m.currentAngle -= m.angularStep;
                    c.flipAndShade();                    
                    if (m.currentAngle <= 0){
                        m.priorAngle = m.currentAngle;                        
                        m.currentAngle = 0;
                        c.flipAndShade();                        
                        clearInterval(m.flipperTimerId);
                        c.setFinalFLipperStatus();
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
        //if flipping is complete, unshade the pages
    }, m.flipTimerInterval);
    //--------------------------//
};
c.setFinalFLipperStatus = function setFinalFLipperStatus(){
    m.busyFlipping = false;
    m.autoFlipping = false;
    m.flipperClosed = true;
    if(m.currentAngle <  90){
        m.currentLocation = m.DOWN;
    }
    else{
        m.currentLocation = m.UP;        
    }
};

c.moveFlipperWithFinger = function(){
    if(m.fingerFlipping){
        m.priorAngle = m.currentAngle;
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
        L(v.flipperContentHolder)
            .styles
            ("transform: rotateX(0deg)")
            ("top: 0")
        ;            
    }
 };
 
//--------| Handle under-shading |----------------//
c.shadePage = function shadePage(degrees){
    if(degrees >= 90 && degrees <=180){
        let fraction =  ( 180 - degrees )  / 90;
        let offset = 0.35;
        let modifiedFraction = fraction + offset;
        L.browserPrefix.forEach(prefix=>{
            L(v.topHalf).styles("background-color: hsl(0, 0%,"+ modifiedFraction * 110 +"%)" );
            L(v.flipper).styles("background-color: hsl(0, 0%,"+ ((1 - fraction)+ 0.65)  * 110 +"%)" );
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.bottomHalf).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        }); 
    }
    else if (degrees < 90 && degrees >=0){
        let fraction = (degrees / 90);
        let offset = 0.30;
        let modifiedFraction = fraction + offset;        
        L.browserPrefix.forEach(prefix=>{
            L(v.bottomHalf).styles("background-color: hsl(0, 0%,"+ modifiedFraction * 100 +"%)" );
            L(v.flipper).styles("background-color: hsl(0, 0%,"+ ((1 - fraction)+ 0.65) * 100 +"%)" );
        });
        L.browserPrefix.forEach(prefix=>{
            L(v.topHalf).styles("background-color: hsl(0, 0%,"+ 100 +"%)" );            
        });        
    }
    if(degrees === 0 || degrees === 180){
        m.flipperClosed = true;
        L(v.topHalf).styles("background-color: hsl(0, 0%, 100%");
        L(v.bottomHalf).styles("background-color: hsl(0, 0%, 100%");
    }
};
c.showEvent = function showEvent(eventObject, here){
    if(eventObject.type != 'foobar'){
    	here.innerHTML = '<br><center>'+ eventObject.target.id +", "+eventObject.type +'</center><br><br><br><br><br><br>';        
    }

};

c.showModelStates = function showModelStates(targetContainer){
    m.urlTop = m.contents[m.currentPage].topHalf.content;
    m.urlBottom = m.contents[m.currentPage].bottomHalf.content;
    let currentStates = `
        <b>Started:</b>  ${m.started} <br>
        <b>Direction:</b>  ${m.direction} <br>
        <b>Location:</b> ${m.currentLocation}<br>        
        <b>Angle:</b>  ${m.currentAngle.toFixed(2)}&deg; <br>
        <b>Direction Crossed:</b>  ${m.crossingDirection} <br>
        <b>currentY:</b>  ${m.currentY.toFixed(2)} <br>
        <b>current page:</b> ${m.currentPage + 1}<br>
        <b>Number of Pages:</b> ${m.numberOfPages}<br>        
        <b>URL top:</b> ${m.urlTop}<br>
        <b>URL bottom:</b> ${m.urlBottom}<br>
        <b>test version:</b> ${m.testVersion}
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
  
    adjustAngleOffset();
    
    return degrees;
    //-------| helper function(s) |--------//
    function adjustAngleOffset(){
        let halfScreen = screenHeight/2;
        let deltaHalfScreen = (currentY - halfScreen );
        let rawFraction = deltaHalfScreen / halfScreen;
        let fraction = rawFraction * rawFraction;
        
        if ( m.fingerFlipping ){
            if ( currentY > (screenHeight / 2) ){
                let possibleAngle = degrees - fraction * m.offsetAngle;
                if(possibleAngle < 0  || currentY > screenHeight){
                    degrees = 0;
                }else{
                    degrees = possibleAngle;
                }
            }
            else if ( currentY < (screenHeight / 2) ){
                let possibleAngle = degrees + fraction * m.offsetAngle;
                if(possibleAngle > 180  || currentY < 0 ){
                    degrees = 180;
                }else{
                    degrees = possibleAngle;
                }           
            }
        }    
    }
    //-------------------------------------//     
};
//=======| add current page |======================//
c.fillPage = function fillPage(index){
    let topUrl = m.contents[index].topHalf.content;
    let topType = m.contents[index].topHalf.type;
    let bottomUrl = m.contents[index].bottomHalf.content;
    let bottomType = m.contents[index].bottomHalf.type;
    //ask about the top
    if(topType === "text"){
        let urlPrefix = "contents/page." + index +"/";
        let url = urlPrefix + topUrl;
        //v.topContentHolder.innerHTML = get(urlPrefix + topUrl, fillTop);
        get(url, fillTop);            
    }
    else if(topType === "halfGraphic"){
        let urlPrefix = "img/";
        let url = urlPrefix + topUrl;
        setTopBackground(url, v.topContentHolder);
    }
    //ask about the bottom
    if(bottomType === "text"){
        let urlPrefix = "contents/page." + index +"/";
        let url = urlPrefix + bottomUrl;
        //v.bottomContentHolder.innerHTML = get(urlPrefix + bottomUrl, fillBottom);
        get(url, fillBottom);
    }
    else if(bottomType === "halfGraphic"){
        let urlPrefix = "img/";
        let url = urlPrefix + bottomUrl;
        setBottomBackground(url, v.bottomContentHolder);
    }
    //----------------------helpers---------------------//
    function get(url, callback){
        let getter = new XMLHttpRequest();
        getter.open("GET", url);
        getter.send();
        
        //handle response and error;            
        getter.onload = function(){
            let response = getter.responseText;                
            if(callback){callback(response);}                
        };
        getter.onerror = function(){};
    }
    function fillTop(text){
        v.topContentHolder.innerHTML = text;
        L(v.topContentHolder)
            .styles
                ("background: none")
                ("width: 85%")
                ("padding-top: 0")
        ;         
        
    }
    function fillBottom(text){
        v.bottomContentHolder.innerHTML = text;
        L(v.bottomContentHolder)
            .styles
                ("background: none")
                ("width: 85%")
                ("padding-top: 0")                    
        ;         
    }
    function setTopBackground(url, target){
        //v.topContentHolder.innerHTML = "";          
        target.innerHTML = "";
        L(target)
            .styles
                ("background: black url("+ url +") no-repeat bottom")
                ("background-size: contain")
                ("width: 100%")
                ("padding-top: 100%")
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

c.handleFipperClosed = function handleFipperClosed(eventObject){
    //----| local helpers |------//
    function shiftPages(fillPage){
        let newPage;
        //if flipper started up and is now down: load prior page:
        if(m.started === m.UP && m.currentLocation === m.DOWN){
            if((m.currentPage - 1) < 0){
                newPage = m.numberOfPages - 1;
            }
            else{
                newPage = m.currentPage - 1;
            } 
            m.currentPage = newPage;
            fillPage(m.currentPage);                
        }                
        //if flipper started down and is now up : load next page:
        else if(m.started === m.DOWN && m.currentLocation === m.UP){
            if((m.currentPage + 1) >= m.numberOfPages){
                newPage = 0;
            }
            else{
                newPage = m.currentPage + 1;
            }  
            m.currentPage = newPage;
            fillPage(m.currentPage);                
        }
    }
    function addContentToPages(){
        
    }        
    function addContentToFlipper(){

    }    
    /*check to:
        1.) hide the closed flipper,
        2.) point to adjascent pages,
        3.) add content to pages ... 
        4.) ... and to flipper
    */
    if(m.flipperClosed && !m.flipperClosedHandled){
        m.flipperClosedHandled = true;
        shiftPages(c.fillPage);
        c.hideFlipper();
        addContentToFlipper();
    }
    else{
        //c.showFlipper();
    }    
};
