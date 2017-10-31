define( [],
function()
{
  var Time = new function ()
  {
    this.DEName      = "Time";
    this.deltaTime   = 1;
    this.missedFrame = 0;
    this.lastCalcul  = Date.now();
    this.scaleDelta  = 1;
    this.currentTime = Date.now();
    this.fps         = 0;
    this.frameDelay  = 16;
    this.stopped     = false;
    
    this.timeSinceLastFrame       = 0;
    this.timeSinceLastFrameScaled = 0;
    
    /****
     * update@Bool
      update frames
      TODO - add a paused state (to pause the engine, when changed tab by example)
     */
    this.update = function()
    {
      if ( this.stopped ) {
        return false;
      }
      
      this.currentTime = Date.now();
      this.timeSinceLastFrame = ( this.currentTime - this.lastCalcul );
      
      if ( this.timeSinceLastFrame < this.frameDelay ) {
        return false;
      }
      
      this.fps = Math.floor( 1000 / this.timeSinceLastFrame );
      
      this.deltaTime = this.timeSinceLastFrame / this.frameDelay * this.scaleDelta;
      this.missedFrame = this.deltaTime;
      if ( this.deltaTime > 2 ) {
        this.deltaTime = this.deltaTime % 1;
        if ( this.deltaTime < 1 )
          this.deltaTime += 1;
      }
      if ( this.deltaTime < 0 ) {
        this.deltaTime += 1;
      }
      this.missedFrame = this.missedFrame - this.deltaTime;
      this.timeSinceLastFrameScaled = ( this.currentTime - this.lastCalcul ) * this.scaleDelta;
      this.lastCalcul = this.currentTime;
      
      return true;
    }
    
    /****
     * getDelta@Float
      previously it was private
     */
    this.getDelta = function(){ return this.deltaTime; }
  };

  // TODO
  // Event.on( "isInited", function()
  // {
  //   Time.deltaTime = 0;
  //   Time.lastCalcul = Date.now();
  // } );

  // Set the name of the hidden property and the change event for visibility
  var hidden, visibilityChange; 
  if ( typeof document.hidden !== "undefined" ) { // Opera 12.10 and Firefox 18 and later support 
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if ( typeof document.mozHidden !== "undefined" ) {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if ( typeof document.msHidden !== "undefined" ) {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if ( typeof document.webkitHidden !== "undefined" ) {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  // lock Time if page is hidden (no loop then)
  function handleVisibilityChange() {
    if ( document[hidden] ) {
      Time.stopped = true;
    } else {
      Time.lastCalcul = Date.now();
      Time.stopped = false;
    }
  }

  if ( typeof document.addEventListener === "undefined"
      || typeof hidden === "undefined" ) {
    // no possibility to handle hidden page
  } else {
    document.addEventListener( visibilityChange, handleVisibilityChange, false );
  }
  
  return Time;
} );