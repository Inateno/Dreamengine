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
  var screenW = 1920, screenH = 1080;
  
  Game.init = function()
  {
    console.log( "game init" );
    // DE.CONFIG.DEBUG = 1;
    DE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DE.Render( "render", { backgroundColor: "0x880044", fullScreen: "ratioStretch", width: screenW, height: screenH } );
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
    
    Game.camera = new DE.Camera( screenW, screenH, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,200)" } );
    
    Game.camera.scene = Game.scene;
    Game.render.add( Game.camera );
    
    for ( var x = 1; x < 70; ++x )
    {
      for ( var y = 0; y < 30; ++y )
        addCircle( 200 + x * 18, 250 + y * 18, x+y, x, y );
    }
    
    // Game.scene.add( new DE.GameObject( {
    //   "x": 1200, "y": 680, "zindex": 2
    //   ,"renderer": new DE.TextRenderer( {
    //     "offsetX": -220, "fillColor": "orange"
    //     , "fontSize": 25, "textAlign": "right"
    //   }, 500, 150, "Dreamengine by Dreamirl" )
    // } ) );
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  
  function addCircle( x, y, deg, cx, cy )
  {
    color = "0x000000";
    if ( cx > 24 && cx < 57 && cy > 9 && cy < 15
        && dreamirl[ cy - 10 ][ cx - 25 ] )
    {
      color = "0xFF0000";
    }
    var circle = new DE.GameObject( {
      "x": x, "y": y
    } );
    var box = new DE.GameObject( {
      x: 50
      ,renderer: new DE.RectRenderer( {
        fillColor : color
        ,width    : 20
        , height  : 20
      } )
    } );
    circle.rotate( deg / 10 );
    circle.addAutomatism( "move", "rotate", { value1: 0.04 } );
    circle.add( box );
    Game.scene.add( circle );
  }
  return Game;
} );