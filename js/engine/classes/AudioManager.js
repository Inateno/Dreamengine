/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * is a system over buzz provide some simple middleware
 * TODO:
 *  - make musics and fxs spritable
 *  - create a pool for fxs
 * @namespace AudioManager
 */
define( [ 'DE.CONFIG', 'buzz', 'DE.Event' ],
function( CONFIG, buzz, Event )
{
  var AudioManager = new function()
  {
    this.DEName = "AudioManager";
    this.muted  = false;
    this.volume = 80;
    
    this.loadAudios = function( audioList )
    {
      this.music.volume = this.volume;
      this.fx.volume = this.volume * 0.75;
      
      for ( var m = 0, au, audio, urls, params; m < audioList.length; ++m )
      {
        au = audioList[ m ];
        params = au[ 3 ] || {};
        audio = {};
        audio.name    = au[ 0 ] || 'noname';
        audio.preload = params.preload || false;
        audio.loop    = params.loop || false;
        audio.formats = au[ 2 ] || [ 'mp3' ];
        audio.autoplay= params.autoplay || false;
        
        audio.sound = new buzz.sound( au[ 1 ], {
          formats  : audio.formats
          ,preload : audio.preload
          ,loop    : audio.loop
          ,autoplay: audio.autoplay
        } );
        /* Howler format, maybe later
        urls = [];
        for ( var i = 0; i < au[ 2 ].length; ++i )
          urls.push( au[ 1 ] + "." + au[ 2 ][ i ] );
        Event.addEventCapabilities( audio );
        audio.sound   = new HowlLib.Howl( {
          urls         : urls
          , autoplay   : params.autoplay || false
          // , buffer     : params.preload || false
          , loop       : params.loop || false
          , sprite     : params.sprite || {}
          , onend      : function(){ this.referrer.trigger( "end", this ); }
          , onload     : function(){ this.referrer.trigger( "load", this ); }
          , onloaderror: function(){ this.referrer.trigger( "loaderror", this ); }
          , onplay     : function(){ this.referrer.trigger( "play", this ); }
          , referrer   : audio
          , volume     : 1.0
        } );*/
        if ( params.isMusic )
          this.music.add( audio );
        else
          this.fx.add( audio );
      }
      this.setVolume( this.volume );
    }
    
    this.mute = function()
    {
      this.music.mute();
      this.fx.mute();
      this.muted = true;
      return this;
    }
    
    this.unmute = function()
    {
      this.music.unmute();
      this.fx.unmute();
      this.muted = false;
      return this;
    }
    
    this.toggle = function()
    {
      if ( this.muted )
        this.unmute();
      else
        this.mute();
      return this;
    }
    
    this.setVolume = function( val, sign )
    {
      if ( sign == "+" )
        this.volume += val;
      else if ( sign == "-" )
        this.volume -= val;
      else
        this.volume = val;
      
      this.checkVolume();
      
      var mval = this.volume;
      this.music.setVolume( mval );
      
      var sval = this.volume * 0.75; //this.fx.volume - val / 100 * this.fx.volume;
      this.fx.setVolume( sval );
      return this;
    }
    
    this.checkVolume = function()
    {
      this.volume = ( ( this.volume > 100 ) ? 100 : this.volume ) >> 0;
      this.volume = ( ( this.volume < 0 ) ? 0 : this.volume ) >> 0;
      return this;
    }
    
    this.applyFades = function()
    {
      var musics = this.music.getAll();
      var m, vol = 0;
      for ( var i in musics )
      {
        if ( musics[ i ].sound.currentFade == 0 )
          continue;
        m = musics[ i ].sound;
        
        for ( var f in m.fades )
        {
          vol = m._volume + m.fades[ f ].dir * m.fades[ f ].step
          ++m.fades[ f ].step;
          m.volume( vol, f !== "default" ? f : null );
          if ( vol == m.fades[ f ].to )
          {
            if ( m.fades[ f ].callback )
              m.fades[ f ].callback();
            delete m.fades[ f ];
          }
        }
        // self.fades[ id ] = {
        //   fading: true,
        //   steps: steps
        //   to: to
        // };
        
        // var change = self._volume + (dir === 'up' ? 0.01 : -0.01) * i,
        //   vol = Math.round(1000 * change) / 1000,
        //   // toVol = to;

        // setTimeout(function() {
        //   self.volume(vol, id);

        //   if (vol === to) {
        //     self.currentFade--;
        //     if (callback) callback();
        //   }
        // }, stepTime * i);
      }
    }
    
    /****
     * singleton@music manager
      provide methods to act on musics only
     */
    this.music = new function()
    {
      var _musics = {};
      this.volume = 80;
      this.muted = false;
      this.currentPlayed = [];
      this.savedPlay = [];
      
      this.getAll = function()
      {
        return _musics;
      }
      
      /****
       * get@Sound( name@String )
        should be usefull sometimes
       */
      this.get = function( name )
      {
        return _musics[ name ].sound;
      }
      
      /****
       * add@void
       */
      this.add = function( mus )
      {
        _musics[ mus.name ] = mus;
      }
      
      this.play = function( name )
      {
        var names = [];
        if ( name.length != undefined && name.push )
          names = name;
        else
          names.push( name );
        
        for ( var i = 0, n; i < names.length; ++i )
        {
          n = names[ i ].split( "." );
          var sprite = n[ 1 ] || null;
          n = n[ 0 ];
          if ( !_musics[ n ] || !_musics[ n ].sound ){ continue; }
          
          if ( sprite )
            this.currentPlayed.push( n + "." + sprite );
          else
            this.currentPlayed.push( n );
          _musics[ n ].sound.loop();
          _musics[ n ].sound.setVolume( this.volume );
          if ( !this.muted )
            _musics[ n ].sound.play( sprite );
        }
        return this;
      }
      
      /****
       * stopAllAndPlay@void( name@Stirng, ignore@String )
        stop all musics to play "name", can ignore a specific music
        example: stopAllAndPlay( "game", "ambiance" )
       */
      this.stopAllAndPlay = function( name, ignore )
      {
        this.stopAll( ignore );
        if ( name != ignore)
          this.play( name );
        
        return this;
      }
      
      this.stopAll = function( ignore )
      {
        this.currentPlayed = [];
        if ( !ignore ){ ignore = []; }
        if ( !ignore.push ){ ignore = [ ignore ]; }
        for ( var m in _musics )
        {
          if ( ignore.indexOf( m ) != -1 )
          {
            if ( !_musics[ m ].sound.isPaused() )
              this.currentPlayed.push( m );
            continue;
          }
          else
            _musics[ m ].sound.stop();
        }
        return this;
      }
      
      this.pauseAll = function( ignore )
      {
        this.currentPlayed = [];
        if ( !ignore ){ ignore = []; }
        if ( !ignore.push ){ ignore = [ ignore ]; }
        for ( var m in _musics )
        {
          if ( ignore.indexOf( m ) != -1 )
          {
            if ( !_musics[ m ].sound.isPaused() )
              this.currentPlayed.push( m );
            continue;
          }
          else
            _musics[ m ].sound.pause();
        }
        return this;
      }
      
      /****
       * pauseAllAndPlay@void( name@String )
       */
      this.pauseAllAndPlay = function( name )
      {
        for ( var m in _musics )
          _musics[ m ].sound.pause();
        if ( this.muted )
          return;
        this.play( name );
        return this;
      }
      
      /****
       * mute@void
       */
      this.mute = function()
      {
        this.savedPlay = [].concat( this.currentPlayed );
        this.muted = true;
        this.pauseAll();
        return this;
      }
      
      /****
       * unmute@void
       */
      this.unmute = function()
      {
        this.muted = false;
        for ( var i = 0; i < this.savedPlay.length; ++i )
          _musics[ this.savedPlay[ i ] ].sound.play();
        this.currentPlayed = this.savedPlay;
        return this;
      }
      
      /****
       * setVolume@void( val@Int )
        set global musics volume
       */
      this.setVolume = function( val )
      {
        this.volume = val || 0;
        for ( var i in _musics )
          _musics[ i ].sound.setVolume( this.volume );
        return this;
      }
    }
    
    /***
     * singleton@fx manager
     */
    this.fx = new function()
    {
      var _fxs = {};
      this.volume = 80;
      this.muted = false;
      
      /****
       * get@Sound( name@String )
        should be usefull sometimes
       */
      this.get = function( name )
      {
        return _fxs[ name ].sound;
      }
      
      /****
       * add@void( fx@Sound )
        add a sound in the library
       */
      this.add = function( fx )
      {
        _fxs[ fx.name ] = fx;
      }
      
      /****
       * play@void( name@String )
        play an fx
       */
      this.play = function( name )
      {
        if ( this.muted )
          return;
        if ( !_fxs[ name ] )
        {
          console.log( "Unable to find the fx named " + name + ". Prevent play" );
          return;
        }
        if ( !_fxs[ name ].sound.isPaused() )
          _fxs[ name ].sound.stop();
        _fxs[ name ].sound.play();
        return this;
      }      
      
      /****
       * playRandom@void( array@Array )
         play a random sound in the array
         example : playRandom( [ "footstep1", "footstep2" ] )
         */
      this.playRandom = function ( array )
      {
        var rand = Math.random() * array.length >> 0;
        this.play( array[ rand ] );
      }      
      
      this.stop = function( name )
      {
        _fxs[ name ].sound.stop();
      }
      
      /****
       * mute@void
        mute all fxs
       */
      this.mute = function()
      {
        this.muted = true;
        for ( var i in _fxs )
          _fxs[ i ].sound.stop();
      }
      
      /****
       * unmute@void
        unmute all fxs
       */
      this.unmute = function()
      {
        this.muted = false;
        return this;
      }
      
      /****
       * setVolume@void( val@Int )
        set fxs volume
       */
      this.setVolume = function( val )
      {
        this.volume = val || 0;
        for ( var i in _fxs )
          _fxs[ i ].sound.setVolume( this.volume );
        return this;
      }
    }
  };
  
  CONFIG.debug.log( "AudioManager loaded", 3 );
  return AudioManager;
} );