function $(s){
    //------------------ 
    var elem = null;
    var classArray = [];
    //------------------ 
    if(typeof s === "string"  && s.charAt(0) === "#"){
        elem = document.getElementById(s.substring(1));
    }else if(typeof s === "string"  && s.charAt(0) === "."){
        var className = s.substring(1);
        var elements = document.getElementsByTagName('*');
        for (var i = 0 ; i < elements.length ; ++i){
            if (elements[i].className == className){
                classArray.push(elements[i]);
            }
        }        
    }else if(typeof s === "string"  && s.toLowerCase() == 'body'){
      elem = document.body;
    }else if(typeof s === "string"  && s.toLowerCase() == 'global'){
      elem = this;
    }
    else if(typeof s === "string"){
        elements = document.getElementsByTagName(s);        
        for (i = 0 ; i < elements.length ; ++i){
            classArray.push(elements[i]);
        } 
    }
    //-----------------------------------------
    $.element = elem;
    $.array = classArray;
    //-----------------------------------------
    $.html = function html(innerString){
      elem.innerHTML = innerString;
    return $;
    };
    //----------------------------
    $.get = function get(url,callback){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send(null);
        //----------------
        xhr.addEventListener("readystatechange", function(){
            if(xhr.readyState === 4){
                if(xhr.status === 200 || xhr.status === 0){
                    callback(xhr.response);
                }else{
                    callback(undefined);
                }
            }
        });
        //----------------
        return $;
    };
    //------------------------
    $.setStyle = function setStyle(property, value){
        elem.style[property] = value;
        return $;
    }
    //---------------------------
    $.chainStyles = function chainStyles(property, value){
        elem.style[property] = value;
        return chainStyles;
    }    
    //----------------------------
    $.styleClass = function styleClass(property, value){
        classArray.forEach(function(m,i,a){
           m.style[property] = value;
        });
        return $;
    }
    //----------------------------
    $.chainStyleClass = function chainStyleClass(property, value){
        classArray.forEach(function(m,i,a){
           m.style[property] = value;
        });
        return chainStyleClass;
    }    
    //----------------------------
    $.element = elem;
    $.classArray = classArray;
    //----------------------------
    $.listen = function listen(event,handler){
      elem.addEventListener(event,handler);
      return $;
    }
    //----------------------------
    $.click = function click(handler){
      elem.addEventListener("click",handler);      
      return $;
    }
    //----------------------------
    $.mouseover = function mouseover(handler){
      elem.addEventListener("mouseover",handler);      
      return $;
    } 
    $.mouseout = function mouseout(handler){
      elem.addEventListener("mouseout",handler);      
      return $;
    } 
    $.mousemove = function mousemove(handler){
      elem.addEventListener("mousemove",handler);      
      return $;
    } 
    $.keydown = function keydown(handler){
      elem.addEventListener("keydown",handler);      
      return $;
    }
    $.keyup = function keyup(handler){
      elem.addEventListener("keyup",handler);      
      return $;
    }     
    //----------------------------
    $.value = function value(x){
      elem.value = x;
      return $;
    }
    //----------------------------
    $.getValue = function getValue(){
      return elem.value;
      //can't also return $: end of chain
    }
    $.keyPressed = function keyPressed(e){
        var theKey=0;
        e=(window.event)?event:e;
        theKey=(e.keyCode)?e.keyCode:e.charCode;
        return theKey;
    }
    $.focus = function focus(){
      elem.focus();
      return $;
    }
    //-----------------------------
    $.liquidPixelFactory = function liquidPixelFactory(minWidth, maxWidth){
        var minWidth = minWidth;
        var maxWidth = maxWidth;
        return  function setPixelValue(minPx, maxPx){        
                    var pixelValue = 0;

                    if ( innerWidth < minWidth ){
                        pixelValue = minPx;
                    }
                    else if ( innerWidth > maxWidth ){
                        pixelValue = maxPx;
                    }
                    else{
                        // y = mx + b, where m = delta y / delta dx ... 
                        // and b = Yo - mXo (for any valid pair of x & y):
                        pixelValue = (maxPx - minPx)*innerWidth/(maxWidth - minWidth) +
                        minPx - (maxPx - minPx)*minWidth/(maxWidth - minWidth);
                    }
                    return pixelValue;
                }
    }    
    //----------------------------
    $.forTwinArrays = function forTwinArrays(ary1, ary2, action){

        if (ary1.length !== ary2.length){
            throw new Error("The two arrays must be the same length.");
        }             
           
        for(var i=0; i < ary1.length; i++){
            action(ary1[i],ary2[i]);
        }
        return $;
    };
    //------------------------------ 
    $.makeDraggable = function makeDraggable(obj){
        var mousePressed = false
        ,   mouseMoving = false
        ,   xyOffsets = {x:0, y:0};
        ;
        obj.style.userSelect = "none";
        obj.style.display = "block";
        
        //save its original position
        var originalPosition = [obj.offsetLeft, obj.offsetTop];
        
        obj.style.position = "absolute";
        
        //after position absolute, attempt to restore original
        obj.style.left = originalPosition[0]+"px";
        obj.style.top = originalPosition[1]+"px";
        
        //======event handlers===========
        obj.addEventListener("mouseout",function(e){
            e = e ? e : window.event;
            var from = e.relatedTarget || e.toElement;
            if (!from || from.nodeName == "HTML") {
                mousePressed = false; 
            }
        });
        //--------------------------------
        obj.addEventListener("mousedown",function(e){
            mousePressed = true;
            saveOffsets(e);
        });
        //--------------------------------     
        obj.addEventListener("mouseup", function(){
            mousePressed = false;
            mouseMoving = false;
        });   
        //-----------------------------------
        obj.addEventListener("mousemove",function(e){
            mouseMoving = true;    
            if(mousePressed){
                positionCursor(e);
            }
        });
        //---------------------------------
        document.body.addEventListener("mousemove", function(e){
            if(mouseMoving && mousePressed){
                positionCursor(e);
            }
        });
        //----------helpers for handlers--------------
        function positionCursor(e){
            obj.style.left = (e.clientX - xyOffsets.x) + 0 + "px";//scrollLeft()         
            obj.style.top = (e.clientY - xyOffsets.y) + 0 + "px"; // scrollTop()
        }
        //---------------------------------------------
        function saveOffsets(e){
            xyOffsets.x = e.clientX - obj.offsetLeft;
            xyOffsets.y = e.clientY - obj.offsetTop;
        }
        //------------------------------------------ 
        return $;
    }//--END of makeDraggable function----------------------
    $.show = function show(){
        var args = [].map.call(arguments, function(m){
            return m;
        });
        try{
            console.log.apply(console,args);		
        }
        catch(error){
            console.log(error.toString());
            return $;
        }
        return $;
    }
    //-------------------------------
    $.log = function log(){
        var args = [].map.call(arguments, function(m){
            return m;
        });
        try{
            console.log.apply(console,args);		
        }
        catch(error){
            console.log(error.toString());
            return $;
        }
        return $;
    }
    //------------------------------- 
    $.pix = function pix(o){
        return o + "px";    
    }
    //------------------------------
    //---attempt to add a reverSort function to global arrays
    this.Array.prototype.revSort = function revSort(){
      return [].sort.call(this, function(x,y){
          if(x > y){
              return -1;
          }
          else if(x < y){
              return +1;
          }
          else{
              return 0;
          }
      });
    };
    //-------------------------------
    $.sym = function sym(){
        var partialSymDiff = [],   
            argsArray = arguments
        ;
        //============THE CRUX=================
        return findSymDiff(partialSymDiff,0);
        //============UNDER THE HOOD===========
        function findSymDiff(partialSymDiff,index){
            if (argsArray[index] === undefined){
                return partialSymDiff;
            }
            else{
                partialSymDiff = symDiff(partialSymDiff, argsArray[index] );
                return findSymDiff( partialSymDiff, index + 1 );
            }
        }    
        //=====================================
        function symDiff(arrayI, arrayJ){
            var diff = [],
                blackList = [],
                i = 0,
                j = 0,
                maxI = arrayI.length,
                maxJ = arrayJ.length
            ;
            //-------------------------------------------------
            /*
            1.) Combine the arrays into a third array.
            2.) Find the matched elements and place them into a blacklist array.
            3.) Pull blacklisted elements from the combined array.
            4.) return the "reduced" combined array.
            */
            //---------------------------------------------------
            // 1.) Combine the arrays into a third array.
            diff = arrayI.concat(arrayJ);        
            //---------------------------------------------------
            // 2.) Find the matched elements and place them into a blacklist array.
            for ( i=0; i < maxI; i++ ){
                for( j=0; j< maxJ; j++ ){
                    if(arrayI[i] === arrayJ[j]){
                        blackList.push(arrayI[i] );
                    }                
                }  
            }
            //----------------------------------------------------
            // 3.) Pull blacklisted elements from the combined array.
                diff = diff.filter(function(element){
                    if ( blackList.indexOf(element) === -1 ){//if not on  blacklist ...
                        return true; // we keep it
                    }
                    else{
                        return false; //if on blacklist, discard it
                    }
                });
            //----------------------------------------------------
            // 4.) return the "reduced" combined array.        
            return killDupes(diff);
        }
        //========================================================
        function killDupes(array){
            var kept = []; // Record of the "keepers"
            return array.filter(function(element){
                if ( kept.indexOf(element) === -1 ){ //if not already retained ...
                    kept.push(element); // Record it as retained now, and...
                    return true;  // allow this element to be kept (true)
                }
                else{
                    return false; // otherwise, don't keep it (already kept)
                }
            });
        }      
    }//--END of sym() symmetrical difference method
    //-----------------------
    $.type = function type(o){
      var prefixLength = "[object ".length;
      var blueprint = "";
      var rawType = undefined;
      rawType = {}.toString.call(o) || {}.toString.call(rawType);
      blueprint = rawType.substring(prefixLength,rawType.length-1);
      return blueprint.trim(); //overly cautious, I guess.
    }
    //-----------------------
    $.start = function start(asynch){
      //-----define basic data ------
      var backlog = [];
      var clearingBacklog = false;
      var result = null;
      //------define the object to relay in the chain--
      var queue = {
        then: function then(f){
         if(clearingBacklog){
           f(result);
         }else{
           backlog.push(f);
         }
         return queue;   
        },
        clearBacklog: function clearBacklog(r){
         result = r;
         clearingBacklog = true;
         while(backlog[0]){
           backlog.shift()(result);
         }
       },//--END of clearingBacklog()
        start: start,
        flush: function flush(r){
         result = r;
         clearingBacklog = true;
         while(backlog[0]){
           backlog.shift()(result);
         }
        }
       //--END of flush
      };//--END of queue {}
      //-----finish start by running asynch------
      if(typeof asynch == 'function'){
        asynch(queue);
      }
      //-----return the 'relay-able' queue-----
      return queue;
     }//--END of start()
    //-----------------------
    //======final return of $ function=====    
    return $;
    //=====================================
}//--END of $ function
$();
imports = $;
return imports




