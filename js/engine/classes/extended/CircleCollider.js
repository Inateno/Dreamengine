/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor CircleCollider
 * @class create a circle collider
 * @augments Collider
 * @param {int} radius - circle size
 * @param {object} params - Optional parameters (offets)
 * @example // classic GameObject declaration
 * var myObject = new DE.GameObject( {
 *   x: 150, y: 200,
 *   collider: new DE.CircleCollider( 100, { offsetY: 50 } )
 * } );
 * @example // adding a collider later
 * myObject.collider = new DE.CircleCollider( 70 );
 */
define( [ 'DE.Collider', 'DE.CONFIG', 'DE.CanvasBuffer', 'DE.COLORS' ],
function( Collider, CONFIG, CanvasBuffer, COLORS )
{
  function CircleCollider( radius, params )
  {
    params = params || {};
    params.type = CONFIG.COLLISION_TYPE.CIRCLE;
    
    Collider.call( this , params );
    
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