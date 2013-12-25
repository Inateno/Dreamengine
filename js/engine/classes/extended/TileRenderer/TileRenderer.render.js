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
  function TileRender( ctx, physicRatio, ratioz )
  {
    ctx.globalAlpha = this.alpha;
    if ( ImageManager.imageNotRatio )
    {
      ctx.drawImage( ImageManager.images[ this.imageName ]
              , this.tileposition.x, this.tileposition.y
              , this.tilesizes.width, this.tilesizes.height
              , this.localPosition.x * physicRatio * ratioz >> 0
              , this.localPosition.y * physicRatio * ratioz >> 0
              , this.sizes.width * this.sizes.scaleX * physicRatio * ratioz >> 0
              , this.sizes.height * this.sizes.scaleY * physicRatio * ratioz >> 0 );
    }
    else
    {
      ctx.drawImage( ImageManager.images[ this.imageName ]
              , this.tileposition.x, this.tileposition.y
              , this.tilesizes.width, this.tilesizes.height
              , this.localPosition.x * ratioz >> 0
              , this.localPosition.y * ratioz >> 0
              , this.sizes.width * this.sizes.scaleX * ratioz >> 0
              , this.sizes.height * this.sizes.scaleY * ratioz >> 0 );
    }
    ctx.globalAlpha = 1;
  };
  
  CONFIG.debug.log( "TileRenderer.render loaded", 3 );
  return TileRender;
} );