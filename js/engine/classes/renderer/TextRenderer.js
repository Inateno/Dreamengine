/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextureRenderer
 * @augments PIXI.Sprite
 * @class draw a sprite<br>
 * this just instantiate a PIXI.Text with a PIXI.TextStyle, but it give to "BaseRenderer" the rest of params, so you can easily set position, scaling, rotation, etc, directly on declaration<br>
 * checkout PIXI.DisplayObject for all attributes
 * @example var helloWorld = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TextRenderer( "Hello World", {
 *     rotation: Math.PI, x: 100, interactive: true,
 *     textStyle: { fontFamily: "cordova", fontSize: 12, fill: "white" }
 *   } )
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
  function TextRenderer( text, params )
  {
    var _params = params || {};
    
    PIXI.Text.call( this, text, new PIXI.TextStyle( _params.textStyle ) );
    delete _params.textStyle;
    
    BaseRenderer.instantiate( this, _params );
  }

  TextRenderer.prototype = Object.create( PIXI.Text.prototype );
  TextRenderer.prototype.constructor = TextRenderer;
  
  BaseRenderer.inherits( TextRenderer );
  
  TextRenderer.prototype.DEName = "TextRenderer";
  
  return TextRenderer;
} );