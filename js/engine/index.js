require.config( {
  baseUrl: "./js/engine/"
  , paths: {
    'DREAM_ENGINE': 'main'
    
    , 'DE.MainLoop': 'MainLoop'
    , 'DE.about'   : 'about'
    , 'DE.config'  : 'config'
    
    , 'DE.Time'         : 'utils/Time'
    , 'DE.Events'       : 'utils/Events'
    , 'DE.Achievements' : 'utils/Achievements'
    , 'DE.Localization' : 'utils/Localization'
    , 'DE.Save'         : 'utils/Save'
    , 'DE.Audio'        : 'utils/Audio'
    , 'DE.Notifications': 'utils/Notifications'
    , 'DE.Inputs'       : 'utils/Inputs'
    , 'DE.gamepad'      : 'utils/gamepad'
    // TODO , 'DE.NebulaOffline': 'utils/NebulaOffline'
    // TODO , 'DE.Screen': 'utils/Screen'
    // TODO , 'DE.SystemDetection': 'utils/SystemDetection'
    // TODO ImageLoader / Manager something to load and handle images / spritesheets (with the ability to add some later)
    
    , 'DE.Render' : 'classes/Render'
    , 'DE.Scene'  : 'classes/Scene'
    , 'DE.Vector2': 'classes/Vector2'
    // TODO -- needed ? , 'DE.Camera': 'classes/Camera'
    
    , 'DE.SpriteRenderer': 'classes/renderer/SpriteRenderer'
    , 'DE.RectRenderer'  : 'classes/renderer/RectRenderer'
    
    , 'DE.GameObject'            : 'classes/GameObject/GameObject'
    , 'DE.GameObject.update'     : 'classes/GameObject/GameObject.update'
    , 'DE.GameObject.automatisms': 'classes/GameObject/GameObject.automatisms'
    
    
    // dependencies
    , 'PIXI'          : '../../node_modules/pixi.js/dist/pixi'
    , 'extendPIXI'    : 'utils/extendPIXI'
    , 'EventEmitter'  : '../../node_modules/eventemitter3/index'
    , 'P_Charm'       : '../../node_modules/pixijs-charm/dist/pixijs-charm'
    , 'stash'         : 'ext_libs/stash'
    , 'howler'        : '../../node_modules/howler/dist/howler.min'
    , 'howler-spatial': '../../node_modules/howler/dist/howler.spatial.min'
  }
  , shim: {
    "EventEmitter": { exports: "EventEmitter" }
  }
  , urlArgs: 'bust=' + Date.now()
} );

define( [ 'DREAM_ENGINE' ], function( DE ){ console.log( "DE Loaded", DE ); return DE; } );
