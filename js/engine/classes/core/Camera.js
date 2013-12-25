/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* Camera( width@Int, height@Int, x@Int, y@Int, [params] )
 the camera is to see in scenes, it have to be append to a Render and have to get a scene
 you can move your camera inside a render as you want
 also you can make more than one camera in a Render or looking in a scene
 
 example: if you want to make a mini-map, you can make a camera with big sizes (FHD), but little scale(0.2)
 and maybe override the render method to call custom rendering for mini-map
 then you got two camera, these two are looking at the same scene, and are in the same Render
 you "mini-map" camera is over the first carmera
 
 example2: on a split-screen multiplayer game, you can make one camera by player
**/
define( [ 'DE.CONFIG', 'DE.Sizes', 'DE.Vector2', 'DE.CanvasBuffer', 'DE.CollisionSystem', 'DE.ImageManager', 'DE.Event' ],
function( CONFIG, Sizes, Vector2, CanvasBuffer, CollisionSystem, ImageManager, Event )
{
  function Camera( width, height, x, y, params )
  {
    params = params || {};
    
    this.name   = params.name || "";
    this.tag    = params.tag || "";
    this.scene  = null;
    this.gui    = undefined;
    
    this.sizes      = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    this.savedSizes = new Sizes( width, height, params.scale || params.scaleX || 1
                                , params.scale || params.scaleY || 1 );
    // position in the render (canvas)
    this.position      = new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    this.savedPosition = new Vector2( x + width * 0.5, y + height * 0.5, params.z || -10 );
    
    // position inside the sceneworld
    this.realposition = new Vector2( params.realx || x, params.realy || y
                                    , params.realz || params.z || -10 );
    
    this.opacity = params.opacity || 1;
    this.backgroundColor = params.backgroundColor || null;
    this.backgroundImage = params.backgroundImage || null;
    
    this.cameras    = new Array();
    this.maxCameras = 0;
    
    this.indexMouseOver  = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]; // 12 touches max ?
    this.lastPointersPos = {};
    
    this.freeze  = false;
    this.sleep   = false;
    
    this.startX  = 0
    this.startY  = 0
    this._buffer = new CanvasBuffer( this.sizes.width, this.sizes.height );
    this._gameObjects = [];
    this._visibleGameObjects = [];
    
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
        _buffer.ctx.fillRect( 0, 0, this.sizes.width, this.sizes.height );
      }
      if ( this.backgroundImage != null )
      {
        _buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ], 0, 0, this.sizes.width, this.sizes.height );
      }
      
      _buffer.ctx.save();
      // renderize here game objects
      if ( this.scene )
      {
        var _gameObjects = this._gameObjects = this.scene.getGameObjects();
        this._visibleGameObjects = [];
        for ( var i = 0, t = _gameObjects.length, g,ratioz; i < t; i++ )
        {
          g = _gameObjects[ i ];
          if ( g && !g.disable
            && g.position.z > this.realposition.z
            && ( g.position.x + g.biggerOffset.width >= this.realposition.x
              && g.position.x - g.biggerOffset.width <= this.realposition.x + this.savedSizes.width )
            && ( g.position.y + g.biggerOffset.height >= this.realposition.y
              && g.position.y - g.biggerOffset.height <= this.realposition.y + this.savedSizes.height )
          )
          {
            this._visibleGameObjects.push( g );
            // distance from 10 between object and camera is ratio 1
            ratioz = 10 / ( g.position.z - this.realposition.z );
            g.render( _buffer.ctx, physicRatio, ratioz, this.realposition, this.sizes );
          }
        }
      }
      else
      {
        _buffer.ctx.textAlign = "center";
        _buffer.ctx.fillStyle = "white";
        _buffer.ctx.fillText( "No scene affiliated :(", this.sizes.width * 0.5, this.sizes.height * 0.5 );
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
        _buffer.ctx.strokeRect( 0, 0, this.sizes.width >> 0
                                   , this.sizes.height >> 0 );
        
        _buffer.ctx.fillStyle = "yellow";
        _buffer.ctx.fillRect( this.sizes.width - 10, this.sizes.height - 10, 10, 10 );
        _buffer.ctx.fillRect( this.sizes.width - 10, 0, 10, 10 );
        _buffer.ctx.fillRect( 0, this.sizes.height - 10, 10, 10 );
        _buffer.ctx.fillRect( 0, 0, 10, 10 );
        
        _buffer.ctx.fillRect( this.sizes.width * 0.5
                            ,this.sizes.height * 0.5
                            , 20, 5 );
        _buffer.ctx.fillRect( this.sizes.width * 0.5
                            ,this.sizes.height * 0.5
                            , 5, 20 );
      }
    }
    
    ctx.translate( this.position.x * drawRatio >> 0
                  , this.position.y * drawRatio >> 0 );
    ctx.rotate( this.position.rotation );
    
    ctx.drawImage( _buffer.canvas
          , -this.sizes.width * this.sizes.scaleX * drawRatio * 0.5 >> 0
          , -this.sizes.height * this.sizes.scaleY * drawRatio * 0.5 >> 0
          , this.sizes.width * this.sizes.scaleX * drawRatio >> 0
          , this.sizes.height * this.sizes.scaleY * drawRatio >> 0 );
    
    // the GUI will totally change with DOM components, try to not use it
    // prefer using GameObjects in your scene
    if ( this.gui )
    {
      this.gui.render( ctx, this.position, this.sizes, drawRatio, physicRatio );
    }
    
    ctx.rotate( -this.position.rotation );
    ctx.translate( -this.position.x * drawRatio >> 0
                  , -this.position.y * drawRatio >> 0 );
    
  }
  
  /***
   * screenChangedSizeIndex@void( physicRatio@float )
   when the engine, or you change quality
   TODO - remove newSizes if this isn't used / usefull in fact
   */
  Camera.prototype.screenChangedSizeIndex = function( physicRatio, newSizes )
  {
    this.sizes.width  = this.savedSizes.width * physicRatio >> 0;
    this.sizes.height = this.savedSizes.height * physicRatio >> 0;
    this.position.x = this.savedPosition.x * physicRatio >> 0;
    this.position.y = this.savedPosition.y * physicRatio >> 0;
    this._buffer.canvas.width = this.sizes.width;
    this._buffer.canvas.height = this.sizes.height;
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
   * focus@void( gameObject@GameObject, offsets@Vector2 )
   focus camera on given target
   TODO - add offsets if there is
   */
  Camera.prototype.focus = function( gameObject, offsets )
  {
    offsets = offsets || undefined;
    
    var ratioz = ( Math.abs( this.realposition.z + gameObject.position.z ) - 10 ) * 0.1 + 1;
    this.realposition.x = gameObject.getPos().x - ( this.sizes.width * 0.5 ) / ratioz;
    this.realposition.y = gameObject.getPos().y - ( this.sizes.height * 0.5 ) / ratioz;
  }
  /****
   convertMousePos@MouseVector2( mouse@MouseVector2, physicRatio@float )
   * convert mouse pos with harmonics and ratio
   */
  Camera.prototype.convertMousePos = function( mouse, physicRatio )
  {
    var harmonics = this.position.getHarmonics();
    if ( harmonics.sin == 0 && harmonics.cos == 0 )
    {
      if ( this.sizes.scaleX != 1 || this.sizes.scaleY != 1 )
      {
        return { x: ( mouse.x / physicRatio - ( ( this.sizes.width - this.sizes.width * this.sizes.scaleX ) / 2 ) ) / this.sizes.scaleX >> 0
          , y: ( mouse.y / physicRatio - ( ( this.sizes.height - this.sizes.height * this.sizes.scaleY ) / 2 ) ) / this.sizes.scaleY >> 0
          , "index": mouse.index };
      }
      return { x: mouse.x / physicRatio >> 0
        , y: mouse.y / physicRatio >> 0
        , "index": mouse.index };
    }
    
    var x = ( this.sizes.width / 2 - mouse.x );
    var y = ( this.sizes.height / 2 - mouse.y );
    
    if ( this.sizes.scaleX != 1 || this.sizes.scaleY != 1 )
    {
      return {
        x: ( ( -(x * harmonics.cos + y * harmonics.sin ) + this.sizes.width / 2 ) / physicRatio
          - ( ( this.sizes.width - this.sizes.width * this.sizes.scaleX ) / 2 ) ) / this.sizes.scaleX >> 0
        , y: ( ( (x * harmonics.sin + y * -harmonics.cos ) + this.sizes.height / 2 ) / physicRatio
          - ( ( this.sizes.height - this.sizes.height * this.sizes.scaleY ) / 2 ) ) / this.sizes.scaleY >> 0
        , "index": mouse.index
      };
    }
    return { x: ( -(x * harmonics.cos + y * harmonics.sin ) + this.sizes.width / 2 ) / physicRatio >> 0
      , y: ( (x * harmonics.sin + y * -harmonics.cos ) + this.sizes.height / 2 ) / physicRatio >> 0
      , "index": mouse.index };
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
  
  /* last event, called after all
   very usefull when you want to do something only if you didn't click on anything (just stopPropagation and this won't be called)  */
  Camera.prototype.lastOnMouseMove  = function(){};
  Camera.prototype.lastOnMouseDown  = function(){};
  Camera.prototype.lastOnMouseUp    = function(){};
  
  /***
  * onMouseDown@void( mouse@MouseVector2, physicRatio@float )
  */
  Camera.prototype.oOnMouseDown = function( mouse, physicRatio )
  {
    this.mouseDetectorHandler( "Down", mouse, physicRatio );
  }
  
  /***
  * onMouseUp@void( mouse@MouseVector2, physicRatio@float )
  */
  Camera.prototype.oOnMouseUp = function( mouse, physicRatio )
  {
    this.mouseDetectorHandler( "Up", mouse, physicRatio );
  }
  
  /***
   * onMouseMove@void( mouse@MouseVector2, physicRatio@float )
   */
  Camera.prototype.oOnMouseMove = function( mouse, physicRatio )
  {
    this.lastPointersPos[ mouse.index ] = mouse;
    this.indexMouseOver[ mouse.index ] = true;
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
    if ( this.freeze || this.sleep )
      return;
    mouse = this.convertMousePos( mouse, physicRatio );
    
    this.trigger( "mouse" + eventType, mouse );
    if ( this[ "onMouse" + eventType ]( mouse ) || mouse.stopPropagation )
      return;
    if ( this.gui && this.gui[ "onMouse" + eventType ]( mouse ) || mouse.stopPropagation )
      return;
    
    mouse.x += this.realposition.x;
    mouse.y += this.realposition.y;
    for ( var i = this._visibleGameObjects.length - 1, g; i >= 0; --i )
    {
      g = this._visibleGameObjects[ i ];
      
      if ( _gameObjectMouseEvent( eventType, g, mouse ) )
        return;
    }
    
    if ( !mouse.stopPropagation )
    {
      this.trigger( "lastMouse" + eventType, mouse );
      this[ "lastOnMouse" + eventType ]( mouse );
    }
  }
  
  /****
   * _gameObjectMouseEvent@bool( eventType@string, g@GameObject, mouse@MouseVector2 )
   */
  function _gameObjectMouseEvent( eventType, g, mouse )
  {
    if ( g.disable )
      return false;
    
    if ( g.collider && ( g[ "onMouse" + eventType ] || g.onMouseLeave || g.onMouseEnter ) )
    {
      var wasOver = g.indexMouseOver[ mouse.index ];
      if ( CollisionSystem.checkCollisionWith( mouse, g.collider ) )
      {
        // mouseEnter event occurs here
        g.indexMouseOver[ mouse.index ] = true;
        if ( !wasOver && g.onMouseEnter && g.onMouseEnter( mouse ) )
          return true;
        if ( g[ "onMouse" + eventType ] && g[ "onMouse" + eventType ]( mouse ) )
          return true;
      }
      // no collision but was over last frame, there is a leave event
      else if ( wasOver && g.onMouseLeave )
      {
        g.indexMouseOver[ mouse.index ] = false;
        if ( g.onMouseLeave( mouse ) )
          return true;
      }
    }
    
    for ( var c = 0, co; co = g.childrens[ c ]; ++c )
    {
      if ( _gameObjectMouseEvent( eventType, co, mouse ) )
        return true;
    }
  }
  Event.addEventCapabilities( Camera );
  Camera.prototype.DEName = "Camera";
  
  CONFIG.debug.log( "Camera loaded", 3 );
  return Camera;
} );