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
    Game.render = new DE.Render( "render", { backgroundColor: "0x1100A4", fullScreen: "ratioStretch", width: 1920, height: 1080 } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DE.Scene( "Test" );
    
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "0x889944" } );
    Game.camera.scene = Game.scene;
    Game.render.add( Game.camera );
    
    Game.camera.gui = new DE.Gui();
    var guiob = new DE.GameObject( {
      x: 500, y: 500
      ,cursorOnOver: true
      ,renderer: new DE.TextRenderer( "This is inside GUI layer" )
      ,collider: new DE.FixedBoxCollider( 100,100 )
    } );
    guiob.onMouseMove = function( m )
    {
      // console.log( m );
      this.askToKill();
    }
    Game.camera.gui.add( guiob );
    Game.camera.onMouseMove = function( data )
    {
        // console.log( data );
      cursor.position.setPosition( data );
      // console.log( lookCursor.position.rotation );
    };
    // after all other events
    Game.camera.onLastMouseUp = function( data )
    {
      Game.box.moveTo( data, 500 );
    };
    
    var cursor = new DE.GameObject( {
      renderer: new DE.CircleRenderer( { fillColor: "0xff0000", radius: 20 } )
    } );
    
    Game.bg = new DE.GameObject( {
      x: 960
      ,y: 1400
      ,zindex: -1
      ,renderer: new DE.SpriteRenderer( { spriteName: "bg" } )
    } );
    Game.camera.interactive = true;
    Game.ship = new DE.GameObject( {
      x: 650 
      ,y: 500
      ,zindex: 1
      ,renderers: [
        new DE.SheetRenderer( "ship1.png" )
        ,new DE.TextRenderer( "This is a line\nreturn", { fill: "red" } )
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
    
    // goes where you click
    Game.box = new DE.GameObject( {
      x: 800, y: 500
      ,collider: new DE.FixedBoxCollider( 150, 120 )
      ,renderer: new DE.TextRenderer( "Click somewhere" )
    } );
    Game.box.check = function()
    {
      // TODO multi-type collision
      if ( DE.CollisionSystem.checkCollisionWith( this.collider, Game.ship.collider ) )
      {
        Game.txt.enable = true;
        console.log( "collision wouhou" );
      }
      else
        Game.txt.enable = false;
    };
    Game.box.addAutomatism( "check", "check" );
    
    // this one will ping-pong from right to left inside the Game.box
    var boxch = new DE.GameObject( {
      renderer: new DE.RectRenderer( { "fillColor": "random", "width": 20, "height": 20 } )
      ,y: 30
    } );
    boxch.moveMeSm = function()
    {
      if ( this.x > 0 )
        this.moveTo( { x: -50 }, 500 );
      else
        this.moveTo( { x: 50 }, 500 );
    }
    boxch.addAutomatism( "moveMeSm", "moveMeSm", { interval: 500 } );
    Game.box.add( boxch );
    
    var verifCircle = new DE.GameObject( {
      x: 800, y: 500, collider: new DE.CircleCollider( 96 )
    } )
    Game.scene.add( Game.box, Game.txt, verifCircle );
    
    var so = new DE.GameObject( {
      x: 1300, y: 400
      // ,zindex: 100
      ,collider: new DE.FixedBoxCollider( 100, 50 )
    } );
    so.add( new DE.GameObject( {
      x: 100
      ,cursorOnOver: true
      ,collider: new DE.CircleCollider( 20 )
    } ), new DE.GameObject( {
      x: -100, y: 20
      ,cursorOnOver: true
      ,collider: new DE.CircleCollider( 40 )
    } ) );
    
    var inout = new DE.GameObject( {
      renderer: new DE.TextRenderer( "In !" )
      ,zindex: 10
    } )
    inout.focus( so );
    inout.enable = false;
    so.onMouseEnter = function(){ inout.enable = true; };
    so.onMouseLeave = function(){ inout.enable = false; };
    
    var soc = so.gameObjects[ 1 ];
    soc.add( new DE.GameObject( {
      x: 150, y: -27
      ,collider: new DE.CircleCollider( 20 )
    } ) );
    so.gameObjects[ 0 ].addAutomatism( "rotate", "rotate", { value1: Math.PI * 0.5, interval: 650, value2: true } );
    so.gameObjects[ 0 ].onMouseMove = function( e ){ console.log( "move on first" ); };
    
    soc.addAutomatism( "rotate", "rotate", { value1: -0.01 } );
    soc.onMouseMove = function( e ){ console.log( "move on second" ); };
    soc.gameObjects[ 0 ].onMouseMove = function( e ){ console.log( "move on child" ); };
    
    Game.scene.add( so, inout );
    
    Game.scene.add( new DE.GameObject( {
        x: 960, y: 100
        ,zindex: 1000
        ,renderer: new DE.TextRenderer( "Open the console to see debug message" )
      } )
      , new DE.GameObject( {
        x: 960, y: 200
        ,renderer: new DE.TextRenderer( "This is camera background color" )
      } )
      , new DE.GameObject( {
        x: 960, y: 1000
        ,renderer: new DE.TextRenderer( "This is a gameobject with a superlarge sprite" )
      } )
      , new DE.GameObject( {
        x: 200, y: 850
        ,renderer: new DE.TextRenderer( "A RectRenderer with x at 25" )
      } )
      , new DE.GameObject( {
        x: 200, y: 900, 
        renderer: new DE.RectRenderer( { x: 25, "fillColor": "0x0000FF", "width": 50, "height": 50 } )
      } )
    );
    
    var lookCursor = new DE.GameObject( {
      x: 150, y: 150,
      renderer: new DE.RectRenderer( { fillColor: "0x220066", width: 20, height: 200 } )
    } );
    lookCursor.customUpdate = function(){
      this.lookAt( cursor );
    };
    lookCursor.addAutomatism( "customUpdate", "customUpdate" );
    
    Game.scene.add( cursor, lookCursor );
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  window.Game = Game; // debug
  return Game;
} );