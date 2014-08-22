/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/* TODO - I was working on physic system by adding "colliders" and grids stuff inside the Scene
 * but I'm still working on */

/**
 * @constructor Scene
 * @class a Scene is a world. You push GameObjects inside this world.
 * There is no world Size, just objects inside
 * @example Game.scene = new DE.Scene( "Test" );
 */
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.GameObject', 'DE.Time', 'DE.MainLoop', 'DE.Event' ],
function( CONFIG, COLORS, GameObject, Time, MainLoop, Event )
{
  function Scene( name )
  {
    /**
     * @public
     * @memberOf Scene
     * @type {String}
     */
    this.name = name || "NoName-" + ( Date.now() + Math.random() * Date.now() >> 0 );
    
    /**
     * store GameObjects
     * @protected
     * @memberOf Scene
     * @type {Array}
     */
    this.gameObjects = new Array();
    
    // TODO - include default physic
      /*this.colliders = new Array();
        //physics attributes by using an octree with colliders inside
        this.maxObjectsPerGrid = 5;
        this.grid     = new Array(); // TODO - octree for collisions ? WIP
        this.maxGrids = 1
        this.gravity  = { x: 0, y: 1 };
        this.airFrictions = 0.97;
        */
    
    /**
     * if this world is sleeping, update will be ignored
     * @public
     * @memberOf Scene
     * @type {Boolean}
     */
    this.sleep = false;
    
    // TODO - used or not ?
      // actually not useful (simply a quick access to gameObjects.length) but I want to this to create octree
      this.maxObjects = 0;
    
    /**
     * store timers
     * @public
     * @memberOf Scene
     * @type {Array}
     */
    this.timers = new Array();
    
    /**
     * store global events, exist for Down, Move, Up and Click with all versions of Last
     * @private
     * @memberOf Scene
     * @type {Object}
     */
    this.onGlobalMouseDown      = {};
    this.onLastGlobalMouseDown  = {};
    this.onGlobalMouseMove      = {};
    this.onLastGlobalMouseMove  = {};
    this.onGlobalMouseUp        = {};
    this.onLastGlobalMouseUp    = {};
    this.onGlobalMouseClick     = {};
    this.onLastGlobalMouseClick = {};
    
    /**
     * add the scene in the MainLoop
     * @private
     * @memberOf Scene
     */
    this._init = function()
    {
      MainLoop.addScene( this );
    };
    
    /**
     * scene update
     * @protected
     * @memberOf Scene
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
      
      for ( var i = 0, t = this.timers.length; i < t; ++tk )
        this.timers[ i ].update();
      
      if ( this.waitSortGameObjects )
        this.sortGameObjects();
    };
    
    /**
     * Sort gameObjects in the scene along z axis or using z-index for objects on the same same plan.
     * If z and z-index are same, objects are sorted from lower x to higher.
     * You shouldn't call this method directly because engine do it for you, but in some case it's useful to do
     * @protected
     * @memberOf Scene
     */
    this.sortGameObjects = function()
    {
      this.gameObjects.sort( function( a, b )
      {
        if ( b.position.z == a.position.z )
          if ( b.zindex == a.zindex )
            return b.position.x - a.position.x;
          else
            return a.zindex - b.zindex;
        else
          return b.position.z - a.position.z;
      } );
      
      for ( var i = 0, go; go = this.gameObjects[ i ]; ++i )
        go.sortChildrens();
      this.waitSortGameObjects = false;
    };
    
    /**
     * add all given gameObjects inside the scene, if you add only one gameObject, call addOne
     * you can call this method with array, single object, or multi arguments objects, look at examples.
     * @public
     * @memberOf Scene
     * @param {GameObject} gameObject gameObject to add
     * @example myScene.add( car ); // just one object, you should call addOne instead
     * @example myScene.add( car, car2, car3, banana, turtle ); // using multi arguments
     * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
     * myScene.add( myArray ); // then call add with array directly
     * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
     * var myArray2 = [ object4, object5, object6 ]; // declare a second array with object inside as you wish
     * myScene.add( myArray, myArray2 ); // then call add with array and multi arguments
     */
    this.add = function( gameObject )
    {
      var args = Array.prototype.slice.call( arguments );
      for ( var i = 0; i < args.length; ++i )
      {
        if ( args[ i ].length )
        {
          for ( var o = 0, m = args[ i ].length || 1; o < m; ++o )
            this.addOne( args[ i ][ o ] );
        }
        else
          this.addOne( args[ i ] );
      }
    };
    
    /**
     * add one gameObject inside the scene, call this one if you have only 1 gameObject to add, it's faster
     * @public
     * @memberOf Scene
     * @param {GameObject} gameObject gameObject to add
     * @example myScene.addOne( car );
     */
    this.addOne = function( gameObject )
    {
      if ( !( gameObject instanceof GameObject ) )
      {
        CONFIG.debug.log( "%cIt's not or not herits from a GameObjects", 1, "color:red" );
        return;
      }
      gameObject.scene = this;
      this.gameObjects.push( gameObject );
      
      // nope, when sort the scene this is not correct anymore
      // gameObject.sceneIndex = this.maxObjects;
      
      ++this.maxObjects;
      this.waitSortGameObjects = true;
    };
    
    Event.addEventComponents( this );
    this._init();
  }
  
  Scene.prototype = Scene.prototype || {};
  Event.addEventCapabilities( Scene );
  
  /**
   * remove global events binded
   * @memberOf Scene
   * @protected
   * @param {GameObject} object
   */
  Scene.prototype.cleanObjectBinding = function( object )
  {
    delete this.onGlobalMouseDown[ object.id ];
    delete this.onLastGlobalMouseDown[ object.id ];
    delete this.onGlobalMouseMove[ object.id ];
    delete this.onLastGlobalMouseMove[ object.id ];
    delete this.onGlobalMouseUp[ object.id ];
    delete this.onLastGlobalMouseUp[ object.id ];
  };
  
  /**
   * Remove an object on this scene (it is not deleted !).
   * @public
   * @memberOf Scene
   * @param {GameObject} object can be the index of the GameObject in the gameObjects array
   */
  Scene.prototype.remove = function( object )
  {
    this.cleanObjectBinding( object );
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
  };
  
  /**
   * Delete and remove an object in the scene.
   * You should prefer askToKill GameObject's method because it's safer (if you know what you do go crazy).
   * @public
   * @memberOf Scene
   * @param {GameObject} object can be the index of the GameObject in the gameObjects array
   */
  Scene.prototype.delete = function( object )
  {
    // if its an index
    if ( this.gameObjects[ object ] )
      this.gameObjects[ object ].killMePlease();
    else
      object.killMePlease();
    this.remove( object );
  };
  
  /**
   * Delete and remove all gameObjects in the scene
   * @public
   * @memberOf Scene
   */
  Scene.prototype.deleteAll = function()
  {
    var objs = this.gameObjects;
    while ( objs.length > 0 )
      this.delete( 0 );
    this.maxObjects = 0;
  };
  Scene.prototype.DEName = "Scene";
  
  CONFIG.debug.log( "Scene loaded", 3 );
  return Scene;
} );