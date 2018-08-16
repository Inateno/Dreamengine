/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * Middleware used to sort children gameObjects (used in Scene and GameObject declarations)
 * @function
 */
define( []
, function()
{
  return function()
  {
    this.gameObjects.sort( function( a, b )
    {
      if ( b.z == a.z ) {
        
        if ( b.zindex == a.zindex ) {
          if ( b.y == a.y ) {
            return a.x - b.x;
          }
          else {
            return a.y - b.y;
          }
        }
        else {
          return a.zindex - b.zindex;
        }
        
      }
      else {
        return b.z - a.z;
      }
    } );
    
    // TODO when parsing children after gameObjects it's like twice the job
    // but IF we want to parse children which are PIXI stuff that is added directly as child
    // we need this
    // so, remove this and let the dev choose the filtering OR remove the previous one and add a z conditional here ?
    if ( this.children ) {
      this.children.sort( function( a, b )
      {
        if ( b.z == a.z ) {
        
          if ( b.zindex == a.zindex ) {
            if ( b.y == a.y ) {
              return a.x - b.x;
            }
            else {
              return a.y - b.y;
            }
          }
          else {
            return a.zindex - b.zindex;
          }
          
        }
        else {
          return b.z - a.z;
        }
      } );
    }
    
    this._shouldSortChildren = false;
    
    this.emit( "gameObjects-sorted" );
  };
} );