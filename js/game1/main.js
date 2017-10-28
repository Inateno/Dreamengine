/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* @constructor
* main.js
- load all customs files
add your files here but don't remove DREAM_ENGINE

-- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles
**/
require.config( {
  baseUrl: "./js/"
  , paths: {
    'engine'    : 'engine/index'
    
    // DATAS
    // ,'DE.imagesDatas' : 'datas/imagesDatas'
    // ,'DE.inputsList'  : 'datas/inputsList'
    // ,'DE.audiosList'  : 'datas/audiosList'
    // ,'DE.dictionary'  : 'datas/dictionary'
    // ,'DE.achievements': 'datas/achievements'
    
    // ,'gameLoop'       : 'custom/gameLoop'
    ,'Game'           : 'game1/Game'
    
    // ,'DE.TouchControl' : 'plugins/TouchControl'
  }
  , urlArgs: 'bust=' + Date.now()
} );

// init here your game with your code by using the Engine (as DE)
require( [ 'engine', 'Game' ],
function( DE, Game )
{
  console.log( "game main file loaded DREAM_ENGINE:" , DE );
  window.DE = DE;
  
  DE.config.DEBUG = true;
  DE.config.DEBUG_LEVEL = 5;
  
  console.log( "make game" );
  Game.make();
  // DE.CONFIG.version = "1.0.0";
  // DE.init(
  // {
  //   'onReady': Game.init
  //   , 'onStart': Game.start
  //   // , 'images': images, 'audios': audios
  //   // , 'inputs': inputs, 'dictionary': dictionary
  //   // , 'about': { 'gameName': "StressTest", "namespace": "ztech", 'author': "Dreamirl", 'gameVersion': "0.1" }
  //   // , 'saveModel': {}, 'saveIgnoreVersion': true
  //   // , 'achievements': achievements
  //   // , 'ignoreNebula': true
  // } );
} );