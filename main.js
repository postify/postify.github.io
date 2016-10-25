/**
<div id="holder">
    <center>
        <h3>Authorized!</h3>
    </center>            
   <div id="app">
       <span id="msg">(Resize Screen To Test REM Response)</span>
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
    ,authorizeUser: function authorizeUser(booleanImmediate, handleAuthResult){
        var authObject = {
            'client_id': model.CLIENT_ID
            ,'scope': model.SCOPES.join(' ')
            ,'immediate': booleanImmediate
        };
        gapi.auth.authorize(authObject, handleAuthResult);
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
        //---------------------------//
        controller.updateView(e);            
        model.updateModelBusy = false;
    }
    ,updateView: function updateView(evt){
        //----| helper |----//
        function handleAuthResult(authResult){
            var authorized = authResult && ! authResult.error;
            if(authorized){
                $($.msg).html("You are authorized.");
                $($.btnLogin).styles("display: none");
            }else{
                $($.msg).html("You are NOT authorized.");
                $($.btnLogin).styles("display: inline-block");                
            }
        }
        //-----------------------//  
        if(model.resized){
            $.adjustRem();
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
            controller.authorizeUser(false, handleAuthResult);
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