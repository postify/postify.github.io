/**
<div id="holder">
      <div id="app">
          <table>
              <tr>
                  <td>
                      <div class="button" id="btnShowData" >Show Metadata</div><br/>
                      <textarea readonly></textarea>
                  </td>
                  <td><div class="button" id="btnSaveFiles">Save Files</div></td>
              </tr>
              <tr>
                  <td>
                      <div class="button" id="btnMkdir">Make a Directory</div><br/>
                      Folder Name:<br/> 
                      <input type="text" size="20" class="textBox" id="txtMkdir">
                  </td>
                  <td>
                      <div class="button" "btnRmFile">Remove a File</div>
                      <input type="text" size="20" class="textBox" id="txtRmFile">                              
                  </td>
              </tr>
          </table>
          
      </div>
      <div id="shroud">
          <div id="btnShroud" class="btnReleased">
              <div id="btnShroudOverlay">Gimme My Music :)</div>
          </div>
      </div>
</div>
*/

//=================//
//====| MODEL |====//
//=================//
var model = {
    CLIENT_ID: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com'
    ,SCOPES: ['https://www.googleapis.com/auth/drive.appfolder',
        'https://www.googleapis.com/auth/drive.appdata'
    ]
    ,windowWidth: window.innerWidth
    ,windowHeight: window.innerHeight
    ,resized: false    
    ,pendingEvents: []
    ,updateModelBusy: false
    ,shroudButtonIsPressed: false
};

/*global $*/
/*global gapi*/
var view = $;
//================//
//====| VIEW |====//
//================//
//---| attach all DOM-related items |---//
view.holder =  // outer div of the project
view.app =  // the app div
view.btnShowMetaData = //
view.btnSaveFiles = //
view.btnMkDir = //
view.btnRmFile = //
view.txtMkDir = //
view.txtRmFile = //
view.shroud = //
view.btnShroud = //
view.btnShroudOverlay = //
//view.etc =   // describe each DOM object to be accessed in this app project
"domObjects";// dummy string variable
view.attachDomObjects();

//======================//
//====| CONTROLLER |====//
//======================//
var controller = {
    initialize: function initialize(){
        view.adjustRem(8, 30);
    }
    ,registerEvent: function registerEvent(e){
         model.pendingEvents.push(e);
         while(model.pendingEvents.length !== 0 && !model.updateModelBusy){
            let nextEventObject = model.pendingEvents.shift();
            controller.updateModel(nextEventObject);
         }
     }
    ,updateModel: function updateModel(e){
        model.updateModelBusy = true;        
        //---------------------------//
        if(e.type === "resize"){
            model.windowWidth = window.innerWidth;
            model.windowHeight = window.innerHeight;
            model.resized = true;
        }
        if(e.type === 'mousedown' && e.target === view.btnShroudOverlay){
            model.shroudButtonIsPressed = true;
        }
        if(e.type === 'mouseup' && e.target === view.btnShroudOverlay){
            model.shroudButtonIsPressed = false;
        }
        if(e.type === 'mouseout' && e.target === view.btnShroudOverlay){
            model.shroudButtonIsPressed = false;
        }        
        
        //---------------------------//
        controller.updateView(e);            
        model.updateModelBusy = false;
    }
    ,updateView: function updateView(evt){
        if(model.resized){
            $.adjustRem();
        }
        if(model.shroudButtonIsPressed){
            /**
                Use element.classList which has
                remove(name), add(name), toggle(name), 
                and contains(name) methods, and is now supported 
                by all major browsers.
            */
            view.btnShroud.classList.remove("btnReleased");
            view.btnShroud.classList.add("btnPressed");
        }else{
            view.btnShroud.classList.remove("btnPressed");
            view.btnShroud.classList.add("btnReleased");            
        }
        
        if(evt.type === "mouseup" || evt.type === "mouseout"){
            if(evt.target.classList.contains("pushedButton")){
                evt.target.classList.remove("pushedButton");
                evt.target.classList.add("button");                
            }
        }else if(evt.type === "mousedown" ){
            if(evt.target.classList.contains("button")){
                evt.target.classList.remove("button");
                evt.target.classList.add("pushedButton");
           }
        }
        
        if(evt.type == "change" && evt.target == view.fileElement){
            if(view.fileElement.files[0]){
                $(view.msg).html(view.fileElement.files[0].name);                
            }else{
                $(view.msg).html("");                 
            }
        }        
        if(evt.type == "keyup" && evt.keyCode == 13){

        }

        //--------------------------//
        //----| DRIVE REQUESTS |----//
        //--------------------------//
        if(evt.target === view.btnShowMetaData && evt.type === "mousedown"){
            userdrive.showMetaData("show meta data");
        }
        if(evt.target === view.btnSaveFiles && evt.type === "mousedown"){
            userdrive.saveFiles("save files");
        }
        if(evt.target === view.btnMkDir && evt.type === "mousedown"){
            userdrive.mkDir("make directory");
        }
        if(evt.target === view.btnRmFile && evt.type === "mousedown"){
            userdrive.rmFile("remove file");
        }
        if(evt.type == "click" && evt.target == view.btnShroudOverlay){
            userdrive.authorizeUser(userdrive.AuthorizeAttempt, function(){alert('Logged in.');});
        } 
    }
    ,monitoredDomEvents: [
         "keydown"
        ,"keyup"
        ,"mousedown"
        ,"mouseup"
        ,"mouseover"
        ,"mouseout"
        ,"resize"
        ,"focus"
        ,"mousemove"
        ,"input"
        ,"click"
        ,"change"
    ]
};

//=====================//
//====| USERDRIVE |====//
//=====================//
//object that holds most relevant google drive methods
var userdrive = {
    clientId: '152061817422-vkr6fn8jtikb6lhkmqtjfja1o9uooseb.apps.googleusercontent.com'
    ,scope: 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.appdata'
    ,showMetaData: function showMetaData(arg){
        arg = arg;
        this.driveAction(function(arg){
            alert(arg);
        });
    }
    ,mkDir: function mkDir(arg){
        var argx = arg;        
        this.driveAction(function(argx){
            alert(argx);             
        });
    }
    ,rmFile: function rmFile(arg){
        var argx = arg;        
        this.driveAction(function(argx){
            alert(argx);             
        });
    }
    ,saveFiles: function saveFiles(arg){
        this.authorizeUser(this.AuthorizeAttempt, function(){alert("Save files.");});
    }
    ,driveAction: function driveAction(doAction){
        this.authorizeUser(this.AuthorizeAttempt, doAction, true);
    }
    ,authorizeUser: function authorizeUser(AuthorizeAttempt, doAction, bolImmediate){
        if(bolImmediate === undefined){bolImmediate = true;}
        var authObject = {
            'client_id': this.clientId
            ,'scope': this.scope
            ,'immediate': bolImmediate
        };
        this.AuthorizeAttempt(authObject, doAction);
        return false;
    }
    ,AuthorizeAttempt: function AuthorizeAttempt(authObject, doAction){
        gapi.auth.authorize(authObject, handleAuthResult);
        function handleAuthResult(authResult){
            var authorized = authResult && ! authResult.error;
            if(authorized){
                $($.shroud).styles
                    ("opacity: 0")
                    ("visibility: hidden")                   
                ;
                if(typeof doAction === 'function'){
                    doAction();                    
                }
            }else{
                $($.shroud).styles
                    ("opacity: 1")               
                    ("visibility: visible")
                ;
                userdrive.authorizeUser(userdrive.AuthorizeAttempt, doAction, false);
            }
        }
    }
};

//=====================//
//====| APP START |====//
//=====================//
view(window).on("load", function(){
    
    controller.initialize();
    
    controller.monitoredDomEvents.forEach(eventType=>{
        $(window).on(eventType, e=>{
            e.stopPropagation(); // prevent target from seeing its own event
            controller.registerEvent(e);
        }, true); // "capture" the event early (on the way down the DOM tree)
     });
});//================//
//====| APP END |====//
//===================//


