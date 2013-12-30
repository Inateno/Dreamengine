/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* engine constructor
**/
define([ 'DE.CONFIG', 'DE.COLORS', 'DE.Time', 'DE.Vector2', 'DE.Sizes', 'DE.ImageManager'
       , 'DE.CollisionSystem', 'DE.Collider', 'DE.Renderer', 'DE.Scene', 'DE.Rigidbody'
       , 'DE.CanvasBuffer', 'DE.GameObject', 'DE.FixedBoxCollider', 'DE.OrientedBoxCollider'
       , 'DE.CircleCollider', 'DE.BoxRenderer', 'DE.CircleRenderer', 'DE.SpriteRenderer'
       , 'DE.Render', 'DE.MainLoop', 'DE.Event', 'DE.States', 'DE.Inputs', 'DE.Camera'
       , 'DE.TextRenderer', 'DE.TileRenderer', 'DE.AudioManager', 'DE.Gui', 'DE.BaseGui'
       , 'DE.GuiButton', 'DE.GuiLabel', 'DE.GuiImage', 'DE.LangSystem', 'DE.SystemDetection'
       , 'DE.GamePad', 'DE.Screen', 'DE.about', 'DE.SaveSystem', 'DE.Notifications' ]
, function()
{
  var DREAM_ENGINE = {};
  
  var _startedAt = Date.now();
  for ( var a in arguments )
  {
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
  DREAM_ENGINE.init = function( params )
  {
    // init about and localStorage
    DREAM_ENGINE.about.set( params.about );
    DREAM_ENGINE.SaveSystem.init( params.saveModel, params.saveIgnoreVersion );
    
    // init lang and system
    DREAM_ENGINE.LangSystem.init( params.dictionary );
    DREAM_ENGINE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );
    
    DREAM_ENGINE.on( 'udpateScreenSizes', function( ratioToConception, sizes )
    {
      this.ImageManager.pathPrefix        = sizes.path;
      this.ImageManager.imageNotRatio     = sizes.notRatio || false;
      this.ImageManager.ratioToConception = ratioToConception;
      this.ImageManager.arrayLoader( params.images.imagesList );
      this.MainLoop.screenChangedSizeIndex( ratioToConception, sizes );
    }, DREAM_ENGINE );
    // adapt to the screen
    DREAM_ENGINE.Screen.init( params.images );
    DREAM_ENGINE.Screen.udpateScreenSizes();
    
    if ( !params.ignoreNotification )
      DREAM_ENGINE.Notifications.init( params );
    
    DREAM_ENGINE.GamePad.init();
    
    params = params || {};
    
    params.loader            = params.loader || {};
    params.loader.name       = params.loader.name || "loader";
    params.loader.url        = params.loader.url || "loader";
    params.loader.totalFrame = params.loader.totalFrame || 16;
    params.loader.eachAnim   = params.loader.eachAnim || 45;
    params.loader.ext        = params.loader.ext || "png";
    params.loader.isAnimated = true;
    params.loader.scale      = params.loader.scale || 1;
    
    DREAM_ENGINE.Event.on( 'notisLoadingImages', function()
    {
      DREAM_ENGINE.MainLoop.loader = new DREAM_ENGINE.SpriteRenderer( { "spriteName": "loader", "scale": params.loader.scale } );
      if ( params.onReady )
        params.onReady();
      else
        console.log( "%cNo initialisation function given", "color:red" );
      
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
      
      DREAM_ENGINE.ImageManager.arrayLoader( params.images.imagesList );
      DREAM_ENGINE.AudioManager.loadAudios( params.audios );
      
      DREAM_ENGINE.Inputs.init( params.inputs );
      if ( params.customLoop )
      {
        DREAM_ENGINE.MainLoop.customLoop = params.customLoop;
      }
    }, DREAM_ENGINE, false );
    this.ImageManager.folderName = params.images.folderName;
    this.ImageManager.pushImage( params.loader.name, params.loader.url, params.loader.ext, params.loader );
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
  DREAM_ENGINE.on = DREAM_ENGINE.Event.on;
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