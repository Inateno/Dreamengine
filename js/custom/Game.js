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
  
  function addFire( object )
  {
    object.bulletSpeed = 3;
    object.fire = function( target, distance )
    {
      if ( DE.CollisionSystem.pointCircleCollision( target.getPos(), this.collider ) )
      {
        var pos = this.getPos();
        var sprite = new DE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.2, "scaleY":0.2 } );
        var bullet = new DE.GameObject( { "name": "bullet", "tag":"time", "x": pos.x, "y": pos.y, "renderer": sprite } );
        bullet.position.setRotation( this.getRotation() );
        bullet.moving = function( value )
        {
          this.translateY( value );
          if ( this.position.x < -50 || this.position.y < -50 || this.position.x > 1920 || this.position.y > 1080 )
          {
            this.askToKill();
          }
        }
        bullet.addAutomatism( "moving", "moving", { "value1": this.bulletSpeed } );
        Game.scene.add( bullet );
      }
    }
  }
  
  function addEnemy( object, x, y, player )
  {
      // STEP 1 enemy and components
      var enemy = new DE.GameObject( {
       'x': x, 'y': y
        , 'collider': new DE.CircleCollider( 30 )
        , "renderer":new DE.BoxRenderer( { "fillColor": "rgb(20,20,20)" }, 50, 80 )
      } );
      enemy.onMouseDown = function(){ console.log( "enemy down" ); }
      enemy.onMouseEnter = function(){ console.log( "enemy enter" ); }
      enemy.onMouseLeave = function(){ console.log( "enemy leave" ); }
      object.scene.add( enemy );
      object.enemies.push( enemy );
      
      
      enemy.arm = new DE.GameObject( {
        "name": "arm", "tag":"time", "x": 0, "y": 0
        , "renderer":new DE.BoxRenderer( { "fillColor": "green", "offsetY": 0 }, 120, 20 )
      } );
      var canon = new DE.GameObject( { 'x': 50, 'y': 0
        , "renderer":new DE.BoxRenderer( { "fillColor": "red", "offsetY": 15 }, 15, 50 )
      } );
      var gatling = new DE.GameObject( { 'x': 0, 'y': 50
        , 'collider': new DE.CircleCollider( 200 )
      } );
      gatling.onMouseDown = function(){ console.log( "%cgatling gun down", "color:orange" ); }
      gatling.onMouseEnter = function(){ console.log( "%cgatling gun enter", "color:orange" ); }
      gatling.onMouseLeave = function(){ console.log( "%cgatling gun leave", "color:orange" ); }
      canon.add( gatling );
      
      var canon2 = new DE.GameObject( { 'x': -50, 'y': 0
        , "renderer":new DE.BoxRenderer( { "fillColor": "red", "offsetY": 15 }, 15, 50 )
      } );
      var rocketo = new DE.GameObject( { 'x': 0, 'y': 50
        , 'collider': new DE.CircleCollider( 300 )
      } );
      canon2.add( rocketo );
      
      enemy.arm.add( canon2 );
      enemy.arm.add( canon );
      enemy.add( enemy.arm );
      
      enemy.target = player;
      // STEP 2
      enemy.move = function()
      {
        this.translateY( 4 );
        this.rotate( 0.01 );
        // this.arm.lookAt( this.target.position );
        this.arm.lookAt( this.target.position );
      }
      enemy.addAutomatism( "gameLogic", "move" );
      
      // STEP 3
      addFire( gatling );
      gatling.addAutomatism( "fire", "fire", { "value1":player, "value2":300, "interval":150+( Math.random()*100 ) >> 0 } );
      addFire( rocketo );
      rocketo.addAutomatism( "fire", "fire", { "value1":player, "value2":300, "interval":150+( Math.random()*100 ) >> 0 } );
      rocketo.bulletSpeed = 7;
  }
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DE.CONFIG.DEBUG = 1;
    // DE.CONFIG.DEBUG_LEVEL = 1;
    DE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    
    DE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DE.Scene( "Test" );
    
    /* GAME SHIP SAMPLE */
      var shipRender = new DE.SpriteRenderer( { "spriteName": "ship", "scaleX":0.2, "scaleY":0.2 } );
      var collider = new DE.CircleCollider( 50 );
      Game.ship = new DE.GameObject( { "name":"Ayera", "tag":"Player"
                                        , "x": 980, "y":500, "z": 0
                                        , "renderer": shipRender
                                        , "collider":collider } );
      Game.ship.onMouseUp= function(){this.fire();};
      
      // add a children
      var reactorfx = new DE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.4, "scaleY":0.4 } );
      var reactor = new DE.GameObject( { "name":"Reactor", "tag":"FX", "y":108, "renderer": reactorfx } );
      Game.ship.add( reactor );
      reactor.position.setRotation( Math.PI );
      
      // add ship in scene
      Game.scene.add( Game.ship );
    
    // camera
    // Game.camera = new DE.Camera( 1400, 880, 420, 100, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera = new DE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    // Game.camera.sizes.scaleX = 0.8;
    // Game.camera.sizes.scaleY = 0.8;
    // Game.camera = new DE.Camera( 1280, 720, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera.scene = Game.scene;
    Game.camera.gui = new DE.Gui( Game.camera, { 'id': "Test" } );
    
    // for ( var i = 1900; i > 0; i -= 100 )
    //   Game.scene.add( new DE.GameObject( { "x": i, "y": 300 } ) );
    Game.scene.add( new DE.GameObject( { "x": 10, "y": 10 } ) );
    Game.scene.add( new DE.GameObject( { "x": 10, "y": 10 } ) );
    Game.scene.add( new DE.GameObject( { "x": 10, "y": 760 } ) );
    Game.scene.add( new DE.GameObject( { "x": 1580, "y": 750 } ) );
    Game.scene.add( new DE.GameObject( { "x": 1580, "y": 10 } ) );
    
    var rotateCol = new DE.GameObject( { "x": 1080, "y": 0, "collider": new DE.OrientedBoxCollider( 200, 100, {} ) } );
    Game.scene.add( rotateCol );
    
    Game.pp = new DE.GameObject( { "x": 500, "y": 500, "renderer": new DE.BoxRenderer( { "fillColor": "pink" }, 50, 50 ) } );
    Game.scene.add( Game.pp );
    Game.camera.onMouseMove = function( e )
    {
      Game.pp.position.x = e.x;
      Game.pp.position.y = e.y;
    }
    Game.camera.onMouseUp = Game.camera.onMouseMove;
    Game.camera.onMouseDown = Game.camera.onMouseMove;
    
    Game.render.add( Game.camera );
    
    // Create Enemies
    Game.enemies = new Array();
    var n = 22;
    addEnemy( Game, 1000, 500, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 0+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 200+i%2*100, Game.ship );
    for ( var i = 0; i < n; ++i )
      // addEnemy( Game, 180 + i*80, 400+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 600+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 800+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 1000+i%2*100, Game.ship );
    
    Game.camera.gui.add( new DE.GuiLabel( { 'id': "hello", 'x': 50, 'y': 100, "w": 200, "h": 50 }, "Hello world" ) );
    Game.camera.gui.add( new DE.GuiButton( { 'id': "Click me plz", 'x': 450, 'y': 600, "w": 100, "h": 100, 'fillColor': "white", "enable": false } ) );
    Game.camera.gui.add( new DE.GuiImage( { 'id': 'simpleImage', 'spriteName': "reactor", "x": 200, "y": 600, "w": 100, "h": 100, "paused": true } ) );
    
    Game.camera.gui.components[ 'hello' ].onMouseUp = function()
    {
      Game.camera.gui.components[ 'Click me plz' ].toggle();
    }
    Game.camera.gui.components[ 'simpleImage' ].onMouseUp = function()
    {
      Game.camera.gui.components[ 'Click me plz' ].toggle();
    }
    Game.camera.gui.components[ 'Click me plz' ].onMouseUp = function()
    {
      console.log( "clickcik" );
      Game.camera.renderPosition.rotate( Math.PI*0.1 );
    }
    // Game.camera.position.rotate( Math.PI );
    
    //add Fire on the ship
    Game.ship.fire = function()
    {
      var pos = this.getPos();
      var sprite = new DE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.2, "scaleY":0.2 } );
      var bullet = new DE.GameObject( { "name": "bullet", "tag":"time", "x": pos.x, "y": pos.y, "z": pos.z, "renderer": sprite } );
      bullet.position.setRotation( this.position.rotation );
      bullet.addAutomatism( "bouge", "translateY", { "value1": -3 } );
      Game.scene.add( bullet );
    }
    //
    // DE.Inputs.addActionInput( "fire", "launchMissile", function(){Game.ship.fire();}, "up" )
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 500 );
  };
  window.Game = Game; // debug
  return Game;
} );