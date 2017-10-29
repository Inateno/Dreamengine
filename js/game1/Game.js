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
  Game.ship  = null;
  Game.obj = null;
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    // DE.config.DEBUG = 1;
    // DE.config.DEBUG_LEVEL = 2;
    
    // Create the renderer before assets start loading
    Game.render = new DE.Render( "render", {
      fullScreen       : "ratioStretch"
      , width          : 1280
      , height         : 720
      , backgroundColor: "0x00004F" } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.onload = function()
  {
    console.log( "game start" );

    // scene
    var scene = new DE.Scene();

    // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scene
    // scene.interactive = true;
    // scene.click = function()
    // {
    //   console.log( "clicked", arguments );
    // }

    // if no Camera, we add the Scene to the render (this can change if I make Camera)
    Game.render.add( scene );
    
    // ImageManager ? Loader ??
    DE.PIXI.loader
      .add( { name: "ayeraShip", url: "imgs/ayera-ship.png" } )
      .load( onLoadComplete );

    Game.ship; Game.ship2;
    function onLoadComplete()
    {
      // gameObject
      Game.ship = new DE.GameObject( {
        x: 240, y: 240
        ,renderer    : new DE.SpriteRenderer( { spriteName: "ayeraShip" } )
        , interactive: true
        , click      :  function()
        {
          console.log( "click" );
        }
      } );
      Game.ship.axes = { x: 0, y: 0 };
      Game.ship.checkInputs = function()
      {
        this.translate( { x: this.axes.x * 2, y: this.axes.y * 2 } );
      };
      Game.ship.addAutomatism( "checkInputs", "checkInputs" );
      Game.ship.fire = function()
      {
        DE.Audio.fx.play( "piew" );
        var bullet = new DE.GameObject( {
          x        : this.x
          ,y       : this.y
          ,rotation: this.rotation
          //,renderer
        } );
        bullet.addAutomatism( "translateY", "translateY", { value1: -6  } );
        bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
        bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
        // bullet.addAutomatism( "askToKill", "askToKill", { interval: 2000, persistent: false } );
        
        scene.add( bullet );
      }
      // Game.ship.addAutomatism( "translateY", "translateY", { value1: -2 } );
      // Game.ship.addAutomatism( "rotate", "rotate", { value1: 0.01 } );
      
      Game.ship2 = new DE.GameObject( {
        x: 700, y: 640
        ,renderer    : new DE.SpriteRenderer( { spriteName: "ayeraShip" } )
      } );
      Game.ship2.addAutomatism( "lookAt", "lookAt", { value1: Game.ship } );
      

      // scene.add
      scene.add( Game.ship, Game.ship2 );
    }
    
    DE.Inputs.on( "keyDown", "left", function() { Game.ship.axes.x = -1; } );
    DE.Inputs.on( "keyDown", "right", function() { Game.ship.axes.x = 1; } );
    DE.Inputs.on( "keyUp", "right", function() { Game.ship.axes.x = 0; } );
    DE.Inputs.on( "keyUp", "left", function() { Game.ship.axes.x = 0; } );
    
    DE.Inputs.on( "keyDown", "up", function() { Game.ship.axes.y = -1; } );
    DE.Inputs.on( "keyDown", "down", function() { Game.ship.axes.y = 1; } );
    DE.Inputs.on( "keyUp", "down", function() { Game.ship.axes.y = 0; } );
    DE.Inputs.on( "keyUp", "up", function() { Game.ship.axes.y = 0; } );
    
    DE.Inputs.on( "keyDown", "fire", function() { Game.ship.addAutomatism( "fire", "fire", { interval: 150 } ); } );
    DE.Inputs.on( "keyUp", "fire", function() { Game.ship.removeAutomatism( "fire" ); } );

  }
  
  window.Game = Game;
  window.DE = DE;

  return Game;
} );