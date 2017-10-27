//Create the renderer
var renderer = PIXI.autoDetectRenderer(512, 512
  , { antialias: false, transparent: false, resolution: 1 });

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);


// scene
var scene = new Scene();


// caméra ??


// MainLoop
//Tell the `renderer` to `render` the `stage`
renderer.render(scene);

// ImageManager ? Loader ??
PIXI.loader
  .add( { name: "ayeraShip", url: "imgs/ayera-ship.png" } )
  .load( onLoadComplete );

var DEBUG = true;
var DEBUG_LEVEL = 5;

function onLoadComplete()
{
  // gameObject
  var object = new GameObject( {
    x: 240, y: 240
    ,renderer: new SpriteRenderer( { spriteName: "ayeraShip" } )
  } );

  // scene.add
  scene.add( object );
  
  // MainLoop
  renderer.render( scene );
}