define( [
  'DE.Time'
  , 'DE.gamepad'
],
function(
  Time
  , gamepad
)
{
  var MainLoop = new function()
  {
    this.DEName = "MainLoop";
    this.scenes = [];
    this.renders = [];
    
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
          => update DE.additionalModules[ x ].update( time ) ?
          */
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
  
  return MainLoop;
} );