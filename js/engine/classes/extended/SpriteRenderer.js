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
define( [ 'PIXI', 'DE.ImageManager', 'DE.CONFIG', 'DE.Time', 'DE.Event', 'DE.BaseRenderer' ],
function( PIXI, ImageManager, CONFIG, Time, Event, BaseRenderer )
{
  function SpriteRenderer( params )
  {
    this.spriteName = params.spriteName || undefined;
    if ( !this.spriteName )
      throw new Error( "SpriteRenderer :: No spriteName defined -- declaration canceled" );
    
    if ( !ImageManager.spritesData[ this.spriteName ] )
      throw new Error( "SpriteRenderer :: Can't find image " + this.spriteName + " in imagesDatas" );
    
    PIXI.Sprite.call( this, PIXI.utils.TextureCache[ PIXI.loader.resources[ this.spriteName ].url ] );
    BaseRenderer.instantiate( this );
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.startFrame   = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.endFrame     = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this._currentFrame = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.startLine    = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this._currentLine  = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.totalFrame   = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.totalLine    = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.eachAnim     = 0;
    
    /**
     * @private
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this._nextAnim    = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.isAnimated   = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.isPaused     = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.isReversed   = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.isOver       = 0;
    
    /**
     * @public
     * @memberOf SpriteRenderer
     * @type {Int}
     */
    this.isLoop = 0;
    
    this.position.x = params.x || params.offsetX || 0;
    this.position.y = params.y || params.offsetY || 0;
    
    this.scale.x = params.scaleX || params.scale || 1;
    this.scale.y = params.scaleY || params.scale || 1;
    
    this._tint = params.tint || 0xFFFFFF;
    
    /**
     * @public
     * This function is called when the animation is over. Overwrite this function
     * @memberOf SpriteRenderer
     */
    this.onAnimEnd = function(){}
    this.changeSprite( this.spriteName, params );
    
    // was used to handle quality change
    // Event.on( 'imageLoaded', function( n, nt, name )
    // {
    //   if ( name != this.spriteName )
    //     return;
      
    //   this.frameSizes.width  = ImageManager.spritesData[ this.spriteName ].widthFrame;
    //   this.frameSizes.height = ImageManager.spritesData[ this.spriteName ].heightFrame;
    //   this.sizes.setSizes( this.frameSizes );
    // }, this );
  }
  
  SpriteRenderer.prototype = Object.create( PIXI.Sprite.prototype );
  SpriteRenderer.prototype.constructor = SpriteRenderer;
  SpriteRenderer.prototype.DEName      = "SpriteRenderer";
  
  BaseRenderer.inherits( SpriteRenderer );
  Object.defineProperties( SpriteRenderer.prototype, {
    tint: {
      get: function()
      {
        return this._tint;
      }
      ,set: function( value )
      {
        this._tint = value || 0xFFFFFF;
        
        if ( this._originalTexture )
          this._originalTexture.tint = this._tint;
      }
    }
    
    , currentFrame: {
      get: function(){ return this._currentFrame; }
      ,set: function( frame )
      {
        if ( frame + 1 >= this.endFrame )
          this._currentFrame = this.endFrame - 1;
        else if ( frame < this.startFrame )
          this._currentFrame = this.startFrame;
        else
          this._currentFrame = frame;
        
        this._originalTexture.frame.x = this._currentFrame * this.fw;
        this._originalTexture._updateUvs();
        
        if ( this.normalTexture )
        {
          this.normalTexture.frame.x = this._currentFrame * this.fw;
          this.normalTexture._updateUvs();
        }
      }
    }
    
    , currentLine: {
      get: function(){ return this._currentLine; }
      ,set: function( line )
      {
        if ( line + 1 >= this.endLine )
          this._currentLine = this.endLine - 1;
        else if ( line < this.startLine )
          this._currentLine = this.startLine;
        else
          this._currentLine = line;
        
        this._originalTexture.frame.y = this._currentLine * this.fh;
        this._originalTexture._updateUvs();
        
        if ( this.normalTexture )
        {
          this.normalTexture.frame.y = this._currentLine * this.fh;
          this.normalTexture._updateUvs();
        }
      }
    }
  } );
  
  SpriteRenderer.prototype.updateAnimation = function()
  {
    if ( !this.isAnimated || this.isPaused || this.isOver )
      return;
    
    this._nextAnim -= Time.timeSinceLastFrameScaled;
    if ( this._nextAnim > 0 )
      return;
    
    this._nextAnim = this.eachAnim + this._nextAnim; // sub rest of previous anim time (if it take 50ms and we goes up to 55, remove 5)
    this.lastAnim = Date.now();
    
    this._currentFrame += this.isReversed ? -1 : 1;
    if ( this._currentFrame >= this.endFrame )
    {
      if ( this.isLoop )
        this._currentFrame = this.startFrame;
      else
      {
        this._currentFrame = this.endFrame - 1;
        this.isOver = true;
        this.onAnimEnd();
      }
    }
    else if ( this._currentFrame < this.startFrame )
    {
      if ( this.isLoop )
        this._currentFrame = this.endFrame - 1;
      else
      {
        this._currentFrame = this.startFrame;
        this.isOver = true;
        this.onAnimEnd();
      }
    }
    
    this._originalTexture.frame.x = this._currentFrame * this.fw;
    this._originalTexture.frame.y = this._currentLine * this.fh;
    this._originalTexture._updateUvs();
    
    if ( this.normalTexture )
    {
      this.normalTexture.frame.x = this._currentFrame * this.fw;
      this.normalTexture.frame.y = this._currentLine * this.fh;
      this.normalTexture._updateUvs();
    }
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setFrame = function( frame )
  {
    this.currentFrame = frame;
    return this;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setLine = function( line )
  {
    this.currentLine = line;
    return this;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.restartAnim = function()
  {
    this.isOver = false;
    if ( !this.isReversed )
      this.currentFrame = this.startFrame;
    else
      this.currentFrame = this.endFrame - 1;
    this.lastAnim = Time.currentTime;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setPause = function( val )
  {
    this.isPaused = val;
    if ( !val && !this.isAnimated )
    {
      this.isAnimated = true;
      this.lastAnim = Date.now();
    }
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setEndFrame = function( v )
  {
    if ( this.totalFrame <= v )
      this.endFrame = this.totalFrame - 1;
    else
      this.endFrame = v;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setDelay = function( delay )
  {
    this.eachAnim = delay;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.setLoop = function( bool )
  {
    this.isLoop = bool;
  };
  
  /**
   * @public
   * @memberOf SpriteRenderer
   * @type {Int}
   */
  SpriteRenderer.prototype.changeSprite = function( spriteName, params )
  {
    params = params || {};
    this.spriteName = spriteName;
    
    if ( !this.spriteName )
      throw new Error( "SpriteRenderer :: No spriteName defined -- declaration canceled" );
    
    var d = ImageManager.spritesData[ this.spriteName ];
    if ( !this.preventCenter )
      this.uncenter();
    if ( !params.keepPosition )
    {
      this.position.x = params.offsetX || params.x || 0;
      this.position.y = params.offsetY || params.y || 0;
    }
    
    this.scale.x = params.scaleX || params.scale || 1;
    this.scale.y = params.scaleY || params.scale || 1;
    
    this.startFrame   = params.startFrame || d.startFrame || 0;
    this.endFrame     = params.endFrame || d.endFrame
                        || d.totalFrame || 0;
    this._currentFrame = this.startFrame || 0;
    this._currentLine  = params.startLine || 0;
    this.startLine    = params.startLine || 0;
    
    this.totalFrame   = d.totalFrame || 0;
    this.totalLine    = params.totalLine || d.totalLine || 0;
    
    this.eachAnim     = params.eachAnim || d.eachAnim || 0;
    this.nextAnim     = this.eachAnim;
    
    this.isAnimated   = params.isAnimated !== undefined ? params.isAnimated : d.isAnimated || this.isAnimated;
    this.isPaused     = params.paused !== undefined ? params.paused : params.isPaused || this.isPaused;
    this.isReversed   = params.reversed !== undefined ? params.reversed : params.isreversed != undefined ? params.isreversed :
                        params.isReversed != undefined ? params.isReversed : d.isReversed || this.isReversed;
    this.isOver       = false;
    this.isLoop       = ( params.isLoop != undefined ) ? params.isLoop : d.isLoop || this.isLoop;
    
    this.frames = [];
    this.baseTexture = PIXI.utils.TextureCache[ PIXI.loader.resources[ this.spriteName ].url ];
    
    if ( params.normal )
    {
      this.normalName = params.normal;
      this.baseNormalTexture = PIXI.utils.TextureCache[ PIXI.loader.resources[ params.normal ].url ]
    }
    
    this.fw = this.baseTexture.width / d.totalFrame >> 0;
    this.fh = this.baseTexture.height / d.totalLine >> 0;
    var size = new PIXI.Rectangle( this.currentFrame * this.fw, this.currentLine * this.fh, this.fw, this.fh );
    this.texture = new PIXI.Texture( this.baseTexture, size, size.clone(), null, null );
    this._originalTexture = this.texture;
    
    if ( this.baseNormalTexture )
    {
      var normsize = new PIXI.Rectangle( this.currentFrame * this.fw, this.currentLine * this.fh, this.fw, this.fh );
      this.normalTexture = new PIXI.Texture( this.baseNormalTexture, normsize, normsize.clone(), null, null );
    }
    
    if ( this.tint )
      this._originalTexture.tint = this.tint;
    
    if ( params.filters )
      this.filters = params.filters;
    
    if ( params.hue )
    {
      if ( !this.hueFilter )
        this.hueFilter = new PIXI.filters.ColorMatrixFilter();
      else
        this.hueFilter.hue( 0, 0 );
      this.hueFilter.hue( params.hue[ 0 ], params.hue[ 1 ] );
      
      if ( !this.filters )
        this.filters = [ this.hueFilter ];
      else if ( this.filters.length >= 1 && this.filters.indexOf( this.hueFilter ) == -1 )
        this.filters = this.filters.concat( [ this.hueFilter ] );
    }
    if ( params.saturation )
    {
      if ( !this.saturationFilter )
        this.saturationFilter = new PIXI.filters.ColorMatrixFilter();
      else
        this.saturationFilter.saturate( 0, 0 );
      this.saturationFilter.saturate( params.saturation[ 0 ], params.saturation[ 1 ] );
      
      if ( !this.filters )
        this.filters = [ this.saturationFilter ];
      else if ( this.filters.length >= 1 && this.filters.indexOf( this.saturationFilter ) == -1 )
        this.filters = this.filters.concat( [ this.saturationFilter ] );
    }
    if ( params.brightness )
    {
      if ( !this.brightnessFilter )
        this.brightnessFilter = new PIXI.filters.ColorMatrixFilter();
      else
        this.brightnessFilter.brightness( 0, 0 );
      this.brightnessFilter.brightness( params.brightness[ 0 ], params.brightness[ 1 ] );
      
      if ( !this.filters )
        this.filters = [ this.brightnessFilter ];
      else if ( this.filters.length >= 1 && this.filters.indexOf( this.brightnessFilter ) == -1 )
        this.filters = this.filters.concat( [ this.brightnessFilter ] );
    }
    if ( params.contrast )
    {
      if ( !this.contrastFilter )
        this.contrastFilter = new PIXI.filters.ColorMatrixFilter();
      else
        this.contrastFilter.contrast( 0, 0 );
      this.contrastFilter.contrast( params.contrast[ 0 ], params.contrast[ 1 ] );
      
      if ( !this.filters )
        this.filters = [ this.contrastFilter ];
      else if ( this.filters.length >= 1 && this.filters.indexOf( this.contrastFilter ) == -1 )
        this.filters = this.filters.concat( [ this.contrastFilter ] );
    }
    
    this.preventCenter = params.preventCenter;
    if ( !this.preventCenter )
    {
      this.center();
    }
  };
  
  CONFIG.debug.log( "SpriteRenderer loaded", 3 );
  return SpriteRenderer;
} );