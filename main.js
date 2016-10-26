/**
<div id="holder">
    <input type="file" id="fileElement">
    <div id="app">
        <button id="btnLogin">Login Google Account </button><br/>
        <span id="msg"></span>
        <br/>Folder to Create:</br>
        <input id="folderName">
        <br/><br/>
        <button id="btnCreateFolder">Create Folder</button>
        <br/><br/>
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
view.msg = //div that holds results of tests, etc.
view.folderName = //
view.btnCreateFolder =//
view.btnLogin = //
view.login = //
view.fileElement = //
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
                $($.msg).html("You are authorized.");
                $($.btnLogin).styles("display: none");
                $($.shroud).styles("display: none");
                
            }else{
                $($.msg).html("You are NOT authorized.");
                $($.btnLogin).styles("display: inline-block");
                $($.shroud).styles("display: block");                
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
        
        if(evt.type == "change" && evt.target == view.fileElement){
            if(view.fileElement.files[0]){
                $(view.msg).html(view.fileElement.files[0].name);                
            }else{
                $(view.msg).html("");                 
            }
        }        
        if(evt.type == "keyup" && evt.keyCode == 13){
            view.msg.innerHTML = "enter pressed";
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