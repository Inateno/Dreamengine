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
define( [ 'DE.COLORS', 'DE.Vector2', 'DE.CONFIG' ],
function( COLORS, Vector2, CONFIG )
{
  function Renderer( params )
  {
    params = params || {};
    this.gameObject  = params.gameObject || undefined;
    
    this.alpha       = params.alpha !== undefined ? params.alpha : 1;
    this.fillColor   = params.fillColor  || COLORS.defaultColor;
    this.strokeColor = params.strokeColor  || COLORS.defaultColor;
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
    
    /****
     * scale@void( x@Int, y@Int )
      TODO - WIP - not finished
      will provide a scaling animation
      (different from sizes.scaleTo because need update offsets)
     */
    this.scale = function( x, y )
    {
      if ( !this.sizes )
        return;
      this.setScale( this.sizes.scaleX + ( x || 0 ), this.sizes.scaleY + ( y || 0 ) );
    }
  }
  
  Renderer.prototype = {
    
    constructor: Renderer
    /****
     * translate@void( vector@Vector2 )
      translate the renderer offsets
      ignore the deltaTime on renderers offseting
     */
    , translate: function( vector )
    {
      this.localPosition.translate( vector, true, true );
    }
    
    /****
     * translateX@void( dist@Int )
      translate the renderer horizontaly
     */
    , translateX: function( dist )
    {
      this.translate( { x: dist, y: 0 } );
    }
    
    /****
     * translateY@void( dist@Int )
      translate the renderer verticaly
     */
    , translateY: function( dist )
    {
      this.translate( { x: 0, y: dist } );
    }
  };
  Renderer.prototype.render = function( ctx, physicRatio, ratioz ){}
  Renderer.prototype.DEName = "Renderer";
  
  CONFIG.debug.log( "Renderer loaded", 3 );
  return Renderer;
} );