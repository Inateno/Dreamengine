/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* Scene( name )
 a Scene is a world. You push GameObjects inside this world.
 There is no world Size, just objects inside
 TODO - I was working on physic system by adding "colliders" and grids stuff inside the Scene
 but I'm still working on
**/
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.GameObject', 'DE.Time', 'DE.MainLoop' ],
function( CONFIG, COLORS, GameObject, Time, MainLoop )
{
  function Scene( name )
  {
    this.name  = name || "NoName-" + Date.now() + Mant.random() * Date.now() >> 0;
    
    this.gameObjects= new Array();
    
    // physics attributes by using an octree with colliders inside
    /*this.colliders = new Array();
    this.maxObjectsPerGrid = 5;
    this.grid     = new Array(); // TODO - octree for collisions ? WIP
    this.maxGrids = 1*/
    
    /*this.cameras    = new Array();
    this.maxCameras = 0;*/
    
    // if this worl is sleeping, update will be ignored
    this.sleep      = false;
    this.maxObjects = 0;
    this.tickers    = new Array(); // tickers can be stored in the world directly
    
    /****
     * init@void
      add this scene in the MainLoop
     */
    this.init = function()
    {
      MainLoop.addScene( this );
    }
    
    /****
     * update@void
      call update from all objects
     */
    this.update = function()
    {
      if ( this.sleep )
        return;
      for ( var i = 0, t = this.gameObjects.length, g; i < t; ++i )
      {
        g = this.gameObjects[ i ];
        if ( !g )
          continue;
        if ( g.flag !== null )
        {
          switch( g.flag )
          {
            case "delete":
              this.delete( i );
              --t;
              continue;
              break;
          }
        }
        // need an octree here for physic ?
        // passing other gameObjects for physic ? (still looking how to do it)
        g.update( Time.currentTime/*, this.gameObjects*/ );
      }
      
      // independant ticker for time counting
      for ( var i = 0, t = this.tickers.length; i < t; ++tk )
      {
        this.tickers[ i ].update();
      }
    }
    
    /****
     * getGameObjects@Array
      previously gameObjects was private, still here to maintain retro-compatibility
      but will be removed
     */
    this.getGameObjects = function()
    {
      return this.gameObjects;
    }
    
    /****
     * sortGameObjects@void
      sort gameObjects in the world depend on z axe and z-index
     */
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
          if ( b.position.z == a.position.z )
            return a.zindex - b.zindex;
          return b.position.z - a.position.z;
        } );
      }
    }
    
    /****
     * add@void
      add an object in this scene
     */
    this.add = function( gameObject )
    {
      if ( !( gameObject instanceof GameObject ) )
      {
        CONFIG.debug.log( "%cIt's not or not herits from a GameObjects", 1, "color:red" );
        return;
      }
      this.gameObjects.push( gameObject );
      // nope, when sort the scene this is not correct anymore
      // gameObject.sceneIndex = this.maxObjects;
      gameObject.scene = this;
      ++this.maxObjects;
      this.sortGameObjects();
    }
    
    this.init();
  }
  
  Scene.prototype = Scene.prototype || {};
  /****
   * remove@void
    remove an object on this scene ( not deleted ! )
   */
  Scene.prototype.remove = function( object )
  {
    if ( this.gameObjects[ object ] )
    {
      this.gameObjects.splice( object, 1 );
    }
    else
    {
      var pos = this.gameObjects.indexOf( object );
      if ( pos == -1 )
      {
        CONFIG.debug.log( "%cRemove gameObject not found", 1, "color:orange", object );
        return;
      }
      this.gameObjects.splice( pos, 1 );
      // this.gameObjects.splice( object.sceneIndex, 1 ); // nope sceneIndex can change
    }
    this.maxObjects--;
  }
  
  /****
   * delete@void
    delete and remove an object in the scene
   */
  Scene.prototype.delete = function( object )
  {
    // if its an index
    if ( this.gameObjects[ object ] )
      this.gameObjects[ object ].killMePlease();
    else
      object.killMePlease();
    this.remove( object );
  }
  
  /****
   * deleteAll@void
    delete and remove all gameObjects in the scene
   */
  Scene.prototype.deleteAll = function()
  {
    for ( var i = 0, go; go = this.gameObjects[ i ]; i++ )
    {
      this.delete( i );
    }
    this.maxObjects = 0;
  }
  Scene.prototype.DEName = "Scene";
  
  CONFIG.debug.log( "Scene loaded", 3 );
  return Scene;
} );