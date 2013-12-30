/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple Game class declaration example
**/
define( [ 'DREAM_ENGINE' ],
function( DreamE )
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
      if ( target.position.isInRangeFrom( this.getPos(), distance ) )
      {
        var pos = this.getPos();
        var sprite = new DreamE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.2, "scaleY":0.2 } );
        var tir = new DreamE.GameObject( { "name": "tir", "tag":"time", "x": pos.x, "y": pos.y, "renderer": sprite } );
        tir.position.setRotation( this.getRotation() );
        tir.moving = function( value )
        {
          this.translateY( value );
          if ( this.position.x < -50 || this.position.y < -50 || this.position.x > 1920 || this.position.y > 1080 )
          {
            this.askToKill();
          }
        }
        tir.addAutomatism( "moving", { "type":"moving", "value1": this.bulletSpeed } );
        Game.scene.add( tir );
      }
    }
  }
  
  function addEnemy( object, x, y, player )
  {
      // STEP 1 enemy and components
      var enemy = new DreamE.GameObject( {
       'x': x, 'y': y
        , 'collider': new DreamE.CircleCollider( 30 )
        , "renderer":new DreamE.BoxRenderer( { "fillColor": "rgb(20,20,20)" }, 50, 80 )
      } );
      enemy.onMouseDown = function(){ console.log( "enemy down" ); }
      enemy.onMouseEnter = function(){ console.log( "enemy enter" ); }
      enemy.onMouseLeave = function(){ console.log( "enemy leave" ); }
      object.scene.add( enemy );
      object.enemies.push( enemy );
      
      
      enemy.arm = new DreamE.GameObject( {
        "name": "arm", "tag":"time", "x": 0, "y": 0
        , "renderer":new DreamE.BoxRenderer( { "fillColor": "green", "offsetY": 0 }, 120, 20 )
      } );
      var canon = new DreamE.GameObject( { 'x': 50, 'y': 0
        , "renderer":new DreamE.BoxRenderer( { "fillColor": "red", "offsetY": 15 }, 15, 50 )
      } );
      var gatling = new DreamE.GameObject( { 'x': 0, 'y': 50
        , 'collider': new DreamE.CircleCollider( 50 )
      } );
      gatling.onMouseDown = function(){ console.log( "%cgatling gun down", "color:orange" ); }
      gatling.onMouseEnter = function(){ console.log( "%cgatling gun enter", "color:orange" ); }
      gatling.onMouseLeave = function(){ console.log( "%cgatling gun leave", "color:orange" ); }
      canon.add( gatling );
      
      var canon2 = new DreamE.GameObject( { 'x': -50, 'y': 0
        , "renderer":new DreamE.BoxRenderer( { "fillColor": "red", "offsetY": 15 }, 15, 50 )
      } );
      var rocketo = new DreamE.GameObject( { 'x': 0, 'y': 50
        , 'collider': new DreamE.CircleCollider( 50 )
      } );
      canon2.add( rocketo );
      
      enemy.arm.add( canon2 );
      enemy.arm.add( canon );
      enemy.add( enemy.arm );
      
      enemy.target = player;
      // STEP 2
      enemy.move = function()
      {
        this.rotate( 0.04 );
        this.translateY( 2 );
        // this.arm.lookAt( this.target.position );
        // this.arm.rotate( 0.008 ); //lookAt( this.target.position );
      }
      enemy.addAutomatism( "gameLogic", { "type": "move" } );
      
      // STEP 3
      // addFire( gatling );
      // gatling.addAutomatism( "tire", { "type":"fire", "value1":player, "value2":300, "interval":150+( Math.random()*100 ) >> 0 } );
      // addFire( rocketo );
      // rocketo.addAutomatism( "tire", { "type":"fire", "value1":player, "value2":300, "interval":150+( Math.random()*100 ) >> 0 } );
      rocketo.bulletSpeed = 7;
  }
  
  // init
  Game.init = function()
  {
    console.log( "game init" );
    DreamE.CONFIG.DEBUG = 1;
    // DreamE.CONFIG.DEBUG_LEVEL = 1;
    DreamE.CONFIG.DEBUG_LEVEL = 2;
    // render
    Game.render = new DreamE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    
    DreamE.start();
  }
  
  Game.start = function()
  {
    // scene
    console.log( "game starto!!" );
    Game.scene = new DreamE.Scene( "Test" );
    
    /* GAME SHIP SAMPLE */
      var shipRender = new DreamE.SpriteRenderer( { "spriteName": "ship", "scaleX":0.2, "scaleY":0.2 } );
      var collider = new DreamE.CircleCollider( 50 );
      Game.ship = new DreamE.GameObject( { "name":"Ayera", "tag":"Player"
                                        , "x": 980, "y":500, "z": 0
                                        , "renderer": shipRender
                                        , "collider":collider } );
      Game.ship.onMouseUp= function(){this.fire();};
      
      // add a children
      var reactorfx = new DreamE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.4, "scaleY":0.4 } );
      var reactor = new DreamE.GameObject( { "name":"Reactor", "tag":"FX", "y":108, "renderer": reactorfx } );
      Game.ship.add( reactor );
      reactor.position.setRotation( Math.PI );
      
      // add ship in scene
      Game.scene.add( Game.ship );
    
    // camera
    // Game.camera = new DreamE.Camera( 1400, 880, 420, 100, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera = new DreamE.Camera( 1920, 1080, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    // Game.camera.sizes.scaleX = 0.8;
    // Game.camera.sizes.scaleY = 0.8;
    // Game.camera = new DreamE.Camera( 1280, 720, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,80)" } );
    Game.camera.scene = Game.scene;
    Game.camera.gui = new DreamE.Gui( Game.camera, { 'id': "Test" } );
    
    // for ( var i = 1900; i > 0; i -= 100 )
    //   Game.scene.add( new DreamE.GameObject( { "x": i, "y": 300 } ) );
    Game.scene.add( new DreamE.GameObject( { "x": 10, "y": 10 } ) );
    Game.scene.add( new DreamE.GameObject( { "x": 10, "y": 10 } ) );
    Game.scene.add( new DreamE.GameObject( { "x": 10, "y": 760 } ) );
    Game.scene.add( new DreamE.GameObject( { "x": 1580, "y": 750 } ) );
    Game.scene.add( new DreamE.GameObject( { "x": 1580, "y": 10 } ) );
    
    var rotateCol = new DreamE.GameObject( { "x": 1080, "y": 0, "collider": new DreamE.OrientedBoxCollider( 200, 100, {} ) } );
    Game.scene.add( rotateCol );
    
    Game.pp = new DreamE.GameObject( { "x": 500, "y": 500, "renderer": new DreamE.BoxRenderer( { "fillColor": "pink" }, 50, 50 ) } );
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
    // addEnemy( Game, 500, 500, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 0+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 200+i%2*100, Game.ship );
    for ( var i = 0; i < n; ++i )
      addEnemy( Game, 180 + i*80, 400+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 600+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 800+i%2*100, Game.ship );
    // for ( var i = 0; i < n; ++i )
    //   addEnemy( Game, 180 + i*80, 1000+i%2*100, Game.ship );
    
    Game.camera.gui.add( new DreamE.GuiLabel( { 'id': "hello", 'x': 50, 'y': 100, "w": 200, "h": 50 }, "Hello world" ) );
    Game.camera.gui.add( new DreamE.GuiButton( { 'id': "Click me plz", 'x': 450, 'y': 600, "w": 100, "h": 100, 'fillColor': "white", "disable": true } ) );
    Game.camera.gui.add( new DreamE.GuiImage( { 'id': 'simpleImage', 'spriteName': "reactor", "x": 200, "y": 600, "w": 100, "h": 100, "paused": true } ) );
    
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
      Game.camera.position.rotate( Math.PI*0.1 );
    }
    // Game.camera.position.rotate( Math.PI );
    
    //add Fire on the ship
    Game.ship.fire = function()
    {
      var pos = this.getPos();
      var sprite = new DreamE.SpriteRenderer( { "spriteName": "reactor", "scaleX":0.2, "scaleY":0.2 } );
      var tir = new DreamE.GameObject( { "name": "tir", "tag":"time", "x": pos.x, "y": pos.y, "z": pos.z, "renderer": sprite } );
      tir.position.setRotation( this.position.rotation );
      tir.addAutomatism( "bouge", { "type":"translateY", "value1": -3 } );
      Game.scene.add( tir );
    }
    //
    // DreamE.Inputs.addActionInput( "fire", "launchMissile", function(){Game.ship.fire();}, "up" )
    setTimeout( function(){ DreamE.States.down( "isLoading" ); }, 500 );
  };
  window.Game = Game; // debug
  return Game;
} );