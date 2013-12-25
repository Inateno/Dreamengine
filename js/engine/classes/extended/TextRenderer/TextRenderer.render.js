/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* TextRenderer.render
**/

/**
* render the text renderer
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function TextRender( ctx, physicRatio, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    ctx.drawImage( this.buffer.canvas
                  , this.localPosition.x * physicRatio * ratioz >> 0
                  , this.localPosition.y * physicRatio * ratioz >> 0
                  , this.sizes.width * this.sizes.scaleX * physicRatio * ratioz >> 0
                  , this.sizes.height * this.sizes.scaleY * physicRatio * ratioz >> 0 );
    ctx.globalAlpha = oldAlpha;
  }
  
  CONFIG.debug.log( "TextRenderer.render loaded", 3 );
  return TextRender;
} );