/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Render
 * @class this create the canvas, buffers, and manage resizing
 * @example Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
 * Game.render.init();
 */
define( [ 'DE.CONFIG', 'DE.Sizes', 'DE.Time', 'DE.MainLoop', 'DE.CollisionSystem', 'DE.Inputs', 'DE.CanvasBuffer', 'DE.Event' ],
function( CONFIG, Sizes, Time, MainLoop, CollisionSystem, Inputs, CanvasBuffer, Event )
{
  function Render( divId, params )
  {
    params      = params || {};
    this.id     = 0;
    this.divId  = divId || undefined;
    this.canvas = null;
    this.ctx    = null;
    
    this.sizes       = new Sizes( params.width || CONFIG.defaultRenderWidth || 100, params.height || CONFIG.defaultRenderHeight || 100, params.scaleX || 1, params.scaleY || 1 );
    this.savedSizes  = new Sizes( params.width || CONFIG.defaultRenderWidth || 100, params.height || CONFIG.defaultRenderHeight || 100, params.scaleX || 1, params.scaleY || 1 );
    
    var _drawRatio   = 1;
    this.physicRatio = 1;
    this.alpha       = params.alpha || 1;
    
    this.conserveSizes  = params.conserveSizes || false;
    this.fullScreenMode = params.fullScreen || null;
    this.cameras        = new Array();
    this.maxCameras     = 0;
    
    this.events = {};
    /**
     * flag if you use HTML5 Fullscreen API
     * @protected
     * @memberOf Render
     * @type {Boolean}
     */
    this.isFullscreen = false;
    
    this.freeze = false;

    /****
     * init@void
      create canvas render, buffer, init ctx, and append in the dom
      bind Inputs, then call updateSizes
     */
    this.init = function()
    {
      if ( this.inited )
        return;
      MainLoop.addRender( this );
      
      if ( !this.divId )
      {
        this.div = window.document.body;
        CONFIG.debug.log( "%cWARN: you not specified a DOM Object where push the render, it will push in the body *hiiik*", 1, "color:orange" );
      }
      else
      {
        this.div = document.getElementById( this.divId );
        if ( !this.div )
        {
          throw new Error( "Can't found the div by the given id" );
          return false;
        }
      }
      
      this.canvas = document.createElement( "canvas" );
      this.div.appendChild( this.canvas );
      Inputs.addRender( this );
      
      if ( window.WebGL2D )
      {
        WebGL2D.enable( this.canvas );
        this.ctx = this.canvas.getContext("webgl-2d");
      }
      else
        this.ctx = this.canvas.getContext( '2d' );
      
      this.buffer = new CanvasBuffer( this.sizes.width, this.sizes.height );
      this.inited = true;
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
    };
    
    this.goFullscreen = function()
    {
      if ( !this.isFullscreen )
      {
        if ( this.div.requestFullscreen )
          this.div.requestFullscreen();
        else if ( this.div.msRequestFullscreen )
          this.div.msRequestFullscreen();
        else if ( this.div.mozRequestFullScreen )
          this.div.mozRequestFullScreen();
        else if ( this.div.webkitRequestFullscreen )
          this.div.webkitRequestFullscreen();
      }
      else
      {
        if ( document.exitFullscreen )
          document.exitFullscreen();
        else if ( document.msExitFullscreen )
          document.msExitFullscreen();
        else if ( document.mozCancelFullScreen )
          document.mozCancelFullScreen();
        else if ( document.webkitCancelFullScreen )
          document.webkitCancelFullScreen();
      }
    }
    
    /****
     * updateSizes@void
      change size, used for init and when change quality
     */
    this.updateSizes = function()
    {
      if ( !this.inited )
        return;
      if ( this.conserveSizes )
      {
        this.sizes.width  = this.div.offsetWidth.valueOf();
        this.sizes.height = this.div.offsetHeight.valueOf();
      }
      else
      {
        this.div.style.width  = this.sizes.width + "px";
        this.div.style.height = this.sizes.height + "px";
      }
      
      this.canvas.width = this.sizes.width.valueOf();
      this.canvas.height= this.sizes.height.valueOf();
      this.canvas.id = this.id;
      
      if ( this.fullScreenMode )
      {
        this.fullScreen( this.fullScreenMode );
        this.resizeOnEventResize();      
      }
      this.buffer.resize( this.sizes.width, this.sizes.height );
    }
    
    /***
     * screenChangedSizeIndex@void
      when Screen class change index size, update sizes and ratios
     */
    this.screenChangedSizeIndex = function( physicRatio, newSizes )
    {
      this.savedSizes.width  = newSizes.w;
      this.savedSizes.height = newSizes.h;
      this.physicRatio = physicRatio;
      this.updateSizes();
      
      for ( var i = 0, c; c = this.cameras[ i ]; ++i )
      {
        c.screenChangedSizeIndex( physicRatio, newSizes );
      }
    }
    
    /****
     * resize@void
     */
    this.resize = function( w, h, stretch )
    {
      if ( this.div != window.document.body )
      {
        this.div.style.width  = w + "px";
        this.div.style.height = h + "px";
      }
      
      this.canvas.width  = w;
      this.canvas.height = h;
      this.sizes.width   = w;
      this.sizes.height  = h;
      
      /*if ( !stretch )
      {
      }*/
    }
    
    /****
     * resizeOnEventResize@void
      bind window resize event if wanted
     */
    this.resizeOnEventResize = function()
    {
      if ( !this.fullScreenMode )
        return;
      
      var o = this;
      var lastResize = undefined;
      var recallMethod = function()
      {
        Event.trigger( "screenSizeChange" );
        o.fullScreenMethod.call( o );
      };
      if ( window.addEventListener )
      {
        window.addEventListener( "resize", function()
        {
          lastResize && window.clearTimeout( lastResize );
          lastResize = window.setTimeout( recallMethod, 200 );
        }, false );
      }
      else if ( window.attachEvent )
      {
        window.attachEvent( "onresize", function()
        {
          lastResize && window.clearTimeout( lastResize );
          lastResize = window.setTimeout( recallMethod, 200 ); 
        } );
      }
    }
    
    /***
     * resizeRatio@void
      resize with ratio, stretched or not
     */
    this.resizeRatio = function( w, h , stretch )
    {
      var baseW = this.savedSizes.width;
      var baseH = this.savedSizes.height;
      var calcRatio = w / baseW;
      
      if ( calcRatio * baseH > h )
      {
        calcRatio = h / baseH;
      }

      var newW = calcRatio * baseW >> 0;
      var newH = calcRatio * baseH >> 0;
      this.resize( newW, newH, stretch );
      
      if ( this.isFullscreen )
      {
        this.div.style.marginLeft = 0;
        this.div.style.marginTop  = 0;
      }
      else
      {
        this.div.style.marginLeft = ( ( w - newW ) / 2 ) + "px";
        this.div.style.marginTop = ( ( h - newH ) / 2 ) + "px";
      }
      
      _drawRatio = newW / this.savedSizes.width;
    }

    var _fullScreenMethod;
    /****
     * changeFullScreenMode@void
      change current resize
     */
    this.changeFullScreenMode = function( mode )
    {
      this.fullScreenMode = mode;
      switch( mode )
      {
        case "ratioStretch" : 
          _fullScreenMethod = function( screenW, screenH )
          {
            this.resizeRatio(screenW, screenH, true);
          };
        break;
        case "fullStretch" : 
          _fullScreenMethod = function( screenW, screenH )
          {
            this.resize(screenW, screenH, true);
          };
        break;
        case "ratio":
          _fullScreenMethod = function( screenW, screenH )
          {
            this.resizeRatio(screenW, screenH, false);
          };
        break;
        // default = nothing
        default:
          _fullScreenMethod = function( screenW, screenH )
          {
            //this.resize(screenW, screenH, false);
          };
        break;
      }
    }
    
    /****
     * fullScreenMethod@void
     */
    this.fullScreenMethod = function()
    {
      var offsetH = window.DEremoveUsableHeight || 0;
      
      var screenW = ( window.innerWidth || document.documentElement.clientWidth );
      var screenH = ( window.innerHeight || document.documentElement.clientHeight ) - offsetH;
      
      var divParentH = window.getComputedStyle( this.div.parentElement, null ).getPropertyValue( 'height' );
      if ( this.div.parentElement != null
          && divParentH && screenH < document.body.clientHeight )
      {
        var divW = this.div.parentElement.innerWidth || this.div.parentElement.clientWidth;
        var divH = this.div.parentElement.innerHeight || this.div.parentElement.clientHeight;
        
        if ( divH < screenH )
          screenH = divH;
        if ( divW < screenW )
          screenW = divW;
      }
      
      if ( !_fullScreenMethod )
      {
        throw ("Render.js : fullScreenMethod need a fullScreenMode, maybe you never used changeFullScreenMode")
      }
      
      _fullScreenMethod.call( this, screenW, screenH );
    }
    
    /****
     * fullScreen@void
      TODO - WIP
     */
    this.fullScreen = function( mode, automatism )
    {
      if ( mode )
      {
        this.changeFullScreenMode( mode );
      }

      if ( automatism )
      {
        // add on listener Resize
      }

      this.fullScreenMethod();
    }

    /****
     * render@void
      renderise all cameras binded on this Render
     */
    this.render = function()
    {
      if ( this.freeze )
        return;
      
      this.ctx.globalAlpha = this.alpha;
      this.ctx.fillStyle = "black";
      this.ctx.fillRect( 0, 0, this.sizes.width, this.sizes.height );
      
      for ( var i = 0, camera; camera = this.cameras[ i ]; ++i )
        camera.render( this.ctx, _drawRatio, this.physicRatio );
      
      if ( CONFIG.DEBUG_LEVEL > 0 )
      {
        this.ctx.globalAlpha = 1;
        this.ctx.font = "24px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText( "DeltaTime: " + Time.deltaTime
                          , ( this.sizes.width >> 0 ) - 220
                          , 30 );
        this.ctx.fillText( "MissedFrame: " + Time.missedFrame
                          , ( this.sizes.width >> 0 ) - 220
                          , 60 );
        this.ctx.fillText( "FPS: " + Time.fps
                          , ( this.sizes.width >> 0 ) - 220
                          , 90 );
      }
    }
    
    this.update = function()
    {
      if ( this.freeze )
        return;
      
      for ( var i in this.events )
      {
        this.camerasMouseCollide.apply( this, this.events[ i ] );
        delete this.events[ i ];
      }
    };
    
    this.updateGuis = function()
    {
      if ( this.sleep || this.freeze )
        return;
      
      for ( var i = 0, camera; camera = this.cameras[ i ]; ++i )
        if ( camera.gui && !camera.gui.sleep )
          camera.gui.update();
    };
    
    /****
     * add@void( camera@Camera )
      add a camera on this render
     */
    this.add = function( camera )
    {
      this.cameras.push( camera );
      camera.on( "changeCursor", function( cursor )
      {
        this.canvas.style.cursor = cursor;
      }, this );
      this.maxScenes++;
      camera.screenChangedSizeIndex( this.physicRatio, this.savedSizes );
    }
    
    /****
     * remove@void( camera@Camera )
      remove a camera on this render ( not deleted ! )
     */
    this.remove = function( camera )
    {
      var pos = this.cameras.indexOf( camera );
      if ( pos == -1 )
      {
        CONFIG.debug.log( "Remove camera not found ", 1, camera );
        return;
      }
      
      this.cameras.splice( pos, 1 );
      this.maxScenes--;
    }
    
    /****
     * camerasMousCollide@void( eventName@string, x@Int, y@Int, index@Int )
      trigger mouses/touches events in cameras
     */
    this.camerasMouseCollide = function( eventName, x, y, index )
    {
      var mouse = _getMouseCoords.call( this, x, y, index );
      
      // custom events ? if return true stop propagation now
      if ( this[ 'on' + eventName ]( mouse ) || mouse.stopPropagation )
        return mouse;
      for ( var i = 0, cam, camPos; i < this.cameras.length; i++ )
      {
        cam = this.cameras[ i ];
        if ( cam.sleep )
          continue;
        
        camPos = {
          'x'      : cam.renderPosition.x - ( cam.renderSizes.width * 0.5 * cam.renderSizes.scaleX )
          ,'y'     : cam.renderPosition.y - ( cam.renderSizes.height * 0.5 * cam.renderSizes.scaleY )
          ,'width' : cam.renderSizes.width * cam.renderSizes.scaleX
          ,'height': cam.renderSizes.height * cam.renderSizes.scaleY
          ,'enable': true
        };
        
        // console.log( 'camPos', mouse );
        if ( CollisionSystem.pointFixedBoxCollision( mouse, camPos ) )
        {
          if ( !cam.indexMouseOver[ index ] && cam.oOnMouseEnter( mouse, this.physicRatio ) )
            break;
          if ( cam[ 'oOn' + eventName ]( mouse, this.physicRatio ) )
            break;
        }
        else if ( cam.indexMouseOver[ index ] && cam.oOnMouseLeave( mouse, this.physicRatio ) )
        {
          break;
        }
      }
      
      if ( !mouse.stopPropagation )
        this[ 'lastOn' + eventName ]( mouse );
      return mouse;
    }
    
    /* Custom Events
      return true to stop current event */
    this.onMouseMove = function(){};
    this.onMouseDown = function(){};
    this.onMouseUp = function(){};
    
    /* last event, called after all 
      if no stopPropagation */
    this.lastOnMouseMove = function(){};
    this.lastOnMouseDown = function(){};
    this.lastOnMouseUp = function(){};
    
    this.oOnMouseDown = function( mouse )
    {
      this.events[ Date.now() + "down" ] = [ "MouseDown", mouse.x, mouse.y, mouse.index ];
      // this.camerasMouseCollide( "MouseDown", mouse.x, mouse.y, mouse.index );
    }
    this.oOnMouseUp = function( mouse )
    {
      this.events[ Date.now() + "up" ] = [ "MouseUp", mouse.x, mouse.y, mouse.index ];
      // this.camerasMouseCollide( "MouseUp", mouse.x, mouse.y, mouse.index );
    }
    this.oOnMouseMove = function( mouse )
    {
      this.events[ Date.now() + "move" ] = [ "MouseMove", mouse.x, mouse.y, mouse.index ];
      // this.camerasMouseCollide( "MouseMove", mouse.x, mouse.y, mouse.index );
    }
    
    /****
     * @private
     */
      /****
       * _scrollPosition@Vector2
        return the scollPostion of the window
       **/
      function _scrollPosition()
      {
        return {
          x: document.scrollLeft || window.pageXOffset,
          y: document.scrollTop || window.pageYOffset
        };
      }
      
      /****
       * _getMouseCoords@Mouse
       */
      function _getMouseCoords( x, y, index )
      {
        var pos = { "x": x, "y": y };
        var elem = this.canvas;
        var offsetLeft = 0, offsetTop = 0;
        while( elem )
        {
          offsetLeft += elem.offsetLeft;
          offsetTop += elem.offsetTop;
          elem = elem.parentElement;
        }
        pos.x -= offsetLeft;
        pos.y -= offsetTop;
        return {
            'x': pos.x / _drawRatio + _scrollPosition().x >> 0
          , 'y': pos.y / _drawRatio + _scrollPosition().y >> 0
          , 'index': index
        };
      }
    /*** -private- ***/
  }
  Render.prototype.DEName = "Render";
  
  CONFIG.debug.log( "Render loaded", 3 );
  return Render;
} );