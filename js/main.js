var DE = DREAM_ENGINE = {};

DE.PIXI = PIXI;

var config = {};
config.VERSION = '2.0';

config.DEBUG = true;
config.DEBUG_LEVEL = 5;

DE.VERSION = config.VERSION;

console.log( PIXI.ticker.shared )
DE.pixtime = PIXI.ticker.shared;

PIXI.utils.sayHello = function( type )
{
  if ( type == 'WebGL' )
    type = type + ' ☺';
  
  if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
      var args = [
          '\n %c %c %c DreamEngine V2 > PIXI V4 ☃ - v' + DE.VERSION + ' - ✰ ' + type + ' ✰  %c ' +
            ' %c ' + ' http://dreamengine.dreamirl.com/ %c ' +
            ' %c ' + ' http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n'
          ,'background: #FF7C0A; padding:5px 0;','background: #FF7C0A; padding:5px 0;','color: #FF7C0A; background: #030307; padding:5px 0;','background: #FF7C0A; padding:5px 0;','background: #FFC18E; padding:5px 0;','background: #FF7C0A; padding:5px 0;','background: #ffc3dc; padding:5px 0;','background: #FF7C0A; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;'
      ];

      window.console.log.apply( console, args ); //jshint ignore:line
  }
  else if ( window.console ) {
      window.console.log( 'DreamEngine V2 > PIXI V4 ☃ - v' + DE.VERSION + ' - ✰ ' + type + ' ✰ '
        + ' | http://dreamengine.dreamirl.com | http://www.pixijs.com' ); //jshint ignore:line
  }
};

// enhance PIXI DisplayObject with new features / attributes
// TODO improveDisplayObject( DE.PIXI );

DE.start = function()
{
  MainLoop.launched = true;
  MainLoop.loop();
}

//Create the renderer
var render = new Render( "render", {
  fullScreen       : "ratioStretch"
  , width          : 1280
  , height         : 720
  , backgroundColor: "0x00004F" } );

// var renderer = PIXI.autoDetectRenderer(512, 512
//   , { antialias: false, transparent: false, resolution: 1 });
// document.body.appendChild(renderer.view);

// scene
var scene = new Scene();

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
PIXI.loader
  .add( { name: "ayeraShip", url: "imgs/ayera-ship.png" } )
  .load( onLoadComplete );

var ship, ship2;
function onLoadComplete()
{
  // gameObject
  ship = new GameObject( {
    x: 240, y: 240
    ,renderer    : new SpriteRenderer( { spriteName: "ayeraShip" } )
    , interactive: true
    , click      :  function()
    {
      console.log( "click" );
    }
  } );
  
  ship2 = new GameObject( {
    x: 700, y: 640
    ,renderer    : new SpriteRenderer( { spriteName: "ayeraShip" } )
  } );
  

  // scene.add
  scene.add( ship, ship2 );
}

window.onload = function()
{
  DE.start();
  render.init();
}