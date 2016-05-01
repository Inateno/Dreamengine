/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TextRenderer
 * @augments Renderer
 * @class draw a text<br>
 * checkout Renderer for standard parameters
 * @example var hello = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TextRenderer( {
 *     "fillColor": "white", "fontSize": "25",
 *     "textAlign": "left", "font": "Calibri", // lol
 *     "paddingX": 5, "backgroundColor": "blue",
 *     "borderSize": 2, "borderColor": "white"
 *   }, 800, 100, "hello" )
 * } );
 */
define( [ 'DE.Renderer', 'DE.TextRenderer.render', 'DE.CONFIG', 'DE.Sizes', 'DE.CanvasBuffer', 'DE.ImageManager' ],
function( Renderer, TextRender, CONFIG, Sizes, CanvasBuffer, ImageManager )
{
  function TextRenderer( params, width, height, text )
  {
    if ( params.length !== undefined )
    {
      var _h = text;
      text   = params || {};
      params = width;
      width  = height || 400;
      height = _h || 140;
    }
    
    Renderer.call( this, params );
    
    if ( !params || !width || !height || text == undefined )
      throw new Error( "TextRenderer :: Can't instantiate without params, width, height, text" );
    
    this._text        = text;
    this.textAlign    = params.textAlign || "center";
    this.textBaseline = params.textBaseline || "middle";
    this.fontSize = params.fontSize || 20;
    this.fontStyle= params.fontStyle || "";
    this.font     = params.font || 'Calibri';
    
    this.sizes = new Sizes( width, height, 1, 1, this );
    this.preventCenter = params.preventCenter || false;
    if ( !this.preventCenter )
      this.sizes._center();
    
    this.paddingX = params.padding || params.paddingX || 0;
    this.paddingY = params.padding || params.paddingY || 0;
    
    this.backgroundColor = params.backgroundColor;
    this.borderColor     = params.borderColor;
    this.borderSize      = params.borderSize || 1;
    this.backgroundImage = params.backgroundImage;
    
    if ( this.backgroundImage && !ImageManager.images[ this.backgroundImage ] )
    {
      console.log( "TextRenderer :: %cCant find given backgroundImage - " + this.backgroundImage
                  + " check your imagesDatas - ignore background"
                  , "color: red" );
      this.backgroundImage = undefined;
    }
    
    if ( this.backgroundImage || this.backgroundColor || this.borderColor )
      this.background = true;
    
    this.init = function()
    {
      this.buffer = new CanvasBuffer( this.sizes.width, this.sizes.height );
      this.clearBuffer();
    }
    
    /***
    * @public @clearBuffer clear the buffer and redraw text
    */
    this.clearBuffer = function()
    {
      this.buffer.ctx.clearRect( 0, 0, this.sizes.width, this.sizes.height );
      this.buffer.ctx.font         = this.fontStyle + ' ' + ( this.fontSize ) + 'px ' + ( this.font );
      this.buffer.ctx.textAlign    = this.textAlign;
      this.buffer.ctx.textBaseline = this.textBaseline;
      if ( this.background )
      {
        if ( this.backgroundImage )
          this.buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ]
                                    , 0, 0, this.sizes.width, this.sizes.height );
        else if ( this.backgroundColor )
        {
          this.buffer.ctx.fillStyle = this.backgroundColor;
          this.buffer.ctx.fillRect( 0, 0, this.sizes.width, this.sizes.height );
        }
        if ( this.borderColor )
        {
          this.buffer.ctx.lineWidth   = this.borderSize;
          this.buffer.ctx.strokeStyle = this.borderColor;
          this.buffer.ctx.strokeRect( 0, 0, this.sizes.width, this.sizes.height );
          this.buffer.ctx.lineWidth = 1;
        }
      }
      
      var x = ( this.textAlign == "right" ? this.sizes.width - this.paddingX :
             this.textAlign == "left" ? this.paddingX : this.sizes.width * 0.5 + this.paddingX >> 0 );
      var y = ( this.textBaseline == "bottom" ? this.sizes.height - this.paddingY :
             this.textBaseline == "top" ? this.paddingY : this.sizes.height * 0.5 + this.paddingY >> 0 );
      if ( this.method == "fill" || this.method == "fillAndStroke" )
      {
        this.buffer.ctx.fillStyle = this.fillColor;
        if ( this.forceWidth )
          this.buffer.ctx.fillText( this._text, x, y, this.sizes.width );
        else
          this.buffer.ctx.fillText( this._text, x, y );
      }
      
      if ( this.method == "stroke" || this.method == "fillAndStroke" )
      {
        this.buffer.ctx.lineWidth   = this.lineWidth;
        if ( this.fillColor )
          this.buffer.ctx.globalAlpha = 0.8;
        this.buffer.ctx.strokeStyle = this.strokeColor;
        if ( this.forceWidth )
          this.buffer.ctx.strokeText( this._text, x, y, this.sizes.width );
        else
          this.buffer.ctx.strokeText( this._text, x, y );
      }
    }
    
    this.init( params );
  }

  TextRenderer.prototype = new Renderer();
  TextRenderer.prototype.constructor = TextRenderer;
  TextRenderer.prototype.supr        = Renderer.prototype;
  
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
        this.setText( text );
      }
    }
  } );
  
  TextRenderer.prototype.DEName = "TextRenderer";
  TextRenderer.prototype.render = TextRender;
  
  TextRenderer.prototype.setText = function( text )
  {
    this.clearBuffer();
    this.onSetText( text );
  };
  
  TextRenderer.prototype.onSetText = function( text ){}
    
  /***
   * @changeSizes
   */
  TextRenderer.prototype.setSizes = function( newWidth, newHeight )
  {
    this.sizes.setSizes( newWidth, newHeight );
  };
  
  CONFIG.debug.log( "TextRenderer loaded", 3 );
  return TextRenderer;
} );