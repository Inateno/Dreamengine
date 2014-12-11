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
  function TextRender( ctx, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    ctx.drawImage( this.buffer.canvas, this.localPosition.x, this.localPosition.y, this.sizes.width * ratioz, this.sizes.height * ratioz );
    ctx.globalAlpha = oldAlpha;
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "BoxRenderer.render loaded" );
  }
  return TextRender;
} );