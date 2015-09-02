/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor FixedBoxCollider
 * @class Create a box collider (can't rotate)
 * @augments PIXI.Rectangle
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
define( [ 'PIXI', 'DE.COLORS', 'DE.CONFIG' ],
function( PIXI, COLORS, CONFIG )
{
  function FixedBoxCollider( width, height, params )
  {
    params = params || {};
    
    PIXI.Rectangle.call( 0, 0, width, height );
    
    this.type = CONFIG.COLLISION_TYPE.FIXED_BOX;
    this.enable = true;
    this.gameObject = params.gameObject || undefined;
    
    this.width  = width || 1;
    this.height = height || 1;
    
    this.x = ( -this.width * 0.5 >> 0 ) + ( params.x || params.offsetX || params.offsetLeft || 0 );
    this.y = ( -this.height * 0.5 >> 0 ) + ( params.y || params.offsetY || params.offsetTop || 0 );
    
    this._createDebugRender = function()
    {
      if ( CONFIG.DEBUG_LEVEL <= 1 )
        return;
      
      if ( !this.debugRender )
        this.debugRender = new PIXI.Graphics();
      else
        this.debugRender.clear();
      
      this.debugRender.lineStyle( 2, COLORS.DEBUG.COLLIDER, 0.6 );
      this.debugRender.drawRect( this.x, this.y, this.width, this.height );
      this.debugRender.zindex = 99999991;
    }
    
    // get worldTransform from PIXI for global scale
    // a = complete scale x and d = complete scale y
    this.getWorldTransform = function()
    {
      var pos = this.gameObject.getPos();
      var offsetX = this.x + this.width * 0.5;
      var offsetY = this.y + this.height * 0.5;
      return {
        x        : offsetX + pos.x - this.width * ( 0.5 * this.gameObject.worldScale.x )
        , y      : offsetY + pos.y - this.height * ( 0.5 * this.gameObject.worldScale.y )
        , z      : pos.z
        , width  : this.width * this.gameObject.worldScale.x
        , height : this.height * this.gameObject.worldScale.y
        , centerX: pos.x
        , centerY: pos.y
      };
    }
    
    this.resize = function( width, height, keepPosition )
    {
      this.width = width  != undefined ? width  : this.width;
      this.height= height != undefined ? height : this.height;
      
      if ( !keepPosition )
      {
        this.x = - this.width * 0.5;
        this.y = - this.height * 0.5;
      }
      
      if ( CONFIG.DEBUG_LEVEL > 1 )
        this._createDebugRender();
    };
  }
  
  FixedBoxCollider.prototype = Object.create( PIXI.Rectangle.prototype );
  FixedBoxCollider.prototype.constructor = FixedBoxCollider;
  FixedBoxCollider.prototype.DEName      = "FixedBoxCollider";
  
  CONFIG.debug.log( "FixedBoxCollider loaded", 3 );
  return FixedBoxCollider;
} );