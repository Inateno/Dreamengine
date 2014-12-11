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
  function CircleRender( ctx, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    
    ctx.drawImage( this.buffer.canvas, this.localPosition.x, this.localPosition.y, this.radius * 2 * ratioz, this.radius * 2 * ratioz );
    
    ctx.globalAlpha = oldAlpha;
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "CircleRender loaded" )
  }
  return CircleRender;
} );