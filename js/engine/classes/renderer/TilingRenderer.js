/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TilingRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite repeated as a Tile<br>
 * it works with any texture loaded in PIXI.utils.TextureCache (included json sheets)<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var background = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TilingRenderer( { "backgroundImage": "mountains_repeat", width: 2000 } )
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
  function TilingRenderer( params )
  {
    if ( !params.backgroundImage && !params.spriteName && !params.spriteUrl && !params.textureName ) {
      console.error( "A TilingRenderer need a spriteName or a spriteUrl argument" );
      return;
    }
    
    PIXI.extras.TilingSprite.call( this, PIXI.utils.TextureCache[ params.backgroundImage || params.spriteName || params.spriteUrl || params.textureName ], params.width, params.height )
    BaseRenderer.instantiate( this, params );
  }

  TilingRenderer.prototype = Object.create( PIXI.extras.TilingSprite.prototype );
  TilingRenderer.prototype.constructor = TilingRenderer;
  
  BaseRenderer.inherits( TilingRenderer );
  
  TilingRenderer.prototype.DEName = "TilingRenderer";
  
  return TilingRenderer;
} );