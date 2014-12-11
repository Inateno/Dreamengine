/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function CanvasBuffer( width, height )
  {
    this.DEName = "CanvasBuffer";
    
    var width = width
      , height = height
      ;
    
    this.canvas = document.createElement( "canvas" );
    this.canvas.width = width;
    this.canvas.height= height;
    
    this.ctx = this.canvas.getContext( '2d' );
    
    // disabling aliasing (test)
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    
    this.resize = function ( newWidth, newHeight )
    {
      width  = newWidth;
      height  = newHeight;
      
      this.canvas.width = width;
      this.canvas.height= height;
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "CanvasBuffer loaded" );
  }
  return CanvasBuffer;
} );