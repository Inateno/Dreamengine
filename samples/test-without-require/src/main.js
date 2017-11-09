// /**
// * Author
//  @Inateno / http://inateno.com / http://dreamirl.com

// * ContributorsList
//  @Inateno

// ***
// * @constructor
// * main.js
// **/
window.onload = function()
{
  DE = DREAM_ENGINE;
  console.log( "game main file loaded DREAM_ENGINE:" , DE );
  
  DE.config.DEBUG = true;
  DE.config.DEBUG_LEVEL = 5;
  
  DE.init(
  {
    'onReady'              : Game.init
    , 'onLoad'             : Game.onload
    , 'ignoreNotifications': true
    , 'inputs'             : inputs
    , 'audios'             : audios
    , 'dictionary'         : dictionary
    , 'images'             : images
    , 'achievements'       : achievements
    , 'about': { 'gameName': "Engine Dev Game 1", "namespace": "noting", 'author': "Inateno", 'gameVersion': "0.1" }
    , 'saveModel': { "nShoots": 0 }, 'saveIgnoreVersion': true
    , 'ignoreNebula': true
    // , 'loader': { interval: 10, scale: 2 }
  } );
};