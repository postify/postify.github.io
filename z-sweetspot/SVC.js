//sweetspot-semi-good-7-25-2017
/*
  Acuthor: Abbas Abdulmalik
  Created: June 10, 2017 
  Updated: July 25, 2017
  Title: SVC.js
  Purpose: an MVC-like starting point for web applications,
  proof of concepts or minimum viable products.
  "S" stands for STATE, a more direct and meanigful word than MODEL.
  The STATE object "s" holds all of the app's state variables and constants
  
  http://www.watermark-images.com/mp3-tag-editor-online.aspx
*/

/*global L*/
/*global gapi*/
/*global a*/

const s = {}; //STATE object
const v = {}; //VIEW object
const c = {}; //CONTROLLER object

//attach all VIEW elements by id
window.id = 'window';
document.body.id = 'body';
document.documentElement.id = 'root';
L.attachAllElementsById(v);

//===================================================//
//================|  UPDATE STATE  |=================//
//===================================================//

//============|  STATE VARIABLES (and CONSTANTS) |============//
s.firstTime = true;
s.onLine = false; //camel-cased to conform to navigator.onLine

s.priorEventObject = {type: "dummy", target: {id: "dummy"}};
s.priorSource = {};

s.eventObject = {};
s.type = '';
s.source = {};

//horizontal movement measurements
s.initialX = 0;
s.finalX = 0;

s.player = v.player; //audio player's properties qualify as state variables
//special current event booleans:
s.pressed = false;
s.released = false;
s.priorPressed = false;
s.priorReleased = false;
s.moved = false;
s.ended = false;

//special continous state booleans
s.stillReleased = true;
s.stillPressed = false;
s.stillOnline = true;

s.menuOpen = false;
s.savingFile = false;

s.nonStop = false;
s.shuffle = false;
s.controlsVisible = true;
s.vertical = null;

s.minTime = 10;
s.tooLong = false;
s.showPicture = false;

s.timeUpdateCount = 0;
s.priorMoveCount = 0;
s.moveCount = 0;
s.moveCountQuota = 3;
s.swipeSongQuota = 100;

s.priorPressedAndMoveCount = 0;
s.pressedAndMoveCount = 0;
s.pressedAndMoveQuota = 3;

s.pictureDelayTime = 150; // in milliseconds

s.chosenMusicFilename = '';
s.webroot = 'https://sweetspot.github.io/';
s.starterFiles = [
  'Mr. Scruff - Kalimba.mp3',
  'Bob Acri - Sleep Away.mp3'
];
s.chosenFile = {};
s.menuAngle = 0;
s.menuRotationTimerId = 0;

s.hideControlsDelay = 1.5; //in seconds
s.debounceTime = 275; //in milliseconds

s.hideControlsTimerId = 0;
s.releaseBounceTimerId = 0;

s.playIcon = '&#9658;';
s.pauseIcon = '&#10074;&#10074;'//'&#x2759;&nbsp;&nbsp;&#x2759;'//'&#73;&nbsp;&#73;'//'&#x00399;&nbsp;&#x00399;'//'&#10074;&nbsp;&#10074;';
s.noImage = 'leaves.jpg';
s.thereIsNoPictureId = false;
s.customEventName = 'hidecontrols';

//debouncer flags
s.menuToggleBusy = false;
s.controlsToggleBusy = false;
s.playPauseToggleBusy = false;
s.nonStopToggleBusy = false;
s.shuffleToggleBusy = false;
s.busyQueueingNextSong = false;
s.busyQueueingPriorSong = false;
s.fileUploadBusy = false;
s.swipeNextSongBusy = false;

s.firstPlay = true;

s.controlsArray = [];
s.menuItems = [];
s.googleDriveMusicSourcePrefix = 'https://drive.google.com/uc?export=download&id=';
s.backgroundColor = 'hsla(60, 100%, 98.7%, 1)';


//============|  function that UPDATEs STATE  |=============//
c.updateState = function(eventObject){
  //===============|  Prepare COMMON STATE VARIABLES  |===============//
  let e = eventObject;
  s.priorEventObject = s.eventObject;
  s.eventObject = e;
  s.type = e.type;
  s.source = e.target;
  
  s.pressed = (e.type === 'mousedown' || e.type === 'touchstart');
  if(e.type === 'mousedown'){s.initialX = e.clientX;}
  else if(e.type === 'touchstart'){s.initialX = Math.round(e.touches[0].clientX);}
  if( s.pressed ){
    //slight delay to stillPressed
    //setTimeout(function(){
       s.stillPressed = true;
    //}, 100); 
  };
  
  //-------------------------------------------------------------------
  s.released =  (e.type === 'mouseup' || e.type === 'touchend');
  if(e.type === 'mouseup'){s.finalX = e.clientX;}
  //https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX  
  else if(e.type === 'touchend'){s.finalX = Math.round(e.changedTouches[0].clientX);}  
  if( s.released ){
    //slight delay to stillReleased
    //setTimeout(function(){
       s.stillReleased = true;
    //}, 100); 
  };
  
  //-------------------------------------------  
  s.priorSource = s.priorEventObject.target;
  s.priorPressed = (s.priorEventObject.type === 'mousedown' || s.priorEventObject.type === 'touchstart');
  s.priorReleased = (s.priorEventObject.type === 'mouseup' || s.priorEventObject.type === 'touchend');
  //-------------------------------------------
  
  if(s.type === 'online'){s.stillOnline = true;}
  if(s.type === 'offline'){s.stillOnline = false;}
  s.stillOnline = (s.type !== 'offline') && s.stillOnline;
    
  s.stillPressed = !s.released && s.stillPressed;
  s.stillReleased = !s.pressed && s.stillReleased;
  
  s.moved = (e.type === 'mousemove' || e.type === 'touchmove');

  s.online = navigator.onLine;
  //===============|  END Prep of COMMON STATE VARIABLES  |===============//  

  //===============|  Run functions to update STATE variables  |============//
  const updateStateGroup = {//all elements of the arrays must be 'true' to invoke the listed methods
    toggleMenu: [s.source === v.menuGlass, s.released, s.priorPressed ],
    resizeAndCallback:[s.type === 'resize'],
    setHideControls: [s.type === s.customEventName],
    togglePlayPause: [s.released,(s.priorEventObject.target === v.btnPlay || s.priorEventObject.target === v.spanBtnPlay) , (s.source === v.btnPlay || s.source === v.spanBtnPlay)],//s.type === 'click'
    noteEnded:       [s.type === 'ended', s.source === s.player],
    
    toggleControls:  [s.released, s.moveCount <= s.moveCountQuota,
                                  (s.source === v.controlsToggler ||
                                   s.source === v.app ||
                                   s.source === v.artistAndTitle ||
                                   s.source === v.timeInfoHolder ||
                                   s.source === v.timeInfo ||
                                   s.source === v.timeSlider ||
                                   s.source === v.timeBead ||
                                   s.source === v.controls)
                     ], //s.type === 'click'  //s.source === v.fileChooser ||
    
    stopControlsCountdown: [s.source === v.songChooser, s.type === 'click'],
    cueChosenSong:   [s.type === 'change', s.source === v.songChooser],
    saveFiles:       [s.type === 'change', s.source === v.fileChooser, v.fileChooser.files[0], !s.savingFile],    
    toggleNonStop:   [s.source === v.btnNonStop, s.released, s.priorPressed, s.priorSource === v.btnNonStop],//s.type === 'click'
    toggleShuffle:   [s.source === v.btnShuffle, s.released, s.priorPressed, s.priorSource === v.btnShuffle],//s.type === 'click'
    incrementTimeCount:[s.type ==='timeupdate'],
    clearTimeCount:  [s.type !=='timeupdate'],
    incrementMoveCount: [s.moved],
    clearMoveCount:  [!s.moved],
    simulateDelay :  [false],
    setOnLine:       [s.type === 'online' || s.type === 'offline'], 
    trailer:         [true]//Always run this dummy function last.
  };
  //run updates in a promise in case they take too long
  c.updateStateThenView(updateStateGroup);

  //===============|  END Run functions to update STATE   |============//
};

//===================================================//
//==================|  UPDATE VIEW |=================//
//===================================================//

//============|  the UPDATE VIEW function:  |=============//
c.updateView = function(){
  //===========|  Run functions to update VIEW  |============//
  const updateViewGroup = {//all elements of the arrays must be 'true' to invoke the listed methods
    //toggleMenuView: [s.source === v.menuGlass, s.released ], // (s.priorEventObject.type === 'mousedown' || s.priorEventObject.type === 'touchstart')   
    handleResize:        [s.type === 'resize'],   
    updateTimeInfo:      [s.type === 'timeupdate' || s.type === 'durationchange'],
    startHideControls:   [s.type === 'play', !s.thereIsNoPictureId],
    hideControls:        [s.type === 'hidecontrols'], 
    togglePlayButton:    [(s.type === 'play' || s.type === 'pause'), s.source === s.player],
    
    toggleNonStopButton: [s.source === v.btnNonStop, s.released, s.priorPressed, s.priorSource === v.btnNonStop],//s.type === 'click'
    toggleShuffleButton: [s.source === v.btnShuffle, s.released, s.priorPressed, s.priorSource === v.btnShuffle],//s.type === 'click'
    
    playNextSong:        [s.type === 'ended', s.source === v.player, s.nonStop],
    playNextSong:        [s.released, (s.source === v.btnNext || s.source === v.spanBtnNext)],//s.type === 'click',
    playPriorSong:       [s.released, (s.source === v.btnBack || s.source === v.spanBtnBack)],//s.type === 'click',    
    swipeNextSong:       [s.released, (s.source === v.app || s.source === v.controls)],
    handleOnLine:        [s.type === 'online' || s.type === 'offline'], 
    showInfo:            [false],
  };
  L.qualifiedKeys(updateViewGroup).forEach( fun => c[fun]() );// c is the controller object
}

//-----------------------------------//
//-------| HELPER FUNCTIONS |--------//
//-----------------------------------//
c.flashOpacity = function (element, delay){
  element.style.transition = `opacity ${delay/2}s ease`;
  element.style.opacity = '0';
  setTimeout(function(){
    element.style.opacity = '1';    
  },delay);
}

  c.dispatchHideControlsEvent = function(okay = false){
  //==========================================//
  // create and dispatch the event
  let internalDetail = {detail: {msg: 'hide controls'}};
  let event = new CustomEvent(s.customEventName, internalDetail);
  if(okay){window.dispatchEvent(event);}
  //==========================================//    
}
c.fillSongChooser = function(callback = function(){}){
    let thisLocalFilesArray = a.allFilesArray.map(file => `${file.name}:${file.id}:${file.description}`);
    
    if(s.shuffle){
      let shuffledList = L.scramble(thisLocalFilesArray);
      thisLocalFilesArray = shuffledList;
    }
    else{
      thisLocalFilesArray.sort();      
    } 

    v.songChooser.innerHTML = '';
    let option = document.createElement('option');
    option.innerHTML = 'List of Songs';
    v.songChooser.appendChild(option);
    thisLocalFilesArray.forEach( (entry, i, a) => {
      
      let maxIndex = a.length - 1;
      let pieces = entry.split(':');
      let name = pieces[0].slice(0,-4);
  
      if(name.indexOf('.mp3') === -1 && name.indexOf('__music') === -1){
         name = pieces[0].slice(0,-4);
        let songId = pieces[1];
        let pictureId = pieces[2];
        let option = document.createElement('option');
        option.innerHTML = name;
        option.setAttribute('value', `${songId}:${pictureId}`);
        v.songChooser.appendChild(option);
        //callback on final file song entry
        //if(i === maxIndex && callback){callback(name)}         
      }
      //callback on final file song entry      
      if(i === maxIndex){
        if(callback){callback();}
      }
    });
  };

//-------------------------------------------//

c.uploadChosenFile = function(fileType){ 
  //let blob = new Blob([s.chosenFile], {type: 'audio/*'});//MUST NOT specify audio
  let type = fileType || '';
  let blob = new Blob([s.chosenFile], {type: type}); //MUST leave type blank like this 
  a.uploadFile(blob, s.chosenFile.name, a.musicFolderId, function(file, uploadedBody){
   L(v.uploadBlocker).styles('visibility: hidden');     
    a.showFiles(c.fillSongChooser); 
    s.menuAngle = 0;
    
    clearInterval(s.menuRotationTimerId);  
    L(v.menuBox).styles
      ('color: black')
      ('background: transparent')
      ('transform: rotateZ(0deg)')
    ;
    v.menuBox.innerHTML = 'Grab<br/>a<br/>Song';
    s.savingFile = false;
  });
};
//-----------------------------------------------------//

c.updateStateThenView = function(functionsArray){
  new Promise(function(yea){
      L.qualifiedKeys(functionsArray).forEach( (fun, i, a) => {
        c[fun]();
        if(i === (a.length-1)){
          //the trailer function (a dummy) has completed
          yea();
        }
      }); 
  }).then(function(){
    //now, update view:   
    c.updateView();
  });  
};
//-----------------------------------------------------//

c.getPictureFromMp3 = function(url, yea, nay){
  var jsmediatags = window.jsmediatags  ;
  if(!jsmediatags){
    console.log("Can't find the 'jsmediatags' object.");
    console.log("Try https://github.com/aadsm/jsmediatags/tree/master/dist");
    return;
  }
  // url from local host
  jsmediatags.read(url, {
    onSuccess: function(tag) {
      console.log(tag);
      let tags = tag.tags;
      //========================//
      var image = tags.picture;
      if (image) {
        var base64String = image.data.reduce((string, datum)=>
            string += String.fromCharCode(datum), '');
        var pictureData = "data:" + image.format + ";base64," + window.btoa(base64String);
        setTimeout( ()=>{
         if(yea){yea(pictureData, image, base64String);}          
        }, s.pictureDelayTime); 
      }
      else{//no image
        if(nay){nay();}
      }       
      //=========================//
    },
    onError: function(error) {
      console.log(error);
      return null;
    }
  });
};
//======| END getPictureFromMp3 |=================//
c.showImageInApp = function(googleDriveFileId){
  let image = s.googleDriveMusicSourcePrefix  + googleDriveFileId;
    L(v.app).styles
      ('background: '+ s.backgroundColor  +' url('+ image +') no-repeat center')
      ('background-size: contain')
   ; 
};

//===================================================//
//==================|  INITIALIZE  |=================//
//===================================================//
c.collectAllControls = function(){
  s.controlsArray = [];
  let controls = document.querySelectorAll('.controls');
  [].forEach.call(controls, control => {
    s.controlsArray.push(control);
  });  
};

c.collectMenuItems = function(){
  s.menuItems = [];
  let menuItems = document.querySelectorAll('.menuItem');
  [].forEach.call(menuItems, menuItem => {
    s.menuItems.push(menuItem);
  });
};

c.initialize = function(eventObject){
  //need this collection to make them toggle their visibility
  c.collectAllControls();
  
  //need this menu item collection to toggle their visibility
  c.collectMenuItems();
  
  s.player.autoplay = false;
  
  //delay hiding the splash page
  setTimeout(function(){
    v.newShroud.style.opacity = '0';
  }, 2000)
  setTimeout(function(){
    v.newShroud.style.visibility = 'hidden';
    v.player.style.opacity = '0.6';
  }, 3000)
  
  if(a.firstTime){c.firstTime();}
  
  
  navigator.serviceWorker.register('service-worker.js')
      .then(swr => {          
          console.log("\nType of registration object: " + {}.toString.call(swr));
      })   
  ;
  
  //--------| END of initialization  |-------//  
  //update state
  c.updateState(eventObject);
}

c.firstTime = function(callback){
  if(s.onLine){
    a.firstTime = false;    
  }
  a.initialize(()=>{
    c.setResize(c.handleResize);     
    let isGoodParentFolder = a.allFilesArray.some(fileEntry => fileEntry.name === a.musicFolderName);
    if ( isGoodParentFolder ){
      //capture the folder ID
      a.allFilesArray.forEach(fileEntry => {
        if(fileEntry.name === a.musicFolderName){
          a.musicFolderId = fileEntry.id; 
        }
      });
      // A small, two-level callback hell to fill song chooser and cue-up a random music file
      a.showFiles(c.fillSongChooser( function(name) {
       let maxIndex = v.songChooser.options.length - 1
       let randomIndex =  Math.ceil(maxIndex * Math.random()) + 1;
       v.songChooser.selectedIndex = randomIndex;
       c.cueChosenSong(false);//false = don't play it;
      }));
      if(callback){callback();}  
    }
    else{
      a.createFolder(a.musicFolderName, loadStarterFiles);
      if(callback){callback();}      
    }
    function loadStarterFiles(){ 
          //capture the folder ID so we can save files to the folder
          a.allFilesArray.forEach(fileEntry => {
            if(fileEntry.name === a.musicFolderName){
              a.musicFolderId = fileEntry.id;
            }
          });

    }//----|  END of loadStarterFiles |----//
  }, 2000);//-----|  END of call to a.initialize, with 2 second delay  |------//  
};

/*
//upload starter file(s) to google drive                   
s.starterFiles.forEach(filename => {
  new Promise((resolve, reject) => {
    s.chosenMusicFilename = filename;
    var url = 'https://SabbaKilam.github.io/music/' + filename;//s.webroot + s.starterFiles[0];
    var ajax = new XMLHttpRequest();
    ajax.responseType = 'blob';
    ajax.open('GET', url);
    ajax.send();
    ajax.onerror = function(){
      reject("nope: can't upload that file:"  + ajax.response);
    }
    ajax.onload = function(){
      if(ajax.status === 200){
        resolve(ajax.response);
      }
      else{
        reject("nay :(  ... Trouble at server after upload");
      }
    };
  })//---|  END of promise |----//
  .then(response => {
      var blob = new Blob([response],{type: ''});            
      a.uploadFile(blob, filename, a.musicFolderId);
      a.showFiles(c.fillSongChooser); 
  })
  .catch(response => {alert('error uploading starter file: '+ response)}); 
});
*/