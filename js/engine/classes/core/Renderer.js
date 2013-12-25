/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* Renderer( params )
 Renderer is to Render a gameObject, you can add unllimited renderers on a gameObject and they can have offsets
 when you want to create a customized Renderer, you have to herits from this one
 (you can look at SpriteRenderer, BoxRenderer, CircleRenderer)
 
 !!Warning!! Default Renderer.render is empty, do not forget did it when you create custom Renderer
**/
define( [ 'DE.COLORS', 'DE.Vector2', 'DE.CONFIG' ],
function( COLORS, Vector2, CONFIG )
{
  function Renderer( params )
  {
    params = params || {};
    this.gameObject  = params.gameObject || undefined;
    
    this.alpha       = params.alpha || 1;
    this.fillColor   = params.fillColor  || COLORS.defaultColor;
    this.strokeColor = params.strokeColor  || COLORS.defaultColor;
    this.method      = params.method || "fill";
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
      
      this.localPosition.x += ( this.sizes.width * this.sizes.scaleX * 0.5 ) >> 0;
      this.localPosition.y += ( this.sizes.height * this.sizes.scaleY * 0.5 ) >> 0;
      this.sizes.setScale( x, y );
      this.localPosition.x -= ( this.sizes.width * this.sizes.scaleX * 0.5 ) >> 0;
      this.localPosition.y -= ( this.sizes.height * this.sizes.scaleY * 0.5 ) >> 0;
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