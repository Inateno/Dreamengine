/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * An audio tool over howler, provide some simple middleware + direct access to howler sounds
 * @namespace Audio
 */
/**
 * An advanced resource loader. Can load pool of resources, or unload it.
 * Handle images, ready to use spritesImages, json sheets, json particles files or custom files
 * @namespace ImageManagser
 */
define( [ 'PIXI', 'DE.config', 'DE.Events' ],
function( PIXI, config, Events )
{
  /* TODO redefine if used or not 
    PIXI.loader.on( 'complete', function()
    {
      States.down( 'isLoadingImages' );
      Event.trigger( "loadFilesEnd" );
    } );
    
    PIXI.loader.on( 'start', function()
    {
      States.up( 'isLoadingImages' );
      Event.trigger( "loadFilesStart" );
    } );
    */
  
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
    this._waitingPools = []; // cannot load multiple pool in // have to queue
    
    /**
     * main init function, create pool and set baseUrl in an object, used to load things later
     * call ImageManager.loadPool( poolName ) to start loading things
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
          if ( typeof data === "string" ) {
            this.pools[ i ].push( data );
          }
          else if ( data.length && data.push ) {
            
            if ( !data[ 2 ] ) {
              data[ 2 ] = {};
            }
            this.spritesData[ data[ 0 ] ] = {
              totalLine    : data[ 2 ].totalLine || 1
              ,totalFrame  : data[ 2 ].totalFrame || 1
              ,startFrame  : data[ 2 ].startFrame || 0
              ,endFrame    : data[ 2 ].endFrame || data[ 2 ].totalFrame || 1
              ,interval    : data[ 2 ].interval || 16
              ,reversed    : data[ 2 ].reversed || false
              ,loop        : data[ 2 ].loop !== undefined ? data[ 2 ].loop : true
              ,animated    : data[ 2 ].animated !== undefined ? data[ 2 ].animated : true
              ,pingPongMode: data[ 2 ].pingPongMode !== undefined ? data[ 2 ].pingPongMode : false
            };
            this.pools[ i ].push( { name: data[ 0 ], url: data[ 1 ] + "?v" + config.VERSION } );
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
    this.loadPool = function( poolName, customEventName )
    {
      var self = this;
      
      if ( this.pools[ poolName ].length == 0 )
      {
        setTimeout( function()
        {
          self.onComplete( poolName, customEventName );
        }, 500 );
        return;
      }
      
      if ( PIXI.loader.loading ) {
        console.log( "WARN ImageManager: PIXI loader is already loading stuff, this call has been queued" );
        this._waitingPools.push( { name: poolName, customEventName: customEventName } );
      }
      
      PIXI.loader.add( this.pools[ poolName ] )
        .on( "progress", function( loader, resource ) {
          self.onProgress( poolName, loader, customEventName );
        } )
        .load( function() {
          
          PIXI.loader.off( "progress", function( loader, resource ) {
            self.onProgress( poolName, loader, customEventName );
          } )
          self.onComplete( poolName, customEventName );
        } );
    };
    
    this.onProgress = function( poolName, loader, customEventName )
    {
      Events.trigger( "ImageManager-pool-progress"
        , poolName
        , loader.progress.toString().slice( 0, 5 ) );
      Events.trigger( "ImageManager-pool-" + poolName + "-progress"
        , poolName
        , loader.progress.toString().slice( 0, 5 ) );
      Events.trigger( "ImageManager-" + customEventName + "-progress"
        , poolName
        , loader.progress.toString().slice( 0, 5 ) );
    };
    
    this.onComplete = function( poolName, customEventName )
    {
      console.log( "ImageManager load complete: ", poolName );
      Events.trigger( "ImageManager-pool-complete", poolName );
      Events.trigger( "ImageManager-pool-" + poolName + "-loaded" );
      Events.trigger( "ImageManager-" + customEventName + "-loaded" );
      
      // dequeue waiting pools here
      if ( this._waitingPools.length ) {
        var pool = this._waitingPools.shift();
        this.loadPool( pool.name, pool.customEventName );
      }
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
          ,interval  : data.interval || 16
          ,reversed  : data.reversed || false
          ,loop      : data.loop !== undefined ? data.loop : true
          ,animated  : data.animated !== undefined ? data.animated : true
        };
      }
      PIXI.loader.add( data ).load( this.onComplete );
    };
    
    /**
     * unload a complete pool (clean memory)
     */
    this.unloadPool = function( poolName )
    {
      var pool = this.pools[ poolName ];
      for ( var i = 0, res, t = pool.length; i < t; ++i )
      {
        res = pool[ i ];
        
        PIXI.utils.TextureCache[
          PIXI.loader.resources[
            res.name || res
          ].url
        ].destroy( true );
        
        // needed ?
        // PIXI doesn't remove it from resources after the texture has been destroyed
        // what is the best practice for this ?
        delete PIXI.loader.resources[ pool[ i ].name || pool[ i ] ];
      }
    };
  };
  
  return ImageManager;
} );