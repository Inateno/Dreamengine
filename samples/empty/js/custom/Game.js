/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
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
    console.log( "game init" );
    DE.CONFIG.DEBUG = 1;
    DE.CONFIG.DEBUG_LEVEL = 2;
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch", width: 1920, height: 1080, backgroundColor: "0x442288" } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DE.Scene( "Test" );
    
    // camera
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera.scene = Game.scene;
    
    Game.render.add( Game.camera );
    
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  
  return Game;
} );