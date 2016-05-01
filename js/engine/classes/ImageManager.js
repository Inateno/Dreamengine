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
  var _loadingImages = null;
  var _indexLoading = 0;
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
        CONFIG.debug.log( "%cno images loaded", -1, "color:red" );
        return;
      }
      
      _loadingImages = imagesDatas;
      _indexLoading = 0;
      
      this.imagesLoaded = 0;
      
      if ( imagesDatas.length === undefined )
      {
        // support for "pools declaration" from DE.PIXI Version
        _loadingImages = [];
        for ( var i in imagesDatas )
          _loadingImages = _loadingImages.concat( imagesDatas[ i ] );
      }
      this.imagesRequested = _loadingImages.length;
      
      if ( _loadingImages.length > 0 )
      {
        this.pushImage( _loadingImages[ 0 ][ 0 ]
                       , _loadingImages[ 0 ][ 1 ]
                       , _loadingImages[ 0 ][ 2 ].length ? _loadingImages[ 0 ][ 2 ] : null
                       , _loadingImages[ 0 ][ 3 ] || _loadingImages[ 0 ][ 2 ]  );
      }
      else
      {
        setTimeout( function()
        {
          States.down( 'isLoadingImages' );
        }, 150 );
      }
      // for ( var i = 0, img; i < imgs.length; ++i )
      // {
      //   img = imgs[ i ];
      //   if ( !img || ( img[ 3 ] || {} ).load === false )
      //     continue;
      //   this.pushImage( img[ 0 ], img[ 1 ], img[ 2 ], img[ 3 ] );
      // }
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
      img.src  = this.folderName + "/" + this.pathPrefix + url + ( extension ? "." + extension : "" );
      img.name = name;
      img.totalFrame = params.totalFrame || 1;
      img.startFrame = params.startFrame || undefined;
      img.endFrame   = params.endFrame || undefined;
      img.totalLine  = params.totalLine || 1;
      img.eachAnim   = params.eachAnim || 0;
      img.isReversed = params.isReversed || false;
      img.isAnimated = params.isAnimated || false;
      img.isPaused   = params.isPaused || false;
      img.isLoop     = ( params.isLoop != undefined ) ? params.isLoop : true;
      img.notRatio   = params.notRatio || false;
      if ( img.totalFrame <= 1 )
      {
        img.isAnimated = false;
      }
      
      img.onload = function()
      {
        if ( _loadingImages && _indexLoading + 1 < _loadingImages.length )
        {
          ImageManager.pushImage( _loadingImages[ ++_indexLoading ][ 0 ]
                                , _loadingImages[ _indexLoading ][ 1 ]
                                , _loadingImages[ _indexLoading ][ 2 ].length ? _loadingImages[ _indexLoading ][ 2 ] : null
                                , _loadingImages[ _indexLoading ][ 3 ] || _loadingImages[ _indexLoading ][ 2 ]  );
        }
        ImageManager.imageLoaded( this );
      }
      
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
      
      /*** Warning
       * removing images by a canvas buffer is faster when drawing it or part of it
       * but it cause issue if the game is loading to much images, and if the buffer just crash 'cause memory
       * the JS API cannot reload it because it's definitively lost
       * with Image only, it's safer, if there is tons of images, the browser will still be able to draw
       * I set the security on 1540px+ images (the most often it's images used for environments, and it's the most laggy)
       * you can decrease this security through config file if you want, but care
       */
      if ( CONFIG.FORCE_BUFFERISATION
        || ( img.width > CONFIG.MIN_SIZE_BUFFER_W && img.height > CONFIG.MIN_SIZE_BUFFER_H ) )
      {
        var buff = new CanvasBuffer( img.width, img.height )
          , cvs = buff.canvas
          , ctx = buff.ctx;
        
        if ( this.imageNotRatio || img.notRatio )
        {
          cvs.width  = cvs.width * this.ratioToConception;
          cvs.height = cvs.height * this.ratioToConception;
        }
        
        cvs.name        = img.name;
        cvs.totalFrame  = img.totalFrame;
        cvs.totalLine   = img.totalLine;
        cvs.startFrame  = img.startFrame || undefined;
        cvs.endFrame    = img.endFrame || undefined;
        cvs.eachAnim    = img.eachAnim;
        cvs.isReversed  = img.isReversed;
        cvs.isAnimated  = img.isAnimated;
        cvs.isPaused    = img.isPaused;
        cvs.isLoop      = img.isLoop;
        cvs.widthFrame  = cvs.width / cvs.totalFrame >> 0;
        cvs.heightFrame = cvs.height / cvs.totalLine >> 0;
        ctx.drawImage( img, 0, 0, cvs.width, cvs.height );
        this.images[ img.name ] = cvs;
      }
      else
      {
        img.widthFrame  = img.width / img.totalFrame >> 0;
        img.heightFrame = img.height / img.totalLine >> 0;
      }
      this.imagesLoaded++;
      
      if ( this.imagesLoaded == this.imagesRequested )
        States.down( 'isLoadingImages', img.name == "loader" );
      Event.trigger( "imageLoaded", this.imagesLoaded, this.imagesRequested, img.name );
    }
  };
  
  CONFIG.debug.log( "ImageManager loaded", 3 );
  return ImageManager;
} );