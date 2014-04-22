/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/* TODO - still WIP, don't use it I'm working on it :) */

/**
 * @constructor Ticker
 * @class <b>Work In Progress - don't use it !</b><br>
 * create a timer, can bind it on a dom element or a TextRenderer
 */
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function Ticker( params )
  {
    if ( !params )
      return;
    
    this.loop  = params.loop || false;
    this.delay = params.delay || 0;
    this.startedAt = undefined;
    this.stopedAt  = undefined;
    this.isTicking = params.isTicking || params.ticking || params.autoStart || params.autostart || false;
    
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
  Ticker.prototype.DEName = "Ticker";
  
  return Ticker;
});