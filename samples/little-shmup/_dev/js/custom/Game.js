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
define( [ 'DREAM_ENGINE', 'Player', 'Enemy', 'datas' ],
function( DE, Player, Enemy, datas )
{
  var Game = {};
  
  Game.screen = { w: 1000, h: 1080 };
  // init
  Game.init = function()
  {
    console.log( "Engine init" );
    DE.CONFIG.DEBUG_LEVEL = 3; // 5 for all debug
    
    // create render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch"
      , width: 1000, height: 1080, backgroundColor: "0x880044" } );
    Game.render.init();
    
    // create scene - name it only
    Game.scene = new DE.Scene( "Test" );
    
    // create your camera
    Game.camera = new DE.Camera( Game.screen.w, Game.screen.h, 0, 0, { 'name': "Test zoom 100%", 'backgroundColor': "rgb(50,50,200)" } );
    
    // give a scene at the camera
    Game.camera.scene = Game.scene;
    // bind it on the render
    Game.render.add( Game.camera );
    
    // launch the engine
    DE.start();
  }
  
  window.DE = DE;
  
  // start
  Game.start = function()
  {
    /** Game Button **/
      var gameBtn = new DE.GameObject( {
        "x": Game.screen.w / 2, "y": Game.screen.h / 2 - 50
        , "renderers": [
          // to make a "good button" I recommend you to use a SpriteSet with 3 frame
          // and changing the currentFrame when trigger GameObject's mouse events
          // you can make a "Button GameObject class" of course (I have to re-write all Gui)
          new DE.SpriteRenderer( { "spriteName": "btn" } )
          // an other way to do it without Sprite
          /*new DE.BoxRenderer( {
            "fillColor": "rgb(200,100,100)", "strokeColor": "white", "method": "fillAndStroke"
          }, 300, 100 )*/
          , new DE.TextRenderer( DE.LangSystem.get( "play" ), {
            "fontSize": 32, "font": "Arial Black" // not a nice font but just to show you how to :)
          } )
        ]
        , "collider": new DE.FixedBoxCollider( 550, 70 )
      } );
      gameBtn.onMouseEnter = function(){ this.renderers[ 0 ].setFrame( 1 ); }
      gameBtn.onMouseLeave = function(){ this.renderers[ 0 ].setFrame( 0 ); }
      gameBtn.onMouseUp = function()
      {
        this.renderers[ 0 ].setFrame( 0 );
        Game.startGame();
      }
      Game.gameBtn = gameBtn;
      Game.scene.add( gameBtn );
      /****/
    /** Bench Button **/
      var benchBtn = new DE.GameObject( {
        "x": Game.screen.w / 2, "y": Game.screen.h / 2 + 50
        , "renderers": [
          new DE.SpriteRenderer( { "spriteName": "btn" } )
          , new DE.TextRenderer( DE.LangSystem.get( "benchmark" ), {
            "fontSize": 32, "font": "Arial Black" // not a nice font but just to show you how to :)
          } )
        ]
        , "collider": new DE.FixedBoxCollider( 550, 70 )
      } );
      benchBtn.onMouseEnter = function(){ this.renderers[ 0 ].setFrame( 1 ); }
      benchBtn.onMouseLeave = function(){ this.renderers[ 0 ].setFrame( 0 ); }
      benchBtn.onMouseUp = function()
      {
        this.renderers[ 0 ].setFrame( 0 );
        Game.startGame( true );
      }
      Game.benchBtn = benchBtn;
      Game.scene.add( benchBtn );
     /****/
    
    
    Game.player = new Player( Game.screen );
    Game.scene.add( Game.player );
    Game.player.createGui();
    Game.player.on( "restart", function(){ Game.startGame( Game.benchmark ); } );
    Game.player.enable = false;
    
    // set fx very low
    DE.AudioManager.fx.setVolume( 10 );
    // always let a little delay between the real load and the visual load, better feeling
    setTimeout( function(){ DE.States.down( "isLoading" ); }, 200 );
  };
  
  Game.startGame = function( bench )
  {
    Game.run = true;
    Game.benchmark = bench;
    Game.benchBtn.enable = false;
    Game.gameBtn.enable  = false;
    for ( var n = 0; n < Game.scene.gameObjects.length; ++n )
    {
      if ( Game.scene.gameObjects[ n ].tag && Game.scene.gameObjects[ n ].tag.match( "enemy|bullet" ) )
        Game.scene.gameObjects[ n ].askToKill();
    }
    Game.player.init();
    for ( var i in datas.waves )
      datas.waves[ i ].readed = false;
    for ( var i in datas.benchwaves )
      datas.benchwaves[ i ].readed = false;
    _firstCheck = false;
    // start the music oh yeah
    DE.AudioManager.music.stopAllAndPlay( "music" );
  }
  
  // simple waves spawner
  var _lastCheck = undefined, _firstCheck, _currentWave = undefined;
  Game.checkSpawns = function( time )
  {
    if ( !Game.run )
      return;
    if ( !_firstCheck )
      _firstCheck = time;
    _lastCheck = time;
    
    var waveTime = ( ( _lastCheck - _firstCheck ) / 100 >> 0 ) * 100;
    
    if ( Game.benchmark )
    {
      _currentWave = datas.benchwaves[ waveTime ];
      if ( _currentWave && !_currentWave.readed )
      {
        _currentWave.readed = true;
        for ( var i = 0, e; e = _currentWave.enemies[ i ]; ++i )
        {
          Game.scene.add( new Enemy( Game.screen, e, Game.player ) );
        }
      }
      return;
    }
    _currentWave = datas.waves[ waveTime ];
    if ( _currentWave && !_currentWave.readed )
    {
      _currentWave.readed = true;
      for ( var i = 0, e; e = _currentWave.enemies[ i ]; ++i )
      {
        Game.scene.add( new Enemy( Game.screen, e, Game.player ) );
      }
    }
  }
  
  window.Game = Game; // debug only
  return Game;
} );