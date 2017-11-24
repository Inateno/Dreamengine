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