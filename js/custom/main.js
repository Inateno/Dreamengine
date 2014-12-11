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
    'files-engine'    : 'files-engine'
    
    // DATAS
    ,'DE.imagesDatas' : 'datas/imagesDatas'
    ,'DE.inputsList'  : 'datas/inputsList'
    ,'DE.audiosList'  : 'datas/audiosList'
    ,'DE.dictionary'  : 'datas/dictionary'
    ,'DE.achievements': 'datas/achievements'
    
    ,'gameLoop'       : 'custom/gameLoop'
    ,'Game'           : 'custom/Game'
    
    ,'DE.TouchControl' : 'plugins/TouchControl'
  }
  , urlArgs: 'bust=' + Date.now()
} );

// init here your game with your code by using the Engine (as DE)
require( [ 'files-engine', 'gameLoop', 'Game', 'DE.imagesDatas', 'DE.audiosList', 'DE.inputsList', 'DE.achievements', 'DE.dictionary', 'DE.TouchControl' ],
function( files, gameLoop, Game, images, audios, inputs, achievements, dictionary, TouchControl )
{
  console.log( "My Custom loads - stress test" );
  var DE = DreamEngine;
  DE.init(
  {
    'customLoop': gameLoop, 'onReady': Game.init
    , 'onStart': Game.start, 'loader': { "scale": 2 }
    , 'images': images, 'audios': audios
    , 'inputs': inputs, 'dictionary': dictionary
    , 'about': { 'gameName': "StressTest", "namespace": "ztech", 'author': "Dreamirl", 'gameVersion': "0.1" }
    , 'saveModel': {}, 'saveIgnoreVersion': true
    , 'achievements': achievements
    , 'ignoreNebula': true
  } );
  window.DREAM_E = DE;
} );