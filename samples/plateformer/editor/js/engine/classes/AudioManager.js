/***
* @AudioManager

***/

define( [ 'buzz', 'DE.audiosList' ],
function( buzz, audioList )
{
  var AudioManager = new function()
  {
    this.DEName = "AudioManager";
    
    this.loadAudios = function()
    {
      for ( var m in audioList )
      {
        var au = audioList[ m ];
        var audio = {};
        audio.name = au[ 0 ];
        audio.preload = au[ 3 ].preload;
        audio.loop = au[ 3 ].loop;
        audio.formats = au[ 2 ].formats;
        audio.sound = new buzz.sound( au[ 1 ], {
          formats: au[ 2 ]
          , preload: au[ 3 ].preload || false
          , loop: au[ 3 ].loop || false
        } );
        if ( au[ 3 ].isMusic )
        {
          this.music.add( audio );
        }
        else
        {
          this.fx.add( audio );
        }
      }
    }
    
    /***
    * @music @manager
    ***/
    this.music = new function()
    {
      var _musics = {};
      this.volume = 80;
      
      this.add = function( mus )
      {
        _musics[ mus.name ] = mus;
      }
      /***
      *
      ***/
      this.stopAllAndPlay = function( name, ignore )
      {
        if ( !ignore ){ var ignore = false; }
        if ( !_musics[ name ] || !_musics[ name ].sound ){ return; }
        
        for ( var m in _musics )
        {
          if ( m == name || m == ignore ) { continue; }
          _musics[ m ].sound.stop();
        }
        
        if ( !_musics[ name ].sound.isPaused() )
        {
          return;
        }
        _musics[ name ].sound.setTime(0);
        _musics[ name ].sound.play();
        _musics[ name ].sound.setVolume( this.volume );
        _musics[ name ].sound.loop();
      }
      
      this.pauseAllAndPlay = function( what )
      {
        for ( var m in _musics )
        {
          if ( !_musics[ m ].sound.isPaused() )
          {
            _musics[ m ].sound.pause();
          }
        }
        
        _musics[ what ].sound.play();
        _musics[ what ].sound.setVolume( this.volume.val );
      }
    }
    
    /***
    * @fx @manager
    ***/
    this.fx = new function()
    {
      var _fxs = {};
      this.volume = 80;
      
      this.add = function( fx )
      {
        _fxs[ fx[ 0 ] ] = fx;
      }
      
      this.play = function( name )
      {
        _fxs[ name ].sound.play();
      }
    }
  };
  
  return AudioManager;
} );