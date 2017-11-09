var path = require( 'path' );

var resolve = {
  alias: {
    'PIXI$'          : path.resolve( __dirname, 'node_modules/pixi.js/dist/pixi' )
    , 'P_Charm$'       : path.resolve( __dirname, 'node_modules/pixijs-charm/dist/pixijs-charm' )
    , 'stash$'         : path.resolve( __dirname, 'src/ext_libs/stash' )
    , 'howler$'        : path.resolve( __dirname, 'node_modules/howler/dist/howler.min' )
    , 'howler-spatial$': path.resolve( __dirname, 'node_modules/howler/dist/howler.spatial.min' )
    
    ,'DE.MainLoop$': path.resolve( __dirname, 'src/MainLoop' )
    , 'DE.about$'  : path.resolve( __dirname, 'src/about' )
    , 'DE.config$' : path.resolve( __dirname, 'src/config' )
    
    // middle-wares
    , 'DE.extendPIXI$'     : path.resolve( __dirname, 'src/utils/extendPIXI' )
    , 'DE.sortGameObjects$': path.resolve( __dirname, 'src/utils/sortGameObjects' )
    
    // tools lib
    , 'DE.Time$'         : path.resolve( __dirname, 'src/utils/Time' )
    , 'DE.Events$'       : path.resolve( __dirname, 'src/utils/Events' )
    , 'DE.Achievements$' : path.resolve( __dirname, 'src/utils/Achievements' )
    , 'DE.Localization$' : path.resolve( __dirname, 'src/utils/Localization' )
    , 'DE.Save$'         : path.resolve( __dirname, 'src/utils/Save' )
    , 'DE.Audio$'        : path.resolve( __dirname, 'src/utils/Audio' )
    , 'DE.Notifications$': path.resolve( __dirname, 'src/utils/Notifications' )
    , 'DE.Inputs$'       : path.resolve( __dirname, 'src/utils/Inputs' )
    , 'DE.gamepad$'      : path.resolve( __dirname, 'src/utils/gamepad' )
    , 'DE.ImageManager$' : path.resolve( __dirname, 'src/utils/ImageManager' )
    // TODO , 'DE.NebulaOffline$': path.resolve( __dirname, 'src/utils/NebulaOffline' )
    // TODO , 'DE.Screen$': path.resolve( __dirname, 'src/utils/Screen' )
    // TODO , 'DE.SystemDetection$': path.resolve( __dirname, 'src/utils/SystemDetection' )
    // TODO ImageLoader / Manager something to load and handle images / spritesheets (with the ability to add some later)
    
    , 'DE.Render$' : path.resolve( __dirname, 'src/classes/Render' )
    , 'DE.Scene$'  : path.resolve( __dirname, 'src/classes/Scene' )
    , 'DE.Vector2$': path.resolve( __dirname, 'src/classes/Vector2' )
    , 'DE.Camera$' : path.resolve( __dirname, 'src/classes/Camera' )
    
    , 'DE.BaseRenderer$'   : path.resolve( __dirname, 'src/classes/renderer/BaseRenderer' )
    , 'DE.TextureRenderer$': path.resolve( __dirname, 'src/classes/renderer/TextureRenderer' )
    , 'DE.SpriteRenderer$' : path.resolve( __dirname, 'src/classes/renderer/SpriteRenderer' )
    , 'DE.TilingRenderer$' : path.resolve( __dirname, 'src/classes/renderer/TilingRenderer' )
    , 'DE.TextRenderer$'   : path.resolve( __dirname, 'src/classes/renderer/TextRenderer' )
    , 'DE.GraphicRenderer$': path.resolve( __dirname, 'src/classes/renderer/GraphicRenderer' )
    , 'DE.RectRenderer$'   : path.resolve( __dirname, 'src/classes/renderer/RectRenderer' )
    
    , 'DE.GameObject$'            : path.resolve( __dirname, 'src/classes/GameObject/GameObject' )
    , 'DE.GameObject.automatisms$': path.resolve( __dirname, 'src/classes/GameObject/GameObject.automatisms' )
    , 'DE.GameObject.fade$'       : path.resolve( __dirname, 'src/classes/GameObject/GameObject.fade' )
    , 'DE.GameObject.focus$'      : path.resolve( __dirname, 'src/classes/GameObject/GameObject.focus' )
    , 'DE.GameObject.moveTo$'     : path.resolve( __dirname, 'src/classes/GameObject/GameObject.moveTo' )
    , 'DE.GameObject.scale$'      : path.resolve( __dirname, 'src/classes/GameObject/GameObject.scale' )
    , 'DE.GameObject.shake$'      : path.resolve( __dirname, 'src/classes/GameObject/GameObject.shake' )
    , 'DE.GameObject.update$'     : path.resolve( __dirname, 'src/classes/GameObject/GameObject.update' )
  }
};

module.exports = resolve;