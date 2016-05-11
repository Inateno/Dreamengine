define( [ 'DREAM_ENGINE' ]
, function( DE )
{
  var Timer = function( time, params, textParams )
  {
    DE.GameObject.call( this, params );
    
    this.addRenderer( new DE.TextRenderer( "0", textParams || {} ), 0 );
    
    this.time = time;
    this.lastSecond = null;
  }
  
  Timer.prototype = new DE.GameObject();
  Timer.prototype.constructor = Timer;
  Timer.prototype.supr        = DE.GameObject.prototype;
  
  Timer.prototype.countdown = function()
  {
    if ( !this.running )
      return;
    this.time -= DE.Time.timeSinceLastFrameScaled;
    if ( this.time <= 0 )
    {
      this.running = false;
      DE.trigger( "tick-end", this );
      this.trigger( "tick-end" );
      this.renderer.text = this.formatTimeString( "0.0.0" );
    }
    else
    {
      var m = ( this.time / 1000 / 60 >> 0 ).toString();
      if ( m.length == 1 )
        m = "0" + m;
      var s = ( ( this.time / 1000 ) % 60 >> 0 ).toString();
      if ( s.length == 1 )
        s = "0" + s;
      if ( s < this.lastSecond )
      {
        DE.trigger( "tick-second", this, m, s );
        this.trigger( "tick-second", m, s );
        if ( this.sound )
          DE.AudioManager.fx.play( this.sound );
      }
      this.lastSecond = s;
      var ms = ( this.time - ( ( m * 60 + parseInt( s ) ) * 1000 ) ).toString();
      while( ms.length < 3 )
        ms = "0" + ms;
      var t = m + "." + s + "." + ms;
      this.renderer.text = this.formatTimeString( t );
    }
  };
  
  Timer.prototype.formatTimeString = function( time )
  {
    return time + ( DE.LangSystem.get( this.timeString ) || this.timeString || "" );
  };
  
  Timer.prototype.reset = function()
  {
    this.running = true;
    this.countdown();
    
    if ( !this.automatism[ "countdown" ] )
      this.addAutomatism( "countdown", "countdown" );
  };
  
  return Timer;
} );