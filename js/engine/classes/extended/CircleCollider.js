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
define( [ 'PIXI', 'DE.CONFIG', 'DE.COLORS' ],
function( PIXI, CONFIG, COLORS )
{
  function CircleCollider( radius, params )
  {
    params = params || {};
    
    PIXI.Circle.call( 0, 0, radius );
    
    this.type = CONFIG.COLLISION_TYPE.CIRCLE;
    this.enable = true;
    this.gameObject = params.gameObject || undefined;
    
    this.radius = radius || 1;
    
    this.x = params.x || params.offsetX || params.offsetLeft || 0;
    this.y = params.y || params.offsetY || params.offsetTop || 0;
    
  
    this._createDebugRender = function()
    {
      if ( !this.debugRender )
        this.debugRender = new PIXI.Graphics();
      else
        this.debugRender.clear();
      
      this.debugRender.lineStyle( 2, COLORS.DEBUG.COLLIDER, 0.6 );
      this.debugRender.drawCircle( this.x, this.y, this.radius );
      this.debugRender.zindex = 99999991;
    }
    
    // get worldTransform from PIXI for global scale
    // a = complete scale x and d = complete scale y
    this.getWorldTransform = function()
    {
      var pos = this.gameObject.getPos();
      return {
        x       : this.x + pos.x
        , y     : this.y + pos.y
        , z     : pos.z
        , radius: this.radius * ( this.gameObject.worldScale.x > this.gameObject.worldScale.y
                                  ? this.gameObject.worldScale.x : this.gameObject.worldScale.y )
      };
    }
    
    this.resize = function( radius )
    {
      this.radius = radius;
      
      if ( CONFIG.DEBUG_LEVEL > 1 )
        this._createDebugRender();
    };
  }

  CircleCollider.prototype = Object.create( PIXI.Circle.prototype );
  CircleCollider.prototype.constructor = CircleCollider;
  CircleCollider.prototype.DEName      = "CircleCollider";
  
  CONFIG.debug.log( "CircleCollider loaded", 3 );
  return CircleCollider;
} );