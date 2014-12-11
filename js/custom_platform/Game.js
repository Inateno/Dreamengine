/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/
define( [ 'DREAM_ENGINE', 'levelGenerator', 'Character' ],
function( DE, levelGenerator, Character )
{
  var Game = {};
    
  Game.render  = null;
  Game.scene   = null;
  Game.player  = null;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DE.CONFIG.DEBUG = 1;
    // DE.CONFIG.DEBUG_LEVEL = 1;
    DE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DE.Scene( "Test" );
    
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera.scene = Game.scene;
    Game.camera.gui = new DE.Gui( Game.camera, { 'id': "Test" } );
    Game.render.add( Game.camera );
    
    levelGenerator( "test", Game.scene, Game.camera, {
      limits: {
        maxX: true, maxY: true, minY: true, minX: true
        ,colliderOffset: true
      }
    } );
    
    // x, y, tag, colliderW, colliderH
    Game.player = new Character( 200, 500, "player", 50, 140 ).bindControls();
    Game.scene.add( Game.player );
    Game.camera.focus( Game.player );
    
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  window.Game = Game; // debug
  return Game;
} );