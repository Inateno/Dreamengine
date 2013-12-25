/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* CanvasBuffer( width@Int, height@Int )
 CanvasBuffer provide a simple middleware to instantiate buffers
 Helper: Buffers are a good way to improve performances in your games.
 1- Canvas offscreen is faster than Canvas in the dom
 2- sometimes you didn't need to render all things you got in your game
 Example: in a RPG game, you render the tiled floor only once in a buffer,
  then you render only this buffer. Try the two ways you'll see performances improved
  (of course not on a very small map)
 
 !!Warning!! Buffers can become very slow and heavy if you bufferise something veryvery big (more than 2000px) 
 In a future version I'll optimise auto-cut buffering to provide the best way to bufferise big stuff
 without DIY, but right now, be careful.
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function CanvasBuffer( width, height )
  {
    if ( !width || !height )
      throw new Error( "CanvasBuffer :: can't instantiate a buffer with a width or a height 0 -- see the doc" );
    
    this.canvas = document.createElement( "canvas" );
    this.canvas.width = width;
    this.canvas.height= height;
    
    this.ctx = this.canvas.getContext( '2d' );
    
    // disabling aliasing should improve quality but lower perfs (testing)
    this.ctx.mozImageSmoothingEnabled = true;
    this.ctx.webkitImageSmoothingEnabled = true;
    
    this.resize = function ( newWidth, newHeight )
    {
      this.canvas.width = newWidth;
      this.canvas.height= newHeight;
    }
    
    this.clear = function()
    {
      this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    }
  }
  CanvasBuffer.prototype.DEName = "CanvasBuffer";
  
  CONFIG.debug.log( "CanvasBuffer loaded", 3 );
  return CanvasBuffer;
} );