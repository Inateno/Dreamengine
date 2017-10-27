function RectRenderer( data )
{
  PIXI.Graphics.call( this );
  
  if ( data ) {
    for ( var i = 0; i < data.length; ++i )
    {
      for ( var n in data[ i ] )
      {
        if ( data[ i ][ n ] instanceof Array ) {
          this[ n ].apply( this, data[ i ][ n ] );
        }
        else {
          this[ n ].call( this, data[ i ][ n ] );
        }
      }
    }
    this.endFill();
  }
}

RectRenderer.prototype = Object.create( PIXI.Graphics.prototype );
RectRenderer.prototype.constructor = RectRenderer;