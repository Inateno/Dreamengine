/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/
define( [ 'DREAM_ENGINE', 'DE.TouchControl' ],
function( DE, TouchControl )
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
    DE.CONFIG.DEBUG = 1;
    DE.CONFIG.DEBUG_LEVEL = 2;
    // DE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DE.Render( "render", { backgroundColor: "0x880044", fullScreen: "ratioStretch", width: 1920, height: 1080 } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DE.Scene( "Test" );
    
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera.scene = Game.scene;
    Game.render.add( Game.camera );
    
    Game.camera.gui = new DE.Gui();
    var guiob = new DE.GameObject( {
      x: 500, y: 500
      ,cursorOnOver: true
      ,renderer: new DE.TextRenderer( "Coucou la GUI" )
      ,collider: new DE.FixedBoxCollider( 100,100 )
    } );
    guiob.onMouseMove = function( m )
    {
      // console.log( m );
    }
    Game.camera.gui.add( guiob );
    Game.camera.onMouseMove = function( data )
    {
        // console.log( data );
    };
    
    Game.bg = new DE.GameObject( {
      x: 960
      ,y: 540
      ,zindex: 0
      ,renderer: new DE.SpriteRenderer( { spriteName: "bg" } )
    } );
    Game.camera.interactive = true;
    Game.ship = new DE.GameObject( {
      x: 650 
      ,y: 500
      ,zindex: 1
      ,renderers: [
        new DE.SheetRenderer( "ship1.png" )
        ,new DE.TextRenderer( "coco la patate\nyoupi", { fill: "red" } )
      ]
      ,collider: new DE.CircleCollider( 100, 100 )
      ,cursorOnOver: true
    } );
    Game.reactor = new DE.GameObject( {
      x: 0
      ,y: 100
      ,name: "reactor"
      ,renderer: new DE.SheetRenderer( "ship4.png", { spriteName: "ship", scale: 0.5 } )
      ,collider: new DE.FixedBoxCollider( 50,50 )
    } );
    Game.ship.add( Game.reactor );
    Game.reactor.interactive = true;
    Game.reactor.onMouseMove = function( data )
    {
        this.setPositionFromAbsolute( data );
    }
    Game.scene.add( Game.bg, Game.ship );
    Game.ship.onMouseDown = function( mouse, prevent )
    {
      this.data = mouse;
      this.alpha = 0.9;
      this.dragging = true;
    };
    Game.ship.onMouseUp = Game.ship.onMouseLeave = function( mouse )
    {
      this.alpha = 1
      this.dragging = false;
      // set the interaction data to null
      this.data = null;
    };
    Game.ship.onMouseMove = function(data)
    {
      if( this.dragging )
      {
        // need to get parent coords..
        // var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = data.x;
        this.position.y = data.y;
      }
    };
    Game.ship.interactive = true;
    
    Game.txt = new DE.GameObject( {
      x: 800, y: 400
      ,renderer: new DE.TextRenderer( "Collision" )
    } )
    Game.txt.enable = false;
    Game.box = new DE.GameObject( {
      x: 800, y: 500
      ,collider: new DE.FixedBoxCollider( 150, 120 )
    } );
    Game.box.check = function()
    {
      if ( DE.CollisionSystem.checkCollisionWith( this.collider, Game.ship.collider ) )
      {
        Game.txt.enable = true;
        console.log( "collision wouhou" );
      }
      else
        Game.txt.enable = false;
    }
    var verifCircle = new DE.GameObject( {
      x: 800, y: 500, collider: new DE.CircleCollider( 96 )
    } )
    Game.box.addAutomatism( "check", "check" );
    Game.scene.add( Game.box, Game.txt, verifCircle );
    // Game.ship.buttonMode = true;
    
    // Game.ship2 = new DE.GameObject( {
    //   x: 600
    //   ,y: 500, zindex: 2
    //   ,renderer: new DE.SpriteRenderer( { spriteName: "ship" } )
    //   ,collider: new DE.CircleCollider( 20 )
    // } );
    // Game.ship2.interactive = true;
    // // Game.ship2.buttonMode = true;
    // Game.scene.add( Game.ship2 );
    // Game.ship2.mousedown = Game.ship2.touchstart = function(data)
    // {
    //   this.data = data;
    //   this.alpha = 0.9;
    //   this.dragging = true;
    // };
    // Game.ship2.mouseup = Game.ship2.mouseupoutside = Game.ship2.touchend = Game.ship2.touchendoutside = function(data)
    // {
    //   this.alpha = 1
    //   this.dragging = false;
    //   // set the interaction data to null
    //   this.data = null;
    // };
    
    // // set the callbacks for when the mouse or a touch moves
    // Game.ship2.mousemove = Game.ship2.touchmove = function(data)
    // {
    //   if(this.dragging)
    //   {
    //     // need to get parent coords..
    //     var newPosition = this.data.data.getLocalPosition(this.parent);
    //     this.position.x = newPosition.x;
    //     this.position.y = newPosition.y;
    //   }
    // };
    
    // Game.simpleObject.add( new DE.GameObject( {
    //   x: 100
    // } ), new DE.GameObject( {
    //   x: -100, y: 20
    //   ,collider: new DE.CircleCollider( 50, 70 )
    // } ) );
    // Game.simpleObject.gameObjects[ 1 ].add( new DE.GameObject( {
    //   x: 150, y: -27
    // } ) );
    // // Game.simpleObject.gameObjects[ 0 ].addAutomatism( "rotate", "rotate", { value1: 0.01 } );
    // Game.simpleObject.gameObjects[ 1 ].addAutomatism( "rotate", "rotate", { value1: -0.05 } );
    
    // var gs = Game.simpleObject;
    // // enable object to be interactive.. this will allow it to respond to mouse and touch events 
    // gs.interactive = true;
    // // this button mode will mean the hand cursor appears when you rollover the bunny with your mouse
    // gs.buttonMode = true;
    // // use the mousedown and touchstart
    // gs.mousedown = gs.touchstart = function(data)
    // {
    //   //    data.originalEvent.preventDefault()
    //   // store a refference to the data
    //   // The reason for this is because of multitouch
    //   // we want to track the movement of this particular touch
    //   this.data = data;
    //   this.alpha = 0.9;
    //   this.dragging = true;
    // };
    
    // // set the events for when the mouse is released or a touch is released
    // gs.mouseup = gs.mouseupoutside = gs.touchend = gs.touchendoutside = function(data)
    // {
    //   this.alpha = 1
    //   this.dragging = false;
    //   // set the interaction data to null
    //   this.data = null;
    // };
    
    // // set the callbacks for when the mouse or a touch moves
    // gs.mousemove = gs.touchmove = function(data)
    // {
    //   if(this.dragging)
    //   {
    //     // need to get parent coords..
    //     var newPosition = this.data.data.getLocalPosition(this.parent);
    //     this.position.x = newPosition.x;
    //     this.position.y = newPosition.y;
    //   }
    // };
    
    // Game.otherObject = new DE.GameObject( {
    //   x: 800, y: 400
    //   ,zindex: 20
    //   ,collider: new DE.CircleCollider( 150, 150 )
    // } );
    // Game.otherObject.buttonMode = true;
    // Game.otherObject.interactive = true;
    // Game.otherObject.logic = function()
    // {
    //   if ( DE.CollisionSystem.pointColliderCollision( Game.simpleObject.gameObjects[ 1 ].gameObjects[ 0 ], this.collider ) )
    //   {
    //     console.log( "wouuw colision" );
    //   }
    // };
    // Game.otherObject.addAutomatism( "logic", "logic" );
    
    // Game.scene.add( Game.simpleObject, Game.otherObject );
    
    // for ( var i = 0, o; i < 20; ++i )
    // {
    //   o = new DE.GameObject( {
    //     x: -5500 + Math.random() * 5520 >> 0
    //     ,y: -2000 + Math.random() * 3080 >> 0
    //     ,renderer: new DE.SpriteRenderer( { spriteName: "ship" } )
    //     // ,collider: new DE.CircleCollider( 20 )
    //   } );
    //   o.renderer._nextAnim = Math.random() * 500 >> 0;
    //   o.addAutomatism( "rotate", "rotate", { value1: -0.05 + Math.random() * 0.1 } );
    //   o.addAutomatism( "translateY", "translateY", { value1: -4 } );
    //   Game.scene.add( o );
    // }
    
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  window.Game = Game; // debug
  return Game;
} );