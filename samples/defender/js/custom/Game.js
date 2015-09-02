/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 sample Game - kill the bubble
 there is no "end" and no menus, it's a very lite "how to" for basics
 and you can create complete game with this :)
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  var screenW = 1280, screenH = 720;
  
  // init
  Game.init = function()
  {
    console.log( "init Engine" );
    DE.CONFIG.DEBUG = 1; // debug on
    DE.CONFIG.DEBUG_LEVEL = 5; // all debug
    
    // create render
    Game.render = new DE.Render( "render", { width: screenW, height: screenH , fullScreen: "ratioStretch"} );
    Game.render.init();
    
    // launch the engine
    DE.start();
  }
  
  // start
  Game.start = function()
  {
    Game.camera = new DE.Camera( screenW, screenH, 0, 0, { backgroundColor: "grey" } );
    
    Game.camera.gui = new DE.Gui();
    Game.camera.scene = new DE.Scene();
    Game.render.add( Game.camera );
    
    var sc = Game.camera.scene;
    
    var pointer = new DE.GameObject();
    Game.camera.onMouseMove = function( mouse )
    {
      pointer.position.x = mouse.x;
      pointer.position.y = mouse.y;
    };
    
    var player = new DE.GameObject( {
      x: 500, y: 300, zindex: 2
      ,renderer: new DE.BoxRenderer( { fillColor: "white" }, 50, 50 )
    } );
    
    player.speed = 10;
    player.checkInputs = function()
    {
      if ( DE.Inputs.key( "shoot" ) )
        this.shoot();
      if ( DE.Inputs.key( "up" ) )
        this.translateY( -this.speed, true );
      if ( DE.Inputs.key( "left" ) )
        this.translateX( -this.speed, true );
      if ( DE.Inputs.key( "right" ) )
        this.translateX( this.speed, true );
      if ( DE.Inputs.key( "down" ) )
        this.translateY( this.speed, true );
      
      player.lookAt( pointer.position );
    }
    player.shoot = function()
    {
      createFire( player );
    }
    player.addAutomatism( "checkInputs", "checkInputs" );
    
    var center = new DE.GameObject();
    
    var angle = ( Math.PI * 2 ) / 3;
    var fireBall = new DE.GameObject( {
      zindex: 10
      ,renderer: new DE.BoxRenderer( { fillColor: "orange" }, 20, 20 )
      ,collider: new DE.CircleCollider( 20 )
    } );
    fireBall.position.setRotation( angle );
    fireBall.translateX( 100 );
    fireBall.addAutomatism( "rot", "rotate", { value1: -0.04 } );
    fireBall.addAutomatism( "translate", "translateY", { value1: -4 } );
    
    var fireBall2 = new DE.GameObject( {
      zindex: 10
      ,collider: new DE.CircleCollider( 20 )
      ,renderer: new DE.BoxRenderer( { fillColor: "orange" }, 20, 20 )
    } );
    fireBall2.position.setRotation( angle * 2 );
    fireBall2.translateX( 100 );
    fireBall2.addAutomatism( "rot", "rotate", { value1: -0.04 } );
    fireBall2.addAutomatism( "translate", "translateY", { value1: -4 } );
    
    var fireBall3 = new DE.GameObject( {
      zindex: 10
      ,renderer: new DE.BoxRenderer( { fillColor: "orange" }, 20, 20 )
      ,collider: new DE.CircleCollider( 20 )
    } );
    fireBall3.position.setRotation( angle * 3 );
    fireBall3.translateX( 100 );
    fireBall3.addAutomatism( "rot", "rotate", { value1: -0.04 } );
    fireBall3.addAutomatism( "translate", "translateY", { value1: -4 } );
    
    center.add( fireBall, fireBall2, fireBall3 );
    center.focus( player );
    
    var enemy = new DE.GameObject( {
      x: 1000, y: 300
      ,renderer: new DE.CircleRenderer( { fillColor: "blue" }, 25 )
      ,collider: new DE.CircleCollider( 30 )
    } );
    enemy.logic = function()
    {
      this.lookAt( player.position );
      this.translateY( -2 );
      for ( var i = 0; i < center.childrens.length; ++i )
      {
        if ( DE.CollisionSystem.circleCollision( this.collider, center.childrens[ i ].collider ) )
        {
          this.askToKill();
        }
      }
    }
    enemy.addAutomatism( "logic", "logic" );
    sc.add( center, player, pointer, enemy );
    // always let a little delay between the real load and the visual load, better feeling
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 200 );
  };
  
  function createFire( player )
  {
    var fire = new DE.GameObject( {
      "x": player.position.x, "y": player.position.y
      ,"renderer": new DE.BoxRenderer( { fillColor: "red" }, 15, 30 )
    } );
    fire.position.setRotation( player.position.rotation );
    fire.addAutomatism( "move", "translateY", { value1: -10 } );
    Game.camera.scene.add( fire );
  }
  
  window.Game = Game; // debug only
  window.DREAM_E = DE;
  return Game;
} );