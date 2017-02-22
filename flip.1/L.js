(function(){
    this.L = main;
    var element = null;
    var elements = [];
    
    var minimumRem = 11.5; //used by the main.adjustRem(min, max) method;
    var maximumRem = 25; //used by the main.adjustRem(min, max) method;
    
    var libraryObject = {};
    
    function main(x){
        
        if(typeof x === 'object' && {}.toString.call(x) !== '[object Array]'){
        //if x is a general object, but not an array (or a string or any other type):
            element = x;
            elements = [];
            
            return libraryObject;
        }
        
        var collection = document.querySelectorAll(x);
        if(collection.length === 1){
            element = collection[0];
            elements = [];
        }
        else if(collection.length > 1){
            element = null;
            elements = collection;
        }
        return libraryObject;
    }//----| END of main |-----//
    
    main.browserPrefix = ["","-webkit-","-moz-","-ms-","-o-"];
    libraryObject.browserPrefix = ["","-webkit-","-moz-","-ms-","-o-"];    
    
    libraryObject.getElement = function getElement(){
        return element;
    };
    main.getElement = libraryObject.getElement;
    
    libraryObject.getElements = function getElements(){
        return elements;
    };
    main.getElements = libraryObject.getElements;    
    
    main.styles = function styles(styleDeclarationString){
        var attributeValue = styleDeclarationString.split(':');
        var attribute = attributeValue[0];
        var value = attributeValue[1];
        if ( element !== null ){
            element.style[attribute] = value;
        }
        else if (elements.length !== 0){
            elements.forEach(element=>{
                element.style[attribute] = value;
            });
        }
        return styles;
    };
    libraryObject.styles = main.styles;
    
    main.attachAllElementsById = function attachAllElementsById(attachHere){
        var allElements = document.getElementsByTagName('*');
        [].forEach.call(allElements,function(element){
            if(element.id){
               attachHere[element.id] = element;
            }
        });
    };
    libraryObject.attachAllElementsById = main.attachAllElementsById;
    
    main.attribs = function attribs(attributeString){
      var attributeValue = attributeString.split("=");
      var attribute = attributeValue[0];
      var value = attributeValue[1];      
      if( element !== null ){
        element.setAttribute(attribute, value);        
      }
      else if( elements.length !== 0 ){
        elements.forEach(element=>{
          element.setAttribute(attribute, value);
        });        
      }
      return attribs;
    }; 
    libraryObject.attribs = main.attribs;
    
    //====| adjustRem() to be called when app loads and when screen size changes |====//
    main.adjustRem = function adjustRem(min,max, optionalWindowWidth){
        if(typeof min === 'number' && typeof max === 'number' && max >= min){
            minimumRem = min;
            maximumRem = max;
        }
        var windowWidth;
        if(optionalWindowWidth !== undefined && typeof optionalWindowWidth === 'number'){
            windowWidth = optionalWindowWidth;
        }else{
            windowWidth = window.innerWidth;
        }
        var rootEm = (minimumRem + (maximumRem - minimumRem)*windowWidth / 1920 );
        document.documentElement.style.fontSize = rootEm + "px";
        return rootEm;
    };
    libraryObject.adjustRem = main.adjustRem;
    //====| END of adjustRem |====//
    
    /*====| adjustRemByArea(min,max, optionalWindowWidth) called
            when app loads & when screen size changes |====
    ====*/   
    main.adjustRemByArea = function adjustRemByArea(min, max, optionalWindowWidth){
        if(typeof min === 'number' && typeof max === 'number' && max >= min){
            minimumRem = min;
            maximumRem = max;
        }
        const maxArea = 1920 * 900;
        const fudgeFactor = 0.6;
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
        var rootEm = (minimumRem + (maximumRem - minimumRem)* windowArea / (maxArea * fudgeFactor) );
        document.documentElement.style.fontSize = rootEm + "px";
        return rootEm;
    };
    libraryObject.adjustRemByArea = main.adjustRemByArea;    
    //====| END of adjustRemByArea |====//
    
    //====| secToMinSec() returns text like 10:34 when given seconds as number |====//
    main.secToMinSec = function secToMinSec(seconds){
        var min = Math.floor(seconds / 60);
        var sec = Math.floor(seconds % 60);
        if(isNaN(min)){min = 0}
        if(isNaN(sec)){sec = 0}
        var zeroMin = ((min < 10) ? ("0" + min) : ("" + min));
        var zeroSec = ((sec < 10) ? ("0" + sec) : ("" + sec));
        var minSec = zeroMin + ":" + zeroSec;  
        return minSec;
    };
    libraryObject.secToMinSec = main.secToMinSec;
    //====| END of secToMinSec |====//      
})();







