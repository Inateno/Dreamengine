/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* BoxRenderer.render
**/

/**
* render the box renderer
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function BoxRender( ctx, physicRatio, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    switch ( this.method )
    {
      case "fill":
        this.fillIt( ctx, physicRatio, ratioz );
        break;
      
      case "fillAndStroke":
        this.fillIt( ctx, physicRatio, ratioz );
        this.strokeIt( ctx, physicRatio, ratioz );
        break;
        
      case "stroke":
        this.strokeIt( ctx, physicRatio, ratioz );
        break;

      default:
        this.strokeIt( ctx, physicRatio, ratioz );
    }
    
    ctx.globalAlpha = oldAlpha;
  }
  
  CONFIG.debug.log( "BoxRenderer.render loaded", 3 );
  return BoxRender;
} );