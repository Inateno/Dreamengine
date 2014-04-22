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
define( [ 'DE.CONFIG', 'DE.Sizes', 'DE.Vector2', 'DE.CanvasBuffer', 'DE.CollisionSystem', 'DE.ImageManager', 'DE.Event' ],
function( CONFIG, Sizes, Vector2, CanvasBuffer, CollisionSystem, ImageManager, Event )
{
  function Camera( width, height, x, y, params )
  {
    params = params || {};
    
    this.name   = params.name || "";
    this.tag    = params.tag || "";
    this.scene  = params.scene || null;
    this.gui    = undefined;
    
    this.renderSizes = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    this.fieldSizes = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    // position in the render (canvas)
    this.renderPosition= new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    this.savedPosition = new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    
    // position inside the sceneworld
    this.scenePosition = new Vector2( params.realx || x, params.realy || y
                                    , params.realz || params.z || -10 );
    this.limits = {
      minX: params.minX != undefined ? params.minX : undefined
      ,maxX: params.maxX != undefined ? params.maxX : undefined
      ,minY: params.minY != undefined ? params.minY : undefined
      ,maxY: params.maxY != undefined ? params.maxY : undefined
    };
    
    this.opacity = params.opacity || 1;
    this.backgroundColor = params.backgroundColor || null;
    this.backgroundImage = params.backgroundImage || null;
    
    this.cameras    = new Array();
    this.maxCameras = 0;
    
    this.freeze  = false;
    this.sleep   = false;
    
    this.startX  = 0
    this.startY  = 0
    this._buffer = new CanvasBuffer( this.renderSizes.width, this.renderSizes.height );
    // this._gameObjects = []; // sotre last active objects 
    this._visibleGameObjects = [];
    
    this.indexMouseOver  = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 20 touches max ?
    this.lastPointersPos = {};
    /****
     * store between two event types if you asked to prevent some events
     * @private
     */
    this._propagationEvent = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];
    
    // add Events components on camera
    Event.addEventComponents( this );
  }
  
  /****
   * getBuffer@void
    previously the _buffer was private - let to maximise retro-version
    (but I'll disapear, don't user it)
    you shouldn't get this buffer and do action on, but it's usefull for the engine
   */
  Camera.prototype.getBuffer = function(){ return this._buffer; }
  
  /****
   * render@void( ctx@CanvasContext, drawRatio@float, physicRatio@float )
   renderise the camera inside the given ctx
   you shouldn't change this method
   */
  Camera.prototype.render = function( ctx, drawRatio, physicRatio )
  {
    if ( this.sleep )
    {
      return;
    }
    
    var _buffer = this._buffer;
    if ( !this.freeze )
    {
      _buffer.ctx.globalAlpha  = this.opacity;
      
      if ( this.backgroundColor != null )
      {
        _buffer.ctx.fillStyle = this.backgroundColor;
        _buffer.ctx.fillRect( 0, 0, this.renderSizes.width, this.renderSizes.height );
      }
      if ( this.backgroundImage != null )
      {
        _buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ], 0, 0, this.renderSizes.width, this.renderSizes.height );
      }
      
      _buffer.ctx.save();
      // renderize here game objects
      if ( this.scene )
      {
        var _gameObjects /*= this._gameObjects*/ = this.scene.gameObjects;
        this._visibleGameObjects = [];
        for ( var i = 0, t = _gameObjects.length, g,ratioz; i < t; i++ )
        {
          g = _gameObjects[ i ];
          if ( g && g.enable
            && g.position.z > this.scenePosition.z
            && ( g.position.x + g.biggerOffset.width >= this.scenePosition.x
              && g.position.x - g.biggerOffset.width <= this.scenePosition.x + this.fieldSizes.width )
            && ( g.position.y + g.biggerOffset.height >= this.scenePosition.y
              && g.position.y - g.biggerOffset.height <= this.scenePosition.y + this.fieldSizes.height )
          )
          {
            this._visibleGameObjects.push( g );
            // distance from 10 between object and camera is ratio 1
            ratioz = 10 / ( g.position.z - this.scenePosition.z );
            g.render( _buffer.ctx, physicRatio, ratioz, this.scenePosition, this.renderSizes );
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
      _buffer.ctx.globalAlpha = this.opacity;
      
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
      
      this.getFocus();
      this.checkLimits();
      this.applyShake();
    }
    
    ctx.translate( this.renderPosition.x * drawRatio >> 0
                  , this.renderPosition.y * drawRatio >> 0 );
    ctx.rotate( this.renderPosition.rotation );
    
    ctx.drawImage( _buffer.canvas
          , -this.renderSizes.width * this.renderSizes.scaleX * drawRatio * 0.5 >> 0
          , -this.renderSizes.height * this.renderSizes.scaleY * drawRatio * 0.5 >> 0
          , this.renderSizes.width * this.renderSizes.scaleX * drawRatio >> 0
          , this.renderSizes.height * this.renderSizes.scaleY * drawRatio >> 0 );
    
    // the GUI will totally change with DOM components, try to not use it
    // prefer using GameObjects in your scene
    if ( this.gui )
    {
      this.gui.render( ctx, this.renderPosition, this.renderSizes, drawRatio, physicRatio );
    }
    
    ctx.rotate( -this.renderPosition.rotation );
    ctx.translate( -this.renderPosition.x * drawRatio >> 0
                  , -this.renderPosition.y * drawRatio >> 0 );
    
  }
  
  /****
   * check camera limits
   */
  Camera.prototype.checkLimits = function()
  {
    var limits = this.limits;
    if ( limits.minX != undefined && this.scenePosition.x < limits.minX )
      this.scenePosition.x = limits.minX;
    else if ( limits.maxX != undefined && this.scenePosition.x + this.renderSizes.width > limits.maxX )
      this.scenePosition.x = limits.maxX - this.renderSizes.width;
    if ( limits.minY != undefined && this.scenePosition.y < limits.minY )
      this.scenePosition.y = limits.minY;
    else if ( limits.maxY != undefined && this.scenePosition.y + this.renderSizes.height > limits.maxY )
      this.scenePosition.y = limits.maxY - this.renderSizes.height;
  }
  
  /***
   * screenChangedSizeIndex@void( physicRatio@float )
   when the engine, or you change quality
   TODO - remove newSizes if this isn't used / useful
   */
  Camera.prototype.screenChangedSizeIndex = function( physicRatio, newSizes )
  {
    this.renderSizes.width  = this.fieldSizes.width * physicRatio >> 0;
    this.renderSizes.height = this.fieldSizes.height * physicRatio >> 0;
    this.renderPosition.x = this.savedPosition.x * physicRatio >> 0;
    this.renderPosition.y = this.savedPosition.y * physicRatio >> 0;
    this._buffer.canvas.width = this.renderSizes.width;
    this._buffer.canvas.height = this.renderSizes.height;
  }
  /****
   * add@void( camera@Camera )
   childs possible with camera, not often usefull but could be
   TODO - I think there is problems with this, I just tried it quickly
   */
  Camera.prototype.add = function( camera )
  {
    this.cameras.push( camera );
    ++this.maxCameras;
  }
  
  /****
   * remove@void( camera@Camera )
   remove a camera affilied in this one
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
  }
  
  /****
   * create a shake with given range
    you can only have one at a time
   */
  Camera.prototype.shake = function( xRange, yRange, duration )
  {
    this.shakeData = {
      "startedAt" : Date.now()
      ,"duration" : duration
      ,"xRange"   : xRange
      ,"yRange"   : yRange
      ,"prevX"    : this.shakeData ? this.shakeData.prevX : 0
      ,"prevY"    : this.shakeData ? this.shakeData.prevY : 0
    };
  }
  
  /****
   * make the shake happen
   */
  Camera.prototype.applyShake = function()
  {
    if ( !this.shakeData )
      return;
    
    var shake = this.shakeData;
    // restore previous shake
    this.scenePosition.x -= shake.prevX;
    this.scenePosition.y -= shake.prevY;
    if ( Date.now() - this.shakeData.startedAt > this.shakeData.duration )
    {
      delete this.shakeData;
      return;
    }
    
    shake.prevX = - ( Math.random() * shake.xRange ) + ( Math.random() * shake.xRange ) >> 0;
    shake.prevY = - ( Math.random() * shake.yRange ) + ( Math.random() * shake.yRange ) >> 0;
    
    this.scenePosition.x += shake.prevX;
    this.scenePosition.y += shake.prevY;
  }
  
  /****
   * focus@void( gameObject@GameObject, offsets@Vector2 )
    give a target to this camera, then camera will focus it until you changed or removed it
    you can lock independent axes
   */
  Camera.prototype.focus = function( gameObject, lock )
  {
    this.target = gameObject;
    this.focusLocks = lock;
  }
  
  /****
   * getFocus@void
    apply focus on target if there is one
   */
  Camera.prototype.getFocus = function()
  {
    if ( !this.target )
      return;
    var pos = this.target.getPos();
    var ratioz = ( Math.abs( this.scenePosition.z + pos.z ) - 10 ) * 0.1 + 1;
    if ( !this.focusLocks.x )
      this.scenePosition.x = pos.x - ( this.fieldSizes.width * 0.5 ) / ratioz;
    if ( !this.focusLocks.y )
      this.scenePosition.y = pos.y - ( this.fieldSizes.height * 0.5 ) / ratioz;
  }
  
  /****
   convertMousePos@MouseVector2( mouse@MouseVector2, physicRatio@float )
   * convert mouse pos with harmonics and ratio
   */
  Camera.prototype.convertMousePos = function( mouse, physicRatio )
  {
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
  }
  
  /***
  * custom events
   return true inside these functions if you want stop propagation (not propaging in GameObjects)
  */
  Camera.prototype.onMouseDown  = function(){};
  Camera.prototype.onMouseUp    = function(){};
  Camera.prototype.onMouseMove  = function(){};
  Camera.prototype.onMouseEnter = function(){};
  Camera.prototype.onMouseLeave = function(){};
  Camera.prototype.onMouseClick = function(){};
  
  /* last event, called after all
   very usefull when you want to do something only if you didn't click on anything (just stopPropagation and this won't be called)  */
  Camera.prototype.onLastMouseMove  = function(){};
  Camera.prototype.onLastMouseDown  = function(){};
  Camera.prototype.onLastMouseUp    = function(){};
  Camera.prototype.onLastMouseClick = function(){};
  
  /***
  * onMouseDown@void( mouse@MouseVector2, physicRatio@float )
  */
  Camera.prototype.oOnMouseDown = function( mouse, physicRatio )
  {
    mouse.isDown = true;
    mouse.date   = Date.now();
    this._propagationEvent[ mouse.index ] = mouse;
    this.mouseDetectorHandler( "Down", mouse, physicRatio );
  }
  
  /***
  * onMouseUp@void( mouse@MouseVector2, physicRatio@float )
  */
  Camera.prototype.oOnMouseUp = function( mouse, physicRatio )
  {
    if ( Date.now() < this._propagationEvent[ mouse.index ].date + CONFIG.CLICK_DELAY )
      this.mouseDetectorHandler( "Click", mouse, physicRatio );
    
    this.mouseDetectorHandler( "Up", mouse, physicRatio );
    this._propagationEvent[ mouse.index ] = {};
  }
  
  /***
   * onMouseMove@void( mouse@MouseVector2, physicRatio@float )
   */
  Camera.prototype.oOnMouseMove = function( mouse, physicRatio )
  {
    if ( !this._propagationEvent[ mouse.index ].index )
      this._propagationEvent[ mouse.index ] = mouse;
    
    this.lastPointersPos[ mouse.index ] = mouse;
    this.indexMouseOver[ mouse.index ]  = true;
    this.mouseDetectorHandler( "Move", mouse, physicRatio );
  }
  
  /****
   * onMouseEnter@void( mouse@MouseVector2, physicRatio@float )
   * when the mouse enter in the camera field
   this isn't called by the main mouse handler because it's a custom event over the native
   */
  Camera.prototype.oOnMouseEnter = function( mouse, physicRatio )
  {
    mouse = this.convertMousePos( mouse, physicRatio );
    this.onMouseEnter( mouse );
  }
  
  /****
   * onMouseLeave@void( mouse@MouseVector2, physicRatio@float )
   * when the mouse leave the camera field (same than previously)
   */
  Camera.prototype.oOnMouseLeave = function( mouse, physicRatio )
  {
    this.indexMouseOver[ mouse.index ] = false;
    mouse = this.convertMousePos( mouse, physicRatio );
    this.onMouseLeave( mouse );
  }
  
  /****
   * mouseDetectorHandler@bool( eventType@string, mouse@MouseVector2, physicRatio@float )
   main mouse handler
   */
  Camera.prototype.mouseDetectorHandler = function( eventType, mouse, physicRatio )
  {
    if ( this.freeze || this.sleep || this._propagationEvent[ mouse.index ][ "prevent" + eventType ] )
      return;
    
    mouse = this.convertMousePos( mouse, physicRatio );
    
    for ( var i in this.scene[ "onGlobalMouse" + eventType ] )
    {
      if ( this.scene[ "onGlobalMouse" + eventType ][ i ].enable )
        if ( this.scene[ "onGlobalMouse" + eventType ][ i ][ "onGlobalMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) )
          return;
    }
    
    this.trigger( "mouse" + eventType, mouse );
    if ( this[ "onMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    if ( this.gui && this.gui[ "onMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] ) || mouse.stopPropagation )
      return;
    
    mouse.x += this.scenePosition.x;
    mouse.y += this.scenePosition.y;
    for ( var i = this._visibleGameObjects.length - 1, g; i >= 0; --i )
    {
      g = this._visibleGameObjects[ i ];
      
      if ( _gameObjectMouseEvent( eventType, g, mouse, this._propagationEvent[ mouse.index ] ) )
        return;
    }
    
    if ( !mouse.stopPropagation && !this._propagationEvent[ mouse.index ][ "preventLast" + eventType ] )
    {
      this.trigger( "onLastMouse" + eventType, mouse, this._propagationEvent[ mouse.index ] );
      this[ "onLastMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
      
      for ( var i in this.scene[ "onLastGlobalMouse" + eventType ] )
      {
        if ( this.scene[ "onLastGlobalMouse" + eventType ][ i ].enable )
          this.scene[ "onLastGlobalMouse" + eventType ][ i ][ "onLastGlobalMouse" + eventType ]( mouse, this._propagationEvent[ mouse.index ] );
      }
    }
    
  }
  
  /****
   * _gameObjectMouseEvent@bool( eventType@string, g@GameObject, mouse@MouseVector2 )
   */
  function _gameObjectMouseEvent( eventType, g, mouse, propagationEvent )
  {
    if ( !g.enable )
      return false;
    
    if ( g.collider && ( g[ "onMouse" + eventType ] || g.onMouseLeave || g.onMouseEnter ) )
    {
      var wasOver = g.indexMouseOver[ mouse.index ];
      if ( CollisionSystem.checkCollisionWith( mouse, g.collider ) )
      {
        // mouseEnter event occurs here
        g.indexMouseOver[ mouse.index ] = true;
        if ( !wasOver && g.onMouseEnter && g.onMouseEnter( mouse, propagationEvent ) )
          return true;
        if ( g[ "onMouse" + eventType ] && g[ "onMouse" + eventType ]( mouse, propagationEvent ) )
          return true;
      }
      // no collision but was over last frame, there is a leave event
      else if ( wasOver && g.onMouseLeave )
      {
        g.indexMouseOver[ mouse.index ] = false;
        if ( g.onMouseLeave( mouse, propagationEvent ) )
          return true;
      }
    }
    
    for ( var c = g.childrens.length - 1, co; c >= 0; --c )
    {
      if ( _gameObjectMouseEvent( eventType, g.childrens[ c ], mouse, propagationEvent ) )
        return true;
    }
  }
  Event.addEventCapabilities( Camera );
  Camera.prototype.DEName = "Camera";
  
  CONFIG.debug.log( "Camera loaded", 3 );
  return Camera;
} );