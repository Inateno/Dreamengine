/**
* @ContributorsList
* @Shocoben
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui @Ticker
create a timer, herits from Label
**/
define( [ 'DE.CONFIG', 'DE.GuiLabel', 'DE.TextRenderer' ],
function( CONFIG, GuiLabel, TextRenderer )
{
  function Ticker( param, text )
  {
    this.DEName = "GuiTicker";
    
    if ( !param )
      return;
    
    GuiLabel.call( this, param, text );
    
    this.loop  = param.loop || false;
    this.delay = param.delay || 0;
    this.startedAt = undefined;
    this.stopedAt  = undefined;
    this.isTicking = param.isTicking || param.ticking || param.autoStart || param.autostart || false;
    
    this.onStart = false;
    this.onTick  = false;
    this.onStop  = false;
    
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
      this.startedAt = undefined;
      this.stopedAt  = Date.now();
      this.isTicking = false;
      
      if ( this.onStop )
        this.onStop();
    }
    
    if ( this.isTicking )
      this.start();
  }
  
  Ticker.prototype = new GuiLabel();
  Ticker.prototype.constructor = GuiLabel;
  Ticker.prototype.supr = GuiLabel.prototype;
  
  return Ticker;
});