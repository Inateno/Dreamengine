/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Time
 manage the deltaTime, scale
**/
define( [ 'DE.CONFIG', 'DE.Event' ],
function( CONFIG, Event )
{
  var Time = new function ()
  {
    this.DEName      = "Time";
    this.deltaTime   = 1;
    this.missedFrame = 0;
    this.lastCalcul  = Date.now();
    this.scaleDelta  = 1;
    this.currentTime = Date.now();
    this.lastRender  = Date.now();
    this.fps         = 0;
    this.FPS         = 30;
    
    /****
     * update@Bool
      update frames
      TODO - add a paused state (to pause the engine, when changed tab by example)
     */
    this.update = function()
    {
      this.currentTime = Date.now();
      this.timeSinceLastFrame = ( this.currentTime - this.lastCalcul );
      
      if ( this.timeSinceLastFrame < 14 )
      {
        return false;
      }
      this.fps = Math.floor( 1000 / this.timeSinceLastFrame );
      
      this.deltaTime = this.timeSinceLastFrame / 16 * this.scaleDelta;
      this.missedFrame = this.deltaTime;
      if ( this.deltaTime > 1 )
        this.deltaTime = this.deltaTime % 1;
      if ( this.deltaTime == 0 )
        this.deltaTime = 1;
      this.missedFrame = this.missedFrame - this.deltaTime;
      this.timeSinceLastFrameScaled = ( this.currentTime - this.lastRender ) * this.scaleDelta;
      this.lastRender = this.currentTime;
      this.lastCalcul = this.currentTime;
      
      return true;
    }
    
    /****
     * getDelta@Float
      previously it was private
     */
    this.getDelta = function(){ return this.deltaTime; }
  };
  
  Event.on( "isInited", function()
  {
    Time.deltaTime = 0;
    Time.lastCalcul = Date.now();
  } )
  
  CONFIG.debug.log( "Time loaded", 3 );
  return Time;
} );