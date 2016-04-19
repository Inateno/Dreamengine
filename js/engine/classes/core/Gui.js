/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Gui
 * @class Gui class is used to create a CanvasGui binded on the given camera.
 * It work like a Scene but Gui is binded to the given Camera and all children inside will follow the camera's moves.
 * Gui copy the Sizes of the Camera, but at any moment you can disable it or change alpha only for Gui.
 * <b>Warning:</b> CanvasGui isn't always the best choice. Don't forget DOM is more powerful
 * As example, Gui with children allow you to use dynamics animations, and logics inside your objects like you do to make the game.
 * If you want only simple button with hover and active effect, DOM seems to be a better choice. Try both and choose.
 * so make a CanvasGui if it's easier for you or if you use tricky graphics
 * @example myCamera.gui = new DE.Gui( myCamera );
 * @param {Camera} Camera the parent camera
 */
define( [ 'PIXI', 'DE.CONFIG', 'DE.COLORS', 'DE.Time', 'DE.Event', 'DE.GameObject'
        , 'DE.Mid.gameObjectMouseEvent' ],
function( PIXI, CONFIG, COLORS, Time, Event, GameObject
        , gameObjectMouseEvent )
{
  function Gui( params )
  {
    params = params || {};
    
    PIXI.Container.call( this );
    
    /**
     * @public
     * @memberOf Gui
     * @type {String}
     /
    this.id        = params.id || undefined;
    
    /**
     * you can set an alpha different from the camera's alpha to manage Gui transparency
     * @public
     * @memberOf Gui
     * @type {Boolean}
     /
    this.alpha     = params.alpha || 1;
    
    /**
     * store children
     * @protected
     * @memberOf Gui
     * @type {Array}
     */
    this.gameObjects = this.children = params.children || [];
    
    /**
     * store timers
     * @public
     * @memberOf Gui
     * @type {Array}
     */
    this.timers = new Array();
    
    /**
     * if gui is sleeping, update will be ignored
     * @public
     * @memberOf Gui
     * @type {Boolean}
     */
    this.enable = true;
    
    /**
     * store global events, exist for Down, Move, Up and Click with all versions of Last
     * @private
     * @memberOf Gui
     * @type {Object}
     */
    this.onGlobalMouseDown      = {};
    this.onLastGlobalMouseDown  = {};
    this.onGlobalMouseMove      = {};
    this.onLastGlobalMouseMove  = {};
    this.onGlobalMouseUp        = {};
    this.onLastGlobalMouseUp    = {};
    this.onGlobalMouseClick     = {};
    this.onLastGlobalMouseClick = {};
    
    /**
     * gui update
     * @protected
     * @memberOf Gui
     */
    this.update = function()
    {
      if ( !this.enable )
        return;
      for ( var i = 0, t = this.children.length, g; i < t; ++i )
      {
        g = this.children[ i ];
        if ( !g )
          continue;
        if ( g.flag !== null )
        {
          switch( g.flag )
          {
            case "delete":
              this.delete( i );
              --t;
              continue;
              break;
          }
        }
        g.update( Time.currentTime );
      }
      
      for ( var i = 0, t = this.timers.length; i < t; ++tk )
        this.timers[ i ].update();
      
      if ( this.waitSortchildren )
        this.sortchildren();
    };
    
    /**
     * add all given children inside the gui, if you add only one gameObject, call addOne
     * you can call this method with array, single object, or multi arguments objects, look at examples.
     * @public
     * @memberOf Gui
     * @param {GameObject} gameObject gameObject to add
     * @example myCamera.gui.add( button ); // just one object, you should call addOne instead
     * @example myCamera.gui.add( button, jauge, list, banana, turtle ); // using multi arguments
     * @example var myArray = [ button1, button2, button3 ]; // declare an array with object inside as you wish
     * myCamera.gui.add( myArray ); // then call add with array directly
     * @example var myArray = [ button1, button2, button3 ]; // declare an array with object inside as you wish
     * var myArray2 = [ button4, button5, button6 ]; // declare a second array with object inside as you wish
     * myCamera.gui.add( myArray, myArray2 ); // then call add with array and multi arguments
     */
    this.add = function( gameObject )
    {
      var args = Array.prototype.slice.call( arguments );
      for ( var i = 0; i < args.length; ++i )
      {
        if ( args[ i ].length )
        {
          for ( var o = 0, m = args[ i ].length || 1; o < m; ++o )
            this.addOne( args[ i ][ o ] );
        }
        else
          this.addOne( args[ i ] );
      }
    };
    
    /**
     * add one gameObject inside the gui, call this one if you have only 1 gameObject to add, it's faster
     * @public
     * @memberOf Gui
     * @param {GameObject} gameObject gameObject to add
     * @example myCamera.gui.addOne( button );
     */
    this.addOne = function( gameObject )
    {
      if ( !( gameObject instanceof GameObject ) )
      {
        CONFIG.debug.log( "%cIt's not or not herits from a children", 1, "color:red" );
        return;
      }
      gameObject.scene = this;
      this.addChild( gameObject );
      
      ++this.maxObjects;
      this.waitSortchildren = true;
    };
    
    /**
     * sort children in the Gui along using z-index, or from lower to higher x
     * @protected
     * @memberOf Gui
     */
    this.sortchildren = function()
    {
      this.children.sort( function( a, b )
      {
        if ( b.zindex == a.zindex )
          return b.position.x - a.position.x;
        else
          return a.zindex - b.zindex;
      } );
      
      for ( var i = 0, go; go = this.children[ i ]; ++i )
        go.sortChildren();
      
      this.waitSortchildren = false;
    };
    
    this.trigger = this.emit; // copy emit reference
    // Event.addEventComponents( this );
  }
  
  Gui.prototype = Object.create( PIXI.Container.prototype );
  Gui.prototype.constructor = Gui;
  Object.defineProperties( Gui.prototype, {
  } );
  // Event.addEventCapabilities( Gui );
  
  /**
   * Look at Camera events, it's the same
   * @public
   * @memberOf Gui
   */
  Gui.prototype.onMouseDown  = function(){};
  Gui.prototype.onMouseMove  = function(){};
  Gui.prototype.onMouseUp    = function(){};
  Gui.prototype.onMouseClick = function(){};
  Gui.prototype.onLastMouseMove  = function(){};
  Gui.prototype.onLastMouseDown  = function(){};
  Gui.prototype.onLastMouseUp    = function(){};
  Gui.prototype.onLastMouseClick = function(){};
  
  Gui.prototype.oOnMouseDown = function( mouse, propagation )
  {
    return this.mainMouseHandler( "Down", mouse, propagation );
  };
  Gui.prototype.oOnMouseMove = function( mouse, propagation )
  {
    return this.mainMouseHandler( "Move", mouse, propagation );
  };
  Gui.prototype.oOnMouseClick = function( mouse, propagation )
  {
    return this.mainMouseHandler( "Click", mouse, propagation );
  };
  Gui.prototype.oOnMouseUp = function( mouse, propagation )
  {
    return this.mainMouseHandler( "Up", mouse, propagation );
  };
  Gui.prototype.oOnLastMouse = function( eventType, mouse, propagation )
  {
    this[ 'onLastMouse' + eventType ]( mouse, propagation );
    for ( var i in this[ "onLastGlobalMouse" + eventType ] )
    {
      if ( this[ "onLastGlobalMouse" + eventType ][ i ].enable )
        this[ "onLastGlobalMouse" + eventType ][ i ][ "onLastGlobalMouse" + eventType ]( mouse, propagation );
    }
  };
  
  Gui.prototype.mainMouseHandler = function( eventType, mouse, propagation )
  {
    if ( this[ 'onMouse' + eventType ]( mouse, propagation ) )
      return true;
    
    for ( var i in this[ "onGlobalMouse" + eventType ] )
    {
      if ( this[ "onGlobalMouse" + eventType ][ i ].enable )
        if ( this[ "onGlobalMouse" + eventType ][ i ][ "onGlobalMouse" + eventType ]( mouse, propagation ) )
          return true;
    }
    
    if ( !mouse.stopPropagation )
    {
      for ( var i = this.children.length - 1, g; g = this.children[ i ]; --i )
        if ( gameObjectMouseEvent( eventType, g, mouse, mouse, propagation ) )
          return true;
    }
  };
  
  /**
   * remove global events binded
   * @memberOf Gui
   * @protected
   * @param {GameObject} object
   */
  Gui.prototype.cleanObjectBinding = function( object )
  {
    delete this.onGlobalMouseDown[ object.id ];
    delete this.onLastGlobalMouseDown[ object.id ];
    delete this.onGlobalMouseMove[ object.id ];
    delete this.onLastGlobalMouseMove[ object.id ];
    delete this.onGlobalMouseUp[ object.id ];
    delete this.onLastGlobalMouseUp[ object.id ];
  };
  
  /**
   * Remove an object on this gui (it is not deleted !).
   * @public
   * @memberOf Gui
   * @param {GameObject} object can be the index of the GameObject in the children array
   */
  Gui.prototype.remove = function( object )
  {
    if ( this.children[ object ] )
    {
      this.cleanObjectBinding( this.children[ object ] );
      this.removeChildAt( object );
    }
    else
    {
      var pos = this.children.indexOf( object );
      if ( pos == -1 )
      {
        CONFIG.debug.log( "%cRemove gameObject not found", 1, "color:orange", object );
        return;
      }
      this.cleanObjectBinding( this.children[ pos ] );
      this.removeChildAt( pos );
    }
    this.maxObjects--;
  };
  
  /**
   * Delete and remove an object in the gui.<br>
   * You should prefer askToKill GameObject's method because it's safer (if you know what you do go crazy).
   * @public
   * @memberOf Gui
   * @param {GameObject} object can be the index of the GameObject in the children array
   */
  Gui.prototype.delete = function( object )
  {
    // if its an index
    if ( this.children[ object ] )
      this.children[ object ].killMePlease();
    else
      object.killMePlease();
    this.remove( object );
  };
  
  /**
   * Delete and remove all children in the gui.
   * @public
   * @memberOf Gui
   */
  Gui.prototype.deleteAll = function()
  {
    var objs = this.children;
    while ( objs.length > 0 )
      this.delete( 0 );
    this.maxObjects = 0;
  };
  
  Gui.prototype.DEName = "Gui";
  
  CONFIG.debug.log( "Gui loaded", 3 );
  return Gui
} );