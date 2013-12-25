/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* CircleRenderer
**/

/**
** The CircleRenderer is child of Renderer
** It draws a colored circle for the gameObject
** need the GameObject to draw
** list of params are the sames as Renderer
** need a radius (int) in px
** optional: angleStart in radians
** optional: angleEnd in radians
** optional: clockRotation (bool);
**/

define( [ 'DE.Renderer', 'DE.CircleRenderer.render', 'DE.CONFIG', 'DE.CanvasBuffer' ],
function( Renderer, CircleRender, CONFIG, CanvasBuffer )
{
  function CircleRenderer( param, radius, angleStart, angleEnd, clockRotation )
  {
    Renderer.call( this, param );
    
    this.radius = radius || 1;
    
    this.angleStart= angleStart || 0;
    this.angleEnd  = angleEnd || Math.PI*2;
    
    this.clockRotation = clockRotation || false;
    
    this.buffer = null;
    this.localPosition.x -= this.radius;
    this.localPosition.y -= this.radius;
    this.initCircle = function()
    {
      this.buffer = new CanvasBuffer( this.radius * 2, this.radius * 2 );
      
      var ctx = this.buffer.ctx;
      ctx.fillStyle  = this.fillColor;
      ctx.strokeStyle  = this.strokeColor;
      ctx.globalAlpha = this.alpha;
      
      ctx.beginPath();
      ctx.arc( this.radius, this.radius,
            this.radius, this.angleStart, this.angleEnd, this.clockRotation );
      switch ( this.method )
      {
        case "fill":
          ctx.fill();
          break;
        
        case "fillAndStroke":
          ctx.fill();
          ctx.stroke();
          break;

        case "stroke":
          ctx.stroke();
          break;

        default:
          ctx.stroke();
      }
      ctx.closePath();
    }
    this.initCircle();
  }

  CircleRenderer.prototype = new Renderer();
  CircleRenderer.prototype.constructor = CircleRenderer;
  CircleRenderer.prototype.supr        = Renderer.prototype;
  CircleRenderer.prototype.DEName      = "CircleRenderer";
  
  CircleRenderer.prototype.render = CircleRender;
  
  CONFIG.debug.log( "CircleRenderer loaded", 3 );
  return CircleRenderer;
} );