/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Camera
 * @class a Camera will render a Scene<br>
 * This class is optional but provide some cool stuff.<br>
 * With a Camera you can easily make translation in your Scene or GameObjects focuses, without changing every GameObjects positions (which is painful for logic)<br>
 * You have to append the Camera to a Render and have to give it a scene to look at<br>
 * You can move your camera inside a render as you want<br>
 * Also you can make more than one camera in a Render or looking in a scene, this can be used to create split-screen games<br>
 * For this last features you have to use a mask filter, remember this is a heavy operation and can drop your performances<br>
 * <br><br>
 * example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2) 
 * and maybe override the render method to call custom rendering for mini-map<br>
 * then you got two camera, these two are looking at the same scene, and are in the same Render 
 * your "mini-map" camera is over the first camera
 * <br><br>
 * example2: on a split-screen local multi-player game, you can make one camera by player, with input for each cameras
 * @example Game.camera = new DE.Camera( 1920, 1080, 0, 0, { "name": "mainGame", "backgroundColor": "green" } );
 * @param {Int} width initial width inside the render
 * @param {Int} height initial height inside the render
 * @param {Int} x position in the Render
 * @param {Int} y position in the Render
 * @param {Object} [params] optional parameters
 * @property {String} [name="noname"] name your camera
 * @property {String} [tag="none"] assign tags if it's can be useful for you
 * @property {Scene} [scene=null] you can give a scene on creation, or later
**/
define( [
  'PIXI'
  , 'DE.config'
  , 'DE.ImageManager'
  , 'DE.Time'
  , 'DE.RectRenderer'
  , 'DE.TilingRenderer'
],
function(
  PIXI
  , config
  , ImageManager
  , Time
  , RectRenderer
  , TilingRenderer
)
{
  function Camera( x, y, width, height, params )
  {
    PIXI.Container.call( this );
    
    this.x = x;
    this.y = y;
    this.renderSizes = new PIXI.Point( width, height );
    this.pivot.set( width / 2 >> 0, height / 2 >> 0 );
    
    this.x += this.pivot.x;
    this.y += this.pivot.y;
    
    var _params = params || {};
    
    this.interactive = params.interactive !== undefined ? params.interactive : true;
    
    this.name   = _params.name || "";
    this.id     = "camera_" + Date.now() + "-" + Math.random() * Date.now();
    this._scene = null;
    // this._gui   = _params.gui || undefined;
    
    if ( _params.backgroundImage ) {
      this.background = new TilingRenderer( { backgroundImage: _params.backgroundImage, width: width, height: height } );
      this.background.interactive = false;
      this.background.anchor.set( -0.5 );
      this.addChild( this.background );
    }
    else if ( _params.backgroundColor ) {
      this.background = new RectRenderer( width, height, _params.backgroundColor );
      this.addChild( this.background );
    }
    
    this.scale.set(
      _params.scaleX || _params.scale ? _params.scale.x || _params.scale : 1
      , _params.scaleY || _params.scale ? _params.scale.y || _params.scale : 1
    );
    
    /**
     * allow to set limits on the Camera, useful to block the camera when it reach the end of level scroll
     * @public
     * @memberOf Camera
     */
    this.limits = {
      minX: _params.minX != undefined ? _params.minX : undefined
      ,maxX: _params.maxX != undefined ? _params.maxX : undefined
      ,minY: _params.minY != undefined ? _params.minY : undefined
      ,maxY: _params.maxY != undefined ? _params.maxY : undefined
    };
    
    /**
     * if true, gameObjects positions will be calculated before rendering to simulate a perspective depending on their z value
     * @private
     * @memberOf Camera
     */
    this._usePerspective = _params.usePerspective !== undefined ? _params.usePerspective : true;
    
    this._hasMoved = false;
    this._usePerspectiveCache = true;
    
    if ( _params.scene ) {
      this.scene = _params.scene;
    }
  }
  
  Camera.prototype = Object.create( PIXI.Container.prototype );
  Camera.prototype.constructor = Camera;
  
  Object.defineProperties( Camera.prototype, {
    /**
     * easy way to shutdown a camera rendering
     * NB: shutdown a camera wont prevent scene to update, set your scene to enable = false if you want to kill it too
     * @public
     * @memberOf Camera
     * @type {Boolean}
     */
    enable: {
      get: function()
      {
        return this.renderable && this.visible;
      }
      , set: function( bool )
      {
        this.visible = bool;
        this.renderable = bool;
      }
    }
    
    /**
     * public getter/setter for _usePerspective, if true perspective is calculated before rendering
     * @public
     * @memberOf GameObject
     * @type {Boolean}
     */
    , usePerspective: {
      get: function()
      {
        return this._usePerspective;
      }
      , set: function( bool )
      {
        if ( this._usePerspective ) {
          this.clearPerspective( true );
        }
        
        this._usePerspective = bool;
        return this._usePerspective;
      }
    }
    
    /**
     * Camera is rendering this scene
     * @public
     * @memberOf Camera
     */
    , scene: {
      get: function()
      {
        return this._scene;
      }
      , set: function( scene )
      {
        if ( this._scene ) {
          this.removeChild( this._scene );
        }
        
        this._scene = scene;
        this.addChild( scene );
      }
    }
    
    /**
     * override the PIXI pointer event to add the "local" camera position in 2nd argument
     * you get/set this method as usual, nothing change
     * WARN: the engine give pos in first argument, and original event in second (not like PIXI)
     * @override
     * @public
     * @memberOf Camera
     */
    , pointermove: {
      get: function() { return this._pointermove; }
      , set: function( fn ) { this._customPointerMove = fn; }
    }
    , pointerdown: {
      get: function() { return this._pointerdown; }
      , set: function( fn ) { this._customPointerDown = fn; }
    }
    , pointerup: {
      get: function() { return this._pointerup; }
      , set: function( fn ) { this._customPointerUp = fn; }
    }
    , pointerover: {
      get: function() { return this._pointerover; }
      , set: function( fn ) { this._customPointerOver = fn; }
    }
    , pointerout: {
      get: function() { return this._pointerout; }
      , set: function( fn ) { this._customPointerOut = fn; }
    }
    , pointertap: {
      get: function() { return this._pointertap; }
      , set: function( fn ) { this._customPointerTap = fn; }
    }
    , pointerupoutside: {
      get: function() { return this._pointerupoutsid; }
      , set: function( fn ) { this._customPointerUpOutside = fn; }
    }
  } );
  
  /**
   * handle pointerevents before calling your custom function
   * this method add an argument "pos" which is the pointer event position + local camera position (to retrieve the true position of the event)
   * @private
   * @memberOf Camera
   */
  Camera.prototype._pointerHandler = function( type, event )
  {
    var pos = {
      x : event.data.global.x + ( this.pivot.x - this.x )
      ,y: event.data.global.y + ( this.pivot.y - this.y )
    };
    
    this[ "_customPointer" + type ]( pos, event );
  };
  
  Camera.prototype._pointermove      = function( e ) { this._pointerHandler( "Move", e ); };
  Camera.prototype._pointerdown      = function( e ) { this._pointerHandler( "Down", e ); };
  Camera.prototype._pointerup        = function( e ) { this._pointerHandler( "Up", e ); };
  Camera.prototype._pointerover      = function( e ) { this._pointerHandler( "Over", e ); };
  Camera.prototype._pointerout       = function( e ) { this._pointerHandler( "Out", e ); };
  Camera.prototype._pointertap       = function( e ) { this._pointerHandler( "Tap", e ); };
  Camera.prototype._pointerupoutside = function( e ) { this._pointerHandler( "UpOutside", e ); };
  
  /**
   * your custom method for handling pointer events is _customPointerEventType (where EventType is the Move/Down etc.)
   * you can directly override these functions or just set via "pointerevent" (the setter will do it correctly for you).
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerMove      = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerDown      = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerUp        = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerOver      = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerOut       = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerTap       = function(){};
  /**
   * @private
   * @memberOf Camera
   */
  Camera.prototype._customPointerUpOutside = function(){};
  
  /**
   * this update the lifecycle of the camera, binded on rendering because if a Camera is "off" it doesn't need to be updated
   * @memberOf Camera
   * @protected
   */
  Camera.prototype.renderUpdate = function( qualityRatio )
  {
    this.checkLimits( qualityRatio );
    this.calculatePerspective();
    
    if ( this.background ) {
      this.background.x = -this.x;
      this.background.y = -this.y;
    }
  };
  
  /**
   * this update happen after the Render rendering to restore gameObjects positions (used for calculate things)
   * @memberOf Camera
   * @protected
   */
  Camera.prototype.afterUpdate = function( qualityRatio )
  {
    this.clearPerspective();
  };
  
  /**
   * calculate perspective for each gameObjects
   * @memberOf Camera
   * @protected
   */
  Camera.prototype.calculatePerspective = function()
  {
    if ( !this._usePerspective || !this._scene ) {
      return;
    }
    
    var centerX = this.x;//this.x + this.renderSizes.x * 0.5 >> 0;
    var centerY = this.y;//this.y + this.renderSizes.y * 0.5 >> 0;
    var children = this._scene.children;
    for ( var i = 0, child, rpx, rpy; i < children.length; ++i )
    {
      child = children[ i ];
      child.savedPosition = { x: child.x, y: child.y };
      
      // TODO create a perspective cache to limit updates ?
      // if ( this._usePerspectiveCache && !child._hasMoved && !this._hasMoved ) {
      //   continue;
      // }
      
      if ( child._zscale != 1 ) {
        rpx = child.x + ( ( child.x - centerX ) * -( 1 - child._zscale ) ) >> 0;
        rpy = child.y + ( ( child.y - centerY ) * -( 1 - child._zscale ) ) >> 0;
        
        child.position.set( rpx, rpy );
      }
    }
  };
  
  /**
   * remove the perspective
   * @memberOf Camera
   * @protected
   */
  Camera.prototype.clearPerspective = function()
  {
    if ( !this._usePerspective || !this._scene ) {
      return;
    }
    
    var children = this._scene.children;
    for ( var i = 0, child; i < children.length; ++i )
    {
      child = children[ i ];
      
      // TODO create a perspective cache to limit updates ?
      // if ( child._staticPosition || ( this._usePerspectiveCache && !child._hasMoved && !this._hasMoved ) ) {
      //   continue;
      // }
      
      child.position.set( child.savedPosition.x, child.savedPosition.y );
    }
  };
  
  /**
   * Check camera limits fixed by limits object you set in camera previously.
   * It's useful to setup a world limits, or in a plate-former limit the Y axis (then your camera will stop at the floor, for example)
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.checkLimits = function( qualityRatio )
  {
    var limits = this.limits;
    if ( limits.minX != undefined && this.x < limits.minX * qualityRatio ) {
      this.x = limits.minX * qualityRatio;
    }
    else if ( limits.maxX != undefined && this.x + this.renderSizes.x > limits.maxX * qualityRatio * this.scale.x ) {
      this.x = limits.maxX * qualityRatio * this.scale.x - this.renderSizes.x;
    }
    
    if ( limits.minY != undefined && this.y < limits.minY * qualityRatio ) {
      this.y = limits.minY * qualityRatio;
    }
    else if ( limits.maxY != undefined && this.y + this.renderSizes.y > limits.maxY * qualityRatio * this.scale.y ) {
      this.y = limits.maxY * qualityRatio * this.scale.y - this.renderSizes.y;
    }
  };
  
  // name registered in engine declaration
  Camera.prototype.DEName = "Camera";
  
  return Camera;
} );