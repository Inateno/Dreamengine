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

    // scene
    var scene = new DE.Scene();

    // don't do this because DisplayObject bounds is not set to the render size but to the objects inside the scene
    // scene.interactive = true;
    // scene.click = function()
    // {
    //   console.log( "clicked", arguments );
    // }

    // if no Camera, we add the Scene to the render (this can change if I make Camera)
    
    Game.camera = new DE.Camera( 0, 0, 1920, 1080, { scene: scene, backgroundImage: "bg" } );
    Game.render.add( Game.camera );
      
    Game.ship; Game.ship2;
    
    // WIP working on a simple "AnimatedSprite" declaration
    // var imgs = ["ship1.png","ship2.png","ship3.png","ship4.png","ship5.png","ship6.png"];
    // var textureArray = [];

    // for (var i=0; i < imgs.length; i++)
    // {
    //   var texture = PIXI.utils.TextureCache[imgs[i]];
    //   textureArray.push(texture);
    // };

    // var mc = new PIXI.extras.AnimatedSprite(textureArray);
    
    Game.ship = new DE.GameObject( {
      x: 240, y: 240, scale: 1
      ,renderers   : [
        new DE.SpriteRenderer( { spriteName: "ayeraShip" } )
        , new DE.TextRenderer( "Player 1", {
          y: -100
          ,textStyle: {
            fill           : 'white',
            fontSize       : 35,
            fontFamily     : 'Snippet, Monaco, monospace',
            strokeThickness: 1,
            align          : "center"
          }
        } )
        ,new DE.SpriteRenderer( { spriteName: "reactor", y: 80, scale: 0.3, rotation: Math.PI } )
      ]
      , axes: { x: 0, y: 0 }
      , interactive: true
      , click      :  function()
      {
        console.log( "click" );
      }
      
      , checkInputs: function()
      {
        this.translate( { x: this.axes.x * 2, y: this.axes.y * 2 } );
        Game.camera.x += 2 * this.axes.x;
        Game.camera.y += 2 * this.axes.y;
      }
      , automatisms: [ [ "checkInputs", "checkInputs" ] ]
      
      , gameObjects: [
        new DE.GameObject( {
          x: 150
          , scale: 0.5
          , automatisms: [ [ "rotate", "rotate", { value1: -0.07 } ] ]
          , gameObjects: [
            new DE.GameObject( {
              x: 250
              , scale: 2
              , renderer: new DE.SpriteRenderer( { spriteName: "player-bullet" } )
            } )
            , new DE.GameObject( {
              x: -250
              , scale: 2
              , rotation: Math.PI
              , renderer: new DE.SpriteRenderer( { spriteName: "player-bullet", loop: true } )
            } )
          ]
        } ) ]
    } );
    
    Game.ship.fire = function()
    {
      DE.Audio.fx.play( "piew" );
      var bullet = new DE.GameObject( {
        x        : 960//this.x
        ,y       : 940//this.y
        ,rotation: this.rotation
        ,renderer: new DE.SpriteRenderer( { spriteName: "player-bullet" } )
      } );
      bullet.addAutomatism( "translateY", "translateY", { value1: -6  } );
      bullet.moveTo( { z: 10 }, 2000 );
      // bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
      // bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
      bullet.addAutomatism( "askToKill", "askToKill", { interval: 2000, persistent: false } );
      
      scene.add( bullet );
    };
    
    Game.ship2 = new DE.GameObject( {
      x: 700, y: 640
      ,renderers: [
        new DE.TextureRenderer( { spriteName: "ship3.png" } )
        ,new DE.SpriteRenderer( { spriteName: "reactor", y: 80, scale: 0.3, rotation: Math.PI } )
      ]
    } );
    Game.ship2.addAutomatism( "lookAt", "lookAt", { value1: Game.ship } );
    
    Game.heart1 = new DE.GameObject( {
      x: 700, y: 100
      , zindex : 10
      ,renderer: new DE.TextureRenderer( { spriteName: "heart" } )
    } );
    Game.heart2 = new DE.GameObject( {
      x: 800, y: 100
      , zindex : 10
      ,renderer: new DE.TextureRenderer( { spriteName: "heart", width: 50, height: 20 } )
    } );
    
    var rectangle = new DE.GameObject( {
      x: 800, y: 300
      ,renderer: new DE.RectRenderer( 40, 70, "0xDDCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false, x: -20, y: -35 } )
    } );
    var rectangle2 = new DE.GameObject( {
      x: 850, y: 300
      ,renderer: new DE.RectRenderer( 40, 70, "0xDDF0CC", { lineStyle: [ 4, "0x00F30D", 10 ], x: -20, y: -35 } )
    } );
    
    var customShape = new DE.GameObject( {
      x: 900, y: 300
      ,renderer: new DE.GraphicRenderer( [ { "beginFill": "0x66CCFF" }, { "drawRect": [ 0, 0, 50, 50 ] }, { "endFill": [] } ], { x: -25, y: -25 } )
    } );
    Game.shapes = {
      customShape : customShape
      , rectangle : rectangle
      , rectangle2: rectangle2
    };
    
    function scroller(){
      this.z -= 0.1;
      if ( this.z < -4 ) {
        this.z = 10;
      }
    }
    for ( var i = 0, a, b, c, d, e, f; i < 150; i += 5 )
    {
      a = new DE.GameObject( { _staticPosition: true, x: 100, y: 100, z: i * 0.1, renderer: new DE.RectRenderer( 40, 70, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35 } ) } )
      a.scroller = scroller;
      a.addAutomatism( "scroller", "scroller" );
      b = new DE.GameObject( { _staticPosition: true, x: 1820, y: 100, z: i * 0.1, renderer: new DE.RectRenderer( 40, 70, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35 } ) } )
      b.scroller = scroller;
      b.addAutomatism( "scroller", "scroller" );
      c = new DE.GameObject( { _staticPosition: true, x: 1820, y: 980, z: i * 0.1, renderer: new DE.RectRenderer( 40, 70, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35 } ) } )
      c.scroller = scroller;
      c.addAutomatism( "scroller", "scroller" );
      d = new DE.GameObject( { _staticPosition: true, x: 100, y: 980, z: i * 0.1, renderer: new DE.RectRenderer( 40, 70, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35 } ) } )
      d.scroller = scroller;
      d.addAutomatism( "scroller", "scroller" );
      
      e = new DE.GameObject( { _staticPosition: true, x: 960, y: 100, z: i * 0.1, renderer: new DE.RectRenderer( 1720, 10, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false, x: -860, y: -5 } ) } )
      e.scroller = scroller;
      e.addAutomatism( "scroller", "scroller" );
      
      f = new DE.GameObject( { _staticPosition: true, x: 960, y: 980, z: i * 0.1, renderer: new DE.RectRenderer( 1720, 10, "0x" + i + "DCCFC", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false, x: -860, y: -5 } ) } )
      f.scroller = scroller;
      f.addAutomatism( "scroller", "scroller" );
      scene.add( a, b, c, d, e, f );
    }
    
    scene.add( Game.ship );
    // scene.add( Game.ship, Game.ship2, Game.heart1, Game.heart2, customShape, rectangle, rectangle2 );
    Game.scene = scene;
    
    DE.Inputs.on( "keyDown", "left", function() { Game.ship.axes.x = -2; } );
    DE.Inputs.on( "keyDown", "right", function() { Game.ship.axes.x = 2; } );
    DE.Inputs.on( "keyUp", "right", function() { Game.ship.axes.x = 0; } );
    DE.Inputs.on( "keyUp", "left", function() { Game.ship.axes.x = 0; } );
    
    DE.Inputs.on( "keyDown", "up", function() { Game.ship.axes.y = -2; } );
    DE.Inputs.on( "keyDown", "down", function() { Game.ship.axes.y = 2; } );
    DE.Inputs.on( "keyUp", "down", function() { Game.ship.axes.y = 0; } );
    DE.Inputs.on( "keyUp", "up", function() { Game.ship.axes.y = 0; } );
    
    DE.Inputs.on( "keyDown", "fire", function() { Game.ship.addAutomatism( "fire", "fire", { interval: 150 } ); } );
    DE.Inputs.on( "keyUp", "fire", function() { Game.ship.removeAutomatism( "fire" ); } );

  }
  
  window.Game = Game;
  window.DE = DE;

  return Game;
} );