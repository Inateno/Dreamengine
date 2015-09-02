/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* @constructor
* files-engine.js
 - load all files
 this file isn't to load your custom files or to make production games
 it's usefull to load the unwrapped engine and work on.
 If you are making a game and don't want to work on the Engine, I recommand you to take a sample with
 wrapped dist version

-- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles
**/
require.config( {
  baseUrl: "./js/"
  , paths: {
    'DREAM_ENGINE': 'engine/main'
    ,'NebulaOffline': 'engine/classes/NebulaOffline'
    
    // engine core datas
    , 'DE.about'           : 'engine/about'
    , 'DE.CONFIG'          : 'engine/CONFIG'
    , 'DE.COLORS'          : 'engine/COLORS'
    , 'DE.States'          : 'engine/states'
    
    // core engine classes
    , 'DE.DemoPopups'        : 'engine/classes/DemoPopups'
    , 'DE.Event'             : 'engine/classes/Event'
    , 'DE.Time'              : 'engine/classes/Time'
    , 'DE.ImageManager'      : 'engine/classes/ImageManager'
    , 'DE.AudioManager'      : 'engine/classes/AudioManager'
    , 'DE.CollisionSystem'   : 'engine/classes/CollisionSystem'
    , 'DE.MainLoop'          : 'engine/classes/MainLoop'
    , 'DE.SystemDetection'   : 'engine/classes/SystemDetection'
    , 'DE.LangSystem'        : 'engine/classes/LangSystem'
    , 'DE.Screen'            : 'engine/classes/Screen'
    , 'DE.SaveSystem'        : 'engine/classes/SaveSystem'
    , 'DE.Notifications'     : 'engine/classes/Notifications'
    , 'DE.AchievementSystem' : 'engine/classes/AchievementSystem'
    
    , 'DE.Sizes'        : 'engine/classes/core/Sizes'
    , 'DE.Vector2'      : 'engine/classes/core/Vector2'
    , 'DE.Collider'     : 'engine/classes/core/Collider'
    , 'DE.Renderer'     : 'engine/classes/core/Renderer'
    , 'DE.Render'       : 'engine/classes/core/Render'
    , 'DE.Camera'       : 'engine/classes/core/Camera'
    , 'DE.Scene'        : 'engine/classes/core/Scene'
    , 'DE.Rigidbody'    : 'engine/classes/core/Rigidbody'
    , 'DE.CanvasBuffer' : 'engine/classes/core/CanvasBuffer'
    , 'DE.GamePad'      : 'engine/classes/gamepad'
    , 'DE.Inputs'       : 'engine/classes/Inputs'
    , 'DE.Gui'          : 'engine/classes/core/Gui'
    // , 'DE.BaseGui'      : 'engine/classes/core/Gui/BaseGui' // BaseGui need extend
    // , 'DE.GuiButton'    : 'engine/classes/core/Gui/Button'
    // , 'DE.GuiImage'     : 'engine/classes/core/Gui/Image'
    // , 'DE.GuiLabel'     : 'engine/classes/core/Gui/Label'

    // GameObject
    , 'DE.GameObject': 'engine/classes/core/GameObject/GameObject'
    , 'DE.GameObject.render': 'engine/classes/core/GameObject/GameObject.render'
    , 'DE.GameObject.update': 'engine/classes/core/GameObject/GameObject.update'

    // colliders
    , 'DE.FixedBoxCollider'    : 'engine/classes/extended/FixedBoxCollider'
    , 'DE.OrientedBoxCollider' : 'engine/classes/extended/OrientedBoxCollider'
    , 'DE.CircleCollider'      : 'engine/classes/extended/CircleCollider'

    // renderers
    , 'DE.BoxRenderer'           : 'engine/classes/extended/BoxRenderer/BoxRenderer'
    , 'DE.BoxRenderer.render'    : 'engine/classes/extended/BoxRenderer/BoxRenderer.render'
    , 'DE.CircleRenderer'        : 'engine/classes/extended/CircleRenderer/CircleRenderer'
    , 'DE.CircleRenderer.render' : 'engine/classes/extended/CircleRenderer/CircleRenderer.render'
    , 'DE.SpriteRenderer'        : 'engine/classes/extended/SpriteRenderer/SpriteRenderer'
    , 'DE.SpriteRenderer.render' : 'engine/classes/extended/SpriteRenderer/SpriteRenderer.render'
    , 'DE.TextRenderer'          : 'engine/classes/extended/TextRenderer/TextRenderer'
    , 'DE.TextRenderer.render'   : 'engine/classes/extended/TextRenderer/TextRenderer.render'
    , 'DE.TileRenderer'          : 'engine/classes/extended/TileRenderer/TileRenderer'
    , 'DE.TileRenderer.render'   : 'engine/classes/extended/TileRenderer/TileRenderer.render'
    , 'DE.BufferRenderer'        : 'engine/classes/extended/BufferRenderer'
    
    , 'DE.Mid.gameObjectMouseEvent': 'engine/middlewares/gameObjectMouseEvent'
    
    // libz get some little change to work with Require without using a "shim"
    , 'buzz'          : 'ext_libs/buzz-require'
    , 'HowlLib'       : 'ext_libs/howler'
    , 'stash'         : 'ext_libs/stash-require'
    , 'handjs'        : 'ext_libs/hand-require'
    
    // used by grunt when compiling in "require" or "standalone" version
    // the require version call the function return by your main file
    , 'requirev'       : 'engine/require'    // file to make RequireJS version
    , 'standalonev'    : 'engine/standalone' // file to make standalone version
  }
  , urlArgs: 'bust=' + Date.now() // burn cache
} );

define( [ 'DREAM_ENGINE' ], function( DE ){ window.DreamEngine = DE; return DE; } );
