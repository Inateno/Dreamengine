/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor RectRenderer
 * @augments Renderer
 * @class draw a circle
 * checkout Renderer for standard parameters
 * @example var circle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.RectRenderer( { "width": 50, "height": 70, "fillColor": "red" } )
 * } );
 */
define( [ 'PIXI', 'DE.ImageManager', 'DE.CONFIG', 'DE.Time', 'DE.Event', 'DE.BaseRenderer' ],
function( PIXI, ImageManager, CONFIG, Time, Event, BaseRenderer )
{
  function RectRenderer( params )
  {
    PIXI.Graphics.call( this );
    BaseRenderer.instantiate( this );
    
    this.fillColor = params.fillColor == "random" ? '0x' + Math.floor( Math.random() * 16777215 ).toString( 16 ) : params.fillColor;
    
    this.lineColor = params.lineColor == "random" ? '0x' + Math.floor( Math.random() * 16777215 ).toString( 16 ) : params.lineColor;
    this.lineWidth = params.lineWidth || 1;
    
    this.scale.x = params.scaleX || params.scale || 1;
    this.scale.y = params.scaleY || params.scale || 1;
    
    this.x = params.x || 0;
    this.y = params.y || 0;
    
    this._rectData = {};
    
    this.rectData = {
      width      : params.width
      ,height    : params.height
      ,fillColor : this.fillColor
      ,lineColor : this.lineColor
      ,lineWidth : this.lineWidth
    };
  }
  
  RectRenderer.prototype = Object.create( PIXI.Graphics.prototype );
  RectRenderer.prototype.constructor = RectRenderer;
  RectRenderer.prototype.DEName      = "RectRenderer";
  
  BaseRenderer.inherits( RectRenderer );
  Object.defineProperties( RectRenderer.prototype, {
    tint: {
      get: function()
      {
        return this._tint;
      }
      ,set: function( value )
      {
        this._tint = value || 0xFFFFFF;
        
        if ( this._originalTexture )
          this._originalTexture.tint = this._tint;
      }
    }
    , rectData: {
      get: function()
      {
        return this._rectData;
      }
      ,set: function( value )
      {
        for ( var i in value )
          this._rectData[ i ] = value[ i ];
        
        if ( !this.silent )
          this.redraw();
      }
    }
  } );
  
  RectRenderer.prototype.redraw = function()
  {
    this.clear();
    this.beginFill( this.fillColor, 1 );
    this.drawRect( 0, 0, this.rectData.width, this.rectData.height );
    this.endFill();
  }
  
  CONFIG.debug.log( "RectRenderer loaded", 3 );
  return RectRenderer;
} );