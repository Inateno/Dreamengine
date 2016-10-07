/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor CircleRenderer
 * @augments Renderer
 * @class draw a circle
 * checkout Renderer for standard parameters
 * @example var circle = new DE.GameObject( {
 *   x: 500, y: 500,
 *   renderer: new DE.CircleRenderer( { "radius": 50, "fillColor": "red", "strokeColor": "blue", "lineWidth": 3 } )
 * } );
 */
define( [ 'PIXI', 'DE.ImageManager', 'DE.CONFIG', 'DE.Time', 'DE.Event', 'DE.BaseRenderer' ],
function( PIXI, ImageManager, CONFIG, Time, Event, BaseRenderer )
{
  function CircleRenderer( params )
  {
    PIXI.Graphics.call( this );
    BaseRenderer.instantiate( this );
    
    this.fillColor = params.fillColor == "random" ? '0x' + Math.floor( Math.random() * 16777215 ).toString( 16 ) : params.fillColor;
    
    this.radius = params.radius || 10;
    this.scale.x = params.scaleX || params.scale || 1;
    this.scale.y = params.scaleY || params.scale || 1;
    
    this.clear();
    this.beginFill( this.fillColor, 1 );
    this.drawCircle( this.x + this.radius, this.y + this.radius, this.radius );
    this.endFill();
  }
  
  CircleRenderer.prototype = Object.create( PIXI.Graphics.prototype );
  CircleRenderer.prototype.constructor = CircleRenderer;
  CircleRenderer.prototype.DEName      = "CircleRenderer";
  
  BaseRenderer.inherits( CircleRenderer );
  Object.defineProperties( CircleRenderer.prototype, {
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
    
  } );
  
  CONFIG.debug.log( "CircleRenderer loaded", 3 );
  return CircleRenderer;
} );