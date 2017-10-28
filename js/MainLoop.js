var MainLoop = new function()
{
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
      // r.update(); // call waiting input here
    }
    
    // TODO apply audio fades (if there is some)
    
    while( Time.missedFrame >= 0 )
    {
    /* TODO
      => update Gamepad
      => update MainLoop.customLoop (keep it ?)
      => update DE.additionalModules[ x ].update( time ) ?
      => update scenes
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