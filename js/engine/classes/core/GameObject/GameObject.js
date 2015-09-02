/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor GameObject
 * @class The core of the engine, all is based on GameObjects
 * They can get renderers, collider (can add more than one but not in an array)
 * You can make groups by adding a GameObject to an other (no recursive limit but be prudent with that,
 * I tried a 5 levels hierarchy and this work perfectly, but you shouldn't have to make a lot)
 * @param {object} params - All parameters are optional
 * @author Inateno
 * @example // the most simple example
 * var ship = new DE.GameObject();
 * @example // with positions
 * var ship = new DE.GameObject( { "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player" } );
 * @example // a complete GameObject with a sprite and a CircleCollider
 * var ship = new DE.GameObject( {
 *   "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player"
 *   ,"renderers": [ new DE.SpriteRenderer( { "spriteName": "ship", "offsetY": 100 } ) ]
 *   ,"collider": new DE.CircleCollider( 60, { "offsetY": 50 } )
 * } );
 * @property {String} [id="0-999999999"] the gameObject id
 * @property {String} [name="noname"] use name to detect precise type (example player)
 * @property {String} [tag="none"] use tags for quick type recognition (example characters)
 * @property {GameObject} [parent=null] if you want to set it a parent on creation
 * @property {Array-GameObject} [gameObjects=[]] if you want to give childs on creation
 * @property {Vector2} [position] if you give a Vector2, this have to be Vector2 class not a nested object
 * @property {Float} [x=0] x position
 * @property {Float} [y=0] y position
 * @property {Float} [z=0] z position
 * @property {Int} [zindex=0] zindex to order the same z axis objects
 * @property {Renderer} [renderer] give a renderer
 * @property {Array-Renderer} [renderers] give some renderers
 * @property {Collider} [collider]
 * @property {RigidBody} [rigidbody] work in progress
 */
define( [ 'PIXI', 'DE.GameObject.update', 'DE.Vector2', 'DE.CONFIG', 'DE.COLORS', 'DE.Event', 'DE.Time' ],
function( PIXI, update, Vector2, CONFIG, COLORS, Event, Time )
{
  var PI = Math.PI;
  function GameObject( params )
  {
    PIXI.Container.call( this );
    
    params    = params || {};
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Vector2}
     */
    this.position = new Vector2( params.x || 0, params.y || 0, params.z || 0 );
    this.position.gameObject = this;
    this.savedPosition = new Vector2( params.x || 0, params.y || 0, params.z || 0 );
    
    /**
     * @public
     * store real scale
     * @memberOf GameObject
     * @type {PIXI.Point}
     */
    this.worldScale = new PIXI.Point( 1, 1 );
    
    /**
     * @private
     * used to prevent call on function undefined in Camera
     * @memberOf GameObject
     * @type {Boolean}
     */
    this._isGameObject = true;
    
    /**
     * @private
     * create a scale depend on z axis (to simulate object is far)
     * @memberOf GameObject
     * @type {Int}
     */
    this._zscale = 1;
    
    /**
     * @public
     * save the scale before z applies
     * @memberOf GameObject
     * @type {PIXI.Point}
     */
    this.savedScale = new PIXI.Point( 1, 1 );
    
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.id      = params.id !== undefined ? params.id : Math.random() * 999999999 >> 0;
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.name    = params.name;
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.tag     = params.tag;
    
    /**
     * @public
     * if false, object will stop being updated
     * see visible from PIXI to prevent render
     * @memberOf GameObject
     * @type {Boolean}
     */
    this.updatable = true;
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Scene}
     */
    this.scene   = null;
    /**
     * @private
     * @memberOf GameObject
     * @type {Object}
     */
    this.killArgs= {};
    
    /**
     * @public
     * @memberOf GameObject
     * @type {GameObject}
     */
    this.parent = params.parent || undefined;
    
    /**
     * @public
     * @memberOf GameObject
     * @type {Int}
     */
    this._zindex = params.zindex || 0;
    
    /**
     * set true will automatically change cursor to pointer on over, and remove it on not over
     * the GameObject must have a collider
     * @public
     * @memberOf GameObject
     * @type {Bool}
     */
    this.cursorOnOver = params.cursorOnOver || false;
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Array-GameObject}
     */
    this.gameObjects = params.gameObjects || new Array();
    
    /**
     * @private
     * @memberOf GameObject
     * @type {Object}
     */
    this.automatism = {};
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {String}
     */
    this.flag = null;
    
    /**
     * register which cursor is over (used to fire Enter and Leave events)
     * @protected
     * @memberOf GameObject
     * @type {Array}
     */
    this.indexMouseOver = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    
    /**
     * register if moved, can be used for collisions, advanced buffers
     * @protected
     * @memberOf GameObject
     * @type {Boolean}
     */
    this.isMoved = false;
    
    /**
     * quick access to renderers[ 0 ] (in 90% of cases we use the one renderer)
     * @protected
     * @memberOf GameObject
     * @type {Renderer}
     */
    this.renderer = undefined;
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Array-Renderer}
     */
    this.renderers  = new Array();
    if ( params.renderers && params.renderers.length > 0 )
    {
      for ( var i = 0, r; r = params.renderers[ i ]; ++i )
        this.addRenderer( r );
    }
    if ( params.renderer )
      this.addRenderer( params.renderer );
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Collider}
     */
    this.collider = null;
    if ( params.collider )
      this.setCollider( params.collider );
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {RigidBody}
     */
    this.rigidbody  = params.rigidbody || undefined;
    if ( this.rigidbody && this.rigidbody.gameObject != this )
      this.rigidbody.gameObject = this;
    
    /**
     * object used to apply shake
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this.shakeData = {
      "done": true
      ,"prevX": 0
      ,"prevY": 0
    };
    
    /**
     * object used to apply move translation
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this.moveData = {
      "done": true
    };
    
    /**
     * object used to apply fade transition
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this.fadeData = {
      "from"     : 1
      ,"to"      : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    /**
     * object used to apply scale transition
     * @protected
     * @memberOf GameObject
     * @type {Object}
     */
    this.scaleData = {
      "fromx"    : 1
      ,"tox"     : 0
      ,"fromy"   : 1
      ,"toy"     : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    this._updateZScale();
    if ( params.create )
    {
      for ( var i in params.create )
        if ( !this[ i ] )
          this[ i ] = params.create[ i ];
    }
    // Event.addEventComponents( this );
  };
  
  GameObject.prototype = Object.create( PIXI.Container.prototype );
  GameObject.prototype.constructor = GameObject;
  
  // GameObject.prototype.position = new Vector2();
  
  /*
  // z scale
    this.zscale = { _x: 0, _y : 0 };//new PIXI.Point( 1, 1 );
    Object.defineProperties( this.zscale,  )
  */
  
  Object.defineProperties( GameObject.prototype, {
    /**
     * @public
     * if false, object will stop being rendered and stop being updated
     * @memberOf GameObject
     * @type {Boolean}
     */
    enable: {
      get: function()
      {
        return this.updatable && this.visible;
      }
      , set: function( value )
      {
        this.updatable  = value;
        this.renderable = value;
        this.visible    = value;
      }
    }
    
    /**
     * @public
     * quick access to z attribute
     * @memberOf GameObject
     * @type {Float}
     */
    , z: {
      get: function()
      {
        return this.position._z;
      }
      , set: function( value )
      {
        this.position._z = value;
        this._updateZScale();
        if ( this.parent && this.parent._isGameObject )
          this.parent.sortChildren();
      }
    }
    
    /***
     * @public
     * overwrite from PIXI rotation to bind this inside the Vector2
     * better when using .rotate using deltaTime
     * @memberOf GameObject
     * @type {Float}
     */
    , rotation: {
      get: function()
      {
        return this.position.rotation;
      }
      , set: function( value )
      {
        this.position.setRotation( value );
      }
    }
    
    /***
     * @public
     * scale the object calling update on scale (for z deformation)
     * use this instead .scale.x
     * @memberOf GameObject
     * @type {Float}
     */
    , scaleX: {
      get: function()
      {
        return this.savedScale.x;
      }
      , set: function( value )
      {
        this.scale.x = value;
        this._updateScale();
      }
    }
    
    /***
     * @public
     * scale the object calling update on scale (for z deformation)
     * use this instead .scale.y
     * @memberOf GameObject
     * @type {Float}
     */
    , scaleY: {
      get: function()
      {
        return this.savedScale.y;
      }
      , set: function( value )
      {
        this.scale.y = value;
        this._updateScale();
      }
    }
    
    /***
     * @public
     * Quick access to get real z
     * @memberOf GameObject
     * @type {Float}
     */
    , realZ: {
      get: function()
      {
        if ( this.parent && this.parent._isGameObject )
          return this.position.z + this.parent.realZ;
        return this.position.z;
      }
    }
  } );
  
  /***
   * when z change we restore scale, then change it again to final values
   * @public
   * @memberOf GameObject
   * @param {Int} x scale x value, can be an object with x-y inside
   * @param {Int} y scale y value
   * @example // precise way
   * myObject.setScale( 1, 1 );
   * // with object
   * myObject.setScale( otherObject.scale );
   * // fast way
   * myObject.setScale( 2 );
   */
  GameObject.prototype.setScale = function( x, y )
  {
    if ( x.x )
    {
      this.scale.x = x.x;
      this.scale.y = x.y;
    }
    else
    {
      this.scale.x = x;
      this.scale.y = x;
      if ( y !== undefined )
        this.scale.y = y;
    }
    this._updateScale();
  };
  
  /***
   * when rotation change if debug and fixed box collider inside, update the prevent rotation to get it on good orientation
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateRotation = function()
  {
    if ( CONFIG.DEBUG_LEVEL > 1 )
    {
      if ( this.collider && this.collider.debugRender
        && this.collider.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
        this.collider.debugRender.rotation = -this.getRotation() || 0;
      
      for ( var i = 0; i < this.gameObjects.length; ++i )
        this.gameObjects[ i ]._updateRotation();
    }
  };
  
  /***
   * when z change we restore scale, then change it again to final values
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateZScale = function()
  {
    // first come back to true scale
    this.scale.x = this.scale.x / this._zscale;
    this.scale.y = this.scale.y / this._zscale;
    // and store savedScale
    this.savedScale.copy( this.scale );
    
    // this come from old Camera render (working fine as excepted...)
    // camera was set to z -10 as default => 10 / ( 0 - - 10 ) = 1
    var zscale = ( 10 / ( this.position.z - -10 ) );
    this._zscale = zscale;
    
    this.scale.x = zscale * this.scale.x;
    this.scale.y = zscale * this.scale.y;
    
    // update worldScale
    this._updateWorldScale();
    for ( var i = 0; i < this.gameObjects.length; ++i )
      this.gameObjects[ i ]._updateWorldScale();
  };
  
  /***
   * when we change the scale manually, we need to re-apply z deformation
   * directly save the old scale before zscale applies
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateScale = function()
  {
    this.savedScale.copy( this.scale );
    this.scale.x = this._zscale * this.scale.x;
    this.scale.y = this._zscale * this.scale.y;
    
    // PIXI update worldScale
    this._updateWorldScale();
    for ( var i = 0; i < this.gameObjects.length; ++i )
      this.gameObjects[ i ]._updateWorldScale();
  };
  GameObject.prototype._updateWorldScale = function( parentWorldScale )
  {
    this.worldScale.set( this.scale.x, this.scale.y );
    if ( !this.parent || !this.parent._isGameObject )
      return;
    
    this.worldScale.x = this.worldScale.x * this.parent.worldScale.x;
    this.worldScale.y = this.worldScale.y * this.parent.worldScale.y;
  };
  
  /**
   * create a gizmo useful for debug renderer and see all gameObjects
   * this method is called when object is added in a scene or into an other GameObject
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._createDebugRender = function()
  {
    this.debugRender = new PIXI.Graphics();
    this.debugRender.position.x = -1;
    this.debugRender.position.y = -1;
    this.debugRender.zindex = 9999999;
    
    this.debugRender.lineStyle( 0 );
    this.debugRender.beginFill( COLORS.DEBUG.X_AXIS, 1 );
    this.debugRender.drawRect( 0, 0, CONFIG.DEFAULT_SIZES.GIZMO.SIZE || 30, CONFIG.DEFAULT_SIZES.GIZMO.WIDTH || 2 );
    this.debugRender.beginFill( COLORS.DEBUG.Y_AXIS, 1 );
    this.debugRender.drawRect( 0, 0, CONFIG.DEFAULT_SIZES.GIZMO.WIDTH || 2, CONFIG.DEFAULT_SIZES.GIZMO.SIZE || 30 );
    
    this.addChild( this.debugRender );
  };
  
  /**
   * create a shake with given range
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Int} xRange max X gameObject will move to shake
   * @param {Int} yRange max Y gameObject will move to shake
   * @param {Int} [duration=500] time duration
   * @example // shake with 10-10 force during 1sec
   * player.shake( 10, 10, 1000 );
   */
  GameObject.prototype.shake = function( xRange, yRange, duration, callback )
  {
    this.shakeData = {
      // "startedAt" : Date.now()
      "duration"  : duration || 500
      ,"xRange"   : xRange
      ,"yRange"   : yRange
      ,"prevX"    : this.shakeData ? this.shakeData.prevX : 0
      ,"prevY"    : this.shakeData ? this.shakeData.prevY : 0
      ,"callback" : callback
    };
  };
  
  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyShake = function()
  {
    if ( this.shakeData.done )
      return;
    
    var shake = this.shakeData;
    // restore previous shake
    this.position.x -= shake.prevX;
    this.position.y -= shake.prevY;
    shake.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    // old way - Date.now() - this.shakeData.startedAt > this.shakeData.duration )
    if ( shake.duration <= 0 )
    {
      if ( shake.callback )
        shake.callback.call( this, shake.callback );
      shake.done = true;
      shake.prevX = 0;
      shake.prevY = 0;
      this.trigger( "shakeEnd" );
      return;
    }
    
    shake.prevX = - ( Math.random() * shake.xRange ) + ( Math.random() * shake.xRange ) >> 0;
    shake.prevY = - ( Math.random() * shake.yRange ) + ( Math.random() * shake.yRange ) >> 0;
    
    this.position.x += shake.prevX;
    this.position.y += shake.prevY;
  };
  
  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object} pos give x, y, and z destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current object context
   * @example // move to 100,100 in 1 second
   * player.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * player.moveTo( bonus.position, 1000, function(){ console.log( this ) } );
   */
  GameObject.prototype.moveTo = function( pos, duration, callback, curveName )
  {
    var myPos = this.position;
    
    this.moveData = {
      "distX"     : - ( myPos.x - ( pos.x !== undefined ? pos.x : myPos.x ) )
      ,"distY"    : - ( myPos.y - ( pos.y !== undefined ? pos.y : myPos.y ) )
      ,"distZ"    : - ( myPos.z - ( pos.z !== undefined ? pos.z : myPos.z ) )
      ,"dirX"     : myPos.x > pos.x ? 1 : -1
      ,"dirY"     : myPos.y > pos.y ? 1 : -1
      ,"dirZ"     : myPos.z > pos.z ? 1 : -1
      ,"duration" : duration || 500
      ,"oDuration": duration || 500
      ,"curveName": curveName || "linear"
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"stepValZ" : 0
      ,"destX"    : pos.x
      ,"destY"    : pos.y
      ,"destZ"    : pos.z
      ,"callback" : callback
    };
    this.moveData.leftX = this.moveData.distX;
    this.moveData.leftY = this.moveData.distY;
    this.moveData.leftZ = this.moveData.distZ;
  };
  
  /**
   * apply the move transition each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyMove = function()
  {
    if ( this.moveData.done )
      return;
    
    var move = this.moveData;
    
    if ( move.distX != 0 )
    {
      move.stepValX = Time.timeSinceLastFrame / move.oDuration * move.distX * Time.scaleDelta;
      move.leftX -= move.stepValX;
      this.position.x += move.stepValX;
    }
    
    if ( move.distY != 0 )
    {
      move.stepValY = Time.timeSinceLastFrame / move.oDuration * move.distY * Time.scaleDelta;
      move.leftY -= move.stepValY * move.dirY; // * dirY because y is inverted
      this.position.y += move.stepValY;
    }
    
    if ( move.distZ != 0 )
    {
      move.stepValZ = Time.timeSinceLastFrame / move.oDuration * move.distZ * Time.scaleDelta;
      move.leftZ -= move.stepValZ * move.dirZ; // * dirZ because z is inverted
      this.position.z += move.stepValZ;
    }
    
    move.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check pos
    if ( move.dirX < 0 && move.leftX < 0 )
      this.position.x += move.leftX;
    else if ( move.dirX > 0 && move.leftX > 0 )
      this.position.x -= move.leftX;
    
    if ( move.dirY < 0 && move.leftY < 0 )
      this.position.y += move.leftY;
    else if ( move.dirY > 0 && move.leftY > 0 )
      this.position.y -= move.leftY;
    
    if ( move.dirZ < 0 && move.leftZ < 0 )
      this.position.z += move.leftZ;
    else if ( move.dirZ > 0 && move.leftZ > 0 )
      this.position.z -= move.leftZ;
    
    if ( move.duration <= 0 )
    {
      this.moveData.done = true;
      this.position.setPosition( move.destX || this.position.x
        , move.destY || this.position.y
        , move.destZ || this.position.z );
      if ( move.callback )
        move.callback.call( this, move.callback );
      
      this.trigger( "moveEnd" );
    }
  };
  
  /**
   * give a target to this gameObject, then it will focus it until you changed or removed it
   * you can lock independent axes, and set offsets
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject is the target to focus on
   * @param {Object} [params] optional parameters, set offsets or lock
   * @example // create a fx for your ship, decal a little on left, and lock y
   * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
   */
  GameObject.prototype.focus = function( gameObject, params )
  {
    params = params || {};
    this.target = gameObject;
    this.focusLock  = params.lock || {};
    this.focusOffset= params.offsets || { x: 0, y: 0 };
  };
  
  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  GameObject.prototype.applyFocus = function()
  {
    if ( !this.target )
      return;
    var pos = this.target.position;
    if ( this.target.getPos )
      pos = this.target.getPos();
    // focus a camera ?
    if ( !pos )
      pos = this.target.sceneContainer;
    
    if ( !this.focusLock.x )
      this.position.x = pos.x + ( this.focusOffset.x || 0 );
    if ( !this.focusLock.y )
      this.position.y = pos.y + ( this.focusOffset.y || 0 );
  };
  
  /**
   * move gameObject with a vector 2
   * @memberOf GameObject
   * @public
   * @param {Vector2} vector2
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   * @example myObject.translate( { "x": 10, "y": 5 }, false );
   */
  GameObject.prototype.translate = function( vector2, absolute )
  {
    absolute = absolute || false;
    this.position.translate( vector2, absolute );
  };
  
  /**
   * move gameObject along x axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  GameObject.prototype.translateX = function( distance, absolute )
  {
    absolute = absolute || false;
    this.translate( { x: distance, y: 0 }, absolute );
  };

  /**
   * move gameObject along y axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  GameObject.prototype.translateY = function( distance, absolute )
  {
    absolute = absolute || false;
    this.translate( { x: 0, y: distance }, absolute );
  };
  
  /**
   * return absolute position - copy from PIXI prototype, is the same but using matrix
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getPos = function()
  {
    // var pos = this.getGlobalPosition(); // PIXI fail and give screen position
    // pos.z = this.realZ;
    // return pos;
    if ( this.parent && this.parent.getPos )
    {
      var pos = this.parent.getPos();
      var harmonics = this.parent.getHarmonics();
      // if ( harmonics.sin == 0 && harmonics.cos == 1 )
      //   return { x: this.position.x + pos.x, y: this.position.y + pos.y, z: this.position.z + pos.z };
      return { x: -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) + pos.x
        , y: -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) + pos.y
        , z: this.realZ
      };
    }
    return { x: this.position.x, y: this.position.y, z: this.position.z };
  };
  // {
  //     var pos = this.parent.getPos();
  //     var harmonics = this.parent.getHarmonics();
  //     // if ( harmonics.sin == 0 && harmonics.cos == 1 )
  //     //   return { x: this.position.x + pos.x, y: this.position.y + pos.y, z: this.position.z + pos.z };
  //     return { x: -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) + pos.x
  //       , y: -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) + pos.y
  //       , z: this.position.z + pos.z
  //     };
  //   }
  //   return { x: this.position.x, y: this.position.y, z: this.position.z };
  // };
  
  GameObject.prototype.setPositionFromAbsolute = function( x, y )
  {
    var pos = this.getGlobalPosition();
    if ( x.x )
    {
      this.position.set( ( x.x + this.x ) - pos.x, ( x.y + this.y ) - pos.y );
      return this;
    }
    this.position.set( ( x + this.x ) - pos.x, ( y + this.y ) - pos.y );
    
    return this;
  };
  
  /**
   * return absolute harmonics (sin, cos)
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getHarmonics = function()
  {
    if ( this.parent && this.parent._isGameObject )
      return this.position.getHarmonics( this.parent.getRotation() );
    
    return this.position.getHarmonics();
  }
  
  /**
   * return the absolute rotation
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getRotation = function()
  {
    if ( this.parent && this.parent._isGameObject )
      return ( this.position.rotation + this.parent.getRotation() ) % ( PI * 2 );
    
    return this.position.rotation % ( PI * 2 );
  };
  
  /**
   * quick access to position.rotate
   * @public
   * @memberOf GameObject
   * @param {Float} angle
   */
  GameObject.prototype.rotate = function( angle )
  {
    this.position.rotate( angle );
  };
  
  /**
   * rotate the GameObject to look at the given 2D position
   * @public
   * @memberOf GameObject
   * @param {Vector2} vector2
   * can be a simple position x-y
   */
  GameObject.prototype.lookAt = function( vector2 )
  {
    if ( this.parent && this.parent._isGameObject )
    {
      var pos = this.getPos();
      this.position.setRotation( -Math.atan2( vector2.x - ( pos.x )
                                , vector2.y - ( pos.y ) ) - ( this.parent.getRotation() ) );
      return;
    }
    this.position.setRotation( -Math.atan2( ( vector2.x - this.position.x ), ( vector2.y - this.position.y ) ) );
  };
  
  /**
   * add all given gameObjects as children's, if you add only one gameObject, call addOne
   * you can call this method with array, single object, or multi arguments objects, look at examples.
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.add( car ); // just one object, you should call addOne instead
   * @example myObject.add( car, car2, car3, banana, turtle ); // using multi arguments
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * myObject.add( myArray ); // then call add with array directly
   * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
   * var myArray2 = [ object4, object5, object6 ]; // declare a second array with object inside as you wish
   * myObject.add( myArray, myArray2 ); // then call add with array and multi arguments
   */
  GameObject.prototype.add = function()
  {
    var args = Array.prototype.slice.call( arguments );
    for ( var i = 0; i < args.length; ++i )
    {
      if ( args[ i ].length !== undefined )
      {
        for ( var o = 0, m = args[ i ].length || 0; o < m; ++o )
          this.addOne( args[ i ][ o ] );
      }
      else
        this.addOne( args[ i ] );
    }
    this.sortChildren();
  };
  
  /**
   * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.addOne( car );
   */
  GameObject.prototype.addOne = function( object )
  {
    if ( !( object instanceof GameObject ) )
    {
      throw new Error( "DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please" );
      return;
    }
    
    if ( object.parent !== undefined )
      object.parent.remove( object ); // remove it from gameObjects, PIXI will auto remove from children
    
    // object.parent = this; // PIXI is already doing it on addChild
    this.gameObjects.push( object );
    
    // TODO - detect if there is renderer or gameObjects inside, push the object inside PIXI.children
    // if ( object.children.length > 0 || CONFIG.DEBUG )
      this.addChild( object );
    
    if ( CONFIG.DEBUG )
        object._createDebugRender();
  };
    
  /**
   * remove a the given child in this GameObject gameObjects
   * @public
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference
   */
  GameObject.prototype.remove = function( object )
  {
    if ( isNaN( object ) )
    {
      var index = this.gameObjects.indexOf( object );
      
      if ( index !== - 1 )
      {
        object.parent = undefined;
        // object.parentPosition = null;
        this.gameObjects.splice( index, 1 );
      }
    }
    else
    {
      object.parent = undefined;
      this.gameObjects.splice( object, 1 );
    }
  };
  
  /**
   * return the object by name
   * @public
   * @memberOf GameObject
   * @param {String} name
   * name of the GameObject
   * @param {Boolean} recursive
   * if you want to look in gameObjects childs
   */
  GameObject.prototype.getObjectByName = function( name, recursive )
  {
    for ( var c = 0, g; g = this.gameObjects[ c ]; c ++ )
    {
      if ( g.name === name )
        return g;
      
      if ( recursive )
      {
        g = g.getObjectByName( name, recursive );
        if ( g !== undefined )
          return g;
      }
    }
    return undefined;
  };
  
  /**
   * bind a global event on the scene
   * use this but be sure to declared target function before
   * @public
   * @memberOf GameObject
   * @param {String} eventType
   * Down, Up, Move, case sensitive
   * @param {Boolean} [isLast]
   * if you want this event have to be called after all other of the same type was
   */
  GameObject.prototype.bindGlobalEvent = function( eventType, isLast )
  {
    if ( !this.scene )
    {
      console.log( "%cCall bindGlobalEvent without adding the object in a scene", "color:red" )
      return;
    }
    this.scene[ "on" + ( isLast ? "Last" : "" ) + "GlobalMouse" + eventType ][ this.id ] = this;
  };
  
  /**
   * sort children by zindex and z<br>
   * engine call this automatically
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.sortChildren = function()
  {
    this.gameObjects.sort( function( a, b )
    {
      if ( b.position.z == a.position.z )
        return a.zindex - b.zindex;
      return b.position.z - a.position.z;
    } );
    this.renderers.sort( function( a, b )
    {
      return a.zindex - b.zindex;
    } );
    this.children = this.renderers.concat( this.gameObjects );
    
    if ( CONFIG.DEBUG )
    {
      if ( this.debugRender )
        this.addChild( this.debugRender );
      if ( this.collider && this.collider.debugRender )
        this.addChild( this.collider.debugRender );
    }
  };
  
  /**
   * add given Renderer to this GameObject and return current GameObject instance
   * @public
   * @memberOf GameObject
   * @param {Renderer} renderer
   * @example myObject.addRenderer( new DE.SpriteRenderer( { "spriteName": "ship" } ) );
   */
  GameObject.prototype.addRenderer = function( renderer, pos )
  {
    if ( !renderer.gameObject && !renderer._isCentered && !renderer.preventCenter ) // if this renderer come from an other GameObject ignore center
    {
      var b = renderer.getBounds();
      if ( b.width )
        renderer.x -= b.width * renderer.scale.x * 0.5;
      if ( b.height )
        renderer.y -= b.height * renderer.scale.y * 0.5;
    }
    renderer.gameObject = this;
    
    if ( pos !== undefined )
    {
      this.renderers.splice( pos, 0, renderer );
      this.addChildAt( renderer, pos );
    }
    else
    {
      this.renderers.push( renderer );
      this.addChild( renderer );
    }
    
    if ( this.renderers.length == 1 )
      this.renderer = renderer;
    
    this.sortChildren();
    return this;
  };
  
  // todo removeRenderer( destroy:bool )
  
  // TODO use primitives from PIXI and CollisionDetection from PIXI ?
  /**
   * set given Collider to this GameObject and return current GameObject instance
   * @public
   * @memberOf GameObject
   * @param {Collider} collider
   * @example myObject.setCollider( new DE.FixedBoxCollider( 100, 200 ) );
   */
  GameObject.prototype.setCollider = function( collider )
  {
    if ( this.collider && this.collider.debugRender )
      this.removeChild( this.collider.debugRender );
    
    collider.gameObject = this;
    this.collider = collider;
    this.hitArea = collider;
    
    if ( CONFIG.DEBUG_LEVEL > 1 )
    {
      collider._createDebugRender();
      collider.debugRender.rotation = -this.getRotation() || 0;
      this.addChild( collider.debugRender );
    }
    return this;
  };
  
  /**
   * delete the object
   * @protected
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference or object index in the gameObjects array
   */
  GameObject.prototype.delete = function( object )
  {
    // if its an index
    if ( this.gameObjects[ object ] )
    {
      this.removeChild( this.gameObjects[ object ] ); // remove from PIXI
      this.gameObjects[ object ].killMePlease();
      delete this.gameObjects[ object ];
      this.gameObjects.splice( object, 1 );
      return;
    }
    var index = this.gameObjects.indexOf( object );
    
    if ( index !== - 1 )
    {
      this.removeChild( this.gameObjects[ object ] ); // remove from PIXI
      object.killMePlease();
      this.gameObjects[ index ] = null;
      this.gameObjects.splice( index, 1 );
      return;
    }
  };
  
  /****
   intern mouse events functions are undefined, have to write your own handler for GameObjects
   the camera trigger the events and give you a mouse attributes that contain
   x, y, pointerId 
  */
  /**
   * onMouse[type] event, override it with the own GameObject's method<br>
   * not used as default<br>
   * mouses events can be triggered only if the current GameObject have a
   * supported Collider (actually, FixedBoxCollider and CircleCollider)<br>
   * here is the full events list (so override with this name) ordered by call order:<br>
   * - onMouseDown<br>
   * - onMouseEnter<br>
   * - onMouseMove<br>
   * - onMouseLeave<br>
   * - onMouseClick<br>
   * - onMouseUp<br>
   * you can stop the propagation to the "Last" events, prevent other types, or kill the current GameObject loop, check examples
   * @public
   * @memberOf GameObject
   * @function
   * @param {MouseEvent} mouse
   * is an engine custom mouse event
   * @config {Int} [x] x position
   * @config {Int} [y] y position
   * @config {Boolean} [isDown] if current cursor is down
   * @config {Int} [index] cursor id (for multi-touch)
   * @param {PropagationEvent} propagation
   * can kill event that append further current event
   * @example // simple event
   * myObject.onMouseDown = function( event, propagation )
   * {
   *   console.log( event, propagation ); // event contain x, y, isDown, index (touchId)
   * };
   * @example // here I want to catch the Click event, but I want to kill the Up and don't want other GameObject can catch events
   * so by returning true and stoping propagation, we kill the event
   * myObject.onMouseClick = function( event, propagation )
   * {
   *   // do stuff here
   *   event.stopPropagation = true; // prevent the camera.onLastMouseClick and all onLastGlobalMouseClick for those who listen Global
   *   return true; // other GameObjects will not handle the event
   * };
   */
  GameObject.prototype.onMouseDown  = undefined;
  GameObject.prototype.onMouseEnter = undefined;
  GameObject.prototype.onMouseMove  = undefined;
  GameObject.prototype.onMouseLeave = undefined;
  GameObject.prototype.onMouseClick = undefined;
  GameObject.prototype.onMouseUp    = undefined;
  
  /**
   * delete the object<br>
   * this is the good way to destroy an object in the scene<br>
   * the object is disable and the mainloop will destroy it at the next frame<br>
   * trigger a kill event with current instance, and call onKill method if provided
   * @public
   * @memberOf GameObject
   * @param {Object} [params]
   * @property {Boolean} [preventEvents] will prevent all kill events
   * @property {Boolean} [preventKillEvent] will prevent the kill event
   * @property {Boolean} [preventKilledEvent] will prevent the killed event
   * if you provide preventEvents, all kill events will be prevented
   * @example myObject.askToKill();
   * @example myObject.askToKill( { preventEvents: true } );
   */
  GameObject.prototype.askToKill = function( params )
  {
    this.target = null;
    if ( this.scene )
      this.scene.cleanObjectBinding( this );
    
    this.killArgs = params || {};
    if ( !this.killArgs.preventEvents && !this.killArgs.preventKillEvent )
    {
      if ( this.onKill )
        this.onKill();
      this.trigger( "kill", this );
    }
    if ( this.parent && this.parent._isGameObject )
    {
      this.parent.delete( this );
      return;
    }
    this.enable   = false;
    this.flag     = "delete";
    
    this.removeAllListeners();
    
    if ( ( this.scene && ( this.scene.enable == false || this.scene.gameObjects.indexOf( this ) == -1 ) ) || !this.scene )
      this.killMePlease();
  };
  
  /**
   * If you want to get an intern method when your object is killed<br>
   * usefull when you make your own GameObjects classes, and don't want to inherit all the "on("kill")" events registered<br>
   * here the list of killed events:<br>
   * - onKill: when you called askToKill<br>
   * - onKilled: when your object is deleted (just before we remove collider and childs, so you can still do actions on)
   * @public
   * @override
   * @memberOf GameObject
   * @function
   * @example myObject.onKill = function(){ console.log( "I'm dead in 16 milliseconds !" ); };
   * @example myObject.onKilled = function(){ console.log( "Ok, now I'm dead" ); };
   * @example myObject.on( "kill", function( currentObject ){ console.log( "I'm dead in 16 milliseconds !" ); } );
   * @example myObject.on( "killed", function( currentObject ){ console.log( "Ok, now I'm dead" ); } );
   */
  GameObject.prototype.onKill   = undefined;
  GameObject.prototype.onKilled = undefined;
  
  /**
   * this function is called when the mainLoop remove this GameObject (after an askToKill call)<br>
   * you shouldn't call it directly, if you do it, maybe other GameObjects in the current 
   * frame are dealing with this one and should produce errors<br>
   * <b>if you provided to askToKill a preventEvents or a preventKilledEvent this will 
   * not trigger killed event and will not call onKilled method if provided</b>
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.killMePlease = function()
  {
    // delete object and all children in PIXI
    // check if object isn't already destroyed and there is children inside 'cause PIXI don't do it
    // and prevent crash (if user ask multiple destroy)
    this.target = null;
    if ( !this.children )
      this.children = [];
    
    // remove children with texture (DE renderers or direct PIXI renderers)
    // all container must be inside "gameObjects"
    for ( var i = 0; i < this.children.length; ++i )
    {
      if ( this.children[ i ].texture )
        this.children[ i ].destroy();
    }
    
    this.enable = false;
    if ( !this.killArgs.preventEvents && !this.killArgs.preventKilledEvent )
    {
      if ( this.onKilled )
        this.onKilled();
      this.trigger( "killed", this );
    }
    
    delete this.renderer;
    for ( var i = 0; i < this.renderers.length; ++i )
    {
      delete this.renderers[ i ];
      this.renderers.splice( i, 1 );
    }
    delete this.collider;
    
    for ( i = 0; i < this.gameObjects.length; ++i )
    {
      this.gameObjects[ i ].killMePlease();
      delete this.gameObjects[ i ];
      this.gameObjects.splice( i, 1 );
    }
    this.destroy();
  };
  
  /****
   * default update method, you can override it if you want but it's not recommended<br>
   * prefer use custom addAutomatism who give you a better control/dry
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype.update = update;
  
  /**
   * This provide you a way to make your custom update / logic<br>
   * You have to set a name on your automatism (to be able to remove it/change it later)
   * if you provide a name already used you automatism will be overred<br>
   * - if you set an interval, this automatism will be called each MS given<br>
   * - if you set persistent to false, it will be removed after the first call<br>
   *<b>This method call only a protected/public method member of your GameObject</b>
   * @public
   * @memberOf GameObject
   * @param {String} id unique id to be able to remove it later
   * @param {String} methodName the method to call each time
   * @param {Object} [params] parameters see below
   * @property {Int} [interval] delay between 2 calls
   * @property {Boolean} [persistent] if false, your automatism will be called only once
   * @property {Undefined} [value1] you can provide a first value
   * @property {undefined} [value2] you can provide a second value
   * if you provide preventEvents, all kill events will be prevented
   * @example
   * // this will call myObject.gameLogic() each updates
   * myObject.addAutomatism( "logic", "gameLogic" );
   * @example
   * // this will call myObject.checkInputs() each 500ms
   * myObject.addAutomatism( "inputs", "checkInputs", { "interval": 500 } );
   * @example
   * // this will call myObject.askToKill() in 2.5 seconds
   * // with parameters preventsEvents = true and will remove itself after
   * myObject.addAutomatism( "killMeLater", "askToKill", {
   *   "interval": 2500
   *   , "value1": { preventEvents: true } // we want prevent the kills events fired when die
   *   , "persistent": false
   * } );
  */
  GameObject.prototype.addAutomatism = function( id, methodName, params )
  {
    params = params || {};
    // if using the old way - TODO - remove it on version 0.2.0
    if ( methodName.type )
    {
      console.error( "You use the old way to call addAutomatism, check the doc please" );
      params = methodName;
      methodName = params.type;
    }
    if ( !this[ methodName ] )
    {
      CONFIG.debug.log( "%cCouldn't found the method " + methodName + " in your GameObject prototype", 1, "color:red" );
      return false;
    }
    if ( params.interval )
      params.lastCall = Date.now();
    
    // only 2 vals max, I could allow a value by array
    // and call the method with apply, but it's slower (I have to try and bench the difference)
    // (to see the call go in GameObject.update)
    params.methodName = methodName;
    params.value1 = params.value1 || undefined;
    params.value2 = params.value2 || undefined;
    params.persistent = ( params.persistent != false ) ? true : false;
    this.automatism[ id ] = params;
  };
  
  /**
   * remove the automatism by id (the one you provided on creation)
   * @public
   * @memberOf GameObject
   * @param {String} id automatism id to remove
   * @example
   * myObject.removeAutomatism( "logic" );
   */
  GameObject.prototype.removeAutomatism = function( id )
  {
    if ( !this.automatism[ id ] )
    {
      CONFIG.debug.log( "%c[RemoveAutomatism] Automatism " + id + " not found", 1, "color:orange" );
      return;
    }
    delete this.automatism[ id ];
  };
  
  /**
   * remove all automatisms
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.removeAutomatisms = function()
  {
    for ( var i in this.automatism )
      delete this.automatism[ i ];
  };
  
  // todo check if we need custom event or not
  /****
   * provide Events handler
   * @memberOf GameObject
   * @public
   */
  // Event.addEventCapabilities( GameObject );
  GameObject.prototype.trigger = GameObject.prototype.emit;
  
  /**
   * create a fade from alpha to alpha, with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fade( 0.5, 1, 850 );
   */
  GameObject.prototype.fade = function( from, to, duration, force )
  {
    if ( force )
      this.enable = true;
    var data = {
      from      : from || 1
      ,to       : to != undefined ? to : 0
      ,duration : duration || 500
      ,oDuration: duration || 500
      ,fadeScale: Math.abs( from - to )
      ,done     : false
    };
    data.dir = data.from > to ? -1 : 1;
    this.alpha = from;
    this.fadeData = data;
    
    if ( !this.visible && to > 0 )
      this.visible = true;
  };
  
  /**
   * create a fade from current alpha to given value with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  GameObject.prototype.fadeTo = function( to, duration, force )
  {
    this.fade( this.alpha, to, duration, force );
  };
  
  /**
   * fade to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.fadeOut( 850 );
   */
  GameObject.prototype.fadeOut = function( duration, force )
  {
    if ( force )
    {
      this.enable = true;
      this.alpha = 1;
    }
    this.fade( this.alpha, 0, duration, force );
  };
  
  /**
   * fade to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0
   * @example // alpha = 1 in 850ms
   * myObject.fadeIn( 850 );
   */
  GameObject.prototype.fadeIn = function( duration, force )
  {
    if ( force )
    {
      this.enable = true;
      this.alpha = 0;
    }
    this.fade( this.alpha, 1, duration, force );
    
  };
  
  /**
   * apply the current fade
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyFade = function()
  {
    if ( !this.fadeData.done )
    {
      this.fadeData.stepVal = Time.timeSinceLastFrame / this.fadeData.oDuration
                              * this.fadeData.dir * this.fadeData.fadeScale;
      this.alpha += this.fadeData.stepVal * Time.scaleDelta;
      this.fadeData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
      if ( ( this.fadeData.dir < 0 && this.alpha <= this.fadeData.to )
          || ( this.fadeData.dir > 0 && this.alpha >= this.fadeData.to )
          || this.alpha < 0 || this.alpha > 1 )
      {
        this.alpha = this.fadeData.to;
      }
      if ( this.fadeData.duration <= 0 )
      {
        this.fadeData.done = true;
        if ( this.alpha == 1 || this.alpha == 0 )
        {
          if ( this.alpha == 0 )
            this.visible = false;
        }
        this.trigger( "fadeEnd", this );
      }
    }
  };
  
  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myGameObject.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  GameObject.prototype.scaleTo = function( scale, duration )
  {
    var dscale = {
      "x"     : !isNaN( scale ) ? scale : scale.x
      ,"y"    : !isNaN( scale ) ? scale : scale.y
    };
    this.scaleData = {
      "valX"     : - ( this.savedScale.x - ( dscale.x !== undefined ? dscale.x : this.savedScale.x ) )
      ,"valY"    : - ( this.savedScale.y - ( dscale.y !== undefined ? dscale.y : this.savedScale.y ) )
      ,"dirX"     : this.savedScale.x > dscale.x ? 1 : -1
      ,"dirY"     : this.savedScale.y > dscale.y ? 1 : -1
      ,"duration" : duration || 500
      ,"oDuration": duration || 500
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"destX"    : dscale.x
      ,"destY"    : dscale.y
      ,"scaleX"   : this.savedScale.x
      ,"scaleY"   : this.savedScale.y
    };
    this.scaleData.leftX = this.scaleData.valX;
    this.scaleData.leftY = this.scaleData.valY;
  };
  
  /**
   * apply the current scale
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyScale = function()
  {
    if ( this.scaleData.done )
      return;
    
    var scaleD = this.scaleData;
    
    if ( scaleD.valX != 0 )
    {
      scaleD.stepValX = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valX * Time.scaleDelta;
      scaleD.leftX    -= scaleD.stepValX;
      scaleD.scaleX   += scaleD.stepValX;
    }
    
    if ( scaleD.valY != 0 )
    {
      scaleD.stepValY = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valY * Time.scaleDelta;
      scaleD.leftY    -= scaleD.stepValY;
      scaleD.scaleY   += scaleD.stepValY;
    }
    scaleD.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check scale
    if ( scaleD.dirX < 0 && scaleD.leftX < 0 )
      scaleD.scaleX += scaleD.leftX;
    else if ( scaleD.dirX > 0 && scaleD.leftX > 0 )
      scaleD.scaleX -= scaleD.leftX;
    
    if ( scaleD.dirY < 0 && scaleD.leftY < 0 )
      scaleD.scaleY += scaleD.leftY;
    else if ( scaleD.dirY > 0 && scaleD.leftY > 0 )
      scaleD.scaleY -= scaleD.leftY;
    
    this.scale.set( scaleD.scaleX, scaleD.scaleY );
    
    if ( scaleD.duration <= 0 )
    {
      this.scaleData.done = true;
      this.scale.set( scaleD.destX, scaleD.destY );
      this.trigger( "scaleEnd", this );
    }
    this._updateScale();
  };
  
  GameObject.prototype.DEName = "GameObject";
  CONFIG.debug.log( "GameObject loaded", 3 );
  return GameObject;
} );