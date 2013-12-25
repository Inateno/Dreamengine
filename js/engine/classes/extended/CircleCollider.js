/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* CircleCollider
**/

define( [ 'DE.Collider', 'DE.CONFIG', 'DE.CanvasBuffer', 'DE.COLORS' ],
function( Collider, CONFIG, CanvasBuffer, COLORS )
{
  function CircleCollider( radius, param )
  {
    param = param || {};
    param.type = CONFIG.COLLISION_TYPE.CIRCLE;
    
    Collider.call( this , param );
    
    this.radius = radius || 1;
    
    this.createDebugRenderer = function()
    {
      this.debugBuffer = new CanvasBuffer( this.radius*2, this.radius*2 );
      this.debugBuffer.ctx.lineWidth = 2;
      this.debugBuffer.ctx.strokeStyle = COLORS.DEBUG.CIRCLE_COLLIDER;
      this.debugBuffer.ctx.beginPath();
      this.debugBuffer.ctx.arc( this.radius, this.radius,
            this.radius, 0, Math.PI*2, true );
      this.debugBuffer.ctx.stroke();
      this.debugBuffer.ctx.closePath();
    }
    
    this.debugRender = function( ctx, physicRatio, ratioz )
    {
      if ( !this.debugBuffer )
        return;
      ctx.drawImage( this.debugBuffer.canvas
                      , this.localPosition.x - this.debugBuffer.canvas.width * 0.5 * physicRatio * ratioz >> 0
                      , this.localPosition.y - this.debugBuffer.canvas.height * 0.5 * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.width * physicRatio * ratioz >> 0
                      , this.debugBuffer.canvas.height * physicRatio * ratioz >> 0 );
    }
    
    if ( CONFIG.DEBUG_LEVEL > 1 )
      this.createDebugRenderer();
  }

  CircleCollider.prototype = new Collider();
  CircleCollider.prototype.constructor = CircleCollider;
  CircleCollider.prototype.supr        = Collider.prototype;
  CircleCollider.prototype.DEName      = "CircleCollider";
  
  CONFIG.debug.log( "CircleCollider loaded", 3 );
  return CircleCollider;
} );