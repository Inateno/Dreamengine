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
function( DreamE )
{
  var Game = {};
  
  Game.render  = null;
  Game.scene  = null;
  var _counter = null;
  var _timer = null;
  var screenW = 1280, screenH = 720;
  
  // init
  Game.init = function()
  {
    console.log( "init Engine" );
    DreamE.CONFIG.DEBUG = 1; // debug on
    DreamE.CONFIG.DEBUG_LEVEL = 5; // all debug
    
    // create render
    Game.render = new DreamE.Render( "render", { width: screenW, height: screenH , fullScreen: "ratioStretch"} );
    Game.render.init();
    
    // launch the engine
    DreamE.start();
  }
  
  // start
  Game.start = function()
  {
    // simple localStorage usage here :)
    console.log( "hello, you killed a total of " + ( DreamE.SaveSystem.get( "ballKilled" ) || 0 ) + " balls" );
    Game.scene = new DreamE.Scene( "Test" );
    
    // create your camera
    Game.camera = new DreamE.Camera( screenW, screenH, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,200)" } );
    // give a scene at the camera
    Game.camera.scene = Game.scene;
    // create a gui on this camera
    Game.camera.gui = new DreamE.Gui( Game.camera, { 'id': "Test" } );
    // bind it on the render
    Game.render.add( Game.camera );
    
    // lastOn is the last event append on the camera, if no gameObject has stoped the propagation
    Game.camera.lastOnMouseDown = function( e )
    {
      // for ( var i = 0; i < 50; ++i ) // stress test if you want try
        addBall( Game, e.x, e.y );
    }
    
    // Create Balls
    Game.enemies = 0;
    _counter = new DreamE.GuiLabel( { 'id': "counter", 'x': 50, 'y': 100, "w": 200, "h": 50 }, "Balls" );
    _counter.onSetText = function( txt )
    {
      if ( txt == 0 )
        console.log( "winner" );
    }
    
    Game.camera.gui.add( _counter );
    
    var n = 25;
    for ( var i = 0; i < n; ++i )
      addBall( Game, Math.random() * screenW, Math.random()* screenH );
    
    // always let a little delay between the real load and the visual load, better feeling
    setTimeout( function(){ DreamE.States.down( "isLoading" ); }, 200 );
  };
  
  // simple function to create a ball
  function addBall( object, x, y )
  {
    var ball = new DreamE.GameObject( {
      "tag": "Ball", "x": x, "y": y
      , "renderer": new DreamE.CircleRenderer(
          { "method": "fillAndStroke"
            , "strokeColor": "white"
            , "fillColor": "rgb("+(Math.random()*255>>0)+","+(Math.random()*255>>0)+","+(Math.random()*255>>0)+")"
          }, 70, 0, Math.PI*2, true )
      , "collider": new DreamE.CircleCollider( 80 )
    } );
    ball.speedx = ( Math.random() * 5 + Math.random() * -5 ) * 2 >> 0;
    ball.speedy = ( Math.random() * 5 + Math.random() * -5 ) * 2 >> 0;
    
    ball.move = function()
    {
      this.translateX( this.speedx );
      this.translateY( this.speedy );
      
      if ( this.position.x > 1250 )
      {
        this.speedx = -this.speedx;
        this.position.x = 1250;
      }
      if ( this.position.x < 30 )
      {
        this.speedx = -this.speedx;
        this.position.x = 30;
      }
      if ( this.position.y > 680 )
      {
        this.speedy = -this.speedy;
        this.position.y = 680;
      }
      if ( this.position.y < 30 )
      {
        this.speedy = -this.speedy;
        this.position.y = 30;
      }
    }
    ball.addAutomatism( "move", { "type": "move" } );
    
    // pointers events on gameObjects
    ball.onMouseDown = function( e )
    {
      this.askToKill();
      DreamE.SaveSystem.save( "ballKilled", DreamE.SaveSystem.get( "ballKilled" ) + 1 );
      e.stopPropagation = true;
    }
    ball.onMouseMove = function( e )
    {
      // console.log( "moved on ball" );
    }
    ball.onKill = function()
    {
      Game.enemies--;
      _counter.setText( Game.enemies );
    }
    Game.enemies++;
    _counter.setText( Game.enemies );
    object.scene.add( ball );
  }
  window.Game = Game; // debug only
  return Game;
} );