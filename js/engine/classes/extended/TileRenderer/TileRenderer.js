/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor TileRenderer
 * @augments Renderer
 * @class draw a tile (it's a part of an image)<br>
 * checkout Renderer for standard parameters
 * @example var haldShip = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.TileRenderer( {
 *     "imageName": "ship",
 *     "tilesizes": { "width": "100", "height": 200 },
 *     "tileposition": { "x": "100", "y": 0 }
 *   } )
 * } );
 */
define( [ 'DE.Renderer', 'DE.ImageManager', 'DE.Vector2', 'DE.Sizes', 'DE.TileRenderer.render', 'DE.CONFIG' ],
function( Renderer, ImageManager, Vector2, Sizes, TileRender, CONFIG )
{
  function TileRenderer( params )
  {
    if ( !params )
      throw new Error( "TileRenderer :: You have to pass arguments object to instantiate -- see the doc" );
    
    Renderer.call( this, params );
    
    this.imageName = params.imageName || undefined;
    if ( !this.imageName )
      throw new Error( "TileRenderer :: No imageName defined -- declaration canceled" );
    
    if ( !ImageManager.images[ this.imageName ] )
      throw new Error( "TileRenderer :: Can't find image " + this.imageName + " in imagesDatas" );
    
    params.tilesizes = params.tilesizes || params.tileSizes || {};
    
    this.tilesizes = new Sizes( params.tilesizes.width || params.tilesizes.w || params.width || 10
                  , params.tilesizes.height || params.tilesizes.h || params.height || 10
                  , 1, 1 );
    
    params.tileposition = params.tileposition || params.tilePosition || {};
    this.tileposition = new Vector2( params.tileposition.x || params.x || 0
                    , params.tileposition.y || params.y || 0 );
    
    if (!this.tileposition)
    {
      console.error("Tile position must be defined");
    }
    params.scaleX = params.scale || params.scaleX || params.scalex || 1;
    params.scaleY = params.scale || params.scaleY || params.scaley || 1;
    params.sizes = params.sizes || {};
    this.sizes  = new Sizes( params.sizes.width || params.width || params.w || params.tilesizes.width || 10
                  , params.sizes.height || params.height || params.h || params.tilesizes.height || 10
                  , params.scaleX, params.scaleY );
    
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