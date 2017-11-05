/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor RectRenderer
 * @augments PIXI.Graphics
 * @class draw a simple rectangle
 * checkout Renderer for standard parameters
 * @example var rectangle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.RectRenderer( 50, 70, "red", { lineStyle: [ 4, "0xFF3300", 1 ], fill: false } )
 * } );
 */
define( [
  'PIXI'
  , 'DE.BaseRenderer'
],
function(
  PIXI
  , BaseRenderer
)
{
  function RectRenderer( width, height, color, params )
  {
    var _params = params || {};
    PIXI.Graphics.call( this );
    
    if ( _params && _params.lineStyle ) {
      this.lineStyle.apply( this, _params.lineStyle ); // 4, 0xFF3300, 1);
      delete _params.lineStyle;
    }
    
    if ( !_params || _params.fill !== false ) {
      this.beginFill( color || "0xFF3300" );
      delete _params.fill;
    }
    
    this.drawRect( 0, 0, width, height );
    
    this.endFill();
    
    BaseRenderer.instantiate( this, _params );
  }

  RectRenderer.prototype = Object.create( PIXI.Graphics.prototype );
  RectRenderer.prototype.constructor = RectRenderer;
  
  BaseRenderer.inherits( RectRenderer );
  
  RectRenderer.prototype.DEName = "RectRenderer";
  
  return RectRenderer;
} );