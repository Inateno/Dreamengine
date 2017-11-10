/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Render
 * @class a Render is globally the canvas in your DOM
 * A Render will render every scene you add to it and is rendered by the MainLoop
 * @example Game.render = new DE.Render( "Test", { size, options } );
 */
define( [
  'PIXI'
  , 'DE.config'
  , 'DE.Time'
  , 'DE.MainLoop'
  , 'DE.Events'
],
function(
  PIXI
  , config
  , Time
  , MainLoop
  , Events
)
{
  function Render( id, params )
  {
    Events.Emitter.call( this );
    
    var _params = params || {};
    
    /**
     * save the previous real size (not the canvas size but the visible size without any resize)
     * this is used to calculate correctly the resize
     * @protected
     * @memberOf Render
     */
    this._savedSizes  = new PIXI.Point( _params.width || 100, _params.height || 100 );
    
    /**
     * can be used to convert every draw to initial size when the Render has a resizeMode (compared to the first declaration)
     * @protected
     * @memberOf Render
     */
    this._drawRatio = 1;
    
    /**
     * the PIXI Renderer
     * @public
     * @memberOf Render
     * @type {PIXI.Renderer}
     */
    this.pixiRenderer = new PIXI.autoDetectRenderer(
      {
        width                  : _params.width
        , height               : _params.height
        , antialias            : _params[ "antialias" ] || false
        , transparent          : _params[ "transparent" ] || false
        , resolution           : _params[ "resolution" ] || 1
        , preserveDrawingBuffer: _params[ "preserveDrawingBuffer" ] || false
        , backgroundColor      : _params[ "backgroundColor" ] || 0x000000
        , clearBeforeRender    : _params[ "clearBeforeRender" ] || true
        , roundPixels          : _params[ "roundPixels" ] || false
        , forceFXAA            : _params[ "forceFXAA" ] || false
        , legacy               : _params[ "legacy" ] || false
        , powerPreference      : _params[ "powerPreference" ] || "" //"high-performance" only for "gamers setup"
        , autoResize           : true
      }
    );
    
    // this.pixiRenderer.plugins.interaction.mousedown
    
    /**
     * For convenience we use a PIXI.Container to add each scenes to, this way we just need to render this container
     * @public
     * @memberOf Render
     * @type {PIXI.Container}
     */
    this.mainContainer = new PIXI.Container();
    
    // TODO NEED camera distinction ? this.cameras = [];
    // TODO NEED ?? this.scenes = []; // waiting to be decided on camera or not, I push scenes here and render it
    
    this.debugRender = new PIXI.Text( 'DEBUG Enable \nDeltaTime: 1\nFPS: 60', new PIXI.TextStyle( {
      fill           : 'white',
      fontSize       : 14,
      fontFamily     : '"Lucida Console", Monaco, monospace',
      strokeThickness: 2
    } ) );
    this.debugRender.y = 10;
    this.debugRender.x = 10;
    
    Events.on( "change-debug", function( debug, level )
    {
      if ( level > 0 ) {
        this.mainContainer.addChild( this.debugRender );
      }
      else {
        this.mainContainer.removeChild( this.debugRender );
      }
    }, this );
    
    this.id = "render-" + Date.now() + "-" + ( Math.random() * Date.now() >> 0 );
    this.divId = id || undefined;
    
    this.enable = true; // set to false to prevent render and update
    this.frozen = false; // set to true to prevent update but keep render
    
    /**
     * Store the resize mode in a string, call changeResizeMode if you want to dynamically change this
     * @private
     * @memberOf Render
     * @type {String}
     */
    this._resizeMode = params.resizeMode || null;
    
    /**
     * The resize method called on event resize
     * @private
     * @memberOf Render
     * @type {Function}
     */
    this._resizeMethod    = function(){}
    /**
     * Flag to prevent potential double event binding
     * @private
     * @memberOf Render
     * @type {Bool}
     */
    this._listeningResize = false;
    
    /**
     * flag if you use HTML5 Fullscreen API
     * @protected
     * @memberOf Render
     * @type {Boolean}
     */
    this.isFullscreen = false;
  }
  
  Render.prototype = Object.create( Events.Emitter.prototype );
  Render.prototype.constructor = Render;
  
  /**
   * create the parent div, add it to the dom, add this render to the MainLoop
   * bind Inputs, then call updateSizes
   * @public
   * @memberOf Render
   */
  Render.prototype.init = function()
  {
    if ( this.__inited ) {
      return;
    }
    
    this.__inited = true;
    
    if ( !this.divId ) {
      this.div = window.document.body;
      console.warn( "%cWARN: you not specified a DOM Object to append the render to, it will be pushed in the body *hiiik*", 1, "color:orange" );
    }
    else {
      this.div = document.getElementById( this.divId );
      if ( !this.div ) {
        throw new Error( "Can't found the div by the given id" );
        return false;
      }
    }
    
    this.div = document.getElementById( this.divId );
    this.div.appendChild( this.pixiRenderer.view );
    this.view = this.pixiRenderer.view;
    
    MainLoop.addRender( this );
    
    this.pixiRenderer.view.setAttribute( "id", this.id );
    
    // update resize if needed
    if ( this._resizeMode ) {
      this.changeResizeMode( this._resizeMode );
      this._onResize();
      this._bindResizeEvent();      
    }
    
    /**
     * This is the ratio to the get initial conception sizes when the user change quality setting, if provided
     * TODO: calculate if when quality change, must do the quality settings issue #20
     * @todo
     * @private
     * @memberOf Render
     */
    this._qualityRatio = 1;
    
    // TODO - this was used only to bind touch/mouse events, if we use the PIXI interactions, it's not required anymore
    // Inputs.addRender( this );
    
    // TODO - update the quality rendering mode (change resolutions and physicRatio)
    // this.updateSizes();
  
    var self = this;
    this.div.addEventListener( "fullscreenchange", function( e )
    {
      self.isFullscreen = document.fullscreenElement;
    }, false );
    this.div.addEventListener( "msfullscreenchange", function( e )
    {
      self.isFullscreen = document.msFullscreenElement;
    }, false );
    this.div.addEventListener( "mozfullscreenchange", function( e )
    {
      self.isFullscreen = document.mozFullScreen;
    }, false );
    this.div.addEventListener( "webkitfullscreenchange", function( e )
    {
      self.isFullscreen = document.webkitIsFullScreen;
    }, false );
  };
  
  /**
   * change real size when change quality (all images are also reloaded in an other resolution to keep the drawRatio ok)
   * this will update the "physical ratio" which you should use when you are doing calculation based on objects positions (if using qualities)
   * @protected
   * @memberOf Render
   */
  /*Render.prototype.updateQualitySizes function()
  {
  };*/
  
  /**
   * resize with ratio, stretched or not
   * @public
   * @memberOf Render
   */
  Render.prototype.resizeRatio = function( w, h, stretch )
  {
    var baseW = this._savedSizes.x;
    var baseH = this._savedSizes.y;
    var calcRatio = w / baseW;

    if ( calcRatio * baseH > h ) {
      calcRatio = h / baseH;
    }

    var newW = calcRatio * baseW >> 0;
    var newH = calcRatio * baseH >> 0;
    
    if ( this.div != window.document.body )
    {
      this.div.style.width  = newW + "px";
      this.div.style.height = newH + "px";
    }
    
    // resize the PIXI Renderer keeping the good aspect ratio
    this.pixiRenderer.autoResize = true;
    this.pixiRenderer.resize( newW, newH );
    
    // if we want to stretch the canvas to keep the same viewport size
    if ( stretch ) {
      this.pixiRenderer.autoResize = false;
      this.pixiRenderer.resize( baseW, baseH );
    }
    
    this.div.style.marginLeft = ( ( w - newW ) / 2 ) + "px";
    this.div.style.marginTop = ( ( h - newH ) / 2 ) + "px";
    
    this._drawRatio = newW / this._savedSizes.x;
    this.emit( "resize", this._drawRatio );
  };
  
  /**
   * change current resize mode
   * @public
   * @memberOf Render
   */
  Render.prototype.changeResizeMode = function( mode )
  {
    this._resizeMode = mode;
    switch( mode )
    {
      case "stretch-ratio":
      case "ratio-stretch":
        this._resizeMethod = function( screenW, screenH )
        {
          this.resizeRatio( screenW, screenH, true );
        };
      break;
      case "stretch":
        // resize stretch = take immediately all the space available with a stretch
        this._resizeMethod = function( screenW, screenH )
        {
          this.pixiRenderer.autoResize = true;
          this.pixiRenderer.resize( screenW, screenH );
          this.pixiRenderer.autoResize = false;
          this.pixiRenderer.resize( this._savedSizes.x, this._savedSizes.y );
        };
      break;
      case "full":
        // resize full = take immediately all the space available in pure pixel
        this._resizeMethod = function( screenW, screenH )
        {
          this.pixiRenderer.autoResize = true;
          this.pixiRenderer.resize( screenW, screenH );
        };
        break;
      // resize and respect the original ratio, but not stretching
      case "ratio":
        this._resizeMethod = function( screenW, screenH )
        {
          this.resizeRatio( screenW, screenH, false );
        };
      break;
      default:
        this._resizeMethod = function(){};
      break;
    }
  };
  
  /****
   * method called when event resize occurs
   * @private
   * @memberOf Render
   */
  Render.prototype._onResize = function()
  {
    var screenW = ( window.innerWidth || document.documentElement.clientWidth );
    var screenH = ( window.innerHeight || document.documentElement.clientHeight );

    var divParentH = window.getComputedStyle( this.div.parentElement, null ).getPropertyValue( 'height' );
    if ( this.div.parentElement != null
        && divParentH && screenH < document.body.clientHeight ) {
      var divW = this.div.parentElement.innerWidth || this.div.parentElement.clientWidth;
      var divH = this.div.parentElement.innerHeight || this.div.parentElement.clientHeight;

      if ( divH < screenH ) {
        screenH = divH;
      }
      if ( divW < screenW ) {
        screenW = divW;
      }
    }

    if ( !this._resizeMethod ) {
      throw ( "Render.js : _onResize need a _resizeMethod, maybe changeResizeMode has never been called" );
    }

    this._resizeMethod( screenW, screenH );
  };
  
  /**
   * bind window resize event if wanted
   * @private
   * @memberOf Render
   */
  Render.prototype._bindResizeEvent = function()
  {
    if ( !this._resizeMode || this._listeningResize ) {
      return;
    }
      
    this._listeningResize = true;
    var self       = this;
    var lastResize = undefined;
    var callback   = function() { self._onResize(); };
    
    if ( window.addEventListener ) {
      window.addEventListener( "resize", function()
      {
        lastResize && window.clearTimeout( lastResize );
        lastResize = window.setTimeout( callback, 50 );
      }, false ); 
    }
    else if ( window.attachEvent ) {
      window.attachEvent( "onresize", function()
      {
        lastResize && window.clearTimeout( lastResize );
        lastResize = window.setTimeout( callback, 50 ); 
      } );
    }
  };
  
  /**
   * render all cameras binded on this Render (called by MainLoop)
   * @private
   * @memberOf Render
   */
  Render.prototype.render = function()
  {
    if ( config.DEBUG_LEVEL ) {
      
      if ( config.DEBUG_LEVEL == "FPS_ONLY" ) {
        this.debugRender.text = "FPS: " + Time.FPS;
      }
      else {
        this.debugRender.text = "DeltaTime: " + Time.deltaTime + "\nscaleDelta: " + Time.scaleDelta + " - FPS: " + Time.fps
          + "\nPIXI: DeltaTime: " + PIXI.time.deltaTime + "\nspeed: " + PIXI.time.speed + " - FPS: " + PIXI.time.FPS
      }
    }
    
    for ( var i = 0, c = this.mainContainer.children.length; i < c; ++i )
    {
      if ( this.mainContainer.children[ i ].renderUpdate ) {
        this.mainContainer.children[ i ].renderUpdate( this._qualityRatio );
      }
    }
    
    this.pixiRenderer.render( this.mainContainer );
    
    for ( var i = 0, c = this.mainContainer.children.length; i < c; ++i )
    {
      if ( this.mainContainer.children[ i ].afterUpdate ) {
        this.mainContainer.children[ i ].afterUpdate( this._qualityRatio );
      }
    }
  };
  
  /**
   * render the given content in this render
   * it's called by the MainLoop when displayLoader is true
   * it can be used in other situation ?
   * @private
   * @memberOf Render
   */
  Render.prototype.directRender = function( container )
  {
    this.pixiRenderer.render( container );
  };

  /**
   * add a container to this render
   * You can add a Scene (if you don't need z perspective) or a Camera or a native PIXI.Container
   * @public
   * @memberOf Render
   */
  Render.prototype.add = function( container )
  {
    this.mainContainer.addChild( container );
    // TODO need ? this.scenes.push( scene );
    
    return this;
  };
  
  Render.prototype.DEName = "Render";
  return Render;
} );