/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Collider
 * @class default Collider Class<br>
 * don't use this one, but you can inherits from if you want to create a custom Collider
 *
 * @param {object} params - parameters, (gameObject, type, localPosition, isTrigger)
 */
define( [ 'DE.Vector2', 'DE.CONFIG' ],
function( Vector2, CONFIG )
{
  function Collider( params )
  {
    params    = params || {};
    this.type = params.type || undefined;
    
    this.enable = true;
    // a collider without gameObject should provide bug if you use it
    
    /**
     * The collider's gameObject, if there isn't, you'll not be able to call CollisionSystem with this collider
     * @type GameObject
     */
    this.gameObject = params.gameObject || undefined;
    
    this.localPosition = params.localPosition || new Vector2( params.offsetX || params.offsetLeft || 0, params.offsetY || params.offsetTop || 0 );
    
    // not sure about this 3 attributes, will probably change
    this.isColliding = false;
    this.isTrigger   = params.isTrigger || false;
    this.collideWith = new Array(); // not sure
    
    /****
     * getRealPosition@void
      return the real gameObject position + this offsets
      a collider position, is always at the center of this collider
     */
    this.getRealPosition = function()
    {
      var pos = this.gameObject.getPos();
      var harmonics = this.gameObject.getHarmonics();
      return { x: -(-this.localPosition.x * harmonics.cos + this.localPosition.y * harmonics.sin) + pos.x
        , y: -(-this.localPosition.x * harmonics.sin + this.localPosition.y * -harmonics.cos) + pos.y
        , z: pos.z
      };
    }
    
    /****
     * debugRender@void
      used by the engine if you provided a DEBUG_LEVEL > 1 before create your colliders,
      the colliders create a debugBuffer, and if 
      the DEBUG_LEVEL > 1, the gameObject call the debugRender
      Helper: so if you create Colliders before set DEBUG_LEVEL, you wont see it
     */
    this.debugRender = function( ctx, physicRatio, ratioz )
    {
      if ( !this.debugBuffer )
        return;
      ctx.drawImage( this.debugBuffer.canvas
                      , this.localPosition.x * physicRatio * ratioz >> 0
                      , this.localPosition.y * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.width * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.height * physicRatio * ratioz >> 0 );
    }
  }
  Collider.prototype.DEName = "Collider";
  
  CONFIG.debug.log( "Collider loaded", 3 );
  return Collider;
} );