/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Scene
 * @class a Scene is a world. You push GameObjects inside this world.
 * There is no world Size, just objects inside
 * For rendering convenience it use a PIXI.Container (actually I didn't make Camera but if I do later probably Scene wont need to be a Container)
 * @example Game.scene = new DE.Scene( "Test" );
 */
define( [
  'PIXI'
  , 'DE.MainLoop'
  , 'DE.GameObject'
],
function(
  PIXI
  , MainLoop
  , GameObject
)
{
  function Scene( name )
  {
    PIXI.Container.call( this );
    
    /**
     * @public
     * @memberOf Scene
     * @type {String}
     */
    this.name = name || "NoName-" + ( Date.now() + Math.random() * Date.now() >> 0 );
    
    // TODO - needed ? this.gameObjects = [];
    // TODO this.objectsByTag = {};
    // TODO this.objectsByName = {};
    
    /**
     * if this world is sleeping, update will be ignored
     * @public
     * @memberOf Scene
     * @type {Boolean}
     */
    this.enable = true;
    
    MainLoop.addScene( this );
  }

  Scene.prototype = Object.create( PIXI.Container.prototype );
  Scene.prototype.constructor = Scene;

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
  Scene.prototype.add = function()
  {
    var args = Array.prototype.slice.call( arguments );
    for ( var i = 0; i < args.length; ++i )
    {
      if ( args[ i ].length ) {
        this.add( args[ i ] );
      }
      else {
        this.addOne( args[ i ] );
      }
    }
  };

  /**
   * add one gameObject inside the scene, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf Scene
   * @param {GameObject} gameObject gameObject to add
   * @example myScene.addOne( car );
   */
  Scene.prototype.addOne = function( gameObject )
  {
    // accept only gameObject to avoid errors
    if ( !( gameObject instanceof GameObject ) )
    {
      console.error( "Tried to add something in a scene that is not a GameObject. Please inherit from GameObject" );
      return;
    }
    
    // TODO add in byTags, byNames, pools objects
    
    // add in PIXI Container
    this.addChild( gameObject );
    
    // TODO event trigger "updateChildren"
  };

  /**
   * scene update
   * @protected
   * @memberOf Scene
   */
  Scene.prototype.update = function( time )
  {
    if ( !this.enable ) {
      return;
    }
    
    for ( var i = 0, t = this.children.length, g; i < t; ++i )
    {
      g = this.children[ i ];
      
      if ( !g ) {
        continue;
      }
      
      if ( g.flag !== null ) {
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
      g.update( time /*, this.gameObjects*/ );
    }
    
    // TODO ? // It seems that PIXI Ticker is calling his own requestAnimationFrame, not needed here ?
    // but it could be cool to have Ticker associated to a scene lifetime (PIXI.Ticker can be dis-activated and manually called ?)
    // for ( var i = 0, t = this.timers.length; i < t; ++tk )
    // {
    //   this.timers[ i ].update();
    // }
    
    // TODO ?
    // if ( this.waitSortGameObjects ) {
    //   this.sortGameObjects();
    // }
  };
  
  Scene.prototype.DEName = "Scene";
  return Scene;
} );