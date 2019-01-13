/**
* Author
 @Grimka

***
simple Game declaration
**/
define( [ 'DREAM_ENGINE', 'Home', 'World' ],
function( DE, Home, World )
{
  var Game = {};
    
  Game.render  = null;
  Game.scene  = null;
  Game.world  = null;

  Game.camera = null;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    // DE.config.DEBUG = 1;
    // DE.config.DEBUG_LEVEL = 2;

    // little hack to be able to right click while holding left click
    // it make pixi fall back to standard mouseevent system
    // it might break mobile touch handling but we don't care since the game is designed for pc users
    // "do you guys not have computers ???"
    // "https://www.youtube.com/watch?v=ly10r6m_-n8"
    window.PointerEvent = null;

    // disable context menu poping up on right click
    document.oncontextmenu = function()
    {
      return false;
    }

    // Create the renderer before assets start loading
    Game.render = new DE.Render( "render", {
      resizeMode       : "stretch-ratio"
      , width          : 1920
      , height         : 1080
      , backgroundColor: "0x00004F"
      , roundPixels    : false
      , powerPreferences: "high-performance"
    } );
    
    Game.render.init();
    
    DE.start();
  }
  
  Game.onload = function()
  {
    console.log( "game start" );

    // hide cursor on canvas
    Game.render.view.style.cursor = "none";

    // scene
    Game.scene = new DE.Scene();

    Game.camera = new DE.Camera( 0, 0, 1920, 1080, { scene: Game.scene, backgroundImage: "bg" } );
    Game.camera.interactive = true;
    Game.camera.pointermove = function( pos, e ) { if(Game.world) Game.world.moveTarget(pos); };
    Game.camera.pointerdown = function( pos, e ) { if(Game.world) Game.world.checkMouseEvent(e); }
    Game.camera.pointerup = function( pos, e ) { if(Game.world) Game.world.checkMouseEvent(e); }

    Game.render.add( Game.camera );

    Game.openHome();
  }

  Game.openHome = function()
  {
    // show cursor in home
    Game.render.view.style.cursor = "default";

    if(Game.world)
      Game.world.askToKill();
    Game.world = null;

    //reset camera
    Game.camera.x = 960;
    Game.camera.y = 540;

    Game.home = new Home();
    
    Game.scene.add( Game.home );
  }

  Game.play = function()
  {
    // hide cursor on world
    Game.render.view.style.cursor = "none";

    Game.home.askToKill();
    Game.home = null;

    Game.world = new World();
    
    Game.scene.add( Game.world );
  }
  
  window.Game = Game;
  window.DE = DE;

  return Game;
} );