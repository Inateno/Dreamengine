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
],
function(
  PIXI
  , config
  , Time
  , MainLoop
)
{
  function Render( id, params )
  {
    var _params = params || {};
    
    /**
     * the PIXI Renderer
     * @public
     * @memberOf Render
     * @type {PIXI.Renderer}
     */
    this.pixiRenderer = new PIXI.autoDetectRenderer(
      _params.width, _params.height
      , {
        antialias              : _params[ "antialias" ] || false
        , transparent          : _params[ "transparent" ] || false
        , resolution           : _params[ "resolution" ] || 1
        , preserveDrawingBuffer: _params[ "preserveDrawingBuffer" ] || false
        , backgroundColor      : _params[ "backgroundColor" ] || 0x000000
        , clearBeforeRender    : _params[ "clearBeforeRender" ] || true
        , roundPixels          : _params[ "roundPixels" ] || false
        , forceFXAA            : _params[ "forceFXAA" ] || false
        , legacy               : _params[ "legacy" ] || false
        , powerPreference      : _params[ "powerPreference" ] || "" //"high-performance" only for "gamers setup"
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
      fontSize       : 12,
      fontFamily     : '"Lucida Console", Monaco, monospace',
      strokeThickness: 2
    } ) );
    this.debugRender.y = 10;
    this.debugRender.x = 10;
    
    this.id = "render-" + Date.now() + "-" + ( Math.random() * Date.now() >> 0 );
    this.divId = id || undefined;
    
    this.enable = true; // set to false to prevent render and update
    this.freeze = false; // set to true to prevent update but keep render
  }

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
    // TODO Inputs.addRender( this );
    /* TODO
    this.updateSizes();

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
    */
  };

  /**
   * render all cameras binded on this Render (called by MainLoop)
   * @private
   * @memberOf Render
   */
  Render.prototype.render = function()
  {
    if ( config.DEBUG_LEVEL )
    {
      this.mainContainer.addChild( this.debugRender );
      
      if ( config.DEBUG_LEVEL == "FPS_ONLY" ) {
        this.debugRender.text = "FPS: " + Time.FPS;
      }
      else {
        this.debugRender.text = "DeltaTime: " + Time.deltaTime + "\nscaleDelta: " + Time.scaleDelta + " - FPS: " + Time.fps
          + "\nPIXI: DeltaTime: " + PIXI.time.deltaTime + "\nspeed: " + PIXI.time.speed + " - FPS: " + PIXI.time.FPS
      }
    }
    
    this.pixiRenderer.render( this.mainContainer );
  };

  /**
   * add a scene on this render
   * @public
   * @memberOf Render
   */
  Render.prototype.add = function( scene )
  {
    this.mainContainer.addChild( scene );
    // TODO need ? this.scenes.push( scene );
    
    return this;
  };
  
  Render.prototype.DEName = "Render";
  return Render;
} );