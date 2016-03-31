/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Ticker
create a timer
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function Ticker( param )
  {
    this.DEName = "Ticker";
    
    if ( !param )
      return;
    
    this.loop  = param.loop || false;
    this.delay = param.delay || 0;
    this.startedAt = undefined;
    this.stopedAt  = undefined;
    this.isTicking = param.isTicking || param.ticking || param.autoStart || param.autostart || false;
    
    this.onStart = false;
    this.onTick  = false;
    this.onStop  = false;
    
    this.update = function( time )
    {
      if ( !this.isTicking )
        return;
      if ( time - this.startedAt >= this.delay )
        this.tick();
    }
    
    this.start = function()
    {
      this.startedAt = Date.now();
      this.stopedAt  = undefined;
      this.isTicking = true;
      
      if ( this.onStart )
        this.onStart();
    }
    
    this.tick = function()
    {
      if ( !this.loop )
        this.stop();
      else
        this.start();
      
      this.setText( this.delay );
      if ( this.onTick )
        this.onTick();
    }
    
    this.stop = function()
    {
      this.stopedAt  = Date.now();
      this.isTicking = false;
      
      if ( this.onStop )
        this.onStop();
    }
    
    if ( this.isTicking )
      this.start();
  }
  
  return Ticker;
});