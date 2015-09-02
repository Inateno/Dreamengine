/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@ImageManager
**/
define( [ 'PIXI', 'DE.CONFIG', 'DE.States', 'DE.Event' ],
function( PIXI, CONFIG, States, Event )
{
  PIXI.loader.on( 'complete', function()
  {
    States.down( 'isLoadingImages' );
    Event.trigger( "loadFilesEnd" );
  } );
  PIXI.loader.on( 'progress', function()
  {
    Event.trigger( "loadFilesProgress", ( PIXI.loader.progress / PIXI.loader._numToLoad * 100 ).toString().slice( 0, 5 ) );
  } );
  PIXI.loader.on( 'start', function()
  {
    States.up( 'isLoadingImages' );
    Event.trigger( "loadFilesStart" );
  } );
  
  var _loadingImages = null;
  var _indexLoading = 0;
  var ImageManager = new function()
  {
    this.DEName = "ImageManager";
    
    // quality var define what we need and how to use it
    this.pathPrefix        = "";
    this.imageNotRatio     = false;
    this.ratioToConception = 1;
    
    this.baseUrl           = "img/";
    
    this.spritesData = {}; // store data for SpriteRenderer
    
    /**
     * main init function, create pool and set baseUrl
     */
    this.init = function( baseUrl, pools )
    {
      this.baseUrl = baseUrl;
      PIXI.loader.baseUrl = baseUrl;
      
      this.pools = pools;
      
      var p, data;
      for ( var i in pools )
      {
        p = pools[ i ];
        this.pools[ i ] = [];
        for ( var n = 0; n < p.length; ++n )
        {
          data = p[ n ];
          if ( typeof data === "string" )
          {
            this.pools[ i ].push( data );
          }
          else if ( data.length && data.push )
          {
            if ( data[ 2 ] && ( data[ 2 ].totalFrame || data[ 2 ].totalLine ) )
            {
              this.spritesData[ data[ 0 ] ] = {
                totalLine  : data[ 2 ].totalLine || 1
                ,totalFrame: data[ 2 ].totalFrame || 1
                ,startFrame: data[ 2 ].startFrame || 0
                ,endFrame  : data[ 2 ].endFrame || data[ 2 ].totalFrame || 1
                ,eachAnim  : data[ 2 ].eachAnim || 16
                ,isReversed: data[ 2 ].isReversed || false
                ,isLoop    : data[ 2 ].isLoop !== undefined ? data[ 2 ].isLoop : true
                ,isAnimated: data[ 2 ].isAnimated !== undefined ? data[ 2 ].isAnimated : true
              };
            }
            this.pools[ i ].push( { name: data[ 0 ], url: data[ 1 ] } );
          }
          else
          {
            console.error( "File format not recognized, make sure you follow the guidelines", data );
          }
        }
      }
    };
    
    /**
     * load a complete pool in memory
     */
    this.loadPool = function( poolId )
    {
      PIXI.loader.add( this.pools[ poolId ] ).load( this.onComplete );
    };
    
    /**
     * load a simple object
     */
    this.load = function( data )
    {
      if ( data.totalFrame )
      {
        this.spritesData[ data.name ] = {
          totalLine  : data.totalLine || 1
          ,totalFrame: data.totalFrame || 1
          ,startFrame: data.startFrame || 0
          ,endFrame  : data.endFrame || data.totalFrame || 1
          ,eachAnim  : data.eachAnim || 16
          ,isReversed: data.isReversed || false
          ,isLoop    : data.isLoop !== undefined ? data.isLoop : true
          ,isAnimated: data.isAnimated !== undefined ? data.isAnimated : true
        };
      }
      PIXI.loader.add( data ).load( this.onComplete );
    };
    
    /**
     * unload a complete pool (clean memory)
     */
    this.unloadPool = function( poolId )
    {
      var pool = this.pools[ poolId ];
      for ( var i = 0, t = pool.length, name; i < t; ++i )
      {
        PIXI.utils.TextureCache[ PIXI.loader.resources[ pool[ i ].name || pool[ i ] ].url ].destroy( true );
        // needed ? does PIXI do it ?
        delete PIXI.loader.resources[ pool[ i ].name || pool[ i ] ];
      }
    };
    
    // OLD
    // /****
    //  * arrayLoader@void( imagesDatas )
    //   add all images in the array and load them
    //  */
    // this.arrayLoader = function( imagesDatas )
    // {
    //   if ( !imagesDatas )
    //   {
    //     CONFIG.debug.log( "%cno images loaded", 1, "color:red" );
    //     return;
    //   }
      
    //   _loadingImages = imagesDatas;
    //   _indexLoading = 0;
      
    //   // var imgs = imagesDatas;
    //   this.imagesLoaded = 0;
    //   this.imagesRequested = imagesDatas.length;
    //   this.pushImage( imagesDatas[ 0 ][ 0 ], imagesDatas[ 0 ][ 1 ], imagesDatas[ 0 ][ 2 ], imagesDatas[ 0 ][ 3 ])
      
    //   // for ( var i = 0, img; i < imgs.length; ++i )
    //   // {
    //   //   img = imgs[ i ];
    //   //   if ( !img || ( img[ 3 ] || {} ).load === false )
    //   //     continue;
    //   //   this.pushImage( img[ 0 ], img[ 1 ], img[ 2 ], img[ 3 ] );
    //   // }
    //   if ( imagesDatas.length == 0 )
    //     States.down( 'isLoadingImages' );
    // }
    
    // /****
    //  * @pushImage
    //   - name:String - url:String - extension:String - params:Object -
    //   push an image in this.images and load it
    //  */
    // this.pushImage = function( name, url, extension, params )
    // {
    //   params = params || {};
      
    //   this.images[ name ] = new Image();
      
    //   var img  = this.images[ name ];
    //   img.src  = this.folderName + "/" + this.pathPrefix + url + "." + extension;
    //   img.name = name;
    //   img.totalFrame = params.totalFrame || 1;
    //   img.startFrame = params.startFrame || undefined;
    //   img.endFrame   = params.endFrame || undefined;
    //   img.totalLine  = params.totalLine || 1;
    //   img.eachAnim   = params.eachAnim || 0;
    //   img.isReversed = params.isReversed || false;
    //   img.isAnimated = params.isAnimated || false;
    //   img.isPaused   = params.isPaused || false;
    //   img.isLoop     = ( params.isLoop != undefined ) ? params.isLoop : true;
    //   img.notRatio   = params.notRatio || false;
    //   if ( img.totalFrame <= 1 )
    //   {
    //     img.isAnimated = false;
    //   }
      
    //   img.onload = function()
    //   {
    //     if ( _loadingImages && _indexLoading + 1 < _loadingImages.length )
    //     {
    //       ImageManager.pushImage( _loadingImages[ ++_indexLoading ][ 0 ], _loadingImages[ _indexLoading ][ 1 ]
    //         , _loadingImages[ _indexLoading ][ 2 ], _loadingImages[ _indexLoading ][ 3 ] );
    //     }
    //     ImageManager.imageLoaded( this );
    //   }
      
    //   States.up( 'isLoadingImages' );
    //   CONFIG.debug.log( "LoadImage " + name, 3 );
    // }
    
    // ***
    //  * @imageLoaded
    //   - img:Image reference
    //   called when an image is loaded - resize the image to the good size if current config isNotRatio
     
    // this.imageLoaded = function( img )
    // {
    //   CONFIG.debug.log( "Image:" + img.name + " correctly loaded", 3 );
      
    //   /*** Warning
    //    * removing images by a canvas buffer is faster when drawing it or part of it
    //    * but it cause issue if the game is loading to much images, and if the buffer just crash 'cause memory
    //    * the JS API cannot reload it because it's definitively lost
    //    * with Image only, it's safer, if there is tons of images, the browser will still be able to draw
    //    * I set the security on 1540px+ images (the most often it's images used for environments, and it's the most laggy)
    //    * you can decrease this security through config file if you want, but care
    //    */
    //   // if ( CONFIG.FORCE_BUFFERISATION
    //   //   || ( img.width > CONFIG.MIN_SIZE_BUFFER_W && img.height > CONFIG.MIN_SIZE_BUFFER_H ) )
    //   // {
    //   //   var buff = new CanvasBuffer( img.width, img.height )
    //   //     , cvs = buff.canvas
    //   //     , ctx = buff.ctx;
        
    //   //   if ( this.imageNotRatio || img.notRatio )
    //   //   {
    //   //     cvs.width  = cvs.width * this.ratioToConception;
    //   //     cvs.height = cvs.height * this.ratioToConception;
    //   //   }
        
    //   //   cvs.name        = img.name;
    //   //   cvs.totalFrame  = img.totalFrame;
    //   //   cvs.totalLine   = img.totalLine;
    //   //   cvs.startFrame  = img.startFrame || undefined;
    //   //   cvs.endFrame    = img.endFrame || undefined;
    //   //   cvs.eachAnim    = img.eachAnim;
    //   //   cvs.isReversed  = img.isReversed;
    //   //   cvs.isAnimated  = img.isAnimated;
    //   //   cvs.isPaused    = img.isPaused;
    //   //   cvs.isLoop      = img.isLoop;
    //   //   cvs.widthFrame  = cvs.width / cvs.totalFrame >> 0;
    //   //   cvs.heightFrame = cvs.height / cvs.totalLine >> 0;
    //   //   ctx.drawImage( img, 0, 0, cvs.width, cvs.height );
    //   //   this.images[ img.name ] = cvs;
    //   // }
    //   // else
    //   // {
    //     img.widthFrame  = img.width / img.totalFrame >> 0;
    //     img.heightFrame = img.height / img.totalLine >> 0;
    //   // }
    //   this.imagesLoaded++;
      
    //   if ( this.imagesLoaded == this.imagesRequested )
    //     States.down( 'isLoadingImages', img.name == "loader" );
    //   Event.trigger( "imageLoaded", this.imagesLoaded, this.imagesRequested, img.name );
    // }
  };
  
  CONFIG.debug.log( "ImageManager loaded", 3 );
  return ImageManager;
} );