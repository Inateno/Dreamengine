/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor SheetRenderer
 * @augments Renderer
 * @class draw a sprite<br>
 * if the given sprite is animated, it'll animate it automatically according to you imagesDatas file<br>
 * checkout Renderer for standard parameters
 * @example var ship = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.SheetRenderer( { "spriteName": "ship", "scale": 0.7, "offsetY": -30 } )
 * } );
 */
define( [ 'PIXI', 'DE.ImageManager', 'DE.CONFIG', 'DE.Time', 'DE.Event', 'DE.BaseRenderer' ],
function( PIXI, ImageManager, CONFIG, Time, Event, BaseRenderer )
{
  function SheetRenderer( frameId, params )
  {
    params = params || {};
    this.frameId = frameId || undefined;
    
    if ( !PIXI.utils.TextureCache[ frameId ] )
      throw new Error( 'The frameId "' + frameId + '" does not exist in the texture cache ' + this );
    
    PIXI.Sprite.call( this, PIXI.utils.TextureCache[ frameId ] );
    BaseRenderer.instantiate( this );
    
    this.position.x = params.x || params.offsetX || 0;
    this.position.y = params.y || params.offsetY || 0;
    
    this.scale.x = params.scaleX || params.scale || 1;
    this.scale.y = params.scaleY || params.scale || 1;
    
    // was used to handle quality change
    // Event.on( 'imageLoaded', function( n, nt, name )
    // {
    //   if ( name != this.spriteName )
    //     return;
    // 
    //   this.frameSizes.width  = ImageManager.spritesData[ this.spriteName ].widthFrame;
    //   this.frameSizes.height = ImageManager.spritesData[ this.spriteName ].heightFrame;
    //   this.sizes.setSizes( this.frameSizes );
    // }, this );
    this.preventCenter = params.preventCenter;
    if ( !params.preventCenter )
      this.center();
  }
  
  SheetRenderer.prototype = Object.create( PIXI.Sprite.prototype );
  SheetRenderer.prototype.constructor = SheetRenderer;
  SheetRenderer.prototype.DEName      = "SheetRenderer";
  
  BaseRenderer.inherits( SheetRenderer );
  Object.defineProperties( SheetRenderer.prototype, {
  } );
  
  // TODO
  /**
   * @public
   * @memberOf SheetRenderer
   * @type {Int}
   */
  // SheetRenderer.prototype.changeFrame = function( frameId, params )
  // {
  //   params = params || {};
  //   this.uncenter();
  //   this.frameId = frameId;
  //   if ( !PIXI.utils.TextureCache[ frameId ] )
  //     throw new Error( 'The frameId "' + frameId + '" does not exist in the texture cache ' + this );
    
  //   // PIXI.Sprite.call( this, PIXI.utils.TextureCache[ frameId ] );
    
  //   if ( !this.spriteName )
  //     throw new Error( "SheetRenderer :: No spriteName defined -- declaration canceled" );
    
  //   if ( this.gameObject )
  //     this.center();
  // };
  
  CONFIG.debug.log( "SheetRenderer loaded", 3 );
  return SheetRenderer;
} );