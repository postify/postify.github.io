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
/*global userdrive*/
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
        //controller.authorizeUser(false, controller.handleAuthResult );
    }
    ,checkAuth: function checkAuth(){
        controller.authorizeUser(true, controller.handleAuthResult);
    }
    ,authorizeUser: function authorizeUser(booleanImmediate, handleAuthResult){
        var authObject = {
            'client_id': model.CLIENT_ID
            ,'scope': model.SCOPES.join(' ')
            ,'immediate': booleanImmediate
        };
        gapi.auth.authorize(authObject, handleAuthResult);
        return false;
    }
    ,handleAuthResult: function handleAuthResult(authResult){
            var authorized = authResult && ! authResult.error;
            if(authorized){
                $($.shroud).styles
                    ("opacity: 0")
                    ("visibility: hidden")                   
                ;
            }else{
                $($.shroud).styles
                    ("opacity: 1")               
                    ("visibility: visible")
                ;
                controller.authorizeUser(false, controller.handleAuthResult);
            }
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
                The simplest is element.classList which has
                remove(name), add(name), toggle(name), 
                and contains(name) methods and is now supported 
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
        if(evt.type == "click" && evt.target == view.btnCreateFolder ){
            $(view.msg).html("Create folder");
        }
        if(evt.type == "click" && evt.target == view.btnLogin){
            controller.authorizeUser(true, controller.handleAuthResult);
        }
        if(evt.type == "click" && evt.target == view.btnShroudOverlay){
            controller.authorizeUser(true, controller.handleAuthResult);
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