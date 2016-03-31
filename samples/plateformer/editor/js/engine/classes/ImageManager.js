/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* ImageManager
**/

define( [ 'DE.CONFIG', 'DE.imagesList', 'DE.States' ],
function( CONFIG, imagesList, States )
{
  var ImageManager = new function()
  {
    this.DEName = "ImageManager";
    
    this.images = {};
    this.imagesLoaded = 0;
    this.imagesRequested = 0;
    this.defaultImages = imagesList;
    
    this.arrayLoader = function( imagesList )
    {
      if ( !imagesList )
      {
        imagesList = this.defaultImages;
      }
      
      var imgs = imagesList;
      for ( var i = 0, img; img = imgs[ i ]; i++ )
      {
        this.pushImage( img[ 0 ], img[ 1 ], img[ 2 ], img[ 3 ] );
      }
      if ( imagesList.length == 0 )
      {
        States.down( 'isLoadingImages' );
      }
    }
    /***
    * @pushImage
      - name:String - url:String - extension:String - param:Object -
    push an image in this.images and load it
    ***/
    this.pushImage = function( name, url, extension, param )
    {
      param = param || {};
      
      this.images[ name ] = new Image();
      
      var img = this.images[ name ];
      img.src = url + "." + extension;
      img.totalFrame  = param.totalFrame || 1;
      img.totalLine  = param.totalLine || 1;
      img.eachAnim  = param.eachAnim || 0;
      img.isReverse  = param.isReverse || false;
      img.isAnimated  = param.isAnimated || false;
      
      if ( img.totalFrame == 0 )
      {
        img.isAnimated = false;
      }
      
      img.name = name;
      
      img.onload = function()
      {
        this.widthFrame = this.width / this.totalFrame >> 0;
        this.heightFrame = this.height / this.totalLine >> 0;
        ImageManager.imageLoaded( this );
      }
      this.imagesRequested++;
      States.up( 'isLoadingImages' );
    }
    
    /***
    * @imageLoaded
      - img:Image reference
    called when an image is loaded
    ***/
    this.imageLoaded = function( img )
    {
      if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
      {
        console.log( "Image:" + name + " correctly loaded" );
      }
      this.imagesLoaded++;
      
      if ( this.imagesLoaded == this.imagesRequested )
      {
        States.down( 'isLoadingImages' );
      }
    }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "ImageManager loaded" );
  }
  return ImageManager;
} );