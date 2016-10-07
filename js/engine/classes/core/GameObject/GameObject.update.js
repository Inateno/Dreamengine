/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* standalone update method for GameObject.prototype.update
**/

define( [ 'DE.CollisionSystem', 'DE.CONFIG', 'DE.Time' ],
function(  CollisionSystem, CONFIG, Time )
{
  function update( time )
  {
    if ( !this.updatable )
      return;
    
    // execute registered automatisms
    for ( var a in this.automatism )
    {
      var auto = this.automatism[ a ];
      if ( auto.interval && time - auto.lastCall < auto.interval / Time.scaleDelta ){ continue;}
      
      auto.timeSinceLastCall = time - auto.lastCall;
      if ( auto.timeSinceLastCall - auto.interval / Time.scaleDelta < auto.interval / Time.scaleDelta )
        auto.lastCall = time - ( auto.timeSinceLastCall - auto.interval / Time.scaleDelta );
      else
        auto.lastCall = time;
      // only 2 vals max, I could make a this[ auto.methodName ].apply( this, args ) but it's slower
      // I think
      this[ auto.methodName ]( auto.value1, auto.value2 );
      
      // if this one isn't persistent delete it
      if ( !auto.persistent )
        delete this.automatism[ a ];
    }
    
    // childs update
    for ( var c = 0; g = this.gameObjects[ c ]; c++ )
    {
      if ( g.flag !== null )
      {
        switch( g.flag )
        {
          case "delete":
            this.delete( c );
            --c;
            continue;
            break;
        }
      }
      g.update( time );
    }
    
    if ( this.renderable )
    {
      for ( var i = 0, r; r = this.renderers[ i ]; ++i )
      {
        if ( r.updateAnimation )
          r.updateAnimation();
        if ( r.applyFade )
        {
          r.applyFade();
          r.applyScale();
        }
      }
    }
    
    this.applyFocus();
    this.applyShake();
    this.applyMove();
    this.applyFade();
    this.applyScale();
  };
  
  CONFIG.debug.log( "GameObject.update loaded", 3 );
  return update;
} );