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
  function BoxRender( ctx, ratioz )
  {
    var oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;
    switch ( this.method )
    {
      case "fill":
        this.fillIt( ctx, ratioz );
        break;
      
      case "fillAndStroke":
        this.fillIt( ctx, ratioz );
        this.strokeIt( ctx, ratioz );
        break;
        
      case "stroke":
        this.strokeIt( ctx, ratioz );
        break;

      default:
        this.strokeIt( ctx, ratioz );
    }
    
    ctx.globalAlpha = oldAlpha;
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "BoxRenderer.render loaded" );
  }
  return BoxRender;
} );