/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor SpriteRenderer
 * @augments Renderer
 * @class draw a sprite<br>
 * if the given sprite is animated, it'll animate it automatically according to you imagesDatas file<br>
 * checkout Renderer for standard parameters
 * @example var ship = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.SpriteRenderer( { "spriteName": "ship", "scale": 0.7, "offsetY": -30 } )
 * } );
 */
define( [ 'DE.Renderer', 'DE.ImageManager', 'DE.Sizes', 'DE.SpriteRenderer.render', 'DE.CONFIG', 'DE.Time', 'DE.Event' ],
function( Renderer, ImageManager, Sizes, SpriteRender, CONFIG, Time, Event )
{
  function SpriteRenderer( params )
  {
    if ( !params )
      throw new Error( "SpriteRenderer :: You have to pass arguments object to instantiate -- see the doc" );
    
    Renderer.call( this, params );
    
    this.spriteName = params.spriteName || undefined;
    if ( !this.spriteName )
      throw new Error( "SpriteRenderer :: No spriteName defined -- declaration canceled" );
    
    if ( !ImageManager.images[ this.spriteName ] )
      throw new Error( "SpriteRenderer :: Can't find image " + this.spriteName + " in imagesDatas" );
    
    this.startFrame = params.startFrame || 0;
    this.endFrame   = params.endFrame || ImageManager.images[ this.spriteName ].totalFrame || 0;
    this.totalFrame = ImageManager.images[ this.spriteName ].totalFrame || 0;
    this.totalLine  = params.totalLine || ImageManager.images[ this.spriteName ].totalLine || 0;
    
    this.eachAnim  = params.eachAnim || ImageManager.images[ this.spriteName ].eachAnim || 0;
    this.lastAnim  = Date.now();
    
    this.frameSizes = new Sizes( ImageManager.images[ this.spriteName ].widthFrame
                    , ImageManager.images[ this.spriteName ].heightFrame
                    , 1, 1 );
    
    // need save given sizes, then:
    // params.w * physicRatio to get real width to display (if there is a width)
    // and when the currentRatioIndex change, get the new ratio and made again the calcul with saved values
    /*
    if ( params.w || params.width || params.Width || params.h || params.height || params.Height )
    {
      this.savedSizes = { "w": params.width || params.w || params.Width || undefined
                        , "h": params.height || params.h || params.Height || undefined };
      this.sizes = new Sizes( this.savedSizes.w * physicRatio || ImageManager.images[ this.spriteName ].widthFrame
                          , this.savedSizes.h * physicRatio || ImageManager.images[ this.spriteName ].heightFrame
                          , params.scaleX, params.scaleY );
    }
    */
    
    params.scaleX = params.scale || params.scaleX || params.scalex || 1;
    params.scaleY = params.scale || params.scaleY || params.scaley || 1;
    this.sizes  = new Sizes( params.width || params.w || ImageManager.images[ this.spriteName ].widthFrame
                  , params.height  || params.h || ImageManager.images[ this.spriteName ].heightFrame
                  , params.scaleX, params.scaleY, this );
    
    this.isAnimated = params.isAnimated || ImageManager.images[ this.spriteName ].isAnimated;
    this.isPaused  = params.paused || params.isPaused
        ImageManager.images[ this.spriteName ].isPaused || false;
    this.isReversed  = params.reversed || params.isreversed || params.isReversed
        || ImageManager.images[ this.spriteName ].isReversed || false;
    this.isOver = false;
    this.isLoop = ( params.isLoop != undefined ) ? params.isLoop : ImageManager.images[ this.spriteName ].isLoop;
    
    this.currentFrame = this.startFrame || 0;
    this.currentLine  = params.startLine || 0;
    this.sizes._center();
    
    this.onAnimEnd = function(){}
    
    Event.on( 'imageLoaded', function( n, nt, name )
    {
      if ( name != this.spriteName )
        return;
      
      this.frameSizes.width  = ImageManager.images[ this.spriteName ].widthFrame;
      this.frameSizes.height = ImageManager.images[ this.spriteName ].heightFrame;
      this.sizes.setSizes( this.frameSizes );
    }, this );
  }
  SpriteRenderer.prototype = new Renderer();
  SpriteRenderer.prototype.constructor = SpriteRenderer;
  SpriteRenderer.prototype.supr        = Renderer.prototype;
  SpriteRenderer.prototype.DEName      = "SpriteRenderer";
  
  SpriteRenderer.prototype.render = SpriteRender;
  
  SpriteRenderer.prototype.setFrame = function( frame )
  {
    if ( frame + 1 >= this.endFrame )
      this.currentFrame = this.endFrame - 1;
    else if ( frame < this.startFrame )
      this.currentFrame = this.startFrame;
    else
      this.currentFrame = frame;
  }
  
  SpriteRenderer.prototype.setLine = function( line )
  {
    if ( line + 1 >= this.totalLine )
      this.currentLine = this.totalLine - 1;
    else
      this.currentLine = line;
  }
  
  SpriteRenderer.prototype.restartAnim = function()
  {
    this.isOver = false;
    if ( !this.isReversed )
      this.currentFrame = this.startFrame;
    else
      this.currentFrame = this.endFrame - 1;
    this.lastAnim = Time.currentTime;
  }
  
  SpriteRenderer.prototype.setPause = function( val, disableAnimation )
  {
    this.isPaused = val;
    if ( !val && !this.isAnimated )
    {
      this.isAnimated = true;
      this.lastAnim = Date.now();
    }
  }
  SpriteRenderer.prototype.setEndFrame = function( v )
  {
    if ( this.totalFrame <= v )
      this.endFrame = this.totalFrame - 1;
    else
      this.endFrame = v;
  }
  SpriteRenderer.prototype.setDelay = function( delay )
  {
    this.eachAnim = delay;
  }
  SpriteRenderer.prototype.setLoop = function( bool )
  {
    this.isLoop = bool;
  }
  
  CONFIG.debug.log( "SpriteRenderer loaded", 3 );
  return SpriteRenderer;
} );