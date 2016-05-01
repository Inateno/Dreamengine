/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Renderer
 * @class Renderer is used to Render a GameObject, you can add unlimited renderers on a gameObject and they can have offsets<br>
 * when you want to create a customized Renderer, you have to herits from this one 
 * (you can look at SpriteRenderer, BoxRenderer, CircleRenderer... are pretty good examples)
 * <b>!!Warning!! Default Renderer.render is empty, do not forget did it when you create custom Renderer</b>
 * @example function MyRenderer = function( params, args )
 * {
 *   DE.Renderer.call( this, params );
 * }
 * MyRenderer.prototype = new Renderer();
 * MyRenderer.prototype.constructor = MyRenderer;
 * MyRenderer.prototype.supr        = Renderer.prototype;
 */
define( [ 'DE.COLORS', 'DE.Vector2', 'DE.CONFIG', 'DE.Time' ],
function( COLORS, Vector2, CONFIG, Time )
{
  function Renderer( params )
  {
    params = params || {};
    this.gameObject  = params.gameObject || undefined;
    
    this.alpha       = params.alpha !== undefined ? params.alpha : 1;
    this.fillColor   = params.fillColor || params.fill || COLORS.defaultColor;
    this.strokeColor = params.strokeColor || COLORS.defaultColor;
    this.method      = params.method || "fill";
    this.lineWidth   = params.lineWidth || 1;
    
    if ( this.fillColor != COLORS.defaultColor && this.strokeColor != COLORS.defaultColor
        && !params.method )
      this.method = "fillAndStroke";
    if ( this.fillColor == COLORS.defaultColor && this.strokeColor != COLORS.defaultColor
        && !params.method )
      this.method = "stroke";
    
    this.localPosition = params.localPosition ||
      new Vector2( params.offsetx || params.offsetX || params.left || params.x || params.offsetLeft || 0
                  , params.offsety || params.offsetY || params.top || params.y || params.offsetTop || 0 );
    
    this.sleep = false;
    
    /**
     * object used to apply fade on final Renderer rendering
     * @protected
     * @memberOf Renderer
     * @type {Object}
     */
    this.fadeData = {
      "from"     : 1
      ,"to"      : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    /**
     * object used to apply scale on final Renderer rendering
     * @protected
     * @memberOf Renderer
     * @type {Object}
     */
    this.scaleData = {
      "fromx"    : 1
      ,"tox"     : 0
      ,"fromy"   : 1
      ,"toy"     : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    /****
     * setScale@void( x@Int, y@Int )
      update scales
     */
    this.setScale = function( x, y )
    {
      if ( !this.sizes )
        return;
      y = y || x;
      this.sizes.setScale( x, y );
    }
    
    this.scale = function( x, y )
    {
      if ( !this.sizes )
        return;
      this.setScale( this.sizes.scaleX + ( x || 0 ), this.sizes.scaleY + ( y || 0 ) );
    }
  }
  
  Renderer.prototype = { constructor: Renderer };
  
  /**
   * translate the renderer along the given Vector2
   * @protected
   * @memberOf Renderer
   * @param {Vector2} vector
   */
  Renderer.prototype.translate = function( vector )
  {
    this.localPosition.translate( vector, true, true );
  };
  
  /**
   * translate the renderer along x
   * @protected
   * @memberOf Renderer
   * @param {Int} dist
   */
  Renderer.prototype.translateX = function( dist )
  {
    this.translate( { x: dist, y: 0 } );
  };
  
  /**
   * translate the renderer along y
   * @protected
   * @memberOf Renderer
   * @param {Int} dist
   */
  Renderer.prototype.translateY = function( dist )
  {
    this.translate( { x: 0, y: dist } );
  };
    
  /**
   * apply the current fade
   * @protected
   * @memberOf Renderer
   */
  Renderer.prototype.applyFade = function()
  {
    if ( !this.fadeData.done )
    {
      this.fadeData.stepVal = Time.timeSinceLastFrame / this.fadeData.oDuration
                              * this.fadeData.dir * this.fadeData.fadeScale;
      this.alpha += this.fadeData.stepVal * Time.scaleDelta;
      this.fadeData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
      if ( ( this.fadeData.dir < 0 && this.alpha <= this.fadeData.to )
          || ( this.fadeData.dir > 0 && this.alpha >= this.fadeData.to )
          || this.alpha < 0 || this.alpha > 1 )
      {
        this.alpha = this.fadeData.to;
      }
      if ( this.fadeData.duration <= 0 )
      {
        this.fadeData.done = true;
        if ( this.alpha == 1 || this.alpha == 0 )
        {
          if ( this.alpha == 0 )
            this.sleep = true;
        }
        if ( this.gameObject )
          this.gameObject.trigger( "fadeEnd", this );
      }
    }
  };
  
  /**
   * create a fade from val, to val, with given duration time
   * @public
   * @memberOf Renderer
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fade( 0.5, 1, 850 );
   */
  Renderer.prototype.fade = function( from, to, duration )
  {
    this.sleep = false;
    var data = {
      from      : from !== undefined ? from : 1
      ,to       : to != undefined ? to : 0
      ,duration : duration || 500
      ,oDuration: duration || 500
      ,fadeScale: Math.abs( from - to )
      ,done     : false
    };
    data.dir = data.from > to ? -1 : 1;
    this.alpha = from;
    this.fadeData = data;
  };
  
  /**
   * create a fade to val, from current alpha value with given duration time
   * @public
   * @memberOf Renderer
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  Renderer.prototype.fadeTo = function( to, duration )
  {
    this.sleep = false;
    this.fade( this.alpha, to, duration );
  };
  
  /**
   * fade the renderer to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf Renderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.renderers[ 0 ].fadeOut( 850 );
   */
  Renderer.prototype.fadeOut = function( duration, force )
  {
    this.sleep = false;
    if ( force )
      this.alpha = 1;
    this.fade( this.alpha, 0, duration );
  };
  
  /**
   * fade the renderer to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf Renderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0 before fade
   * @example // alpha = 1 in 850ms
   * myObject.renderers[ 0 ].fadeIn( 850 );
   */
  Renderer.prototype.fadeIn = function( duration, force )
  {
    this.sleep = false;
    if ( force )
      this.alpha = 0;
    this.fade( this.alpha, 1, duration );
  };
  
  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf Renderer
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myRenderer.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  Renderer.prototype.scaleTo = function( scale, duration )
  {
    var dscale = {
      "x"     : !isNaN( scale ) ? scale : scale.x
      ,"y"    : !isNaN( scale ) ? scale : scale.y
    };
    this.scaleData = {
      "valX"     : - ( this.sizes.scaleX - ( dscale.x !== undefined ? dscale.x : this.sizes.scaleX ) )
      ,"valY"    : - ( this.sizes.scaleY - ( dscale.y !== undefined ? dscale.y : this.sizes.scaleY ) )
      ,"dirX"     : this.sizes.scaleX > dscale.x ? 1 : -1
      ,"dirY"     : this.sizes.scaleY > dscale.y ? 1 : -1
      ,"duration" : duration || 500
      ,"oDuration": duration || 500
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"destX"    : dscale.x
      ,"destY"    : dscale.y
      ,"scaleX"   : this.sizes.scaleX
      ,"scaleY"   : this.sizes.scaleY
    };
    this.scaleData.leftX = this.scaleData.valX;
    this.scaleData.leftY = this.scaleData.valY;
  };
  
  /**
   * apply the current scale
   * @protected
   * @memberOf Renderer
   */
  Renderer.prototype.applyScale = function()
  {
    if ( this.scaleData.done )
      return;
    
    var scaleD = this.scaleData;
    
    if ( scaleD.valX != 0 )
    {
      scaleD.stepValX = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valX * Time.scaleDelta;
      scaleD.leftX    -= scaleD.stepValX;
      scaleD.scaleX   += scaleD.stepValX;
    }
    
    if ( scaleD.valY != 0 )
    {
      scaleD.stepValY = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valY * Time.scaleDelta;
      scaleD.leftY    -= scaleD.stepValY;
      scaleD.scaleY   += scaleD.stepValY;
    }
    scaleD.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check scale
    if ( scaleD.dirX < 0 && scaleD.leftX < 0 )
      scaleD.scaleX += scaleD.leftX;
    else if ( scaleD.dirX > 0 && scaleD.leftX > 0 )
      scaleD.scaleX -= scaleD.leftX;
    
    if ( scaleD.dirY < 0 && scaleD.leftY < 0 )
      scaleD.scaleY += scaleD.leftY;
    else if ( scaleD.dirY > 0 && scaleD.leftY > 0 )
      scaleD.scaleY -= scaleD.leftY;
    
    this.sizes.setScale( scaleD.scaleX, scaleD.scaleY );
    
    if ( scaleD.duration <= 0 )
    {
      this.scaleData.done = true;
      this.sizes.setScale( scaleD.destX, scaleD.destY );
      if ( this.gameObject )
        this.gameObject.trigger( "scaleEnd", this );
    }
  };
  
  Renderer.prototype.render = function( ctx, physicRatio, ratioz ){}
  Renderer.prototype.DEName = "Renderer";
  
  CONFIG.debug.log( "Renderer loaded", 3 );
  return Renderer;
} );