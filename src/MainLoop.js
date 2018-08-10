define( [
  'DE.Time'
  , 'DE.gamepad'
  , 'DE.GameObject'
  , 'PIXI'
  , 'DE.Events'
  , 'DE.TextRenderer'
  , 'DE.SpriteRenderer'
  , 'DE.Localization'
],
function(
  Time
  , gamepad
  , GameObject
  , PIXI
  , Events
  , TextRenderer
  , SpriteRenderer
  , Localization
)
{
  var MainLoop = new function()
  {
    this.DEName = "MainLoop";
    this.scenes = [];
    this.renders = [];
    this.additionalModules = {};
    
    this.createLoader = function()
    {
      this.loader = new GameObject( {
        renderer: new TextRenderer(
          "Loading...", { textStyle: {
            fill           : 'white',
            fontSize       : 35,
            fontFamily     : 'Snippet, Monaco, monospace',
            strokeThickness: 1,
            align          : "center"
          } }
        )
      } );
      var n_dots = 0;
      this.loader.animateLoader = function()
      {
        var dots = ".";
        for ( var i = 0; i < 3; ++i ){ dots+= n_dots < i ? " " : "."; }

        ++n_dots
        if ( n_dots > 3 ) {
          n_dots = 0;
        }
        this.renderer.text = "Loading" + dots;
      };
      this.loader.addAutomatism( "animateLoader", "animateLoader", { interval: 500 } );
      this.loader.renderer.y += 150;
      Events.on( 'ImageManager-pool-progress', function( poolName, progression )
      {
        MainLoop.loader.removeAutomatism( "animateLoader" );
        MainLoop.loader.renderer.text = poolName + ": " + progression + "%";
      } );
      Events.on( 'ImageManager-pool-complete', function( poolName )
      {
        MainLoop.loader.removeAutomatism( "animateLoader" );
        MainLoop.loader.renderer.text = "100%";
      } );
    };
    
    this.updateLoaderImage = function( loader )
    {
      this.loader.addRenderer( new SpriteRenderer( { spriteName: loader[ 0 ], scale: loader[ 2 ].scale } ) );
    };
    
    this.loop = function()
    {
      if ( !MainLoop.launched ) {
        console.warn( "MainLoop has stopped" );
        return;
      }
      
      requestAnimationFrame( MainLoop.loop );
      
      // regulate fps OR if the Time machine is stopped
      if ( !Time.update() ) {
        return;
      }
      
      if ( MainLoop.displayLoader ) {
        
        for ( var i = 0, j; j = MainLoop.renders[ i ]; i++ )
        {
          MainLoop.loader.x = j.pixiRenderer.width * 0.5;
          MainLoop.loader.y = j.pixiRenderer.height * 0.5;
          MainLoop.loader.update( Time.currentTime );
          j.directRender( MainLoop.loader );
        }
        
        return;
      }
      
      // TODO render only if framerate is ok then ?
      // TODO render and update renderer
      for ( var i = 0, r; r = MainLoop.renders[ i ]; ++i )
      {
        r.render();
        // r.update(); // was used for touch things, needed ? (call waiting input here)
      }
      
      gamepad.update( Time.currentTime );
      
      while( Time.missedFrame >= 0 )
      {
        /* TODO
          => update MainLoop.customLoop (keep it ?)
          */
        for ( var r in MainLoop.additionalModules )
          MainLoop.additionalModules[ r ].update( Time.currentTime );
        
        for ( var i = 0, s; s = MainLoop.scenes[ i ]; ++i )
        {
          if ( s.enable ) {
            s.update( Time.currentTime );
          }
        }
        
        /*
          => update Renders GUIs ?
        */
        
        Time.deltaTime = 1;
        Time.timeSinceLastFrameScaled = 0;
        Time.timeSinceLastFrame = 0;
        --Time.missedFrame;
      }
    }
    
    this.addScene = function( scene )
    {
      this.scenes.push( scene );
    }
    
    this.addRender = function( render )
    {
      this.renders.push( render );
      // TODO call the resize of this render ?
    }
  }
  
  Events.on( "lang-changed", function()
  {
    for ( var i = 0, s; s = MainLoop.scenes[ i ]; ++i )
    {
      for ( var ii = 0, g; g = s.gameObjects[ ii ]; ++ii )
      {
        checkGameObjectsTextRenderer( g );
      }
    }
  }, MainLoop );
  
  function checkGameObjectsTextRenderer( go ) {
    for ( var ix = 0, sub; sub = go.gameObjects[ ix ]; ++ix )
    {
      checkGameObjectsTextRenderer( sub );
    }
    if ( !go.renderers ) {
      return;
    }
    for ( var ir = 0, r; r = go.renderers[ ir ]; ++ir )
    {
      if ( r.localizationKey ) {
        if ( r.subKey ) {
          r.text = Localization.get( r.localizationKey )[ r.subKey ];
        }
        else {
          r.text = Localization.get( r.localizationKey );
        }
      }
    }
  }
  
  return MainLoop;
} );