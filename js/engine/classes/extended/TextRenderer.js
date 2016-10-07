/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextRenderer
 * @augments TextRenderer
 * @class draw a text<br>
 * checkout TextRenderer for standard parameters
 * @example var hello = new DE.GameObject( {
 *   x: 500, y: 500,
 *   TextRenderer: new DE.TextRenderer( {
 *     "fill": "white", "fontSize": "25",
 *     "textAlign": "left", "font": "Calibri", // lol
 *     "paddingX": 5, "backgroundColor": "blue",
 *     "borderSize": 2, "borderColor": "white"
 *   }, 800, 100, "hello" )
 * } );
 */
define( [ 'PIXI', 'DE.CONFIG', 'DE.ImageManager', 'DE.BaseRenderer' ],
function( PIXI, CONFIG, ImageManager, BaseRenderer )
{
  function TextRenderer( text, params )
  {
    params = params || {};
    
    params.align = params.align || "center";
    
    if ( params.fillColor )
      params.fill = params.fillColor;
    
    if ( params.font && params.fontSize )
    {
      params.font = params.fontSize + "px " + params.font;
      if ( params.fontWeight )
        params.font = params.fontWeight + " " + params.font;
    }
    else if ( params.fontSize )
    {
      params.font = params.fontSize + "px " + 'Calibri';
      if ( params.fontWeight )
        params.font = params.fontWeight + " " + params.font;
    }
    
    PIXI.Text.call( this, text, params );
    BaseRenderer.instantiate( this );
    
    this.x += params.x || params.offsetX || params.offsetLeft || 0;
    this.y += params.y || params.offsetY || params.offsetTop || 0;
    this.align = params.align;
    
    this._isCentered = true;
    this.preventCenter = params.preventCenter;
    
    if ( this.preventCenter )
      return;
    
    if ( this.align == "left" )
      this.pivot.x = this.width;
    else if ( this.align == "right" )
      this.pivot.x = 0;
    else
      this.pivot.x = this.width * 0.5 >> 0;
    this.pivot.y = this.height * 0.5 >> 0;
  }

  TextRenderer.prototype = Object.create( PIXI.Text.prototype );
  TextRenderer.prototype.constructor = TextRenderer;
  TextRenderer.prototype.DEName      = "TextRenderer";
  
  BaseRenderer.inherits( TextRenderer );
  Object.defineProperties( TextRenderer.prototype, {
    text: {
      get: function()
      {
        return this._text;
      },
      set: function ( text )
      {
        text = text.toString() || ' ';
        if ( this._text === text )
        {
          return;
        }
        this._text = text;
        this.dirty = true;
        
        if ( !this._style )
          return;
        this.updateText();
        
        this._isCentered = true;
        if ( this.preventCenter )
          return;
        
        if ( this.align == "left" )
          this.pivot.x = this.width;
        else if ( this.align == "right" )
          this.pivot.x = 0;
        else
          this.pivot.x = this.width * 0.5 >> 0;
        this.pivot.y = this.height * 0.5 >> 0;
      }
    }
  } );
  
  CONFIG.debug.log( "TextRenderer loaded", 3 );
  return TextRenderer;
} );