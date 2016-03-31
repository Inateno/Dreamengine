/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
**/

define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.GameObject', 'DE.Time', 'DE.MainLoop' ],
function( CONFIG, COLORS, GameObject, Time, MainLoop )
{
  function Scene( name )
  {
    this.DEName = "Scene";
    
    if ( !name )
    {
      return;
    }
    this.name  = name;
    
    this.gameObjects= new Array();
    this.colliders  = new Array();
    
    this.grid = new Array(); /* subdivide the space area ? for check collision */
    this.maxObjectsPerGrid  = 5;
    this.maxGrids = 1
    
    this.cameras = new Array();
    this.maxCameras = 0;
    
    this.freeze  = false;
    this.sleep  = false;
    this.maxObjects = 0;
    this.tickers = new Array();
    
    /***
    * @init
    ***/
    this.init = function()
    {
      MainLoop.addScene( this );
    }
    
    /**
    * @update
    call update from all objects
    **/
    this.update = function()
    {
      for ( var i = 0, t = this.gameObjects.length, g; i < t; ++i )
      {
        g = this.gameObjects[ i ];
        if ( g.flag !== null )
        {
          switch( g.flag )
          {
            case "delete":
              this.delete( i );
              t = this.gameObjects.length;
              continue;
              break;
          }
        }
        
        // on passe les gameObjects présent dans l'espace de l'objet (besoin de couper en plusieurs morceaux)
        g.update( Time.currentTime , this.gameObjects );
      }
      
      for ( var i = 0, t = this.tickers.length; i < t; ++tk )
      {
        this.tickers[ i ].update();
      }
    }
    
    /***
    * @getGameObjects
    ***/
    this.getGameObjects = function()
    {
      return this.gameObjects;
    }
    /***
    * @sortGameObjects
    ***/
    this.sortGameObjects = function()
    {
      this.gameObjects.sort( function( a, b )
      {
        if ( b.position.z == a.position.z )
          return a.zindex - b.zindex;
        return b.position.z - a.position.z;
      } );
      
      for (var i = 0, go; go = this.gameObjects[ i ]; i++ )
      {
        go.childrens.sort( function( a, b )
        {
          return b.position.z - a.position.z;
        } );
      }
    }
    
    /**
    * @add
    add an object on this scene
    **/
    this.add = function( gameObject )
    {
      if ( !( gameObject instanceof GameObject ) )
      {
        console.log( "Please noob, just add GameObjects" );
        return;
      }
      this.gameObjects.push( gameObject );
      gameObject.sceneIndex = this.maxObjects;
      gameObject.scene = this;
      this.maxObjects++;
      this.sortGameObjects();
    }
    
    this.init();
  }
  
  /***
  * @remove
  remove an object on this scene ( not deleted ! )
  ***/
  Scene.prototype.remove = function( gameObject )
  {
    var pos = this.gameObjects.indexOf( gameObject );
    if ( pos == -1 )
    {
      console.log( "Remove gameObject not found", gameObject );
      return;
    }
    
    this.gameObjects.splice( pos, 1 );
    // this.gameObjects.splice( gameObject.sceneIndex, 1 );
    // this.maxObjects--;
    
    this.sortGameObjects();
  }
  
  /***
  * @delete
  ***/
  Scene.prototype.delete = function( object )
  {
    // if its an index
    if ( this.gameObjects[ object ] )
    {
      var go = this.gameObjects[ object ];
        go.killMePlease();
      this.gameObjects[ object ] = null;
      delete go;
      this.gameObjects.splice( object, 1 );
      return;
    }
    var index = this.gameObjects.indexOf( object );
    
    if ( index !== - 1 )
    {
      object.killMePlease();
      this.childrens[ index ] = null;
      this.childrens.splice( index, 1 );
      delete object;
    }
    // this.maxObjects--;
  }
  
  /***
  * @deleteAll
  ***/
  Scene.prototype.deleteAll = function()
  {
    for ( var i = 0, go; go = this.gameObjects[ i ]; i++ )
    {
      go.killMePlease();
      this.gameObjects[ i ] = null;
      delete go;
      this.gameObjects.splice( i, 1 );
    }
    this.maxObjects = 0;
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Scene loaded" );
  }
  return Scene;
} );