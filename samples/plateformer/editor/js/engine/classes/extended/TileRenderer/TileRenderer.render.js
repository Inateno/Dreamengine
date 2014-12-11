/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* TileRenderer.render
**/

/**
** The TileRenderer is child of Renderer
** It draws a tile from an image or a sprite for the gameObject
** need the GameObject to draw
** list of params are the sames as Renderer
**/

define( [ 'DE.ImageManager', 'DE.CONFIG', 'DE.Time' ],
function( ImageManager, CONFIG, Time )
{
  function TileRender( ctx, ratioz )
  {
    if ( this.imageName === undefined )
    {
      console.log( "WARN: No image name on a TileRenderer" );
      return false;
    }
    
    ctx.globalAlpha = this.alpha;
    ctx.drawImage( ImageManager.images[ this.imageName ]
            , this.tileposition.x, this.tileposition.y
            , this.tilesizes.width, this.tilesizes.height
            , this.localPosition.x * ratioz
            , this.localPosition.y * ratioz
            , this.sizes.width * this.sizes.scaleX * ratioz, this.sizes.height * this.sizes.scaleY * ratioz );
    ctx.globalAlpha = 1;
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "TileRenderer.render loaded" );
  }
  return TileRender;
} );