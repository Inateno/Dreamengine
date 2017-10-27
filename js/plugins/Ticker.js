define( [ "DREAM_ENGINE" ],
function( DE )
{
  function Ticker( params )
  {
    params.renderer = new DE.TextRenderer( "00.00", params.textRender || {
      fillColor : "black"
      ,fontSize : 40
      ,textAlign: "center"
    } );
    
    DE.GameObject.call( this, params );
    
    this.time = params.time || 0;
    this.previousTime = params.time || 0;
    
    this.mode = ( params.mode || "" ).toLowerCase() === "counter" ? "counter" : "timer";
    this.dir = this.mode === "counter" ? 1 : -1;
  }
  
  Ticker.prototype = Object.create( DE.GameObject.prototype );
  Ticker.prototype.constructor = Ticker;
  Ticker.prototype.supr        = DE.GameObject.prototype;
  
  Ticker.prototype.tick = function()
  {
    if ( !this.running )
      return;
    this.time += DE.Time.timeSinceLastFrameScaled * this.dir;
    if ( this.time <= 0 )
    {
      this.running = false;
      this.trigger( "tickedEnd", this.previousTime );
      this.renderers[ 0 ].text = "00.00";
    }
    else
    {
      var m = ( this.time / 1000 / 60 >> 0 ).toString();
      if ( m.length == 1 )
        m = "0" + m;
      var s = ( ( this.time / 1000 ) % 60 >> 0 ).toString();
      if ( s.length == 1 )
        s = "0" + s;
      var ms = ( this.time - ( ( m * 60 + parseInt( s ) ) * 1000 ) ).toString();
      while( ms.length < 2 )
        ms = "0" + ms;
      if ( ms.length >= 3 )
        ms = ms.slice( 0, 2 );
      
      var t = s + "." + ms;
      this.renderers[ 0 ].text = t;
    }
  };
  
  Ticker.prototype.reset = function( time )
  {
    if ( this.mode === "timer" )
    {
      this.time         = time || this.previousTime;
      this.previousTime = time || this.previousTime;
    }
    else
    {
      this.time = time || 0;
    }
    
    this.running = true;
    this.trigger( "reset" );
    if ( !this.enable )
      this.enable = true;
    if ( !this.automatism[ "ticktick" ] )
      this.addAutomatism( "ticktick", "tick" );
  };
  
  Ticker.prototype.pause = function()
  {
    if ( !this.automatism[ "ticktick" ] )
      this.removeAutomatism( "ticktick", "tick" );
    
    this.running = false;
    this.trigger( "pause" );
  };
  
  Ticker.prototype.play = function()
  {
    if ( !this.automatism[ "ticktick" ] )
      this.addAutomatism( "ticktick", "tick" );
    
    this.running = true;
    this.trigger( "play" );
  };
  
  DE.Ticker = Ticker;
  
  return Ticker;
} );