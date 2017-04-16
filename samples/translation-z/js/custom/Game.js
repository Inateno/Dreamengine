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
  DE.CONFIG.DEBUG_LEVEL = 5;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DE.CONFIG.DEBUG = 5;
    DE.CONFIG.DEBUG_LEVEL = 5;
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
    
    Game.scene.add( new DE.GameObject( { x: 0, y: 0,renderer: new DE.RectRenderer( { lineWidth: 5, lineColor: "0xFF0000", width: 50, height: 50 } ) } ) );
    Game.scene.add( new DE.GameObject( { x: 1920, y: 0,renderer: new DE.RectRenderer( { lineWidth: 5, lineColor: "0xFF0000", width: 50, height: 50 } ) } ) );
    Game.scene.add( new DE.GameObject( { x: 1920, y: 1080,renderer: new DE.RectRenderer( { lineWidth: 5, lineColor: "0xFF0000", width: 50, height: 50 } ) } ) );
    Game.scene.add( new DE.GameObject( { x: 0, y: 1080,renderer: new DE.RectRenderer( { lineWidth: 5, lineColor: "0xFF0000", width: 50, height: 50 } ) } ) );
    Game.scene.add( new DE.GameObject( { x: 1920 * 0.5 >> 0, y: 1080 * 0.5 >> 0,renderer: new DE.RectRenderer( { lineWidth: 5, lineColor: "0xFF0000", width: 50, height: 50 } ) } ) );
  
    for ( var i = 0; i < 10; ++i )
    {
      Game.scene.add( new DE.GameObject( {
        x: 1400, y: 500, z: i * 2
        ,renderer: new DE.SpriteRenderer( { spriteName: "ship", scale: 2 } )//( { lineWidth: 5, lineColor: "0xFF0000", width: 200, height: 200 } )
      } ) );
    }
    
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  window.DE = DE;
  window.Game = Game;
  
  return Game;
} );