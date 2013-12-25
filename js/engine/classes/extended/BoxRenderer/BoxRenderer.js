/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* BoxRenderer
**/

/**
** The BoxRenderer is child of Renderer
** It draws a colored square for the gameObject
** need the GameObject to draw
** list of params are the sames as Renderer
** need a width (int) in px
** need a height (int) in px
**/

define( [ 'DE.Renderer', 'DE.BoxRenderer.render', 'DE.CONFIG', 'DE.Sizes' ],
function( Renderer, BoxRender, CONFIG, Sizes )
{
  function BoxRenderer( param, width, height )
  {
    Renderer.call( this, param );
    
    this.sizes = new Sizes( width, height, 1, 1 );
    this.localPosition.x -= ( width * 0.5 );
    this.localPosition.y -= ( height * 0.5 );
    
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
    this.changeWidth = function( newWidth )
    {
      var delta = newWidth - this.sizes.width
      this.sizes.width = newWidth;
      
      this.localPosition.x -= ( delta * 0.5 ) >> 0;
    }
    
    /***
    * @changeHeight
    ***/  
    this.changeHeight = function( newHeight )
    {
      var delta = newHeight - this.sizes.height
      this.sizes.height = newHeight;
      
      this.localPosition.y -= ( delta * 0.5 ) >> 0;
    }
      
    /***
    * @changeSizes
    ***/
    this.changeSizes = function( newWidth, newHeight )
    {
      var deltaw = newWidth - this.sizes.width
      this.sizes.width = newWidth;
      
      var deltah = newHeight - this.sizes.height
      this.sizes.height = newHeight;
      
      this.localPosition.x -= ( deltaw * 0.5 ) >> 0;
      this.localPosition.y -= ( deltah * 0.5 ) >> 0;
    }
    /* // */
  }

  BoxRenderer.prototype = new Renderer();
  BoxRenderer.prototype.constructor = BoxRenderer;
  BoxRenderer.prototype.supr        = Renderer.prototype;
  BoxRenderer.prototype.DEName      = "BoxRenderer";
  
  BoxRenderer.prototype.render = BoxRender;
  
  
  CONFIG.debug.log( "BoxRenderer loaded", 3 );
  return BoxRenderer;
} );