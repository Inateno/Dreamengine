/**
* THIS IS: a sample to show you how to work with require for your project and include DreamEngine (for require ofc)
*
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
write here the function launching the engine
**/

define( [ 'gameLoop', 'Game', 'DE.imagesDatas', 'DE.audiosList', 'DE.inputsList', 'DE.dictionnary' ],
function( gameLoop, Game, images, audios, inputs, dictionnary )
{
  // make a function, will be called by engine
  function launch( DreamE )
  {
    DreamE.CONFIG.DEBUG = true;
    DreamE.CONFIG.DEBUG_LEVEL = 2;//5;
    DreamE.init(
    {
      'customLoop': gameLoop, 'onReady': Game.init
      , 'onStart': Game.start, 'loader': { "scale": 2 }
      , 'images': images, 'audios': audios
      , 'inputs': inputs, 'dictionnary': dictionnary
    } );
  }
  
  return launch;
} );