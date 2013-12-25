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
  function FixedBoxCollider( width, height, param )
  {
    param = param || {};
    param.type = CONFIG.COLLISION_TYPE.FIXED_BOX;
    
    Collider.call( this, param );
    
    var _points    = new Array();
    var _inCircles = new Array();
    var _extCircle = new Array();
    
    this.width  = width || 1;
    this.height = height || 1;

    this.localPosition.x -= this.width * 0.5;
    this.localPosition.y -= this.height * 0.5;
    
    this.createDebugRenderer = function()
    {
      this.debugBuffer = new CanvasBuffer( this.width, this.height );
      this.debugBuffer.ctx.lineWidth = 2;
      this.debugBuffer.ctx.strokeStyle = COLORS.DEBUG.COLLIDER;
      this.debugBuffer.ctx.strokeRect( 0, 0, this.width, this.height );
    }
    
    // only for fixed box collider
    this.getColliderPoints = function()
    {
      var pos = this.gameObject.getPos();
      return {
        'top': pos.y + this.localPosition.y
        ,'left': pos.x + this.localPosition.x
        ,'right': pos.x + this.localPosition.x + this.width
        ,'bottom': pos.y + this.localPosition.y + this.height
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