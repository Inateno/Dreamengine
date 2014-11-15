/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 sample Game - kill the bubble
 there is no "end" and no menus, it's a very lite "how to" for basics
 and you can create complete game with this :)
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  var screenW = 1280, screenH = 720;
  
  // init
  Game.init = function()
  {
    console.log( "init Engine" );
    DE.CONFIG.DEBUG = 1; // debug on
    DE.CONFIG.DEBUG_LEVEL = 5; // all debug
    
    // create render
    Game.render = new DE.Render( "render", { width: screenW, height: screenH , fullScreen: "ratioStretch"} );
    Game.render.init();
    
    // launch the engine
    DE.start();
  }
  
  // start
  Game.start = function()
  {
    // always let a little delay between the real load and the visual load, better feeling
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 200 );
  };
  
  window.Game = Game; // debug only
  window.DREAM_E = DE;
  return Game;
} );