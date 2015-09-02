/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor BufferRenderer
 * @augments Renderer
 * @class create an empty renderer with a buffer ready for draw in
 * checkout Renderer for standard parameters
 * @example var bufferedObj = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.BufferRenderer( { alpha: 0.5 }, 200, 200 )
 * } );
 */
define( [ 'DE.Renderer', 'DE.CONFIG', 'DE.Sizes' ],
function( Renderer, CONFIG, Sizes )
{
  function BufferRenderer( params, width, height )
  {
    Renderer.call( this, params );
    
    this.width = width || 1;
    this.height= height || 1;
    
    this.buffer = null;//new CanvasBuffer( width, height );
    this.preventCenter = params.preventCenter || false;
    
    this.sizes  = new Sizes( width || 1, height  || 1
        , params.scale || params.scaleX
        , params.scale || params.scaleY, this );
    if ( !this.preventCenter )
      this.sizes._center();
    
    this.resize = function( w, h )
    {
      this.sizes.setSizes( w, h );
      this.buffer.resize( w, h );
    };
    
    this.clear = function()
    {
      this.buffer.clear.apply( this.buffer, arguments );
    };
    
    this.drawRenderer = function( renderer, offset )
    {
      if ( offset )
        this.buffer.ctx.translate( offset.x, offset.y );
      renderer.render( this.buffer.ctx, 1, 1 );
      if ( offset )
        this.buffer.ctx.translate( -offset.x, -offset.y );
    };
  }

  BufferRenderer.prototype = new Renderer();
  BufferRenderer.prototype.constructor = BufferRenderer;
  BufferRenderer.prototype.supr        = Renderer.prototype;
  BufferRenderer.prototype.DEName      = "BufferRenderer";
  
  BufferRenderer.prototype.render = function( ctx, physicRatio, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    
    ctx.globalAlpha = this.alpha * oldAlpha;
    ctx.drawImage( this.buffer.canvas
                  , this.localPosition.x * physicRatio * ratioz >> 0
                  , this.localPosition.y * physicRatio * ratioz >> 0
                  , this.sizes.width * this.sizes.scaleX * physicRatio * ratioz >> 0
                  , this.sizes.height * this.sizes.scaleY * physicRatio * ratioz >> 0 );
    
    ctx.globalAlpha = oldAlpha;
  };
  
  CONFIG.debug.log( "BufferRenderer loaded", 3 );
  return BufferRenderer;
} );