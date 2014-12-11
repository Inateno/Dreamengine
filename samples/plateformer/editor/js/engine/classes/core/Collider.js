/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @constructor
* Collider
**/
  
/**
** The Collider is needed for a GameObject to calculate contact with other GameObject
** list of params:
**                type -> CONFIG.COLLISION_TYPE. CIRCLE | ORIENTED_BOX | FIXED_BOX
**/

define( [ 'DE.Vector2', 'DE.CONFIG' ],
function( Vector2, CONFIG )
{
  function Collider(  param )
  {
    this.DEName = "Collider";
    
    param           = param || {};
    this.type       = param.type || undefined;
    this.gameObject = param.gameObject || undefined;
    
    this.localPosition = param.localPosition || new Vector2( param.offsetX || param.offsetLeft || 0, param.offsetY || param.offsetTop || 0 );
    
    this.isColliding   = false;
    this.isTrigger     = param.isTrigger || false;
    this.collideWith   = new Array();
    
    this.getRealPosition = function()
    {
      var x = this.gameObject.position.x + this.localPosition.x;
      var y = this.gameObject.position.y + this.localPosition.y;
      
      var parent = this.gameObject.parent;
      if ( parent != undefined )
      {
        x += parent.position.x;
        y += parent.position.y;
        while ( parent.parent != undefined )
        {
          parent = parent.parent;
          x += parent.position.x;
          y += parent.position.y;
        }
      }
      return { x: x, y: y };
    }
    
    this.debugRender = function( ctx )
    {
      if ( !this.debugBuffer )
        return;
      ctx.drawImage( this.debugBuffer.canvas
                      , this.localPosition.x// - this.debugBuffer.canvas.width * 0.5 >> 0
                      , this.localPosition.y ); //>- this.debugBuffer.canvas.height * 0.5 >> 0 );
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Collider" );
  }
  return Collider;
} );