/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Camera
 * @class the eyes used to see in your scenes :)<br>
 * you have to append it to a Render and have to give it a scene to look in<br>
 * you can move your camera inside a render as you want<br>
 * also you can make more than one camera in a Render or looking in a scene<br>
 * <br><br>
 * example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2) 
 * and maybe override the render method to call custom rendering for mini-map<br>
 * then you got two camera, these two are looking at the same scene, and are in the same Render 
 * your "mini-map" camera is over the first carmera
 * <br><br>
 * example2: on a split-screen multiplayer game, you can make one camera by player, with input for each cameras
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
define( [ 'DE.CONFIG', 'DE.Sizes', 'DE.Vector2', 'DE.CanvasBuffer', 'DE.Mid.gameObjectMouseEvent'
        , 'DE.ImageManager', 'DE.Event', 'DE.Time' ],
function( CONFIG, Sizes, Vector2, CanvasBuffer, gameObjectMouseEvent
        , ImageManager, Event, Time )
{
  function Camera( width, height, x, y, params )
  {
    params = params || {};
    
    this.name   = params.name || "";
    this.tag    = params.tag || "";
    this.scene  = params.scene || null;
    this.gui    = params.gui || undefined;
    
    this.renderSizes = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    this.fieldSizes = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    // position in the render (canvas)
    this.renderPosition= new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    this.savedPosition = new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    
    // position inside the sceneworld
    this.scenePosition = new Vector2( params.realx || 0, params.realy || 0
                                    , params.realz || params.z || -10 );
    this.limits = {
      minX: params.minX != undefined ? params.minX : undefined
      ,maxX: params.maxX != undefined ? params.maxX : undefined
      ,minY: params.minY != undefined ? params.minY : undefined
      ,maxY: params.maxY != undefined ? params.maxY : undefined
    };
    
    /**
     * applied on final rendering, this will display the camera with transparency in the Render
     * @public
     * @memberOf Camera
     */
    this.alpha = params.alpha || 1;
    
    /**
     * applied before rendering, all gameObjects and gui will inherits from the bufferAlpha
     * @public
     * @memberOf Camera
     */
    this.bufferAlpha = params.bufferAlpha || 1;
    
    this.backgroundColor = params.backgroundColor || null;
    this.backgroundImage = params.backgroundImage || null;
    this.useTransparency = params.useTransparency || params.transparent || false;
    this.stretchedBackground = params.stretchedBackground != undefined ? params.stretchedBackground : true;
    
    this.cameras    = new Array();
    this.maxCameras = 0;
    
    this.freeze  = false;
    this.sleep   = false;
    
    this.startX  = 0
    this.startY  = 0
    this._buffer = new CanvasBuffer( this.renderSizes.width, this.renderSizes.height );
    // this._gameObjects = []; // sotre last active objects 
    this._visibleGameObjects = [];
    
    this.indexMouseOver  = {}; //[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 20 touches max ?
    this.lastPointersPos = {};
    
    /****
     * store between two event types if you asked to prevent some events
     * @private
     */
    this._propagationEvent = {}; //[ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];
    
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
    Event.addEventComponents( this );
  }
  
  /**
   * render the camera, called by renders that contain this camera (can be contained by two or more render)
   * You touch this method at your own risks
   * @protected
   * @param {Context2D} ctx
   * @param {Float} drawRatio
   * @param {Float} physicRatio
   * @memberOf Camera
   */
  Camera.prototype.render = function( ctx, drawRatio, physicRatio )
  {
    if ( this.sleep )
      return;
    
    var oldAlpha = ctx.globalAlpha;
    var _buffer = this._buffer;
    if ( !this.freeze )
    {
      this.applyFocus();
      this.checkLimits( physicRatio );
      this.applyShake();
      this.applyMove();
      
      _buffer.ctx.globalAlpha = this.bufferAlpha * oldAlpha;
      
      if ( this.useTransparency )
        _buffer.ctx.clearRect( 0, 0, this.renderSizes.width, this.renderSizes.height );
      
      if ( this.backgroundImage != null )
        if ( this.stretchedBackground )
          _buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ], 0, 0, this.renderSizes.width, this.renderSizes.height );
        else
          _buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ], 0, 0 );
      else if ( this.backgroundColor != null )
      {
        _buffer.ctx.fillStyle = this.backgroundColor;
        _buffer.ctx.fillRect( 0, 0, this.renderSizes.width, this.renderSizes.height );
      }
      
      _buffer.ctx.save();
      // renderize here game objects
      if ( this.scene )
      {
        var _gameObjects /*= this._gameObjects*/ = this.scene.gameObjects;
        this._visibleGameObjects = [];
        for ( var i = 0, t = _gameObjects.length, g, rpx, rpy, ratioz; i < t; ++i )
        {
          g = _gameObjects[ i ];
          
          if ( g.position.z < this.scenePosition.z )
            continue;
          
          ratioz  = ( 10 / ( g.position.z - this.scenePosition.z ) );
          rpx = g.position.x;
          rpy = g.position.y;
          // calculate real position only if ratioz isn't 1, otherwise the result is simply g.position.x
          if ( ratioz != 1 )
          {
            rpx = ( g.position.x - ( this.scenePosition.x + this.fieldSizes.width * 0.5 ) ) * ratioz + ( this.scenePosition.x + this.fieldSizes.width * 0.5 );
            rpy = ( g.position.y - ( this.scenePosition.y + this.fieldSizes.height * 0.5 ) ) * ratioz + ( this.scenePosition.y + this.fieldSizes.height * 0.5 );
          }
          if ( g && g.enable
            && rpx + g.biggerOffset.width * ratioz >= this.scenePosition.x
            && rpx - g.biggerOffset.width * ratioz <= this.scenePosition.x + this.fieldSizes.width
            && rpy + g.biggerOffset.height * ratioz >= this.scenePosition.y
            && rpy - g.biggerOffset.height * ratioz <= this.scenePosition.y + this.fieldSizes.height )
          {
            this._visibleGameObjects.push( g );
            g.render( _buffer.ctx, physicRatio, this.scenePosition, this.fieldSizes );
          }
        }
      }
      else
      {
        _buffer.ctx.textAlign = "center";
        _buffer.ctx.fillStyle = "white";
        _buffer.ctx.fillText( "No scene affiliated :(", this.renderSizes.width * 0.5, this.renderSizes.height * 0.5 );
      }
      
      _buffer.ctx.restore();
      _buffer.ctx.globalAlpha = this.alpha * oldAlpha;
      
      // debuging - display name and stroke the camera
      if ( CONFIG.DEBUG )
      {
        _buffer.ctx.fillStyle = "white";
        _buffer.ctx.textAlign = "left";
        _buffer.ctx.fillText( "Camera " + this.name, 10, 20);
        
        _buffer.ctx.strokeStyle = "red";
        _buffer.ctx.strokeRect( 0, 0, this.renderSizes.width >> 0
                                   , this.renderSizes.height >> 0 );
        
        _buffer.ctx.fillStyle = "yellow";
        _buffer.ctx.fillRect( this.renderSizes.width - 10, this.renderSizes.height - 10, 10, 10 );
        _buffer.ctx.fillRect( this.renderSizes.width - 10, 0, 10, 10 );
        _buffer.ctx.fillRect( 0, this.renderSizes.height - 10, 10, 10 );
        _buffer.ctx.fillRect( 0, 0, 10, 10 );
        
        _buffer.ctx.fillRect( this.renderSizes.width * 0.5
                            ,this.renderSizes.height * 0.5
                            , 20, 5 );
        _buffer.ctx.fillRect( this.renderSizes.width * 0.5
                            ,this.renderSizes.height * 0.5
                            , 5, 20 );
      }
      this.applyFade();
    }
    
    ctx.translate( this.renderPosition.x * drawRatio >> 0
                  , this.renderPosition.y * drawRatio >> 0 );
    ctx.rotate( this.renderPosition.rotation );
    
    if ( this.gui )
      this.gui.render( _buffer.ctx, drawRatio, physicRatio, this.renderSizes );
    ctx.globalAlpha = this.alpha;
    ctx.drawImage( _buffer.canvas
          , -this.renderSizes.width * this.renderSizes.scaleX * drawRatio * 0.5 >> 0
          , -this.renderSizes.height * this.renderSizes.scaleY * drawRatio * 0.5 >> 0
          , this.renderSizes.width * this.renderSizes.scaleX * drawRatio >> 0
          , this.renderSizes.height * this.renderSizes.scaleY * drawRatio >> 0 );
    
    // the GUI will totally change with DOM components, try to not use it
    // prefer using GameObjects in your scene
    
    ctx.rotate( -this.renderPosition.rotation );
    ctx.translate( -this.renderPosition.x * drawRatio >> 0
                  , -this.renderPosition.y * drawRatio >> 0 );
    ctx.globalAlpha = oldAlpha;
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
    if ( limits.minX != undefined && this.scenePosition.x < limits.minX * physicRatio )
      this.scenePosition.x = limits.minX * physicRatio;
    else if ( limits.maxX != undefined && this.scenePosition.x + this.renderSizes.width > limits.maxX * physicRatio )
      this.scenePosition.x = limits.maxX * physicRatio - this.renderSizes.width;
    if ( limits.minY != undefined && this.scenePosition.y < limits.minY * physicRatio )
      this.scenePosition.y = limits.minY * physicRatio;
    else if ( limits.maxY != undefined && this.scenePosition.y + this.renderSizes.height > limits.maxY * physicRatio )
      this.scenePosition.y = limits.maxY * physicRatio - this.renderSizes.height;
  };
  
  /**
   * when the engine, or you change quality setting
   * TODO - remove newSizes if this isn't used / useful
   * You touch this method at your own risks
   * @protected
   * @memberOf Camera
   * @param {Float} physicRatio is the new physical ratio to go to the "native" size
   */
  Camera.prototype.screenChangedSizeIndex = function( physicRatio/*, newSizes*/ )
  {
    this.renderSizes.width  = this.fieldSizes.width * physicRatio >> 0;
    this.renderSizes.height = this.fieldSizes.height * physicRatio >> 0;
    this.renderPosition.x = this.savedPosition.x * physicRatio >> 0;
    this.renderPosition.y = this.savedPosition.y * physicRatio >> 0;
    this._buffer.canvas.width = this.renderSizes.width;
    this._buffer.canvas.height = this.renderSizes.height;
  };
  
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
            this.sleep = true;
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
            this.sleep = true;
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
    
    this.sleep = false;
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
    this.sleep = false;
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
    this.scenePosition.x -= shake.prevX;
    this.scenePosition.y -= shake.prevY;
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
    
    this.scenePosition.x += shake.prevX;
    this.scenePosition.y += shake.prevY;
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
    var myPos = this.scenePosition;
    
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
      this.scenePosition.x += move.stepValX;
    }
    
    if ( move.distY != 0 )
    {
      move.stepValY = Time.timeSinceLastFrame / move.oDuration * move.distY * Time.scaleDelta;
      move.leftY -= move.stepValY * move.dirY;
      this.scenePosition.y += move.stepValY;
    }
    
    if ( move.distZ != 0 )
    {
      move.stepValZ = Time.timeSinceLastFrame / move.oDuration * move.distZ * Time.scaleDelta;
      move.leftZ -= move.stepValZ * move.dirZ;
      this.scenePosition.z += move.stepValZ;
    }
    
    move.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check pos
    if ( move.dirX < 0 && move.leftX < 0 )
      this.scenePosition.x += move.leftX;
    else if ( move.dirX > 0 && move.leftX > 0 )
      this.scenePosition.x -= move.leftX;
    
    if ( move.dirY < 0 && move.leftY < 0 )
      this.scenePosition.y += move.leftY;
    else if ( move.dirY > 0 && move.leftY > 0 )
      this.scenePosition.y -= move.leftY;
    
    if ( move.dirZ < 0 && move.leftZ < 0 )
      this.scenePosition.z += move.leftZ;
    else if ( move.dirZ > 0 && move.leftZ > 0 )
      this.scenePosition.z -= move.leftZ;
    
    if ( move.duration <= 0 )
    {
      move.done = true;
      this.scenePosition.setPosition( move.destX, move.destY, move.destZ );
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
    var pos = this.target.getPos();
    if ( !this.focusLock.x )
      this.scenePosition.x = pos.x - this.fieldSizes.width * 0.5 + ( this.focusOffset.x || 0 );
    if ( !this.focusLock.y )
      this.scenePosition.y = pos.y - this.fieldSizes.height * 0.5 + ( this.focusOffset.y || 0 );
  };
  
  /**
   * convert mouse pos with harmonics and ratio
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  Camera.prototype.convertMousePos = function( mouse, physicRatio )
  {
    mouse.x -= ( this.renderPosition.x - this.renderSizes.width * 0.5 ) >> 0;
    mouse.y -= ( this.renderPosition.y - this.renderSizes.height * 0.5 ) >> 0;
    var harmonics = this.renderPosition.getHarmonics();
    if ( harmonics.sin == 0 && harmonics.cos == 0 )
    {
      if ( this.renderSizes.scaleX != 1 || this.renderSizes.scaleY != 1 )
      {
        return { x: ( mouse.x / physicRatio - ( ( this.renderSizes.width - this.renderSizes.width * this.renderSizes.scaleX ) / 2 ) ) / this.renderSizes.scaleX >> 0
          , y: ( mouse.y / physicRatio - ( ( this.renderSizes.height - this.renderSizes.height * this.renderSizes.scaleY ) / 2 ) ) / this.renderSizes.scaleY >> 0
          , "index": mouse.index };
      }
      return { x: mouse.x / physicRatio >> 0
        , y: mouse.y / physicRatio >> 0
        , "index": mouse.index };
    }
    
    var x = ( this.renderSizes.width / 2 - mouse.x );
    var y = ( this.renderSizes.height / 2 - mouse.y );
    
    if ( this.renderSizes.scaleX != 1 || this.renderSizes.scaleY != 1 )
    {
      return {
        "x": ( ( -(x * harmonics.cos + y * harmonics.sin ) + this.renderSizes.width / 2 ) / physicRatio - ( ( this.renderSizes.width - this.renderSizes.width * this.renderSizes.scaleX ) / 2 ) ) / this.renderSizes.scaleX >> 0
        , "y": ( ( (x * harmonics.sin + y * -harmonics.cos ) + this.renderSizes.height / 2 ) / physicRatio - ( ( this.renderSizes.height - this.renderSizes.height * this.renderSizes.scaleY ) / 2 ) ) / this.renderSizes.scaleY >> 0
        , "index": mouse.index
        , "isDown": mouse.isDown
      };
    }
    return {
      "x": ( -(x * harmonics.cos + y * harmonics.sin ) + this.renderSizes.width / 2 ) / physicRatio >> 0
      , "y": ( (x * harmonics.sin + y * -harmonics.cos ) + this.renderSizes.height / 2 ) / physicRatio >> 0
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
    if ( this.freeze || this.sleep || this._propagationEvent[ mouse.index ][ "prevent" + eventType ] )
      return;
    
    mouse = this.convertMousePos( mouse, physicRatio );
    
    this.trigger( "mouse" + eventType, mouse, this._propagationEvent[ mouse.index ] );
    if ( this[ "onMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    if ( this.gui && !this.gui.sleep && this.gui[ "oOnMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    
    if ( this.scene && !this.scene.sleep )
    {
      mouse.scenePosition = this.scenePosition;
      mouse.fieldSizes    = this.fieldSizes;
      mouse.x += this.scenePosition.x;
      mouse.y += this.scenePosition.y;
      for ( var i in this.scene[ "onGlobalMouse" + eventType ] )
      {
        if ( this.scene[ "onGlobalMouse" + eventType ][ i ].enable )
          if ( this.scene[ "onGlobalMouse" + eventType ][ i ][ "onGlobalMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) )
            return;
      }
      for ( var i = this._visibleGameObjects.length - 1, g; i >= 0; --i )
      {
        g = this._visibleGameObjects[ i ];
        
        if ( gameObjectMouseEvent( eventType, g, mouse, this._propagationEvent[ mouse.index ] ) )
          return;
      }
    }
    
    if ( !mouse.stopPropagation && !this._propagationEvent[ mouse.index ][ "preventLast" + eventType ] )
    {
      if ( this.scene && !this.scene.sleep )
      {
        for ( var i in this.scene[ "onLastGlobalMouse" + eventType ] )
        {
          if ( this.scene[ "onLastGlobalMouse" + eventType ][ i ].enable )
            this.scene[ "onLastGlobalMouse" + eventType ][ i ][ "onLastGlobalMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
        }
        mouse.x -= this.scenePosition.x;
        mouse.y -= this.scenePosition.y;
      }
      mouse.scenePosition = undefined;
      mouse.fieldSizes    = undefined;
      
      this.trigger( "lastMouse" + eventType, mouse, this._propagationEvent[ mouse.index ] );
      if ( this.gui && !this.gui.sleep )
        this.gui[ "oOnLastMouse" ]( eventType, mouse, this._propagationEvent[ mouse.index ] );
      this[ "onLastMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
    }
  };
  
  Event.addEventCapabilities( Camera );
  Camera.prototype.DEName = "Camera";
  
  CONFIG.debug.log( "Camera loaded", 3 );
  return Camera;
} );