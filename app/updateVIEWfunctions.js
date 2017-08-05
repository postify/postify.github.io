/*global L*/

/*global s*/
/*global v*/
/*global c*/

/*global a*/



// all VIEW update functions here:
//-----------------------------------------------------//
c.toggleMenuView = function(){
  if(s.menuOpen){
    v.newMenuGroup.classList.remove('controls');
    s.menuItems.forEach(menuItem => {
      menuItem.style.visibility = 'visible';
      menuItem.style.opacity = 1;      
    });
    
    L(v.menuLines).styles('left: 65%');
    L(v.topLine).styles('transform: rotateZ(45deg)');
    L(v.middleLine).styles('transform: rotateY(90deg)');
    L(v.bottomLine).styles('transform: rotateZ(-45deg)');
    L(v.menuCurtain)
      .styles
        ('opacity: 0.95')
        ('visibility: visible')
    ;
  }
  else if(!s.menuOpen){
    v.newMenuGroup.classList.add('controls');
    s.menuItems.forEach(menuItem => {
      setTimeout(function(){
        menuItem.style.visibility = 'hidden';        
      }, 500);
      menuItem.style.opacity = 0;
    });
    
    v.newMenuGroup.style.visibility = s.controlsVisible ? "visible" : "hidden";
    L(v.menuLines).styles('left: 58.8%');
    L(v.topLine).styles('transform: rotateZ(0deg)');
    L(v.middleLine).styles('transform: rotateY(0deg)');
    L(v.bottomLine).styles('transform: rotateZ(0deg)');
    L(v.menuCurtain).styles('opacity: 0');
    setTimeout(function(){
      L(v.menuCurtain).styles('visibility: hidden');
    }, 500);    
  }
};
//-----------------------------------------------------//

c.swipeNextSong = function(){
  if((s.initialX - s.finalX) >= s.swipeSongQuota){
    c.playNextSong();
    c.flashOpacity(v.artistAndTitle, 2000);
  }
  else if((s.finalX - s.initialX) >= s.swipeSongQuota){
    c.playPriorSong();
    c.flashOpacity(v.artistAndTitle, 2000);    
  }
};
//-----------------------------------------------------//

c.handleResize = function(){
  let fullWidth = window.innerWidth;
  let halfWidth = fullWidth / 2;
  if(!s.vertical){
    L(v.player)
      .styles
        ('display: inline-block')
        ('position: absolute')
        ('bottom: 0')
        ('left: 12px')
        ('width:' + (halfWidth - 20) + 'px')
        ('border-radius: 0.25rem')
        ('box-shadow: 0 0 5px gray')
        ('opacity: 0.6')
    ;
    L(v.songChooserGroup)
      .styles
        ('bottom: 19%')
        ('left: 11%')
    ;    
  }
  else if(s.vertical){
    L(v.player)
      .styles
        ('display: inline-block')
        ('position: absolute')
        ('bottom: 0')
        ('left: 0')
        ('width: '+ fullWidth + 'px')
        ('border-radius: 0.25rem')
        ('box-shadow: 0 0 5px gray')
        ('opacity: 0.6')
    ;
    L(v.songChooserGroup)
      .styles
        ('bottom: 9%')
        ('left: 20%')
    ;
  }
};

//-----------------------------------------------------//

c.updateTimeInfo = function(){
  v.timeInfo.innerHTML = `${L.secToMinSec(s.player.currentTime)} / ${L.secToMinSec(s.player.duration)}`;
}
//-----------------------------------------------------//

c.startHideControls = function(){
  clearTimeout(s.hideControlsTimerId);
  s.hideControlsTimerId = setTimeout(function(){
    //c.dispatchHideControlsEvent(!s.thereIsNoPictureId);
    c.dispatchHideControlsEvent(true);
    
  }, 1000 * s.hideControlsDelay);  
};
//-----------------------------------------------------//

c.hideControls = function(){
  c.collectAllControls();
  s.controlsArray.forEach( control => control.style.visibility = 'hidden');  
};
//-----------------------------------------------------//

c.togglePlayButton = function(){
  
  //if(a.firstTime){c.firstTime(playOrPause)}
  //else{playOrPause}
  
  //playOrPause();
  //-----| playOrPause(){} |--------// 
  //function playOrPause(){
    if(s.player.paused){
      v.spanBtnPlay.innerHTML = s.playIcon;
      L(v.btnPlay)
        .styles
          ('background: linear-gradient( 45deg, hsla(240, 50%, 50%, 0.2), hsla(120, 50%, 50%, 0.2) )')
          ('color: black')
      ;
    }else if(!s.player.paused){
      v.spanBtnPlay.innerHTML = s.pauseIcon;
      c.startHideControls();    
      L(v.btnPlay)
        .styles
          ('background: teal')
          ('color: white')
      ;    
    }      
  //}
  //------------------------------//
};
//-----------------------------------------------------//

c.playPriorSong = function(){
  if(s.busyQueueingPriorSong){return;}
  s.busyQueueingPriorSong = true;
  
  let currentIndex = v.songChooser.selectedIndex;
  let maxIndex = v.songChooser.options.length - 1;
  let minIndex = 1;
  v.songChooser.selectedIndex = ( currentIndex <= minIndex ) ? maxIndex : currentIndex - 1;
  c.cueChosenSong(s.nonStop);
  if(s.nonStop){c.startHideControls();}
  
  setTimeout(function(){
    s.busyQueueingPriorSong = false;
  }, s.debounceTime);
};
//-----------------------------------------------------//

c.playNextSong = function(){
  if(s.busyQueueingNextSong){return;}
  s.busyQueueingNextSong = true;
  
  let currentIndex = v.songChooser.selectedIndex;
  let maxIndex = v.songChooser.options.length - 1;
  v.songChooser.selectedIndex = ( currentIndex >= maxIndex ) ? 1 : currentIndex + 1;
  c.cueChosenSong(s.nonStop)
  if(s.nonStop){c.startHideControls();}
  
  setTimeout(function(){
    s.busyQueueingNextSong = false;    
  }, s.debounceTime);
};
//-----------------------------------------------------//

c.toggleControlsPanel = function(){
  c.collectAllControls();
  s.controlsArray.forEach( control => control.style.visibility = s.controlsVisible ? 'visible' : 'hidden');
  v.songChooserGroup.style.visibility = "visible";
  v.songChooserCover.style.visibility = "visible";  
  v.songChooser.style.visibility = "visible";
  v.songList.style.visibility = "visible";  
  
  if(s.controlsVisible){
    L(v.menu).styles('visibility: hidden');// menu is the mis-named fileSaveGroup
  }
  if(s.menuOpen){
    L(v.menu).styles('visibility: visible');// menu is the mis-named fileSaveGroup
    if(s.savingFile){
      L(v.uploadBlocker).styles('visibility: visible');        
    }
    else if(!s.savingFile){
      L(v.uploadBlocker).styles('visibility: hidden');       
    }     
  }
}

//-----------------------------------------------------//

c.storeChosenFile = function(showPicture){  
  L(v.uploadBlocker).styles('visibility: visible');
  
  let numberOfFiles = v.fileChooser.files.length;
  let fileOrFiles = (numberOfFiles === 1)?'file':'files';  
  v.menuBox.innerHTML = `Saving<br/>${numberOfFiles} ${fileOrFiles}`;
  
  L(v.menuBox).styles
    ('color: white')
    ('background: teal')
  ;
  c.getPictureFromMp3(s.chosenFile, function(pictureData, image, base64String){
    //https://stackoverflow.com/questions/27946228/file-download-a-byte-array-as-a-file-in-javascript-extjs
    a.pictureId = a.NO_PICTURE_ID;     
    //The holy grail (Uint8Array) follows !  :)
    let blob = new Blob([new window.Uint8Array(image.data)], {type: image.format});
    
    clearInterval(s.menuRotationTimerId);
    s.menuRotationTimerId = setInterval(function(){
      s.menuAngle += 1.8;
      L(v.menuBox).styles
        ('transform: rotateZ(' + s.menuAngle + 'deg)')
      ;
    }, 15);
    
    a.uploadFile( blob, (s.chosenFile.name + ".jpg"), a.musicFolderId, fileInfo => {
      a.pictureId = fileInfo.id;
      if(s.showPicture){
        c.showImageInApp(a.pictureId);
      }
      c.uploadChosenFile(image.format);
    });
  }, function(error){
    a.pictureId = a.NO_PICTURE_ID;   
    v.filesInfo.innerHTML = "Having trouble getting picture tag data";
    c.uploadChosenFile();
    
    let numberOfFiles = v.fileChooser.files.length;
    let fileOrFiles = (numberOfFiles === 1)?'file':'files';  
    v.menuBox.innerHTML = `Saving<br/>${numberOfFiles} ${fileOrFiles}`;    
    
    clearInterval(s.menuRotationTimerId);    
    s.menuRotationTimerId = setInterval(function(){
      s.menuAngle += 1.8;
      L(v.menuBox).styles
        ('transform: rotateZ(' + s.menuAngle + 'deg)')
      ;
    }, 15);    
  });
};
//----------------------------------------------------------//
c.function3 = function(){
  if(s.tooLong){
    v.info.innerHTML += ' '+ "too long";    
    s.tooLong = false;
  }
  console.log("I am function", 3);  
};

//-----------------------------------------------------//
c.toggleNonStopButton = ()=>{
  
  if(s.nonStop){
    v.btnNonStop.classList.remove('stop');
    v.btnNonStop.classList.add('nonStop');    
  }
  else{
    v.btnNonStop.classList.remove('nonStop');
    v.btnNonStop.classList.add('stop');     
  }
    
};
//-----------------------------------------------------//
c.toggleShuffleButton = ()=> {
  //let background = s.shuffle ? 'teal' : 'transparent';
  let color = s.shuffle ? 'white' : 'black';
  let otherColor = s.shuffle ? 'black' : 'white';

  let rightClass = color + "Shuffle";
  let wrongClass = otherColor + "Shuffle";
  
  v.btnShuffle.classList.remove(wrongClass);
  v.btnShuffle.classList.add(rightClass);
  c.fillSongChooser();
};
//-----------------------------------------------------//
c.showInfo = function(){
  
  v.info.innerHTML = s.source.id +
    ": " + 
    s.type +
    ((s.moved) ? ' (' + s.moveCount  +')':'')+
    //((s.type === 'timeupdate') ? ' (' + s.timeUpdateCount + ')' :'') +
    ((s.stillPressed) ? ', pressed' : '')+
    ((s.stillReleased) ? ', released' : '')+
    (s.stillOnline ? '' : ' (offline)')
  ;
  
  //v.info.innerHTML = `initialX: ${s.initialX}  finalX: ${s.finalX}`;
};
//-----------------------------------------------------//
c.handleOnLine = ()=>{
  if(s.type === 'online' || s.onLine){
    v.offLineInfo.style.visibility = 'hidden';
    v.timeInfo.style.color = '#242424';//black, kinda    
    //c.initialize();
    //window.location.assign('https://sweetspot.glitch.me/');
    if(a.firstTime){c.firstTime();}    
  }  
  else if(s.type === 'offline'|| !s.online) {
    v.offLineInfo.style.visibility = 'visible';
    v.timeInfo.style.color = 'hsl(0, 80%, 40%)';//red, kinda
  }
};