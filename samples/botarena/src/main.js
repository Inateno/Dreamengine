// /**
// * Author
//  @Inateno / http://inateno.com / http://dreamirl.com

// * ContributorsList
//  @Inateno

// ***
// * @constructor
// * main.js
// - load all customs files
// add your files here but don't remove DREAM_ENGINE

// -- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles
// **/
require.config( {
  baseUrl: "./src/"
  , paths: {
    'DREAM_ENGINE'     : '../../../dist/Dreamengine.amd'
    ,'DE.NebulaOffline': '../../../plugins/NebulaOffline/index'

    //game stuff
    ,'Game'        : 'Game'
    ,'Home'        : 'custom/Home'
    ,'World'       : 'custom/World'
    ,'Player'      : 'custom/Player'
    ,'Lifebar'     : 'custom/Lifebar'
    ,'Projectile'  : 'custom/Projectile'
    ,'Explosion'   : 'custom/Explosion'
    ,'Ennemi'      : 'custom/Ennemi'
    ,'Tile'        : 'custom/Tile'
    ,'Map'         : 'custom/Map'
    ,'HUD'         : 'custom/HUD'

    //plugins
    ,"astar"       : '../plugins/astar'

    // custom data
    ,'inputs'      : 'data/inputs'
    ,'audios'      : 'data/audios'
    ,'dictionary'  : 'data/dictionary'
    ,'achievements': 'data/achievements'
    ,'images'      : 'data/images'
  }
  , urlArgs: 'bust=' + Date.now()
} );

// // init here your game with your code by using the Engine (as DE)
require( [ 'DREAM_ENGINE', 'Game', 'inputs', 'audios', 'dictionary', 'images', 'achievements' ],
function( DE, Game, inputs, audios, dictionary, images, achievements )
{
  console.log( "game main file loaded DREAM_ENGINE:" , DE );
  
  /*DE.config.DEBUG = true;
  DE.config.DEBUG_LEVEL = 4;*/
  
  DE.init(
  {
    'onReady'              : Game.init
    , 'onLoad'             : Game.onload
    , 'inputs'             : inputs
    , 'audios'             : audios
    , 'dictionary'         : dictionary
    , 'images'             : images
    , 'achievements'       : achievements
    , 'about': { 'gameName': "Engine Dev Game 1", "namespace": "noting", 'author': "Inateno", 'gameVersion': "0.1" }
    , 'saveModel': { "nShoots": 0 }, 'saveIgnoreVersion': true
    // , 'loader': { interval: 10, scale: 2 }
  } );
} );