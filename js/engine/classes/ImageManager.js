/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@ImageManager
**/
define( [ 'DE.CONFIG', 'DE.States', 'DE.Event', 'DE.CanvasBuffer' ],
function( CONFIG, States, Event, CanvasBuffer )
{
  var ImageManager = new function()
  {
    this.DEName = "ImageManager";
    
    this.images            = {};
    this.imagesLoaded      = 0;
    this.imagesRequested   = 0;
    this.defaultImages     = [];
    this.pathPrefix        = "";
    this.imageNotRatio     = false;
    this.ratioToConception = 1;
    this.folderName        = "img";
    
    /****
     * arrayLoader@void( imagesDatas )
      add all images in the array and load them
     */
    this.arrayLoader = function( imagesDatas )
    {
      if ( !imagesDatas )
      {
        CONFIG.debug.log( "%cno images loaded", 1, "color:red" );
        return;
      }
      
      var imgs = imagesDatas;
      for ( var i = 0, img; i < imgs.length; ++i )
      {
        img = imgs[ i ];
        if ( !img || ( img[ 3 ] || {} ).load === false )
          continue;
        this.pushImage( img[ 0 ], img[ 1 ], img[ 2 ], img[ 3 ] );
      }
      if ( imagesDatas.length == 0 )
      {
        setTimeout( function(){ States.down( 'isLoadingImages' ); }, 10 );
      }
    }
    
    /****
     * @pushImage
      - name:String - url:String - extension:String - params:Object -
      push an image in this.images and load it
     */
    this.pushImage = function( name, url, extension, params )
    {
      params = params || {};
      
      this.images[ name ] = new Image();
      
      var img  = this.images[ name ];
      img.src  = this.folderName + "/" + this.pathPrefix + url + "." + extension;
      img.name = name;
      img.totalFrame = params.totalFrame || 1;
      img.totalLine  = params.totalLine || 1;
      img.eachAnim   = params.eachAnim || 0;
      img.isReversed = params.isReversed || false;
      img.isAnimated = params.isAnimated || false;
      img.isPaused   = params.isPaused || false;
      img.isLoop     = ( params.isLoop != undefined ) ? params.isLoop : true;
      if ( img.totalFrame <= 1 )
      {
        img.isAnimated = false;
      }
      
      img.onload = function()
      {
        ImageManager.imageLoaded( this );
      }
      this.imagesRequested++;
      States.up( 'isLoadingImages' );
      CONFIG.debug.log( "LoadImage " + name, 3 );
    }
    
    /****
     * @imageLoaded
      - img:Image reference
      called when an image is loaded - resize the image to the good size if current config isNotRatio
     */
    this.imageLoaded = function( img )
    {
      CONFIG.debug.log( "Image:" + img.name + " correctly loaded", 3 );
      var buff = new CanvasBuffer( img.width, img.height )
        , cvs = buff.canvas
        , ctx = buff.ctx;
      
      if ( this.imageNotRatio )
      {
        cvs.width  = cvs.width * this.ratioToConception;
        cvs.height = cvs.height * this.ratioToConception;
      }
      
      cvs.name        = img.name;
      cvs.totalFrame  = img.totalFrame;
      cvs.totalLine   = img.totalLine;
      cvs.eachAnim    = img.eachAnim;
      cvs.isReversed  = img.isReversed;
      cvs.isAnimated  = img.isAnimated;
      cvs.isPaused    = img.isPaused;
      cvs.isLoop      = img.isLoop;
      cvs.widthFrame  = cvs.width / cvs.totalFrame >> 0;
      cvs.heightFrame = cvs.height / cvs.totalLine >> 0;
      ctx.drawImage( img, 0, 0, cvs.width, cvs.height );
      this.images[ img.name ] = cvs;
      this.imagesLoaded++;
      
      if ( this.imagesLoaded == this.imagesRequested )
      {
        States.down( 'isLoadingImages' );
      }
      Event.emit( "imageLoaded", this.imagesLoaded, this.imagesRequested, img.name );
    }
  };
  
  CONFIG.debug.log( "ImageManager loaded", 3 );
  return ImageManager;
} );