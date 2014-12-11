/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* FixedBoxCollider
**/

define( [ 'DE.Collider', 'DE.COLORS', 'DE.CONFIG', 'DE.CanvasBuffer' ],
function( Collider, COLORS, CONFIG, CanvasBuffer )
{
  function FixedBoxCollider( param )
  {
    param = param || {};
    param.type = CONFIG.COLLISION_TYPE.FIXED_BOX;
    
    Collider.call( this, param );
    
    this.DEName = "FixedBoxCollider";
    
    var _points    = new Array();
    var _inCircles  = new Array();
    var _extCircle  = new Array();
    
    this.width  = param.w || param.width || 0;
    this.height  = param.h || param.height || 0;

    this.localPosition.x -= this.width * 0.5;
    this.localPosition.y -= this.height * 0.5;
    
    this.createDebugRenderer = function()
    {
      this.debugBuffer = new CanvasBuffer( this.width, this.height );
      this.debugBuffer.ctx.lineWidth = 5;
      this.debugBuffer.ctx.strokeStyle = COLORS.DEBUG.COLLIDER;
      this.debugBuffer.ctx.strokeRect( 0, 0, this.width, this.height );
    }
    if ( CONFIG.DEBUG_LEVEL > 1 )
      this.createDebugRenderer();
  }

  FixedBoxCollider.prototype = new Collider();
  FixedBoxCollider.prototype.constructor = FixedBoxCollider;
  FixedBoxCollider.prototype.supr = Collider.prototype;
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "FixedBoxCollider loaded" );
  }
  return FixedBoxCollider;
} );