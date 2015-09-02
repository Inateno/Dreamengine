/**
* @author Inateno / http://inateno.com / http://dreamirl.com
*/

/**
* @constructor Render
* @class this create the canvas, buffers, and manage resizing
* @example Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
* Game.render.init();
*/
define( [ 'PIXI', 'DE.CONFIG', 'DE.Time', 'DE.MainLoop', 'DE.CollisionSystem', 'DE.Inputs' ],
function( PIXI, CONFIG, Time, MainLoop, CollisionSystem, Inputs )
{
  // TODO use PIXI renderer
  function Render( divId, params )
  {
    params      = params || {};
    
    var _drawRatio = 1;
    
    // create a renderer instance
    this.pixiRenderer = new PIXI.autoDetectRenderer(
      params.width || CONFIG.defaultRenderWidth || 100
      , params.height || CONFIG.defaultRenderHeight || 100
      , params
    );
    this.pixiRenderer.plugins[ 'interaction' ].removeEvents();
    this.pixiRenderer.plugins[ 'interaction' ].destroy();
    delete this.pixiRenderer.plugins[ 'interaction' ];
    
    this.pixiContainer = new PIXI.Container();
    
    this.cameras = new Array();
    this._renderedObjects = new Array();
    
    this.debugRender = new PIXI.Text( "DeltaTime: 1.2\nMissedFrame: 0\nFPS: 60\n", {font: "25px Snippet", fill: "white", align: "left"} );
    this.debugRender.y = 10;
    this.debugRender.x = 10;
    
    this.id     = "render-" + Date.now() + "-" + ( Math.random() * Date.now() >> 0 );
    this.divId  = divId || undefined;

    this.sizes       = new PIXI.Point( params.width || CONFIG.defaultRenderWidth || 100, params.height || CONFIG.defaultRenderHeight || 100 );
    this.savedSizes  = new PIXI.Point( params.width || CONFIG.defaultRenderWidth || 100, params.height || CONFIG.defaultRenderHeight || 100 );
    this.physicRatio = 1;

    // this.conserveSizes  = params.conserveSizes || false;
    this.fullScreenMode = params.fullScreen || null;
    // this.maxCameras     = 0;
    this.enable = true;
    
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
      
      this.div = document.getElementById( divId );
      this.div.appendChild( this.pixiRenderer.view );
      this.view = this.pixiRenderer.view;
      this.inited = true;
      
      MainLoop.addRender( this );
      
      this.pixiRenderer.view.setAttribute( "id", this.id );
      Inputs.addRender( this );
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
    
    /***
     * toggle fullScreen API
     */
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
    };

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
        this.sizes.x = this.div.offsetWidth.valueOf();
        this.sizes.y = this.div.offsetHeight.valueOf();
      }
      else
      {
        this.div.style.width  = this.sizes.x + "px";
        this.div.style.height = this.sizes.y + "px";
      }
      
      this.view.width = this.savedSizes.x.valueOf() >> 0;
      this.view.height= this.savedSizes.y.valueOf() >> 0;
      
      this.view.style.width = this.sizes.x.valueOf() + "px";
      this.view.style.height= this.sizes.y.valueOf() + "px";
      this.view.id = this.id;
      
      if ( this.fullScreenMode )
      {
        this.changeFullScreenMode( this.fullScreenMode );
        this.fullScreenMethod();
        this.resizeOnEventResize();      
      }
      // this.buffer.resize( this.sizes.x, this.sizes.y );
    }

    /***
     * screenChangedSizeIndex@void
      when Screen class change index size, update sizes and ratios
     */
    this.screenChangedSizeIndex = function( physicRatio, newSizes )
    {
      this.savedSizes.x = newSizes.w;
      this.savedSizes.y = newSizes.h;
      this.physicRatio = physicRatio;
      this.updateSizes();

      for ( var i = 0, c; c = this.cameras[ i ]; ++i )
      {
        c.screenChangedSizeIndex( physicRatio, newSizes );
      }
    }

    // deprecated, using resize from pixi (almost the same) ??
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

      this.view.style.width  = w + "px";
      this.view.style.height = h + "px";
      this.sizes.x   = w;
      this.sizes.y  = h;

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
      if ( !this.fullScreenMode || this.resizeEventBinded )
        return;
        
      this.resizeEventBinded = true;
      var o = this;
      var lastResize = undefined;
      var recallMethod = function()
      {
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
      var baseW = this.savedSizes.x;
      var baseH = this.savedSizes.y;
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
      
      _drawRatio = newW / this.savedSizes.x;
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
            this.resizeRatio( screenW, screenH, true );
          };
        break;
        case "fullStretch" : 
          _fullScreenMethod = function( screenW, screenH )
          {
            this.resize( screenW, screenH, true );
          };
        break;
        case "ratio":
          _fullScreenMethod = function( screenW, screenH )
          {
            this.resizeRatio( screenW, screenH, false );
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
      var screenW = ( window.innerWidth || document.documentElement.clientWidth );
      var screenH = ( window.innerHeight || document.documentElement.clientHeight );

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
    
    this.directRender = function( container )
    {
      this.pixiRenderer.render( container );
    };
    
    /****
     * render@void
      renderise all cameras binded on this Render
     */
    this.render = function()
    {
      this.pixiContainer.removeChildren();
      for ( var i = 0, c = this.cameras.length; i < c; ++i )
      {
        if ( this.cameras[ i ].enable )
        {
          this.pixiContainer.addChild( this.cameras[ i ].render( this.physicRatio ) );
        }
      }
      
      if ( CONFIG.DEBUG_LEVEL )
      {
        this.pixiContainer.addChild( this.debugRender );
        this.debugRender.text = "DeltaTime: " + Time.deltaTime + "\nMissedFrame: " + Time.missedFrame + "\nFPS: " + Time.fps;
      }
      
      this.pixiRenderer.render( this.pixiContainer );
      
      for ( var i = 0, c = this.cameras.length; i < c; ++i )
      {
        if ( this.cameras[ i ].enable )
        {
          this.cameras[ i ].restoreAfterRender();
        }
      }
    };
    
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
      if ( !this.enable )
        return;

      for ( var i = 0, camera; camera = this.cameras[ i ]; ++i )
        if ( camera.enable && camera.gui && camera.gui.enable )
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
        // this.canvas.style.cursor = cursor;
        this.pixiRenderer.view.style.cursor = cursor;
      }, this );
      this.maxScenes++;
      // camera.screenChangedSizeIndex( this.physicRatio, this.savedSizes ); // TODO
    };

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

    // TODO PIXI had a touch/mouse event side
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
        if ( !cam.enable )
          continue;
        
        // camPos = cam.getBounds();
        camPos = {
          'x'      : cam.x
          ,'y'     : cam.y
          ,'width' : cam.renderSizes.x * cam.renderScale.x
          ,'height': cam.renderSizes.y * cam.renderScale.y
          ,'enable': true
        };
        
        if ( CollisionSystem.standardPointFixedBoxCollision( mouse, camPos ) )
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

    // /* Custom Events
    //   return true to stop current event */
    this.onMouseMove = function(){};
    this.onMouseDown = function(){};
    this.onMouseUp = function(){};

    // /* last event, called after all 
    //   if no stopPropagation */
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
      var elem = this.pixiRenderer.view;
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