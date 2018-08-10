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
 
 * if you use "Localizations" you should give "localizationKey" instead of the text value
 * by doing this, the text will be automatically updated when the lang change if the Renderer exist in a scene (active or not)
 * you can use the locales with one . to go deeper (but only one)
 * => intro.title will do Localization.get( "intro" ).title
 */
define( [
  'PIXI'
  , 'DE.BaseRenderer'
  , 'DE.Localization'
],
function(
  PIXI
  , BaseRenderer
  , Localization
)
{
  function TextRenderer( text, params )
  {
    var _params = params || {};
    
    if ( _params.localizationKey ) {
      var locales = _params.localizationKey.split( "." );
      this.localizationKey = locales[ 0 ];
      this.subKey = locales[ 1 ] || undefined;
      text = Localization.get( this.localizationKey );
      if ( this.subKey ) {
        text = text[ this.subKey ];
      }
      delete _params.localizationKey;
    }
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