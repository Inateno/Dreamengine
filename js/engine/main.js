/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* engine constructor
**/
define( [ 'PIXI', 'DE.COLORS', 'DE.CONFIG', 'DE.Time', 'DE.Vector2', 'DE.ImageManager'
       , 'DE.CollisionSystem', 'DE.BaseRenderer', 'DE.Scene', 'DE.Rigidbody'
       , 'DE.GameObject', 'DE.FixedBoxCollider', 'DE.CircleCollider'
       , 'DE.TextRenderer', 'DE.SpriteRenderer', 'DE.SheetRenderer'
       , 'DE.CircleRenderer', 'DE.RectRenderer'
       /*, 'DE.BoxRenderer', 'DE.Sizes'
       , 'DE.BufferRenderer', 'DE.TileRenderer'
       , 'DE.BaseGui', 'DE.GuiButton', 'DE.GuiLabel', 'DE.GuiImage'*/
       , 'DE.Render', 'DE.MainLoop', 'DE.Event', 'DE.States', 'DE.Inputs'
       , 'DE.Camera', 'DE.AudioManager', 'DE.Gui'
       , 'DE.LangSystem', 'DE.SystemDetection'
       , 'DE.GamePad', 'DE.Screen', 'DE.about', 'DE.SaveSystem', 'DE.Notifications'
       , 'NebulaOffline', 'DE.AchievementSystem', 'DE.DemoPopups' ]
, function( PIXI )
{
  var DREAM_ENGINE = {};
  var NebulaOffline = null;
    window.PIXI = undefined;
  /** PIXI overwrite */
    DREAM_ENGINE.PIXI = PIXI;
    PIXI.IS_PIXI = true;
    PIXI.utils.sayHello = function( type )
    {
      if ( type == "WebGL" )
        type = type + " ☺";
      
      if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 )
      {
          var args = [
              '\n %c %c %c DreamEngine > PIXI ☃ - version ' + DREAM_ENGINE.about.version + ' - ✰ ' + type + ' ✰  %c ' +
                ' %c ' + ' http://dreamengine.dreamirl.com/ %c ' +
                ' %c ' + ' http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n'
              ,'background: #FF7C0A; padding:5px 0;'
              ,'background: #FF7C0A; padding:5px 0;'
              ,'color: #FF7C0A; background: #030307; padding:5px 0;'
              ,'background: #FF7C0A; padding:5px 0;'
              ,'background: #FFC18E; padding:5px 0;'
              ,'background: #FF7C0A; padding:5px 0;'
              ,'background: #ffc3dc; padding:5px 0;'
              ,'background: #FF7C0A; padding:5px 0;'
              ,'color: #ff2424; background: #fff; padding:5px 0;'
              ,'color: #ff2424; background: #fff; padding:5px 0;'
              ,'color: #ff2424; background: #fff; padding:5px 0;'
          ];

          window.console.log.apply(console, args); //jshint ignore:line
      }
      else if (window.console)
      {
          window.console.log( 'DreamEngine > PIXI ☃ - version ' + DREAM_ENGINE.about.version + ' - ✰ ' + type + ' ✰ '
            + ' | http://dreamengine.dreamirl.com | http://www.pixijs.com' ); //jshint ignore:line
      }
    };
    
    Object.defineProperties( PIXI.DisplayObject.prototype, {
      zindex: {
        get: function()
        {
          return this._zindex || 0;
        }
        , set: function( value )
        {
          this._zindex = value;
          if ( this.parent )
            this.parent.sortChildren();
        }
      }
    } );
    
    PIXI.Point.prototype.setRotation = function( value )
    {
      this.rotation = value;
    };
    
    /**
     * sort children by zindex
     * this is overwrite by gameObjects because it using z position
     * @protected
     * @memberOf GameObject
     */
    PIXI.DisplayObject.prototype.sortChildren = function()
    {
      this.children.sort( function( a, b )
      {
        return a.zindex - b.zindex;
      } );
    };
  
  var _startedAt = Date.now();
  for ( var a in arguments )
  {
    if ( arguments[ a ].IS_PIXI )
      continue;
    if ( arguments[ a ].isNebula )
    {
      NebulaOffline = arguments[ a ];
      continue;
    }
    var arg = arguments[ a ];
    var name = arg.DEName;
    if ( !name && arg.prototype )
      name = arg.prototype.DEName;
    if ( !name )
    {
      console.log( "%cNo name for " + a, "color:red", arguments[ a ] );
      continue;
    }
    DREAM_ENGINE[ name ] = arguments[ a ];
    delete DREAM_ENGINE[ name ].DEName;
  }
  
  /***
  * @init
  ***/
  // TODO new loader based on PIXI
  DREAM_ENGINE.init = function( params )
  {
    params = params || {};
    
    params.loader            = params.loader || {};
    params.loader.name       = "loader";
    params.loader.url        = params.loader.url || "loader.png";
    params.loader.totalFrame = params.loader.totalFrame || 16;
    params.loader.eachAnim   = params.loader.eachAnim || 45;
    params.loader.isAnimated = true;
    params.loader.scale      = params.loader.scale || 1;
    
    DREAM_ENGINE.isDemo = params.isDemo || false;
    
    window.ENGINE_SETTING = window.ENGINE_SETTING || {}; // configuration trough html
    
    // init about and localStorage
    DREAM_ENGINE.about.set( params.about );
    DREAM_ENGINE.SaveSystem.init( params.saveModel, params.saveIgnoreVersion );
    
    // init lang and system
    DREAM_ENGINE.LangSystem.init( params.dictionary || {} );
    DREAM_ENGINE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );
    
    DREAM_ENGINE.AchievementSystem.init( params.achievements || [] );
    
    // TODO update with PIXI loader
    DREAM_ENGINE.on( 'updateScreenSizes', function( ratioToConception, sizes )
    {
      this.ImageManager.pathPrefix        = sizes.path;
      this.ImageManager.imageNotRatio     = sizes.notRatio || false;
      this.ImageManager.ratioToConception = ratioToConception;
      this.ImageManager.load( params.loader );
    }, DREAM_ENGINE, false );
    
    if ( !params.ignoreNotification )
      DREAM_ENGINE.Notifications.init( params );
    
    DREAM_ENGINE.GamePad.init();
    
    DREAM_ENGINE.pause = function()
    {
      this.on( 'isReady', function()
      {
        this.MainLoop.launched = true;
        this.MainLoop.loop();
        if ( this.paused )
        {
          this.MainLoop.launched = false;
          this.Inputs.keyLocked = true;
        }
      }, this );
      this.MainLoop.launched = false;
      this.Inputs.keyLocked = true;
      this.paused = true;
    };
    DREAM_ENGINE.unPause = function()
    {
      this.Inputs.keyLocked = false;
      this.paused = false;
      this.Time.lastCalcul = Date.now();
      this.MainLoop.launched = true;
      this.MainLoop.loop();
    };
    
    DREAM_ENGINE.ImageManager.init( params.images.baseUrl, params.images.pools );
    DREAM_ENGINE.on( 'notisLoadingImages', function()
    {
      if ( !params.ignoreNebula )
      {
        this.on( "nebula-hide", this.unPause, this );
        this.on( "nebula-show", this.pause, this );
        NebulaOffline.init( params.nebulaElementId, params.preventNebulaAutoStart );
      }
      // DREAM_ENGINE.MainLoop.loader = new DREAM_ENGINE.GameObject( {
      //   renderers: [
      //     new DREAM_ENGINE.SpriteRenderer( { "spriteName": "loader", "scale": params.loader.scale } )
      //     ,new DREAM_ENGINE.TextRenderer( {
      //       "fillColor"    : params.loader.fillColor || "#FFFFFF"
      //       , "strokeColor": params.loader.strokeColor || "#FBC989"
      //       , "fontSize"   : params.loader.fontSize || 32
      //       , "lineWidth"  : params.loader.lineWidth || 2
      //       , "offsetY"    : 220 + ( params.loader.offsetY || 0 )
      //       , "offsetX"    : 0 + ( params.loader.offsetX || 0 )
      //       , "font"       : params.loader.font || "Helvetica"
      //     }, 400, 100, "100%" )
      //   ]
      // } );
      
      // TODO update with PIXI loader
      // for future screen update (manual call needed)
      DREAM_ENGINE.on( 'updateScreenSizes', function( ratioToConception, sizes )
      {
        this.ImageManager.pathPrefix        = sizes.path;
        this.ImageManager.imageNotRatio     = sizes.notRatio || false;
        this.ImageManager.ratioToConception = ratioToConception;
        this.ImageManager.arrayLoader( params.images.imagesList );
        this.MainLoop.screenChangedSizeIndex( ratioToConception, sizes );
      }, DREAM_ENGINE );
      
      if ( params.onStart )
      {
        DREAM_ENGINE.Event.on( 'isReady', function()
        {
          var delay = ( Date.now() - _startedAt );
          if ( delay >= 5000 )
          {
            params.onStart();
            DREAM_ENGINE.SystemDetection.askToRate();
          }
          else
          {
            DREAM_ENGINE.CONFIG.debug.log( "start in ", ( 1000 - delay ), "ms" );
            setTimeout( function()
            {
              params.onStart();
              DREAM_ENGINE.SystemDetection.askToRate();
            }, ( 1000 - delay ) );
          }
        }, DREAM_ENGINE, false );
      }
      else
        console.log( "%cNo start function given", "color:red" );
      
      if ( DREAM_ENGINE.isDemo )
        DREAM_ENGINE.DemoPopups.init();
      
      DREAM_ENGINE.ImageManager.loadPool( "main" );
      DREAM_ENGINE.AudioManager.loadAudios( params.audios );
      
      DREAM_ENGINE.Inputs.init( params.inputs );
      if ( params.customLoop )
      {
        DREAM_ENGINE.MainLoop.customLoop = params.customLoop;
      }
      
      if ( params.onReady )
        params.onReady();
      else
        console.log( "%cNo initialisation function given", "color:red" );
      
    }, DREAM_ENGINE, false );
    
    // adapt to the screen
    // TODO update with PIXI (have hi own system ?)
    DREAM_ENGINE.Screen.init( params.images );
    DREAM_ENGINE.Screen.updateScreenSizes( ENGINE_SETTING.quality );
  };
  
  /***
  * @start
  - launch the loop engine
  ***/
  DREAM_ENGINE.start = function()
  {
    DREAM_ENGINE.States.up( 'isInited' );
    this.MainLoop.launched = true;
    this.MainLoop.loop();
  };
  
  // Supprimer le Event et le state du DREAM_ENGINE pour qu'il reste privé ( à confirmer )
  DREAM_ENGINE.on = function()
  {
    this.Event.on.apply( this.Event, arguments );
  };
  DREAM_ENGINE.trigger = function()
  {
    this.Event.trigger.apply( this.Event, arguments );
  };
  DREAM_ENGINE.deltaTime = DREAM_ENGINE.Time.getDelta();
  
  // requestAnimationFrame declaration
  if ( !window.requestAnimationFrame )
  {
    window.requestAnimationFrame = ( function()
    {
      return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element )
      {
        window.setTimeout( callback, 1000 / 60 );
      };
    } )();
  };
  
  return DREAM_ENGINE;
} );