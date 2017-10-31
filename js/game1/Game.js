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
      
      , checkInputs: function(){ this.translate( { x: this.axes.x * 2, y: this.axes.y * 2 } ); }
      , automatisms: [ [ "checkInputs", "checkInputs" ] ]
      
      , gameObjects: [
        new DE.GameObject( {
          x: 0
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
        x        : this.x
        ,y       : this.y
        ,rotation: this.rotation
        ,renderer: new DE.SpriteRenderer( { spriteName: "player-bullet" } )
      } );
      bullet.addAutomatism( "translateY", "translateY", { value1: -6  } );
      bullet.addAutomatism( "rotate", "rotate", { value1: Math.random() * 0.1 } );
      bullet.addAutomatism( "inverseAutomatism", "inverseAutomatism", { value1: "rotate", interval: 100 } );
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
      ,renderer: new DE.TextureRenderer( { spriteName: "heart" } )
    } );
    Game.heart2 = new DE.GameObject( {
      x: 800, y: 100
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
    
    scene.add( Game.ship, Game.ship2, Game.heart1, Game.heart2, customShape, rectangle, rectangle2 );
    
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