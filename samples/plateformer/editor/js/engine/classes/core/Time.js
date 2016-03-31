/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Time
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var Time = new function ()
  {
    this.DEName = "Time";
    
    this.deltaTime    = 1;
    this.lastCalcul    = Date.now();
    this.scaleDelta    = 1;
    this.currentTime  = Date.now();
    this.lastRender  = Date.now();
    this.fps = 0;
    this.FPS = 60;
    
    this.update = function()
    {
      this.currentTime = Date.now();
      this.timeSinceLastFrame = ( this.currentTime - this.lastCalcul );
      
      if ( this.timeSinceLastFrame < 14 )
      {
        return false;
      }
      this.fps = Math.floor( 1000 / this.timeSinceLastFrame );
      // this.deltaTime = ( ( this.FPS / this.fps * 100 ) >> 0 ) * 0.01 * this.scaleDelta;
      // this.deltaTime = 1 * this.scaleDelta;
      this.deltaTime = this.timeSinceLastFrame / 16 * this.scaleDelta; // the good one ?
      
      this.timeSinceLastFrameScaled = ( this.currentTime - this.lastRender ) * this.scaleDelta;
      this.lastRender = this.currentTime;
      this.lastCalcul = this.currentTime;
      
      return true;
    }
    
    this.getDelta = function(){ return this.deltaTime; }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Time loaded" );
  }
  return Time;
} );