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
    Game.camera.interactive = true;
    Game.camera.pointermove = function( e, pos ) { Game.targetPointer.moveTo( pos, 100 ); };
    Game.camera.pointerdown = function( e, pos ) { console.log( "down" ); Game.targetPointer.shake( 10, 10, 200 ); };
    Game.camera.pointerup = function( e, pos ) { console.log( "up" ); Game.targetPointer.shake( 10, 10, 200 ); };
    Game.render.add( Game.camera );
    
    Game.targetPointer = new DE.GameObject( {
      zindex: 500
      , renderer: new DE.SpriteRenderer( { spriteName: "target", scale: 0.3 } )
    } );
    
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
        
        if ( Game.moveCamera ) {
          Game.camera.x -= 2 * this.axes.x;
          Game.camera.y -= 2 * this.axes.y;
        }
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
      x: 1600, y: 100
      , zindex : 10
      ,renderer: new DE.TextureRenderer( { spriteName: "heart" } )
    } );
    Game.heart2 = new DE.GameObject( {
      x: 1700, y: 100
      , zindex : 10
      ,renderer: new DE.TextureRenderer( { spriteName: "heart", width: 50, height: 20 } )
    } );
    
    var rectangle = new DE.GameObject( {
      x: 800, y: 300
      ,interactive: true
      ,renderers: [
        new DE.RectRenderer( 40, 70, "0xFFFF00", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35 } )
        ,new DE.RectRenderer( 40, 70, "0xF0F0F0", { lineStyle: [ 4, "0xFF3300", 1 ], fill: true, x: -20, y: -35, visible: false } )
      ]
      ,pointerover: function() {
        this.renderers[ 1 ].visible = true;
        console.log( "mouse over" );
      }
      ,pointerout: function() {
        this.renderers[ 1 ].visible = false;
        console.log( "mouse out" );
      }
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
      if ( this.z < 2 ) {
        this.z = 10;
      }
    }
    for ( var i = 0, a, b, c, d, e, f, g; i < 100; i += 5 )
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
      
      if ( i % 10 == 0 ) {
        g = new DE.GameObject( { _staticPosition: true, x: 960, y: 980, zindex: 10, z: i * 0.1, renderer: new DE.RectRenderer( 10, 30, "0xFFFFFF", { x: -5, y: -15 } ) } )
        g.scroller = scroller;
        g.addAutomatism( "scroller", "scroller" );
        
        scene.add( g );
      }
    }
    
    var button = new DE.GameObject( {
      x: 960, y: 100
      ,zindex     : 50
      ,interactive: true
      ,hitArea    : new DE.PIXI.Rectangle( -225, -50, 450, 100 )
      ,cursor     : "pointer"
      ,renderers  : [
        new DE.RectRenderer( 400, 80, "0xFFCDCD", { lineStyle: [ 4, "0x000000", 1 ], fill: true, x: -200, y: -40 } )
        , new DE.TextRenderer( "Camera Move: false", {
          textStyle: {
            fill           : 'black',
            fontSize       : 35,
            fontFamily     : 'Snippet, Monaco, monospace',
            strokeThickness: 1,
            align          : "center"
          }
        } )
      ]
      ,pointerover: function() {
        if ( !Game.moveCamera ) {
          this.renderer.updateRender( { color: "0xFFDEDE" } );
        }
        else {
          this.renderer.updateRender( { color: "0xDEFFDE" } );
        }
      }
      ,pointerout: function() {
        if ( !Game.moveCamera ) {
          this.renderer.updateRender( { color: "0xFFCDCD" } );
        }
        else {
          this.renderer.updateRender( { color: "0xCDFFCD" } );
        }
      }
      ,pointerdown: function() {
        if ( !Game.moveCamera ) {
          this.renderer.updateRender( { color: "0xFF0000" } );
        }
        else {
          this.renderer.updateRender( { color: "0x00FF00" } );
        }
      }
      ,pointerup: function() {
        Game.moveCamera = !Game.moveCamera;
        this.renderers[ 1 ].text = "Camera Move: " + Game.moveCamera.toString();
        this.pointerover();
      }
    } );
    
    scene.add( Game.ship, Game.ship2, Game.heart1, Game.heart2, customShape, rectangle, rectangle2, button, Game.targetPointer );
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