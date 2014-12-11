/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Sizes
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function Sizes( width, height, scaleX, scaleY )
  {
    this.DEName = "Sizes";
    
    this.width  = width;
    this.height  = height;
    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;
    
    this.scaleTo = function( val )
    {
      this.scaleX = val;
      this.scaleY = val;
    }

    this.scaleXTo = function( valX )
    {
      this.scaleX = valX;
    }

    this.scaleYTo = function( valY )
    {
      this.scaleY = valY;
    }

    this.setSizes = function( first, height )
    {
      if ( first.width )
      {
        this.width = first.width;
        this.height= first.height || this.height;
        return;
      }
      this.width = first;
      this.height= height || this.height;
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Sizes loaded" );
  }
  return Sizes;
} );