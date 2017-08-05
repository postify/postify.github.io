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
    
    main.attachAllElementsById = function attachAllElementsById(attachHere){
        var allElements = document.getElementsByTagName('*');
        [].forEach.call(allElements,function(element){
            if(element.id){
               attachHere[element.id] = element;
            }
        });
    };
    libraryObject.attachAllElementsById = main.attachAllElementsById;    
    
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
        var value = "";
        if(attributeValue.length === 2){
          value = attributeValue[1];          
        }
        else if(attributeValue.length > 2){
          //piece together multiple parts of a multi-part value for style
          attributeValue.forEach(function(piece, index, a){
            if( index != 0 && index != a.length-1 ){
              value += (piece + ":");
            }
            else if( index === a.length-1) {
              value += piece;
            }
          });
        }

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
      
        if(min === Infinity || min === -Infinity){min = 0}
        if(sec === Infinity || sec === -Infinity){sec = 0}      
      
        var zeroMin = ((min < 10) ? ("&nbsp;" + min) : ("" + min));
        var zeroSec = ((sec < 10) ? ("0" + sec + "&nbsp;") : ("" + sec + "&nbsp;"));
        var minSec = zeroMin + ":" + zeroSec;  
        return minSec;
    };
    libraryObject.secToMinSec = main.secToMinSec;
    //====| END of secToMinSec |====//
  
    //==============|  qualifiedKeys  |=============//
    /*
      Returns an array of keys from an object whose keys (property names)
      point to arrays that are collections of booleans:
      object = {
        nameOfFunction1: [x === 5, y <= 3 , c.funky === "James Brown"],
        nameOfFunction2: [x === 6, y <= 4 , c.funky === "Funkadelic"],
        nameOfFunction3: [x === 6, y <= 5 , c.funky === "Prince"],
        nameOfFunction4: [x === 5, y <= 6 , c.funky === "Cameo"]        
      }
      The returned array holds keys that point only to those arrays, all of whose
      members are 'boolean TRUE.'; Used to call only those functions
      that are qualified to run, especially for updating STATE (yeah, you read that right),
      or updating the VIEW.
    */    
    main.qualifiedKeys = function(QualifiersObject){
      return ( Object.keys(QualifiersObject)
                .filter( key => {
                  if( QualifiersObject[key].every( x => x ) ){return key;}
                })
              );
    };
    libraryObject.qualifiedKeys = main.qualifiedKeys;
  /*
  //**
   * Author: Abbas Abdulmalik
   * Creation Date: April 15, 2016
   * Title:  CreateListMixer
   * Revised: June 7, 2016
   * Purpose: Factory creates a function that
   * returns a random item from collection provided (array or object)
   * Notes: Example-> var list = ["a", "short", "list"];//three (3) items to test
   *  				var getRandomItem = CreateListMixer();
   * 					getRandomItem(list);//returns first of randomized list
   * 					getRandomItem();//returns next item
   * 					getRandomItem();//returns next item (last of three)
   * 					getRandomItem();//new first item from re-ramdomized list
   *					// a new list;					
   *					var list2 = { record1: "string", record2: "anotherString", ...};
   * 					getRandomItem(list2);//returns first of new randomized list2
   * 					getRandomItem();//etc.
   * Returns a property name for objects or an array member for arrays;
   * Returns 'false' if argument of function is not an object (fails typeof arg === 'object')
   * 
  */
  main.CreateListMixer = function(){
    var	list=[], 
      randList= [],
      listLength= 0,
      itemReturned= null,
      itemReturnedIndex= -1
    ;
    return function(){
      if(arguments[0]){
        if(typeof arguments[0] === 'object'){
            list = arguments[0];
          if({}.toString.call(arguments[0]) === '[object Object]'){
            list = Object.keys(list);
          }
          randList = randomize(list);
          listLength = list.length;
        }
        else{
          return false;
        }
      }
      //----| no args activity: return next random item |----
      if(itemReturnedIndex >= listLength-1){
        do{
          randList = randomize(list);
          itemReturnedIndex = -1;
        }
        while(randList[itemReturnedIndex +1] === itemReturned);
      }
      itemReturnedIndex++;
      itemReturned = randList[itemReturnedIndex];
      return itemReturned;
      //-----helpers-----
      function randomize(x){
        var mixedIndexes = [];
        var randomList = [];
        randomizeIndexes();
        return randomList;
        //----sub helper----
        function randomizeIndexes(){
          // random numbers for mixedIndexes
          while(mixedIndexes.length !== x.length){
            var match = false;
            var possibleIndex = (x.length)*Math.random();
            possibleIndex = Math.floor(possibleIndex);
            mixedIndexes.forEach(function(m){
              if(m === possibleIndex){
                match = true;
              }
            });
            if(!match){
              mixedIndexes.push(possibleIndex);
            }
          }
          for(var i = 0; i < x.length; i++){
            var newIndex = mixedIndexes[i];
            randomList.push(list[newIndex]);
          }
        }		
      }
    };//===| END returned function |======
  };//===| END enclosing factory function======
  libraryObject.createListMixer = main.createListMixer;


  main.scramble = function(collection){
    var mix = main.CreateListMixer();
    var list = collection;
    var mixedList =[];
    var firstNewItem = mix(list);
    var size = 0;
    mixedList.push(firstNewItem);

    if(Object.prototype.toString.call(collection) === '[object Array]'){
      size = collection.length;
    }
    else{
      size = Object.keys(collection).length;		
    }

    for(var i = 0; i< size - 1; i++){
      var nextItem = mix();
      mixedList.push(nextItem);
    }
    return mixedList;
  };
  libraryObject.scramble = main.scramble;
  
  
  //===========================================//
})();
