GameObject.prototype.update = function( time )
{
  if ( !this.updatable ) {
    return;
  }
  
  // execute registered automatisms
  for ( var a in this._automatisms )
  {
    var auto = this._automatisms[ a ];
    auto.timeSinceLastCall = time - auto.lastCall;
    if ( auto.timeSinceLastCall < auto.interval / Time.scaleDelta ){
      continue;
    }
    
    if ( auto.timeSinceLastCall - auto.interval < auto.interval ) {
      auto.lastCall = time - ( auto.timeSinceLastCall - auto.interval / Time.scaleDelta );
    }
    else {
      auto.lastCall = time;
    }

    // i think calling apply each update is slower than calling v1/v2. Should benchmark this
    if ( auto.args ) {
      this[ auto.methodName ].apply( this, auto.args );
    }
    else {
      this[ auto.methodName ]( auto.value1, auto.value2 );
    }
    
    // if this one isn't persistent delete it
    if ( !auto.persistent ) {
      delete this._automatisms[ a ];
    }
  }
  
  // childs update
  for ( var c = 0; g = this.gameObjects[ c ]; c++ )
  {
    if ( g.flag !== null ) {
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
  
  // TODO
  // if ( this.visible )
  // {
  //   for ( var i = 0, r; r = this.renderers[ i ]; ++i )
  //   {
  //     if ( r.updateAnimation )
  //       r.updateAnimation();
  //     if ( r.applyFade )
  //     {
  //       r.applyFade();
  //       r.applyScale();
  //     }
  //   }
  // }
  
  // this.applyFocus();
  // this.applyShake();
  // this.applyMove();
  // this.applyFade();
  // this.applyScale();
}