/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Camera
 * @class the eyes used to see in your scenes :)<br>
 * you have to append it to a Render and have to give it a scene to look at<br>
 * you can move your camera inside a render as you want<br>
 * also you can make more than one camera in a Render or looking in a scene<br>
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
define( [ 'PIXI', 'DE.CONFIG', 'DE.Vector2', 'DE.Mid.gameObjectMouseEvent'
        , 'DE.ImageManager', 'DE.Event', 'DE.Time' ],
function( PIXI, CONFIG, Vector2, gameObjectMouseEvent
        , ImageManager, Event, Time )
{
  // Camera is a PIXI container append in the render, it had an other container for scene
  function Camera( width, height, x, y, params )
  {
    PIXI.Container.call( this );
    
    this.trigger = this.emit; // keep trigger for the engine, let emit for socket don't use it
    
    params = params || {};
    
    this.name   = params.name || "";
    this.id     = "camera_" + Date.now() + "-" + Math.random() * Date.now();
    this.tag    = params.tag || "";
    this._scene = params.scene || null;
    this._gui   = params.gui || undefined;
    
    this.needUpdateVisible = true;
    this.updatable = true;
    
    this.position.set( x, y );
    
    if ( params.backgroundImage )
    {
      this.background = new PIXI.extras.TilingSprite( PIXI.utils.TextureCache[ PIXI.loader.resources[ params.backgroundImage ].url ], width, height );
      this.addChild( this.background );
    }
    
    // look at the end of this file for the SceneContainer
    this.sceneContainer = new SceneContainer();
    this.addChild( this.sceneContainer );
    this.sceneContainer.pos = {
      x: params.realX || params.sceneX || 0
      ,y: params.realY || params.sceneY || 0
      ,z: params.realZ || params.sceneZ || 0
    };
    this.scenePosition = this.sceneContainer.pos; // copy reference to improve compatibilities with old games
    this.sceneContainer.id = this.id;
    
    this.renderSizes = new PIXI.Point( width, height );
    this.fieldSizes  = this.renderSizes; // copy reference to improve compatibilities with old games
    this.scale.set( params.scale || params.scaleX || 1, params.scale || params.scaleY || 1 ) ;
    this.renderScale = this.scale; // copy reference to improve compatibilities with old games
    
    this.limits = {
      minX: params.minX != undefined ? params.minX : undefined
      ,maxX: params.maxX != undefined ? params.maxX : undefined
      ,minY: params.minY != undefined ? params.minY : undefined
      ,maxY: params.maxY != undefined ? params.maxY : undefined
    };
    
    /**
     * applied before rendering, all gameObjects and gui will inherits from the bufferAlpha
     * @public
     * @memberOf Camera
     */
    // this.bufferAlpha = params.bufferAlpha || 1;
    
    // this.backgroundColor = params.backgroundColor || null;
    // this.backgroundImage = params.backgroundImage || null;
    // this.useTransparency = params.useTransparency || params.transparent || false;
    // this.stretchedBackground = params.stretchedBackground != undefined ? params.stretchedBackground : true;
    
    this.cameras    = new Array();
    this.maxCameras = 0;
    
    this._visibleGameObjects = [];
    
    
    /****
     * store between two event types if you asked to prevent some events
     * @private
     */
    this._propagationEvent = {}; //[ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];
    this.indexMouseOver  = {}; //[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 20 touches max ?
    this.lastPointersPos = {};
    
    /**
     * object used to apply fade on final Camera rendering
     * @protected
     * @memberOf Camera
     * @type {Object}
     */
    this.fadeData = {
      "from"     : 1
      ,"to"      : 0
      ,"duration": 1000
      ,"done"    : true
    };
    /**
     * object used to apply fade before rendering
     * @protected
     * @memberOf Camera
     * @type {Object}
     */
    this.fadeBufferData = {
      "from"      : 1
      ,"to"       : 0
      ,"duration" : 500
      ,"done"     : true
    };
    
    /**
     * object used to apply shake
     * @protected
     * @memberOf Camera
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
     * @memberOf Camera
     * @type {Object}
     */
    this.moveData = {
      "done": true
    };
    
    
    // add Events components on camera
    // Event.addEventComponents( this );
  }
  
  Camera.prototype = Object.create( PIXI.Container.prototype );
  Camera.prototype.constructor = Camera;
  Object.defineProperties( Camera.prototype, {
    /**
     * Scene, setting will update event binding
     *
     * @member {number}
     * @memberof Text#
     */
    scene: {
      get: function()
      {
        return this._scene;
      }
      , set: function( scene )
      {
        if ( this._scene )
        {
          // this._scene.stopListening( "updateObjects", this );
          this._scene.stopListen( "updateObjects", this.updateObjects );
        }
        this._scene = scene;
        this._scene.on( "updateObjects", this.updateObjects, this );
      }
    }
    
    , gui: {
      get: function()
      {
        return this._gui;
      }
      , set: function( value )
      {
        if ( this._gui )
          this.removeChild( this._gui );
        
        this._gui = value;
        if ( value )
          this.addChild( this._gui );
      }
    }
    
    ,enable: {
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
    
    // to improve compatibilities with older games
    ,sleep: {
      get: function()
      {
        return !this.enable;
      }
      , set: function( value )
      {
        this.enable = !value;
      }
    }
  } );
  
  /**
   * updateObjects from scene trigger, update children from scene visibleObjects
   */
  Camera.prototype.updateObjects = function()
  {
    this.sceneContainer.removeChildren();
    
    var objs = this._scene.gameObjects;
    this._visibleGameObjects = objs;
    for ( var i = 0, t = objs.length; i < t; ++i )
      this.sceneContainer.addChild( objs[ i ] );
    this.needUpdateVisible = true;
    return this;
  };
  
  /**
   * update camera middlewares
   */
  Camera.prototype.render = function( physicRatio )
  {
    if ( this.needUpdateVisible ) // todo add trigger from scene / gameobjects when they turn on/off/move
      this.updateVisibleObjects();
    
    this.applyFade();
    this.applyMove();
    this.applyFocus();
    this.applyShake();
    this.checkLimits( physicRatio );
    this.calculatePerspective();
    
    return this;
  };
  
  Camera.prototype.calculatePerspective = function()
  {
    var cpos = this.sceneContainer.pos;
    for ( var i = 0, c, ratioz, rpx, rpy, gpos; i < this.sceneContainer.children.length; ++i )
    {
      c = this.sceneContainer.children[ i ];
      if ( !c.getPos || !c.position )
        continue;
      gpos = c.getPos();
      ratioz  = ( 10 / ( gpos.z - -10 ) );
      
      rpx = gpos.x;
      rpy = gpos.y;
      if ( ratioz != 1 )
      {
        rpx = cpos.x + ( gpos.x - ( cpos.x + this.renderSizes.x * 0.5 ) ) * ratioz + this.renderSizes.x * 0.5 >> 0;
        rpy = cpos.y + ( gpos.y - ( cpos.y + this.renderSizes.y * 0.5 ) ) * ratioz + this.renderSizes.y * 0.5 >> 0;
      }
      
      c.savedPosition.setPosition( c.position );
      c.position.setPosition( rpx, rpy );
    }
  };
  
  Camera.prototype.restoreAfterRender = function()
  {
    for ( var i = 0, c; i < this.sceneContainer.children.length; ++i )
    {
      c = this.sceneContainer.children[ i ];
      if ( !c.position )
        continue;
      c.position.setPosition( c.savedPosition );
    }
  };
  
  /**
   * updateVisibleObjects
   */
  Camera.prototype.updateVisibleObjects = function()
  {
    // this._visibleGameObjects = [];
    // for ( var i = 0, c, b; i < this.sceneContainer.children.length; ++i )
    // {
    //   c = this.sceneContainer.children[ i ];
    //   b = c.getBounds();
    //   if ( b.x > this.sceneContainer.x + this.renderSizes.x
    //     || b.x + b.width < this.sceneContainer.x
    //     || b.y > this.sceneContainer.y + this.renderSizes.y
    //     || b.y + b.height < this.sceneContainer.y )
    //     c.visible = false;
    //   else if ( c.renderable )
    //   {
    //     this._visibleGameObjects.push( c );
    //     c.visible = true;
    //   }
    // }
    // this.needUpdateVisible = false;
  };
  
  /**
   * Check camera limits fixed by limits object you set in camera previously.
   * It's usefull to setup worlds limits, or in a plate-former limit the Y axis (then your camera will stop at the floor, for example)
   * You touch this method at your own risks
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.checkLimits = function( physicRatio )
  {
    var limits = this.limits;
    if ( limits.minX != undefined && this.sceneContainer.x < limits.minX * physicRatio )
      this.sceneContainer.x = limits.minX * physicRatio;
    else if ( limits.maxX != undefined && this.sceneContainer.x + this.renderSizes.x > limits.maxX * physicRatio * this.sceneContainer.scale.x )
      this.sceneContainer.x = limits.maxX * physicRatio * this.sceneContainer.scale.x - this.renderSizes.x;
    if ( limits.minY != undefined && this.sceneContainer.y < limits.minY * physicRatio )
      this.sceneContainer.y = limits.minY * physicRatio;
    else if ( limits.maxY != undefined && this.sceneContainer.y + this.renderSizes.y > limits.maxY * physicRatio * this.sceneContainer.scale.y )
      this.sceneContainer.y = limits.maxY * physicRatio * this.sceneContainer.scale.y - this.renderSizes.y;
  };
  
  // /**
  //  * when the engine, or you change quality setting
  //  * TODO - remove newSizes if this isn't used / useful
  //  * You touch this method at your own risks
  //  * @protected
  //  * @memberOf Camera
  //  * @param {Float} physicRatio is the new physical ratio to go to the "native" size
  //  */
  // Camera.prototype.screenChangedSizeIndex = function( physicRatio/*, newSizes*/ )
  // {
  //   this.renderSizes.x  = this.renderSizes.x * physicRatio >> 0;
  //   this.renderSizes.y = this.renderSizes.y * physicRatio >> 0;
  //   this.x = this.savedPosition.x * physicRatio >> 0;
  //   this.y = this.savedPosition.y * physicRatio >> 0;
  //   this._buffer.canvas.width = this.renderSizes.x;
  //   this._buffer.canvas.height = this.renderSizes.y;
  // };
  
  /**
   * add a Camera to your camera
   * TODO - I think there is problems with this, I just tried it quickly
   * @public
   * @memberOf Camera
   * @param {Camera} camera
   */
  Camera.prototype.add = function( camera )
  {
    this.cameras.push( camera );
    ++this.maxCameras;
  };
  
  /**
   * remove a camera affilied in this one
   * @public
   * @memberOf Camera
   * @param {Camera} camera
   */
  Camera.prototype.remove = function( camera )
  {
    var pos = this.cameras.indexOf( camera );
    if ( pos == -1 )
    {
      CONFIG.debug.log( "%cRemove camera not found ", 1, "color:orange", camera );
      return;
    }
    
    this.cameras.splice( pos, 1 );
    this.maxCameras--;
  };
  
  /**
   * apply the current fade
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.applyFade = function()
  {
    if ( !this.fadeData.done )
    {
      this.fadeData.stepVal = Time.timeSinceLastFrame / this.fadeData.oDuration * Time.scaleDelta
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
        this.trigger( "fadeEnd" );
        this.fadeData.done = true;
        if ( this.alpha == 1 || this.alpha == 0 )
        {
          if ( this.alpha == 0 )
            this.enable = false;
        }
      }
    }
    if ( !this.fadeBufferData.done )
    {
      this.fadeBufferData.stepVal = Time.timeSinceLastFrame / this.fadeBufferData.oDuration * Time.scaleDelta
                              * this.fadeBufferData.dir * this.fadeBufferData.fadeScale;
      this.bufferAlpha += this.fadeBufferData.stepVal * Time.scaleDelta;
      this.fadeBufferData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
      if ( ( this.fadeBufferData.dir < 0 && this.bufferAlpha <= this.fadeBufferData.to )
          || ( this.fadeBufferData.dir > 0 && this.bufferAlpha >= this.fadeBufferData.to )
          || this.bufferAlpha < 0 || this.bufferAlpha > 1 )
      {
        this.bufferAlpha = this.fadeBufferData.to;
      }
      if ( this.fadeBufferData.duration <= 0 )
      {
        this.trigger( "fadeBufferEnd" );
        this.fadeBufferData.done = true;
        if ( this.bufferAlpha == 1 || this.bufferAlpha == 0 )
        {
          if ( this.bufferAlpha == 0 )
            this.enable = false;
          this.useTransparency = this.oUseTransparency;
        }
      }
    }
  };
  
  /**
   * create a fade from val, to val, with given duration time
   * @public
   * @memberOf Camera
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [bufferApply=false] apply the fade on buffer (will render all objects transparent)
   * @example myCamera.fade( 0.5, 1, 850 );
   */
  Camera.prototype.fade = function( from, to, duration, bufferApply )
  {
    if ( ( bufferApply && to == this.bufferAlpha ) || to == this.alpha
      || ( this.alpha == 0 && bufferApply ) )
      return;
    
    this.enable = false;
    var data = {
      from      : from || 1
      ,to       : to != undefined ? to : 0
      ,duration : duration || 500
      ,oDuration: duration || 500
      ,fadeScale: Math.abs( from - to )
      ,done     : false
    };
    data.dir = data.from > to ? -1 : 1;
    if ( !bufferApply )
    {
      this.alpha = from;
      this.fadeData = data;
    }
    else
    {
      this.fadeBufferData = data;
      this.oUseTransparency = this.useTransparency;
      this.useTransparency  = true;
    }
  };
  
  /**
   * create a fade to val, from current alpha value with given duration time
   * @public
   * @memberOf Camera
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [bufferApply=false] apply the fade on buffer (will render all objects transparent)
   * @example myCamera.fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  Camera.prototype.fadeTo = function( to, duration, bufferApply )
  {
    this.enable = false;
    this.fade( this.alpha, to, duration, bufferApply );
  };
  
  /**
   * fade the camera to alpha 0 with given duration time
   * fade start to the current alpha
   * @public
   * @memberOf Camera
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [bufferApply=false] apply the fade on buffer (will render all objects transparent)
   * @example // alpha = 0 in 850ms
   * myCamera.fadeOut( 850 );
   */
  Camera.prototype.fadeOut = function( duration, bufferApply )
  {
    this.fade( this.alpha, 0, duration, bufferApply );
  };
  
  /**
   * fade the camera to alpha 1 with given duration time
   * fade start to the current alpha
   * @public
   * @memberOf Camera
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [bufferApply=false] apply the fade on buffer (will render all objects transparent)
   * @example // alpha = 1 in 850ms
   * myCamera.fadeIn( 850 );
   */
  Camera.prototype.fadeIn = function( duration, bufferApply )
  {
    this.fade( this.alpha, 1, duration, bufferApply );
  };
  
  /**
   * create a shake with given range
   * you can only have one at a time
   * @public
   * @memberOf Camera
   * @param {Int} xRange max X camera will move to shake
   * @param {Int} yRange max Y camera will move to shake
   * @param {Int} [duration=500] time duration
   * @example // shake with 10-10 force during 1sec
   * myCamera.shake( 10, 10, 1000 );
   */
  Camera.prototype.shake = function( xRange, yRange, duration, callback )
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
   * apply the shake each frame
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.applyShake = function()
  {
    if ( this.shakeData.done )
      return;
    
    var shake = this.shakeData;
    // restore previous shake
    this.sceneContainer.x -= shake.prevX;
    this.sceneContainer.y -= shake.prevY;
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
    
    this.sceneContainer.x += shake.prevX;
    this.sceneContainer.y += shake.prevY;
  };
  
  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf Camera
   * @param {Object} pos give x, y, and z destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current camera context
   * @example // move to 100,100 in 1 second
   * camera.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * camera.moveTo( bonus.position, 1000, function(){ console.log( this ) } );
   */
  Camera.prototype.moveTo = function( pos, duration, callback, curveName )
  {
    var myPos = this.sceneContainer;
    
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
      ,"destX"    : ( pos.x !== undefined ? pos.x : myPos.x )
      ,"destY"    : ( pos.y !== undefined ? pos.y : myPos.y )
      ,"destZ"    : ( pos.z !== undefined ? pos.z : myPos.z )
      ,"callback" : callback
    };
    this.moveData.leftX = this.moveData.distX;
    this.moveData.leftY = this.moveData.distY;
    this.moveData.leftZ = this.moveData.distZ;
    // console.log( this.moveData, this.sceneContainer.z )
  };
  
  /**
   * apply the move transition each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.applyMove = function()
  {
    if ( this.moveData.done )
      return;
    
    var move = this.moveData;
    
    if ( move.distX != 0 )
    {
      move.stepValX = Time.timeSinceLastFrame / move.oDuration * move.distX * Time.scaleDelta;
      move.leftX -= move.stepValX;
      this.sceneContainer.x += move.stepValX;
    }
    
    if ( move.distY != 0 )
    {
      move.stepValY = Time.timeSinceLastFrame / move.oDuration * move.distY * Time.scaleDelta;
      move.leftY -= move.stepValY * move.dirY;
      this.sceneContainer.y += move.stepValY;
    }
    
    if ( move.distZ != 0 )
    {
      move.stepValZ = Time.timeSinceLastFrame / move.oDuration * move.distZ * Time.scaleDelta;
      move.leftZ -= move.stepValZ * move.dirZ;
      this.sceneContainer.z += move.stepValZ;
    }
    
    move.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check pos
    if ( move.dirX < 0 && move.leftX < 0 )
      this.sceneContainer.x += move.leftX;
    else if ( move.dirX > 0 && move.leftX > 0 )
      this.sceneContainer.x -= move.leftX;
    
    if ( move.dirY < 0 && move.leftY < 0 )
      this.sceneContainer.y += move.leftY;
    else if ( move.dirY > 0 && move.leftY > 0 )
      this.sceneContainer.y -= move.leftY;
    
    if ( move.dirZ < 0 && move.leftZ < 0 )
      this.sceneContainer.z += move.leftZ;
    else if ( move.dirZ > 0 && move.leftZ > 0 )
      this.sceneContainer.z -= move.leftZ;
    
    if ( move.duration <= 0 )
    {
      move.done = true;
      this.sceneContainer.pos = { x: move.destX, y: move.destY, z: move.destZ };
      if ( move.callback )
        move.callback.call( this, move.callback );
      
      this.trigger( "moveEnd" );
      return;
    }
  };
  
  /**
   * give a target to this camera, then camera will focus it until you changed or removed it
   * you can lock independent axes, or set offsets
   * @public
   * @memberOf Camera
   * @param {GameObject} gameObject is the target to focus on
   * @param {Object} [params] optional parameters, set offsets or lock
   * @example // focus the player, decal a little on right, and lock y
   * myCamera.focus( player, { lock: { y: true }, offsets: { x: 200, y: 0 } } );
   */
  Camera.prototype.focus = function( gameObject, params )
  {
    params = params || {};
    this.target = gameObject;
    this.focusLock  = params.lock || {};
    this.focusOffset= params.offsets || { x: 0, y: 0 };
    this.focusMaxParent = null;
    
    var parent = gameObject;
    while ( parent && !this.focusMaxParent )
    {
      if ( parent.parent && parent.parent.id == this.id )
        this.focusMaxParent = parent;
      else
        parent = parent.parent;
    }
  };
  
  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.applyFocus = function()
  {
    if ( !this.target )
      return;
    
    if ( this.focusMaxParent )
    {
      this.sceneContainer.pos = { x: 0, y: 0 };
      this.sceneContainer.updateTransform();
      // this.sceneContainer.removeChild( this.focusMaxParent );
      this.focusMaxParent.updateTransform();
    }
    // inverser les X et Y de la position de la camera dans la scene ?
    var pos = this.target.getPos();
    if ( !this.focusLock.x && !this.focusLock.y )
      this.sceneContainer.pos = {
        x: pos.x * this.sceneContainer.scale.x - ( this.renderSizes.x * 0.5 ) + ( this.focusOffset.x || 0 )
        , y: pos.y * this.sceneContainer.scale.y - ( this.renderSizes.y * 0.5 ) + ( this.focusOffset.y || 0 )
      };
    else if ( !this.focusLock.x )
      this.sceneContainer.x = pos.x * this.sceneContainer.scale.x - ( this.renderSizes.x * 0.5 ) + ( this.focusOffset.x || 0 );
    else if ( !this.focusLock.y )
      this.sceneContainer.y = pos.y * this.sceneContainer.scale.y - ( this.renderSizes.y * 0.5 ) + ( this.focusOffset.y || 0 );
    
    // if ( this.focusMaxParent )
    //   this.sceneContainer.addChild( this.focusMaxParent );
  };
  
  /**
   * convert mouse pos to correspond to your camera position with harmonics and ratio
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.convertMousePos = function( mouse, physicRatio )
  {
    mouse.x -= this.x;
    mouse.y -= this.y;
    
    if ( this._sr == 0 && this._cr == 1 )
    {
      return {
        x: ( mouse.x * this.renderScale.x / physicRatio >> 0 )// - ( ( this.renderSizes.x - this.renderSizes.x * this.renderScale.x ) / 2 ) ) / this.renderScale.x >> 0
        , y: ( mouse.y * this.renderScale.y / physicRatio >> 0 )//- ( ( this.renderSizes.y - this.renderSizes.y * this.renderScale.y ) / 2 ) ) / this.renderScale.y >> 0
        , "index": mouse.index
      };
    }
    
    var x = mouse.x;//( this.renderSizes.x / 2 - mouse.x );
    var y = mouse.y;//( this.renderSizes.y / 2 - mouse.y );
    
    return {
      "x": ( ( x * this._cr + y * this._sr ) ) * this.renderScale.x / physicRatio >> 0
      , "y": ( -( x * this._sr + y * -this._cr ) ) * this.renderScale.y / physicRatio >> 0
      , "index": mouse.index, "isDown": mouse.isDown
    };
  };
  
  /**
   * onMouse[type] event, override it with the own Camera's method<br>
   * empty as default<br>
   * here is the full events list (so override with this name) ordered by call order:<br>
   * - onMouseDown<br>
   * - onMouseEnter<br>
   * - onMouseMove<br>
   * - onMouseLeave<br>
   * - onMouseClick<br>
   * - onMouseUp<br>
   * @public
   * @memberOf Camera
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
   * myCamera.onMouseDown = function( event, propagation )
   * {
   *   console.log( event, propagation ); // event contain x, y, isDown, index (touchId)
   * };
   * @example // here I want to catch the Click event, but I want to kill prevent propagation in gui and scene
   * myCamera.onMouseClick = function( event, propagation )
   * {
   *   // do stuff here
   *   return true; // prevent Gui and GameObjects calls
   * };
   */
  Camera.prototype.onMouseDown  = function(){};
  Camera.prototype.onMouseEnter = function(){};
  Camera.prototype.onMouseMove  = function(){};
  Camera.prototype.onMouseLeave = function(){};
  Camera.prototype.onMouseUp    = function(){};
  Camera.prototype.onMouseClick = function(){};
  
  /**
   * It works like onMouseDown but it's called after Gui, Scene globals, and GameObjects last event, called after all.<br>
   * Very usefull when you want to do something only if you didn't click on anything (just stopPropagation before and this one won't be called)<br>
   * Here is the full events list (so override with this name) ordered by call order:<br>
   * - onMouseDown<br>
   * - onMouseMove<br>
   * - onMouseClick<br>
   * - onMouseUp<br>
   * @public
   * @memberOf Camera
   */
  Camera.prototype.onLastMouseMove  = function(){};
  Camera.prototype.onLastMouseDown  = function(){};
  Camera.prototype.onLastMouseUp    = function(){};
  Camera.prototype.onLastMouseClick = function(){};
  
  /**
   * original mouseDown event, called by the Render, exist for mouseUp, mouseMove, mouseEnter and mouseLeave
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.oOnMouseDown = function( mouse, physicRatio )
  {
    mouse.isDown = true;
    mouse.date   = Date.now();
    this._propagationEvent[ mouse.index ] = mouse;
    this.mouseDetectorHandler( "Down", mouse, physicRatio );
    this.trigger( "changeCursor", this._propagationEvent[ mouse.index ].cursor || "default" );
  };
  Camera.prototype.oOnMouseUp = function( mouse, physicRatio )
  {
    if ( Date.now() < this._propagationEvent[ mouse.index ].date + CONFIG.CLICK_DELAY )
      this.mouseDetectorHandler( "Click", { x: mouse.x, y: mouse.y, index: mouse.index, isDown: mouse.isDown }, physicRatio );
    
    this.mouseDetectorHandler( "Up", mouse, physicRatio );
    this.trigger( "changeCursor", this._propagationEvent[ mouse.index ].cursor || "default" );
    this._propagationEvent[ mouse.index ] = {};
  };
  Camera.prototype.oOnMouseMove = function( mouse, physicRatio )
  {
    if ( !this._propagationEvent[ mouse.index ].index )
      this._propagationEvent[ mouse.index ] = mouse;
    
    this.lastPointersPos[ mouse.index ] = mouse;
    this.indexMouseOver[ mouse.index ]  = true;
    this.mouseDetectorHandler( "Move", mouse, physicRatio );
    this.trigger( "changeCursor", this._propagationEvent[ mouse.index ].cursor || "default" );
  };
  Camera.prototype.oOnMouseEnter = function( mouse, physicRatio )
  {
    mouse = this.convertMousePos( mouse, physicRatio );
    this.onMouseEnter( mouse );
    this._propagationEvent[ mouse.index ] = this._propagationEvent[ mouse.index ] || {};
    this.trigger( "changeCursor", this._propagationEvent[ mouse.index ].cursor || "default" );
  };
  Camera.prototype.oOnMouseLeave = function( mouse, physicRatio )
  {
    this.indexMouseOver[ mouse.index ] = false;
    mouse = this.convertMousePos( mouse, physicRatio );
    this.onMouseLeave( mouse );
    this._propagationEvent[ mouse.index ] = this._propagationEvent[ mouse.index ] || {};
    this.trigger( "changeCursor", this._propagationEvent[ mouse.index ].cursor || "default" );
  };
  
  /**
   * mouseDetectorHandler
   * main mouse handler
   */
  Camera.prototype.mouseDetectorHandler = function( eventType, mouse, physicRatio )
  {
    if ( !this.enable || this._propagationEvent[ mouse.index ][ "prevent" + eventType ] )
      return;
    
    mouse = this.convertMousePos( mouse, physicRatio );
    var mouseInScene = {
      x: mouse.x + this.sceneContainer.x
      ,y: mouse.y + this.sceneContainer.y
      ,index: mouse.index, isDown: mouse.isDown
    };
    
    this.trigger( "mouse" + eventType, mouse, this._propagationEvent[ mouse.index ] );
    if ( this[ "onMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    if ( this.gui && this.gui.enable && this.gui[ "oOnMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    
    if ( this._scene && this._scene.enable )
    {
      mouse.sceneContainer = this.sceneContainer;
      mouse.renderSizes    = this.renderSizes;
      
      for ( var i in this._scene[ "onGlobalMouse" + eventType ] )
      {
        if ( this._scene[ "onGlobalMouse" + eventType ][ i ].enable )
          if ( this._scene[ "onGlobalMouse" + eventType ][ i ][ "onGlobalMouse" + eventType ]( mouseInScene, this._propagationEvent[ mouse.index ] ) )
            return;
      }
      for ( var i = this._visibleGameObjects.length - 1, g; i >= 0; --i )
      {
        g = this._visibleGameObjects[ i ];
        
        if ( gameObjectMouseEvent( eventType, g, mouse, mouseInScene, this._propagationEvent[ mouse.index ] ) )
          return;
      }
    }
    
    if ( !mouse.stopPropagation && !this._propagationEvent[ mouse.index ][ "preventLast" + eventType ] )
    {
      if ( this._scene && !this._scene.enable )
      {
        for ( var i in this._scene[ "onLastGlobalMouse" + eventType ] )
        {
          if ( this._scene[ "onLastGlobalMouse" + eventType ][ i ].enable )
            this._scene[ "onLastGlobalMouse" + eventType ][ i ][ "onLastGlobalMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
        }
      }
      mouse.sceneContainer = undefined;
      mouse.renderSizes    = undefined;
      
      this.trigger( "lastMouse" + eventType, mouse, this._propagationEvent[ mouse.index ] );
      if ( this.gui && !this.gui.enable )
        this.gui[ "oOnLastMouse" ]( eventType, mouse, this._propagationEvent[ mouse.index ] );
      this[ "onLastMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
    }
  };
  
  // Event.addEventCapabilities( Camera );
  Camera.prototype.DEName = "Camera";
  
  /***
   * the SceneContainer is used to display scene's GameOjects
   * this is because we can add a "gui" (as an other Container) and we need 2 different containers to manage each things aside
   * so, a Camera is a Container that contain:
    - a SceneContainer
    - a gui Container
   */
  function SceneContainer()
  {
    PIXI.Container.call( this );
    this.position.z = 0;
  }
  SceneContainer.prototype = Object.create( PIXI.Container.prototype );
  SceneContainer.prototype.constructor = SceneContainer;
  Object.defineProperties( SceneContainer.prototype, {
    // redefine getter setter to invert pos to work has excepted
    x: {
      get: function()
      {
        return -this.position.x;
      }
      , set: function( v )
      {
        this.position.x = -v;
        this.parent.needUpdateVisible = true;
      }
    }
    
    ,y: {
      get: function()
      {
        return -this.position.y;
      }
      , set: function( v )
      {
        this.position.y = -v;
        this.parent.needUpdateVisible = true;
      }
    }
    
    ,z: {
      get: function()
      {
        return this.position.z;
      }
      , set: function( v )
      {
        var ratioz  = ( 10 / ( v - -10 ) );
        this.scale.set( ratioz, ratioz );
        this.position.z = v;
        this.parent.needUpdateVisible = true;
      }
    }
    
    ,pos: {
      get: function()
      {
        return { x: -this.position.x, y: -this.position.y, z: this.position.z };
      }
      ,set: function( o )
      {
        this.position.x = -o.x;
        this.position.y = -o.y;
        this.z = o.z !== undefined ? o.z : this.position.z || 0;
        this.parent.needUpdateVisible = true;
      }
    }
  } );
  
  CONFIG.debug.log( "Camera loaded", 3 );
  return Camera;
} );