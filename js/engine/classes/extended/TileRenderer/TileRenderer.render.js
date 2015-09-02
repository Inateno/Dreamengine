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
    var oldAlpha = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha * oldAlpha;
    if ( ImageManager.imageNotRatio )
    {
      // if ( this.buffer )
      // {
        
      // }
      // else
      // {
        ctx.drawImage( ImageManager.images[ this.imageName ]
                , this.tileposition.x * physicRatio >> 0, this.tileposition.y * physicRatio >> 0
                , this.tilesizes.width * physicRatio +1 >> 0, this.tilesizes.height * physicRatio +1 >> 0
                , this.localPosition.x * physicRatio * ratioz >> 0
                , this.localPosition.y * physicRatio * ratioz >> 0
                , this.sizes.width * this.sizes.scaleX * physicRatio * ratioz +2 >> 0
                , this.sizes.height * this.sizes.scaleY * physicRatio * ratioz +1 >> 0 );
      // }
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
    ctx.globalAlpha = oldAlpha;
  };
  
  CONFIG.debug.log( "TileRenderer.render loaded", 3 );
  return TileRender;
} );