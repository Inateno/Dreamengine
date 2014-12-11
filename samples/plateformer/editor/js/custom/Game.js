/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
simple Game class declaration example
**/

define( [ 'DREAM_ENGINE', 'gui', 'resources' ],
function( DE, createGUI, resources )
{
  var Game = {};
  Game.render  = null;
  
  // init
  Game.init = function()
  {
    // DE.CONFIG.DEBUG = 1;
    DE.CONFIG.DEBUG_LEVEL = 3;
    
    DE.start();
  };
  
  Game.start = function()
  {
    // render and scene
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    resources.scene = new DE.Scene( "Test", { backgroundColor: "black" } );
    
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,200)" } );
    Game.miniMap = new DE.Camera( 256, 178, 0, 1080-178, { 'name': "Minimap", 'backgroundColor': "rgb(40,40,40)" } );
    Game.miniMap.scene = resources.scene;
    Game.camera.scene = resources.scene;
    Game.render.add( Game.camera );
    Game.render.add( Game.miniMap );
    
    Game.miniMap.scenePosition.x = Game.camera.scenePosition.x + Game.camera.fieldSizes.width * 0.5 - Game.miniMap.fieldSizes.width * 0.5;
    Game.miniMap.scenePosition.y = Game.camera.scenePosition.y + Game.camera.fieldSizes.height * 0.5 - Game.miniMap.fieldSizes.height * 0.5;
    Game.miniMap.scenePosition.z = -200;
    
    Game.miniMap.gui = new DE.Gui();
    var plus = new DE.GameObject( {
      "x": 230, "y": 20
      , "renderer": new DE.TextRenderer( { fillColor: "white", fontSize: 30 }, 100, 100, "+" )
      , "collider": new DE.CircleCollider( 20 )
    } );
    plus.onMouseUp = function(){ console.log( "plus" ); Game.miniMap.scenePosition.z += 100; };
    var minus = new DE.GameObject( {
      "x": 230, "y": 60
      , "renderer": new DE.TextRenderer( { fillColor: "white", fontSize: 30 }, 100, 100, "-" )
      , "collider": new DE.CircleCollider( 20 )
    } );
    minus.onMouseUp = function(){ console.log( "minus" ); Game.miniMap.scenePosition.z -= 100; };
    Game.miniMap.gui.add( plus, minus );
    // Game.miniMap.onMouseDown = function( mouse )
    // {
    //   // return;
      // var mouseZ = {};
      // var ratioz = ( 10 / ( -10 - Game.miniMap.scenePosition.z ) );
      // mouseZ.x = ( mouse.x - ( Game.miniMap.scenePosition.x + Game.miniMap.fieldSizes.width * 0.5 ) ) / ratioz
      //     + ( Game.miniMap.scenePosition.x + Game.miniMap.fieldSizes.width * 0.5 );
      // mouseZ.y = ( mouse.y - ( Game.miniMap.scenePosition.y + Game.miniMap.fieldSizes.height * 0.5 ) ) / ratioz
      //     + ( Game.miniMap.scenePosition.y + Game.miniMap.fieldSizes.height * 0.5 );
      
      
      // Game.camera.scenePosition.x = mouseZ.x - Game.camera.fieldSizes.width * 0.5;
      // Game.camera.scenePosition.y = mouseZ.y - Game.camera.fieldSizes.height * 0.5;
      
      // console.log( ratioz, Game.camera.scenePosition );
    // };
    
    resources.camera = Game.camera;
    
    DE.Inputs.on( "axeMoved", "wheelTop", function()
    {
      Game.camera.scenePosition.z += 1;
      console.log( "Zoom + at " + ( Game.camera.scenePosition.z / (-10) * 100 >> 0 ) );
    } );
    DE.Inputs.on( "axeMoved", "wheelDown", function()
    {
      Game.camera.scenePosition.z -= 1;
      console.log( "Zomm - at " + ( Game.camera.scenePosition.z / (-10) * 100 >> 0 ) );
    } );
    Game.camera.onMouseMove = function( mouse )
    {
      if ( resources.currentEl != null && resources.currentEl.isDragged && !resources.currentEl.isLocked )
      {
        var mouseZ = {};
        var ratioz  = ( 10 / ( resources.currentEl.position.z - Game.camera.scenePosition.z ) );
        mouseZ.x = ( mouse.x - ( Game.camera.scenePosition.x + Game.camera.fieldSizes.width * 0.5 ) ) * ratioz
          + ( Game.camera.scenePosition.x + Game.camera.fieldSizes.width * 0.5 );
        mouseZ.y = ( mouse.y - ( Game.camera.scenePosition.y + Game.camera.fieldSizes.height * 0.5 ) ) * ratioz
          + ( Game.camera.scenePosition.y + Game.camera.fieldSizes.height * 0.5 );
        
        var deltaX = ( Game.camera.scenePosition.x + mouse.x - mouseZ.x ) / ratioz;
        var deltaY = ( Game.camera.scenePosition.y + mouse.y - mouseZ.y ) / ratioz
        // var x = ( ( Game.camera.scenePosition.x + mouse.x ) / resources.gridsize >> 0 ) * resources.gridsize;
        // var y = ( ( Game.camera.scenePosition.y + mouse.y ) / resources.gridsize >> 0 ) * resources.gridsize;
        resources.currentEl.position.setPosition( ( ( mouse.x + deltaX ) / resources.gridsize >> 0 ) * resources.gridsize
                                                , ( ( mouse.y + deltaY ) / resources.gridsize >> 0 ) * resources.gridsize );
      }
    }
    Game.camera.onMouseUp = function( mouse )
    {
      if ( resources.currentEl == null )
        return;
      resources.currentEl.isDragged = false;
      return true;
    }
    Game.camera.lastOnMouseDown = function( mouse )
    {
      if ( resources.currentEl == null )
        return;
      resources.currentEl.selected = false;
      resources.currentEl = null;
      document.getElementById( "elGui" ).style.display = "none";
      return true;
    }
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 200 );
    setTimeout( function(){ createGUI();DE.Inputs.keyLocked = true; }, 800 );
  };
  
  window.DE = DE; // debug
  window.Game = Game; // debug
  return Game;
} );