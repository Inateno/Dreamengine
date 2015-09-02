/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor CanvasBuffer
 * @class CanvasBuffer provide a simple middle ware to instantiate buffers<br>
 * <b>What is it</b>: Buffers are a good way to improve performances in your games<br>
 * 1- Canvas offscreen manipulation is faster than Canvas in the dom (draw, resize, etc..)<br>
 * 2- sometimes you don't need to render all things you got in your game<br>
 * Example: in a RPG game, you render the tiled floor only once in a buffer, 
 * then you render only this buffer.<br>
 * Try the two ways you'll see performances improved (of course not on a very small map)
 
 * <br>!!Warning!! Buffers can become very slow and heavy if you bufferise something very very big (more than 2000 pixels)<br>
 * In a future version I'll optimise auto-cut buffering to provide the best way to bufferise big stuff 
 * without DIY, but right now, be careful.</b><br><br>
 * <b>Declare buffers only with Integers, never declare with 0, negative or float</b>
 * @param {Int} width
 * @param {Int} height
 * @example var customBuffer = new DE.CanvasBuffer( 500, 250 );
 */

// DEPRECATED - use PIXI stuff for this now
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function CanvasBuffer( width, height, smoothingEnable )
  {
    if ( !width || !height )
      throw new Error( "CanvasBuffer :: can't instantiate a buffer with a width or a height 0 -- see the doc" );
    
    /**
     * dom element ( isn't append)
     * @public
     * @type {CanvasElement}
     */
    this.canvas = document.createElement( "canvas" );
    
    /**
     * canvas width
     * @public
     * @type {Int}
     */
    this.canvas.width = width;
    
    /**
     * canvas height
     * @public
     * @type {Int}
     */
    this.canvas.height= height;
    
    /**
     * canvas context 2d
     * @public
     * @type {CanvasContext2D}
     */
    if ( window.WebGL2D )
    {
      WebGL2D.enable( this.canvas );
      this.ctx = this.canvas.getContext("webgl-2d");
    }
    else
      this.ctx = this.canvas.getContext( '2d' );
    
    // disabling aliasing should improve quality but lower perfs (testing)
    if ( smoothingEnable !== undefined )
    {
      if ( this.ctw.imageSmoothingEnabled )
        this.ctx.imageSmoothingEnabled = true;
      else
      {
        this.ctx.mozImageSmoothingEnabled = true;
        this.ctx.webkitImageSmoothingEnabled = true;
      }
    }
    
    /**
     * resize the buffer
     * @public
     * @memberOf CanvasBuffer
     * @param {Int} newWidth
     * @param {Int} newHeight
     * @returns {CanvasBuffer} this current instance
     */
    this.resize = function ( newWidth, newHeight )
    {
      this.canvas.width = newWidth;
      this.canvas.height= newHeight;
      return this;
    }
    
    /**
     * clear the buffer
     * @public
     * @memberOf CanvasBuffer
     * @returns {CanvasBuffer} this current instance
     */
    this.clear = function()
    {
      this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
      return this;
    }
  }
  CanvasBuffer.prototype.DEName = "CanvasBuffer";
  
  CONFIG.debug.log( "CanvasBuffer loaded", 3 );
  return CanvasBuffer;
} );