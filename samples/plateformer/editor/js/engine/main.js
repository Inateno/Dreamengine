/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
- load all engine files
**/
require.config( {
  /*baseUrl: "./js/engine/"
  , */paths: {
    /*// core engine classes
    'DE.CONFIG'                 : 'CONFIG'
    ,'DE.COLORS'                : 'COLORS'
    ,'DE.States'                : 'states'
    ,'DE.Event'                 : 'classes/Event'
    ,'DE.Time'                  : 'classes/core/Time'
    ,'DE.Vector2'               : 'classes/core/Vector2'
    ,'DE.Sizes'                 : 'classes/core/Sizes'
    ,'DE.ImageManager'          : 'classes/ImageManager'
    ,'DE.AudioManager'          : 'classes/AudioManager'
    ,'DE.CollisionSystem'       : 'classes/CollisionSystem'
    ,'DE.MainLoop'              : 'classes/MainLoop'
    ,'DE.Collider'              : 'classes/core/Collider'
    ,'DE.Renderer'              : 'classes/core/Renderer'
    ,'DE.Render'                : 'classes/core/Render'
    ,'DE.Camera'                : 'classes/core/Camera'
    ,'DE.Scene'                 : 'classes/core/Scene'
    ,'DE.Rigidbody'             : 'classes/core/Rigidbody'
    ,'DE.CanvasBuffer'          : 'classes/core/CanvasBuffer'
    ,'DE.Inputs'                : 'classes/Inputs'
    ,'DE.Gui'                   : 'classes/core/Gui'
    ,'DE.BaseGui'               : 'classes/core/Gui/BaseGui' // BaseGui need extend
    ,'DE.GuiButton'             : 'classes/core/Gui/Button'
    ,'DE.GuiImage'              : 'classes/core/Gui/Image'
    ,'DE.GuiInput'              : 'classes/core/Gui/Input'        // not ok
    ,'DE.GuiWindow'             : 'classes/core/Gui/Window'  // not ok
    ,'DE.GuiLabel'              : 'classes/core/Gui/Label'
    
    // GameObject
    ,'DE.GameObject'            : 'classes/core/GameObject/GameObject'
    ,'DE.GameObject.render'     : 'classes/core/GameObject/GameObject.render'
    ,'DE.GameObject.update'     : 'classes/core/GameObject/GameObject.update'
    
    // colliders
    ,'DE.FixedBoxCollider'      : 'classes/extended/FixedBoxCollider'
    ,'DE.OrientedBoxCollider'   : 'classes/extended/OrientedBoxCollider'
    ,'DE.CircleCollider'        : 'classes/extended/CircleCollider'
    
    // renderers
    ,'DE.BoxRenderer'           : 'classes/extended/BoxRenderer/BoxRenderer'
    ,'DE.BoxRenderer.render'    : 'classes/extended/BoxRenderer/BoxRenderer.render'
    ,'DE.CircleRenderer'        : 'classes/extended/CircleRenderer/CircleRenderer'
    ,'DE.CircleRenderer.render' : 'classes/extended/CircleRenderer/CircleRenderer.render'
    ,'DE.SpriteRenderer'        : 'classes/extended/SpriteRenderer/SpriteRenderer'
    ,'DE.SpriteRenderer.render' : 'classes/extended/SpriteRenderer/SpriteRenderer.render'
    ,'DE.TextRenderer'          : 'classes/extended/TextRenderer/TextRenderer'
    ,'DE.TextRenderer.render'   : 'classes/extended/TextRenderer/TextRenderer.render'
    ,'DE.TileRenderer'          : 'classes/extended/TileRenderer/TileRenderer'
    ,'DE.TileRenderer.render'   : 'classes/extended/TileRenderer/TileRenderer.render'
    
    // DATAS
    ,'DE.imagesList'            : '../datas/imagesList'
    ,'DE.inputsList'            : '../datas/inputsList'
    ,'DE.audiosList'            : '../datas/audiosList'
    
    , 'buzz' : '../ext_libs/buzz'*/
  }
  , shim: {
    'buzz': {
        exports: 'buzz'
      }
  }
  // , urlArgs: 'bust=' + Date.now()
} );

define([ 'DE.CONFIG', 'DE.COLORS', 'DE.Time', 'DE.Vector2', 'DE.Sizes', 'DE.ImageManager', 'DE.CollisionSystem', 'DE.Collider', 'DE.Renderer', 'DE.Scene', 'DE.Rigidbody', 'DE.CanvasBuffer', 'DE.GameObject', 'DE.FixedBoxCollider', 'DE.OrientedBoxCollider', 'DE.CircleCollider', 'DE.BoxRenderer', 'DE.CircleRenderer', 'DE.SpriteRenderer', 'DE.Render', 'DE.MainLoop', 'DE.Event', 'DE.States', 'DE.Inputs', 'DE.Camera', 'DE.TextRenderer', 'DE.TileRenderer', 'DE.AudioManager'
, 'DE.Gui', 'DE.BaseGui', 'DE.GuiButton', 'DE.GuiLabel', 'DE.GuiImage' ]
  , function()
  {
    var DREAM_ENGINE = {};
    
    for ( var a in arguments )
    {
      var arg = arguments[ a ];
      // if ( typeof arg === "function" )
      // {
        // console.log( arg.toString().match(/function ([^\(]+)/)[ 1 ] );
      // }
      // else if ( typeof arg === "object" )
      // {
        // console.log( arg.toString() );
      // }
      
      var name = arguments[ a ].DEName;
      if ( !name && typeof arg === "function" )
      {
        var tryName = new arguments[ a ]();
        var name = tryName.DEName || undefined;
        delete tryName;
      }
      if ( !name )
      {
        console.log( "No name for " + a, arguments[ a ] );
        continue;
      }
      DREAM_ENGINE[ name ] = arguments[ a ];
      delete DREAM_ENGINE[ name ].DEName;
    }
    
    /***
    * @init
    ***/
    DREAM_ENGINE.init = function( param )
    {
      param = param || {};
      
      if ( param.onReady )
      {
        DREAM_ENGINE.Event.on( 'isReady', function(){ param.onReady(); }, false );
      }
      else
      {
        console.log( "no initialisation function given" );
      }
      
      this.ImageManager.arrayLoader();
      this.AudioManager.loadAudios();
      
      this.Inputs.init();
      
      this.States.up( 'isInited' );
      if ( param.customLoop )
      {
        this.MainLoop.customLoop = param.customLoop;
      }
    }
    
    /***
    * @start
    - launch the loop engine
    ***/
    DREAM_ENGINE.start = function()
    {
      this.MainLoop.launched = true;
      this.MainLoop.loop();
    }
    
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
        }
      )();
    }
    
    return DREAM_ENGINE;
  }
);