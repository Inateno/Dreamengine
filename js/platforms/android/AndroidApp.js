define( [ 'DREAM_ENGINE', 'customizeAndroid' ],
function( DE, customizeAndroid )
{
  var AndroidApp = new function()
  {
    var _self = null;
    this.init = function( params )
    {
      _self = this;
      customizeAndroid( this );
      
      document.addEventListener("deviceready", _self.onDeviceReady, false);
      document.addEventListener("backbutton", _self.onBackButton, false);
      // document.addEventListener("menubutton", _self.onMenuButton, false);
      // document.addEventListener("pause", _self.onAppPause, false);
      // document.addEventListener("resume", _self.onAppResume, false);
      // document.addEventListener("volumedownbutton", _self.onVolumeDownButton, false);
      // document.addEventListener("volumeupbutton", _self.onVolumeUpButton, false);
      // document.addEventListener("searchbutton", _self.onSearchButton, false);
    }
    
    this.onBackButton = function(e){}
    // this.onMenuButton = function(e){}
    // this.onAppPause = function(e){}
    // this.onAppResume = function(e){}
    // this.onVolumeDownButton = function(e){}
    // this.onVolumeUpButton = function(e){}
    // this.onSearchButton = function(e){}
    
    this.onDeviceReady = function() 
    {
      if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
        console.log( "Android plugin loaded Successfully" );    
    }
    
    //override buzz by Cordova plugin MEDIA
    DE.AudioManager.loadAudios = function( audioList )
    {
      this.music.volume = this.volume;
      this.fx.volume = this.volume * 0.75;
      
      for ( var m = 0, au, audio, urls, params; m < audioList.length; ++m )
      {
        au             = audioList[ m ];
        params         = au[ 3 ] || {};
        audio          = {};
        audio.name     = au[ 0 ] || 'noname';
        audio.preload  = params.preload || false;
        audio.loop     = params.loop || false;
        audio.autoplay = params.autoplay || false;
        
        if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3)
        {
          console.log("adding audio "+audio.name+".mp3 from file:///android_asset/www/"+ au[ 1 ] +".mp3");
          console.log("=> ",audio);
        }
        
        audio.sound = new Media( "file:///android_asset/www/"+ au[ 1 ] +".mp3",
          // success callback
          function () 
          {
            if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
              console.log("Android Audio " + this.src + " loaded Successfully"); 
          }
          // error callback
          ,function (err) 
          {
            if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
            {
              console.log("Android Audio " + this.src + " Error: " + err);
            }
          }
          //status callback
          ,function( status )
          {
            if ( status == 0 ) // Media.MEDIA_NONE
            {
              if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
              {
                console.log( "Android Audio "+ this.src +" not found" )
              }
            }
            else if ( status == 1 ) // Media.MEDIA_STARTING
            {
              if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
              {
                console.log( "Android Audio "+ this.src +" is starting" )
              }
              this.onStarted();
            }
            else if ( status == 2 ) // Media.MEDIA_RUNNING
            {
              if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 4 )
              {
                console.log( "Android Audio "+ this.src +" is playing" )
              }
              this.paused = false;
            }
            else if ( status == 3 ) // Media.MEDIA_PAUSED
            {
              if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
              {
                console.log( "Android Audio "+ this.src +" is paused" )
              }
              this.paused = true;
              this.onPaused();
            }
            else if ( status == 4 ) // Media.MEDIA_STOPPED
            {
              if ( DE.CONFIG.DEBUG && DE.CONFIG.DEBUG_LEVEL > 3 )
              {
                console.log( "Android Audio "+ this.src +" stopped" )
              }
              this.onStopped();
            }
          }
        );
        
        audio.sound.name = audio.name;
        audio.sound.needToLoop = audio.loop;
        
        audio.sound.onStopped = function()
        {
          // console.log("stopped at "+this._position)
          // this._position = 0;
          // if ( this.needToLoop )
          //   this.loop();
        }
        
        audio.sound.onStarted = function()
        {
          
        }
        
        audio.sound.onPaused = function()
        {
          
        }
        
        audio.sound.isPaused = function()
        {
          return this.paused;
        }
        
        audio.sound.loop = function()
        {
          this.play();
        }
        
        if( audio.autoplay )
          audio.sound.play();
        
        if ( params.isMusic )
          this.music.add( audio );
        else
          this.fx.add( audio );
      }
      this.setVolume( this.volume );
    }
  };
  
  return AndroidApp;
} );