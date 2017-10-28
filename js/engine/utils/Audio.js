/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * An audio tool over howler, provide some simple middleware + direct access to howler sounds
 * @namespace Audio
 */
define( [ 'DE.config', 'howler', 'DE.Events', 'howler-spatial' ],
function( config, howler, Events )
{
  var Audio = new function()
  {
    this.DEName = "Audio";
    this.howler = howler;
    
    this.loadAudios = function( audioList )
    {
      this.music.volume = this.volume;
      this.fx.volume = this.volume * 0.75;
      
      for ( var m = 0, audioData, audio, urls, params; audioData = audioList[ m ]; ++m )
      {
        params = audioData[ 3 ] || {};
        
        /* Howler format */
        urls = [];
        for ( var i = 0; i < audioData[ 2 ].length; ++i ) {
          urls.push( audioData[ 1 ] + "." + audioData[ 2 ][ i ] );
        }
        audio = new howler.Howl( {
          src          : urls
          , autoplay   : params.autoplay || false
          , loop       : params.loop || false
          , volume     : params.volume || 1
          , sprite     : params.sprite || {}
          , html5      : params.html5 !== undefined ? params.html5 : false
          , preload    : params.preload !== undefined ? params.preload : true
          , mute       : params.mute || false
          , rate       : params.rate || 1
          , pool       : params.pool || 1
        } );
        /**/
        
        audio.name = audioData[ 0 ] || 'noname';
        
        if ( params.isMusic ) {
          this.music.add( audio );
        }
        else {
          this.fx.add( audio );
        }
      }
      this.setVolume( this.volume );
    }
    
    this.mute = function()
    {
      howler.Howler.mute( true );
      return this;
    }
    
    this.unmute = function()
    {
      howler.Howler.mute( false );
      return this;
    }
    
    this.toggle = function()
    {
      howler.Howler.mute( !howler.Howler._muted );
      return this;
    }
    
    /**
     * set the global volume (FX is 75% of musics by default)
     * @memberOf Audio
     * @protected
     * @param {Number} musicValue - from 0 (0%) to 1 (100%)
     * @param {Number} fxValue - from 0 (0%) to 1 (100%), if nothing musicValue*0.75 is used
     * @param {String} sign - used to increment or decrement current volume with the value passed (+ or - in a string)
     */
    this.setVolume = function( musicValue, fxValue, sign )
    {
      if ( sign == "+" ) {
        this.music.setVolume( this.music.volume + musicValue );
        this.fx.setVolume( this.fx.volume + ( fxValue || ( musicValue * 0.75 ) ) );
      }
      else if ( sign == "-" ) {
        this.music.setVolume( this.music.volume - musicValue );
        this.fx.setVolume( this.fx.volume - ( fxValue || ( musicValue * 1.25 ) ) );
      }
      else {
        this.music.setVolume( musicValue );
        this.fx.setVolume( fxValue || ( musicValue * 0.75 ) );
      }
      return this;
    }
    
    /***
     * @namespace Audio.fx
     * @memberOf Audio
     */
    this.music = new function()
    {
      this._musics = {};
      
      /**
       * get all musics, an other way to access (instead of Audio.music._musics )
       * @memberOf Audio.music
       * @public
       */
      this.getAll = function()
      {
        return this._musics;
      }
      
      /**
       * get a specific music
       * an other way to access the instance of howler (instead of Audio.music._musics[ name ] )
       * @memberOf Audio.music
       * @public
       * @param {string} name - name of the music
       */
      this.get = function( name )
      {
        return this._musics[ name ].sound;
      }
      
      /**
       * add a music to the library
       * @memberOf Audio.music
       * @public
       * @param {Howl} music - instance of Howl (must have a .name)
       */
      this.add = function( mus )
      {
        this._musics[ mus.name ] = mus;
        return this;
      }
      
      /**
       * play the given music
       * @memberOf Audio.music
       * @public
       * @param {String} name - name of the music to play
       * @param {String} sprite - name of the sprite to play (optional)
       */
      this.play = function( name, sprite )
      {
        if ( !this._musics[ name ] ){ return; }
        
        this._musics[ name ].play( sprite );
        return this;
      }
      
      /****
       * stop all musics and play one, can preserve specific musics
       * @memberOf Audio.music
       * @public
       * @param {String} name - name of the music to play
       * @param {String} sprite - name of the sprite to play (optional)
       * @param {String or Array of String} preserve - name of music to preserve (can be an array)
       * @example: Audio.music.stopAllAndPlay( "game", null, "ambiance" )
       */
      this.stopAllAndPlay = function( name, sprite, preserve )
      {
        this.stopAll( preserve );
        if ( name != preserve ) {
          this.play( name, sprite );
        }
        
        return this;
      }
      
      /****
       * stop all musics to play "name", can preserve a specific music
       * @memberOf Audio.music
       * @public
       * @param {String or Array of String} preserve - name of music to preserve (can be an array)
       * @example: Audio.music.stopAll( [ "bossFight", "lavaExplosions" ] )
       */
      this.stopAll = function( preserve )
      {
        if ( !preserve ){ preserve = []; }
        if ( !preserve.push ){ preserve = [ preserve ]; }
        for ( var m in this._musics )
        {
          if ( preserve.indexOf( m ) != -1 ) {
            continue;
          }
          else {
            this._musics[ m ].stop();
          }
        }
        return this;
      }
      
      this.pauseAll = function( preserve )
      {
        if ( !preserve ){ preserve = []; }
        if ( !preserve.push ){ preserve = [ preserve ]; }
        for ( var m in this._musics )
        {
          if ( preserve.indexOf( m ) != -1 ) {
            continue;
          }
          else {
            this._musics[ m ].pause();
          }
        }
        return this;
      }
      
      this.pauseAllAndPlay = function( name, sprite, preserve )
      {
        this.pauseAll( preserve );
        if ( name != preserve ) {
          this.play( name, sprite );
        }
        return this;
      }
      
      /**
       * change mute state for all musics
       * @memberOf Audio.music
       * @public
       * @param {Boolean} state - mute or unmute
       */
      this.mute = function( state )
      {
        for ( var m in this._musics )
        {
          this._musics[ m ].mute( state );
        }
        return this;
      }
      
      /**
       * set a global volume for every musics
       * @memberOf Audio.music
       * @public
       * @param {Number} value - from 0 (0%) to 1 (100%)
       * @param {Boolean} useAsCoef - if true, this will use the value as a coef for each musics (example: bullet.volume is 0.7, you call setVolume with 0.5 then bullet.volume is 0.35)
       */
      this.setVolume = function( val, usePercent )
      {
        for ( var i in this._musics )
        {
          if ( usePercent ) {
            this._musics[ i ].volume( this._musics[ i ].volume() * val );
          }
          else {
            this._musics[ i ].volume( val );
          }
        }
        return this;
      }
    }
    
    /***
     * @namespace Audio.fx
     * @memberOf Audio
     */
    this.fx = new function()
    {
      this._fxs = {};
      
      /**
       * get a specific fx
       * an other way to access the instance of howler (instead of Audio.fx._fxs[ name ] )
       * @memberOf Audio.fx
       * @public
       * @param {string} name - name of the fx
       */
      this.get = function( name )
      {
        return this._fxs[ name ];
      }
      
      /**
       * add a fx to the library
       * @memberOf Audio.fx
       * @public
       * @param {Howl} fx - instance of Howl (must have a .name)
       */
      this.add = function( fx )
      {
        this._fxs[ fx.name ] = fx;
        return this;
      }
      
      /**
       * play the given fx
       * @memberOf Audio.fx
       * @public
       * @param {String} name - name of the fx to play
       * @param {String} sprite - name of the sprite to play (optional)
       */
      this.play = function( name, sprite )
      {
        if ( !this._fxs[ name ] ){ return; }
        
        this._fxs[ name ].play( sprite );
        return this;
      }   
      
      /**
       * play randomly one of the given fx
       * @memberOf Audio.fx
       * @public
       * @param {Array of String} name - array of name to choose randomly (can be a string, and the sprite is an array)
       * @param {Array of String} sprite - sprite to choose randomly if the name is a string
       */
      this.playRandom = function ( name, sprite )
      {
        var rand;
        
        if ( name.push ) {
          rand = Math.random() * name.length >> 0;
          this.play( name[ rand ] );
        }
        else {
          rand = Math.random() * sprite.length >> 0;
          this.play( name, sprite[ rand ] );
        }
      }
      
      /**
       * stop every instance of this fx (including sprites)
       * @memberOf Audio.fx
       * @public
       * @param {String} name - fx to stop
       */
      this.stop = function( name )
      {
        this._fxs[ name ].stop();
      }
      
      /**
       * change mute state for all fx
       * @memberOf Audio.fx
       * @public
       * @param {Boolean} state - mute or unmute
       */
      this.mute = function( state )
      {
        for ( var m in this._fxs )
        {
          this._fxs[ m ].mute( state );
        }
        return this;
      }
      
      /**
       * set a global volume for every fx
       * @memberOf Audio.fx
       * @public
       * @param {Number} value - from 0 (0%) to 1 (100%)
       * @param {Boolean} useAsCoef - if true, this will use the value as a coef for each fx (example: bullet.volume is 0.7, you call setVolume with 0.5 then bullet.volume is 0.35)
       */
      this.setVolume = function( val, usePercent )
      {
        for ( var i in this._fxs )
        {
          if ( usePercent ) {
            this._fxs[ i ].volume( this._fxs[ i ].volume() * val );
          }
          else {
            this._fxs[ i ].volume( val );
          }
        }
        return this;
      }
    }
  };
  
  return Audio;
} );