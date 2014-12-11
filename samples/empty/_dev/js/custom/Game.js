/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 Sample empty to make Games
 
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  
  // init
  Game.init = function()
  {
    console.log( "init Engine" );
    DE.CONFIG.DEBUG = 1; // debug on
    DE.CONFIG.DEBUG_LEVEL = 3; // show collider
    
    // create render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch"} );
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