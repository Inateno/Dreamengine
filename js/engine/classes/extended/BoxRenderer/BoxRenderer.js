/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor BoxRenderer
 * @augments Renderer
 * @class draw a a colored square<br>
 * checkout Renderer for standard parameters
 * @example var itsJustABox = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.BoxRenderer( { "fillColor": "red" }, 250, 100 )
 * } );
 */
define( [ 'DE.Renderer', 'DE.BoxRenderer.render', 'DE.CONFIG', 'DE.Sizes' ],
function( Renderer, BoxRender, CONFIG, Sizes )
{
  function BoxRenderer( param, width, height )
  {
    Renderer.call( this, param );
    
    this.sizes = new Sizes( width, height, 1, 1, this );
    this.sizes._center();
    
    /***
    * @fillIt
    ***/
    this.fillIt = function( ctx, physicRatio, ratioz )
    {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect( this.localPosition.x * physicRatio >> 0
                    , this.localPosition.y * physicRatio >> 0
                    , this.sizes.width * physicRatio * ratioz >> 0
                    , this.sizes.height * physicRatio * ratioz >> 0 );
    }
    
    /***
    * @strokeIt
    ***/
    this.strokeIt = function( ctx, physicRatio, ratioz )
    {
      ctx.strokeStyle  = this.strokeColor;
      ctx.strokeRect( this.localPosition.x * physicRatio >> 0
                     , this.localPosition.y * physicRatio >> 0
                     , this.sizes.width * physicRatio * ratioz >> 0
                     , this.sizes.height * physicRatio * ratioz >> 0 );
    }
    
    /***
    * @changeWidth
    ***/
    this.setWidth = function( newWidth )
    {
      this.sizes.setSizes( newWidth, this.sizes.height );
    }
    
    /***
    * @changeHeight
    ***/  
    this.setHeight = function( newHeight )
    {
      this.sizes.setSizes( this.sizes.width, newHeight );
    }
      
    /***
    * @changeSizes
    ***/
    this.setSizes = function( newWidth, newHeight )
    {
      this.sizes.setSizes( newWidth, newHeight );
    }
  }

  BoxRenderer.prototype = new Renderer();
  BoxRenderer.prototype.constructor = BoxRenderer;
  BoxRenderer.prototype.supr        = Renderer.prototype;
  BoxRenderer.prototype.DEName      = "BoxRenderer";
  
  BoxRenderer.prototype.render = BoxRender;
  
  
  CONFIG.debug.log( "BoxRenderer loaded", 3 );
  return BoxRenderer;
} );