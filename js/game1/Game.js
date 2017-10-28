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
    // DE.CONFIG.DEBUG = 1;
    // DE.CONFIG.DEBUG_LEVEL = 2;
    // // DE.CONFIG.DEBUG_LEVEL = 2;
    // // render
    // Game.render = new DE.Render( "render", { backgroundColor: "0x880044", fullScreen: "ratioStretch", width: 1920, height: 1080 } );
    // Game.render.init();
    
    // DE.start();
  }
  
  Game.start = function()
  {
    console.log( "game start" );
  };
  
  Game.make = function()
  {
    //Create the renderer
    var render = new DE.Render( "render", {
      fullScreen       : "ratioStretch"
      , width          : 1280
      , height         : 720
      , backgroundColor: "0x00004F" } );

    // var renderer = PIXI.autoDetectRenderer(512, 512
    //   , { antialias: false, transparent: false, resolution: 1 });
    // document.body.appendChild(renderer.view);

    // scene
    var scene = new DE.Scene();

    // ne pas faire ça car le bounds se limite a la taille et position des objets dans la scene...
    // scene.interactive = true;
    // scene.click = function()
    // {
    //   console.log( "clicked", arguments );
    // }

    // caméra ??
    //Tell the `renderer` to `render` the `stage`
    render.add( scene );

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
      Game.ship.addAutomatism( "translateY", "translateY", { value1: -2 } );
      Game.ship.addAutomatism( "rotate", "rotate", { value1: 0.01 } );
      
      Game.ship2 = new DE.GameObject( {
        x: 700, y: 640
        ,renderer    : new DE.SpriteRenderer( { spriteName: "ayeraShip" } )
      } );
      Game.ship2.addAutomatism( "lookAt", "lookAt", { value1: Game.ship } );
      

      // scene.add
      scene.add( Game.ship, Game.ship2 );
    }

    DE.start();
    render.init();
  }
  
  window.Game = Game;

  return Game;
} );