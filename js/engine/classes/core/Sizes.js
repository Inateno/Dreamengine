/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* Sizes( width@Int, height@Int, scaleX@Float, scaleY@Float )
 it's a simple class to contain Sizes with scaling vals
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function Sizes( width, height, scaleX, scaleY )
  {
    if ( !width || !height )
      throw new Error( "Sizes :: You have to pass a width and height when instantiate -- see the doc" );
    this.width  = width;
    this.height = height;
    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;
    
    /****
     * setScale@Sizes( val@Vector2 || Float, [valY@Float] )
      set directly scale
     */
    this.setScale = function( val, valY )
    {
      if ( val.x && val.y )
      {
        this.scaleX = val.x;
        this.scaleY = val.y;
      }
      else if ( !valY )
      {
        this.scaleX = val;
        this.scaleY = val;
      }
      else
      {
        this.scaleX = val;
        this.scaleY = valY;
      }
      return this;
    }
    
    /****
     * scaleTo@void( val@Vector2 || Float, [time@MS] )
      scaleTo provide a middleware to make scale animation
      TODO - WIP
     */
    this.scaleTo = function( val, time )
    {
      if ( val.x && val.y )
      {
        this.scaleX = val.x;
        this.scaleY = val.y;
      }
      else
      {
        this.scaleX = val;
        this.scaleY = val;
      }
      return this;
    }
    
    /****
     * scaleXTo@void( val@Float, time@MS )
      scaleXTo provide a middleware to make scaleX animation
      TODO - WIP
     */
    this.scaleXTo = function( val, time )
    {
      this.scaleX = valX;
    }
    
    /****
     * scaleYTo@void( val@Float, time@MS )
      scaleYTo provide a middleware to make scaleY animation
      TODO - WIP
     */
    this.scaleYTo = function( val )
    {
      this.scaleY = valY;
    }
    
    /****
     * setSizes@Sizes( first@Sizes || Int, [height@int] )
      set current sizes to given sizes
      if you provide only first as Int, will make a boxed sizes
     */
    this.setSizes = function( first, height )
    {
      if ( first.width )
      {
        this.width = first.width;
        this.height= first.height || this.height;
      }
      else if ( first && !height )
      {
        this.width = first;
        this.height= first;
      }
      else
      {
        this.width = first;
        this.height= height;
      }
      return this;
    }
  }
  Sizes.prototype.DEName = "Sizes";
  
  CONFIG.debug.log( "Sizes loaded", 3 );
  return Sizes;
} );