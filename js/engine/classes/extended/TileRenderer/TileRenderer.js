/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* TileRenderer
**/

/**
** The TileRenderer is child of Renderer
** It draws a tile from an image or a sprite for the gameObject
** need the GameObject to draw
** list of params are the sames as Renderer
**/

define( [ 'DE.Renderer', 'DE.ImageManager', 'DE.Vector2', 'DE.Sizes', 'DE.TileRenderer.render', 'DE.CONFIG' ],
function( Renderer, ImageManager, Vector2, Sizes, TileRender, CONFIG )
{
  function TileRenderer( param )
  {
    if ( !param )
      throw new Error( "TileRenderer :: You have to pass arguments object to instantiate -- see the doc" );
    
    Renderer.call( this, param );
    
    this.imageName = param.imageName || undefined;
    if ( !this.imageName )
      throw new Error( "TileRenderer :: No imageName defined -- declaration canceled" );
    
    if ( !ImageManager.images[ this.imageName ] )
      throw new Error( "TileRenderer :: Can't find image " + this.imageName + " in imagesDatas" );
    
    param.tilesizes = param.tilesizes || param.tileSizes || {};
    
    this.tilesizes = new Sizes( param.tilesizes.width || param.tilesizes.w || param.width || 10
                  , param.tilesizes.height || param.tilesizes.h || param.height || 10
                  , 1, 1 );
    
    param.tileposition = param.tileposition || param.tilePosition || {};
    this.tileposition = new Vector2( param.tileposition.x || param.x || 0
                    , param.tileposition.y || param.y || 0 );
    
    if (!this.tileposition)
    {
      console.error("Tile position must be defined");
    }
    param.scaleX = param.scale || param.scaleX || param.scalex || 1;
    param.scaleY = param.scale || param.scaleY || param.scaley || 1;
    param.sizes = param.sizes || {};
    this.sizes  = new Sizes( param.sizes.width || param.width || param.w || param.tilesizes.width || 10
                  , param.sizes.height || param.height || param.h || param.tilesizes.height || 10
                  , param.scaleX, param.scaleY );
    
    this.localPosition.x -= ( this.sizes.width * this.sizes.scaleX * 0.5 );
    this.localPosition.y -= ( this.sizes.height * this.sizes.scaleY * 0.5 );
  }

  TileRenderer.prototype = new Renderer();
  TileRenderer.prototype.constructor = TileRenderer;
  TileRenderer.prototype.supr        = Renderer.prototype;
  TileRenderer.prototype.DEName      = "TileRenderer";
  
  TileRenderer.prototype.render = TileRender;
  
  CONFIG.debug.log( "TileRenderer loaded", 3 );
  return TileRenderer;
} );