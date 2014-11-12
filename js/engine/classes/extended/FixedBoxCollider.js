/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor FixedBoxCollider
 * @class Create a box collider (can't rotate)
 * @augments Collider
 * @param {int} width - box width
 * @param {int} height - box height
 * @param {object} params - Optional parameters (offets)
 * @example // classic GameObject declaration
 * var myObject = new DE.GameObject( {
 *   x: 150, y: 200,
 *   collider: new DE.FixedBoxCollider( 150, 100 )
 * } );
 * @example // adding a collider later
 * myObject.collider = new DE.FixedBoxCollider( 150, 100 );
 */
define( [ 'DE.Collider', 'DE.COLORS', 'DE.CONFIG', 'DE.CanvasBuffer' ],
function( Collider, COLORS, CONFIG, CanvasBuffer )
{
  function FixedBoxCollider( width, height, params )
  {
    params = params || {};
    params.type = CONFIG.COLLISION_TYPE.FIXED_BOX;
    
    Collider.call( this, params );
    
    var _points    = new Array();
    var _inCircles = new Array();
    var _extCircle = new Array();
    
    this.width  = width || 1;
    this.height = height || 1;
    this.preventRotation = true;
    
    this.localPosition.x -= this.width * 0.5;
    this.localPosition.y -= this.height * 0.5;
    
    this.createDebugRenderer = function()
    {
      this.debugBuffer = new CanvasBuffer( this.width, this.height );
      this.debugBuffer.ctx.lineWidth = 2;
      this.debugBuffer.ctx.strokeStyle = COLORS.DEBUG.COLLIDER;
      this.debugBuffer.ctx.strokeRect( 0, 0, this.width, this.height );
    }
    
    // only for fixed box collider because we prevent rotate
    this.debugRender = function( ctx, physicRatio, ratioz )
    {
      if ( !this.debugBuffer )
        return;
      ctx.rotate( -this.gameObject.position.rotation );
      ctx.drawImage( this.debugBuffer.canvas
                      , this.localPosition.x * physicRatio * ratioz >> 0
                      , this.localPosition.y * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.width * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.height * physicRatio * ratioz >> 0 );
      ctx.rotate( this.gameObject.position.rotation );
    }
    
    // overrides for box collider because we have to subtract width and height
    this.getRealPosition = function()
    {
      var pos = this.gameObject.getPos();
      var harmonics = this.gameObject.getHarmonics();
      var offsetX = this.localPosition.x + this.width * 0.5;
      var offsetY = this.localPosition.y + this.height * 0.5;
      return { x: -(-offsetX * harmonics.cos + offsetY * harmonics.sin) + pos.x - this.width * 0.5
        , y: -(-offsetX * harmonics.sin + offsetY * -harmonics.cos) + pos.y - this.height * 0.5
        , z: pos.z
      };
    }
    
    if ( CONFIG.DEBUG_LEVEL > 1 )
      this.createDebugRenderer();
  }

  FixedBoxCollider.prototype = new Collider();
  FixedBoxCollider.prototype.constructor = FixedBoxCollider;
  FixedBoxCollider.prototype.supr        = Collider.prototype;
  FixedBoxCollider.prototype.DEName      = "FixedBoxCollider";
  
  CONFIG.debug.log( "FixedBoxCollider loaded", 3 );
  return FixedBoxCollider;
} );