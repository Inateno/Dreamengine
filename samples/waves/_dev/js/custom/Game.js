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
  
  Game.init = function()
  {
    console.log( "game init" );
    // DE.CONFIG.DEBUG = 1;
    DE.CONFIG.DEBUG_LEVEL = 1;
    // DE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    
    DE.start();
  }
  var dreamirl = [
     [ 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0 ]
    ,[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0 ]
    ,[ 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0 ]
    ,[ 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0 ]
    ,[ 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1 ]
  ];
  Game.start = function()
  {
    // scene
    Game.scene = new DE.Scene( "Test" );
    
    Game.camera = new DE.Camera( 1280, 720, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    
    Game.camera.scene = Game.scene;
    Game.render.add( Game.camera );
    
    for ( var x = 1; x < 80; ++x )
    {
      for ( var y = 0; y < 40; ++y )
        addCircle( 0 + x * 18, 0 + y * 18, x+y, x, y );
    }
    
    Game.scene.add( new DE.GameObject( {
      "x": 1200, "y": 680, "zindex": 2
      ,"renderer": new DE.TextRenderer( {
        "offsetX": -220, "fillColor": "orange"
        , "fontSize": 25, "textAlign": "right"
      }, 500, 150, "Dreamengine by Dreamirl" )
    } ) );
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  
  function addCircle( x, y, deg, cx, cy )
  {
    color = "black";
    if ( cx > 24 && cx < 57 && cy > 9 && cy < 15
        && dreamirl[ cy - 10 ][ cx - 25 ] )
    {
      color = "orange";
    }
    var circle = new DE.GameObject( {
      "x": x, "y": y
    } );
    var box = new DE.GameObject( {
      x: 50
      // LEL !
      ,renderer: new DE.SpriteRenderer( {
        "spriteName": "bg", "startFrame": cx, "startLine": cy
      } )
      // ,renderer: new DE.BoxRenderer( {
      //   fillColor: color
      // }, 20, 20 )
    } );
    circle.rotate( deg / 10 );
    circle.addAutomatism( "move", "rotate", { value1: 0.04 } );
    circle.add( box );
    Game.scene.add( circle );
  }
  return Game;
} );