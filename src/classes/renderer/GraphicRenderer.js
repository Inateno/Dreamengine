/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor GraphicRenderer
 * @augments PIXI.Graphics
 * @class Generate a PIXI.Graphics
 * checkout PIXI.Graphics documentation, you can pass in the first "methods" arguments any function to call in an array format declaration
 * @example var customShape = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.GraphicRenderer( [ { "beginFill": "0x66CCFF" }, { "drawRect": [ 0, 0, 50, 50 ] }, { "endFill": [] } ] )
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
  function GraphicRenderer( methods, params )
  {
    PIXI.Graphics.call( this );
    
    if ( methods ) {
      for ( var i = 0; i < methods.length; ++i )
      {
        for ( var n in methods[ i ] )
        {
          if ( methods[ i ][ n ] instanceof Array ) {
            this[ n ].apply( this, methods[ i ][ n ] );
          }
          else {
            this[ n ].call( this, methods[ i ][ n ] );
          }
        }
      }
    }
    
    BaseRenderer.instantiate( this, params );
  }

  GraphicRenderer.prototype = Object.create( PIXI.Graphics.prototype );
  GraphicRenderer.prototype.constructor = GraphicRenderer;
  
  BaseRenderer.inherits( GraphicRenderer );
  
  GraphicRenderer.prototype.DEName = "GraphicRenderer";
  
  return GraphicRenderer;
} );