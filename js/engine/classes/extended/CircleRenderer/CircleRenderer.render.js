/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* CircleRenderer
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function CircleRender( ctx, physicRatio, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    
    ctx.drawImage( this.buffer.canvas
                  , this.localPosition.x * physicRatio * ratioz >> 0
                  , this.localPosition.y * physicRatio * ratioz >> 0
                  , this.radius * 2 * physicRatio * ratioz >> 0
                  , this.radius * 2 * physicRatio * ratioz >> 0 );
    
    ctx.globalAlpha = oldAlpha;
  }
  
  CONFIG.debug.log( "CircleRenderer.render loaded", 3 );
  return CircleRender;
} );