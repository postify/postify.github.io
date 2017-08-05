/*global L*/

/*global s*/
/*global v*/
/*global c*/

/*global a*/

//all STATE update functions are here:
c.trailer = function(){}; //never delete this (dummy function to be run last)
//-----------------------------------------------------//
c.toggleMenu = function(){
  if(s.menuToggleBusy){return;}
  s.menuToggleBusy = true;
  
  s.menuOpen = !s.menuOpen;
  c.toggleMenuView();
  
  setTimeout(function(){
    s.menuToggleBusy = false;    
  }, s.debounceTime);
}
//-----------------------------------------------------//

c.stopControlsCountdown = function(){
  clearTimeout(s.hideControlsTimerId);
}
//-----------------------------------------------------//

c.togglePlayPause = function(){
  if(s.playPauseToggleBusy){return;}
  s.playPauseToggleBusy = true;
  
  if(s.player.paused || s.firstPlay){
    s.player.autoplay = true;
    s.player.play();
    s.firstPlay = false;
  }else{
    s.player.pause();
  }

  setTimeout(function(){
    s.playPauseToggleBusy = false;
  }, s.debounceTime);
};
//-----------------------------------------------------//
c.resizeAndCallback = function(){
  c.setResize(c.handleResize);
};
c.setResize = function(callback){
  let h = window.innerHeight;
  let w = window.innerWidth;
  if( h > w){s.vertical = true;}
  else{s.vertical = false;}
  setTimeout(function(){
      if(callback){callback();}
  }, 400);
};

//-----------------------------------------------------//

c.setHideControls = function(){
  s.controlsVisible = false;
};
//-----------------------------------------------------//

c.noteEnded = function(){
  s.ended = true;
  if(s.nonStop){
    c.playNextSong(s.nonStop);    
  }
};
//-----------------------------------------------------//

c.toggleControls = function(){
  if(s.controlsToggleBusy){return;}
  //debounce all controls (temporarily lock out their use)
  s.controlsToggleBusy = true;
  
  s.playPauseToggleBusy = true;
  s.nonStopToggleBusy = true;
  s.shuffleToggleBusy = true;
  s.busyQueueingNextSong = true;
  s.busyQueueingPriorSong = true;
  v.fileChooser.style.visibility = 'hidden';

  //only toggle the controls panel if the pointer (or finger) ...
  //hasn't slid too far after a delay
  s.controlsVisible = !s.controlsVisible;
  c.toggleControlsPanel();
  
  setTimeout(function(){
    //restore use of all controls
    s.controlsToggleBusy = false;
    
    s.playPauseToggleBusy = false;
    s.nonStopToggleBusy = false;
    s.shuffleToggleBusy = false;
    s.busyQueueingNextSong = false;
    s.busyQueueingPriorSong = false;
    //v.fileChooser.style.visibility = 'visible'; 
  }, s.debouceTime * 2.5);
}
//-----------------------------------------------------//

c.cueChosenSong = function(alsoPlayIt=true, callback){
  
  v.msg.innerHTML = '';
  
  let index = v.songChooser.selectedIndex;
  let data = v.songChooser.options[index].value.split(':');
  let songId = data[0].trim();
  let pictureId = data[1].trim();
  //-------------------------//
  let artistAndTitle = v.songChooser.options[index].innerHTML.split('-');
  let innerHTML = (artistAndTitle[0] && artistAndTitle[0].trim())  + '<br/>' + (artistAndTitle[1] && artistAndTitle[1].trim()) ;
  v.artistAndTitle.innerHTML = innerHTML;
  
  //-------------------------//
  
  s.thereIsNoPictureId = (pictureId === a.NO_PICTURE_ID.trim()) ? true : false;
  
  if(index !== 0){     
    v.player.src = s.googleDriveMusicSourcePrefix + songId;
    if(alsoPlayIt){v.player.play();}
    else{v.player.pause()}
    c.togglePlayButton();

    if(s.thereIsNoPictureId){
      v.msg.innerHTML = '(No image found)';
      L(v.app)
        .styles
          ("background: none")
          ("background-image: url( " + s.noImage + ")" )
          ("background-repeat: no-repeat")
          ("background-position: center")
          ("background-size: contain")
      ;
    }
    else{
      c.showImageInApp(pictureId);
    }
    if(callback){callback();}    
  }

}
//-----------------------------------------------------//
c.saveFiles = function(){
  [].forEach.call(v.fileChooser.files, (file, i, a)=>{
    if(!s.savingFile){
      //-------------------------------------------------------//
      L(v.uploadBlocker).styles('visibility: hidden');   
      let pieces = file.name.split('.');

      if ( pieces[pieces.length-1].toLowerCase() !== 'mp3' ){
        alert('Only mp3 music files allowed.');
        //return;
      }
      else{
        s.savingFile = true;
        s.chosenFile = file;
        //-----------------//
        /*
        if(a.firstTime){
          c.firstTime(c.storeChosenFile);
        } 
        else{
          c.storeChosenFile();  
        }
        */
        //------------------//
        c.storeChosenFile();        
      }
      //-------------------------------------------------------//       
    }
  });
}

//-----------------------------------------------------//
c.toggleNonStop = function(){
  if(s.nonStopToggleBusy){return;}
  s.nonStopToggleBusy = true;
  
  s.nonStop = !s.nonStop;
  s.player.autoplay = s.nonStop ? true : false; 
  
  //updates the "VIEW" part:
  //c.toggleNonStopButton();
    
  setTimeout(function(){
    s.nonStopToggleBusy = false;
  }, s.debounceTime * 2);
};

//-----------------------------------------------------//
c.toggleShuffle = ()=>{
  if(s.shuffleToggleBusy){return;}
  s.shuffleToggleBusy = true;
  
  s.shuffle = !s.shuffle;
  
  //c.toggleShuffleButton();
  
  setTimeout(function(){
    s.shuffleToggleBusy = false;
  }, s.debounceTime);
 
};

//-----------------------------------------------------//
c.incrementTimeCount = function(){
  s.timeUpdateCount++;
}

//-----------------------------------------------------//
c.clearTimeCount = function(){
  s.timeUpdateCount = 0;

};
//-----------------------------------------------------//
c.incrementMoveCount = ()=>{
  s.moveCount++;
  if(s.stillPressed){++s.pressedAndMoveCount;}
}
//-----------------------------------------------------//
c.clearMoveCount = ()=>{
  s.priorMoveCount = s.moveCount;
  s.moveCount = 0;
  if(!s.stillPressed){
    s.priorPressedAndMoveCount = s.pressedAndMoveCount;
    s.pressedAndMoveCount = 0;
  }    
}
//-----------------------------------------------------//
c.simulateDelay = function(){
  let then = Date.now();
  for(var i = 0; i< 3e8 ;i++){}
  if(Date.now() - then > s.minTime){
      s.tooLong = true;
  };
};
//-----------------------------------------------------//
c.setOnLine = function (){
  if(s.type === 'online'){s.onLine = true;}
  else if(s.type === 'offline'){s.onLine = false;}
};
//----------| END of UPDATE STATE  |-------------//