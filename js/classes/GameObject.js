function GameObject( params )
{
  var _params = params || {};
  
  PIXI.Container.call( this );
  
  this.position.set( _params.x || 0, _params.y || 0 );
  delete _params.x;
  delete _params.y;
  
  this.vector2 = new Vector2( this.x, this.y, this );
  
  /**
   * If false, the object wont be updated anymore (but still renderer).
   *
   * @public
   * @member {DE.GameObject}
   * @type {Boolean}
   */
  this.updatable = true;
  
  /**
   * @readOnly
   * @member {DE.GameObject}
   * @type {Array-GameObject}
   */
  this.gameObjects = params.gameObjects || [];
  
  /**
   * @readOnly
   * @memberOf GameObject
   * @type {Object}
   */
  this._automatisms = {};
  
  /**
   * @private
   * used to make distinction between gameObject and pure PIXI DisplayObject
   * @memberOf GameObject
   * @type {Boolean}
   */
  this._isGameObject = true;
  
  this.renderers = [];
  
  if ( _params.renderer ) {
    this.addRenderer( _params.renderer );
    delete params.renderer;
  }
  
  if ( _params.renderers ) {
    for ( var i = 0; i < _params.renderers.length; ++i )
    {
      this.addRenderer( _params.renderers[ i ] );
    }
    delete _params.renderers;
  }
  
  if ( config.DEBUG ) {
    this._createDebugRenderer();
  }
  
  for ( var i in _params )
  {
    this[ i ] = _params[ i ];
  }
}

GameObject.prototype = Object.create( PIXI.Container.prototype );
GameObject.prototype.constructor = GameObject;

Object.defineProperties( GameObject.prototype, {
  /**
   * @public
   * if false, object will stop being rendered and stop being updated
   * @memberOf GameObject
   * @type {Boolean}
   */
  enable: {
    get: function()
    {
      return this.updatable || this.visible;
    }
    , set: function( value )
    {
      // TODO ? this is useful for dynamic pools (feature incoming)
      // if ( this.enable != value )
      //   this.trigger( value ? 'active' : 'unactive' );
      
      this.updatable  = value;
      this.visible    = value;
    }
  }
  
  , rotation: {
    get: function()
    {
        return this.transform.rotation;
    },
    set: function set(value) // eslint-disable-line require-jsdoc
    {
      this.vector2._updateRotation( value );
      this.transform.rotation = value;
    }
  }
} );

GameObject.prototype._createDebugRenderer = function()
{
  if ( this._debugRenderer ) {
    console.error( "GameObject._createDebugRenderer was called but _debugRenderer already exist" );
    return;
  }
  
  this._debugRenderer = new RectRenderer(
    [
      { beginFill: "0x00FF00" }
      , { drawRect: [ 0, 0, 20, 2 ] }
      , { beginFill: "0xFF0000" }
      , { drawRect: [ 0, 0, 2, 20 ] }
    ]
  );
  this.addChild( this._debugRenderer );
}

GameObject.prototype._destroyDebugRenderer = function()
{
  if ( !this._debugRenderer ) {
    console.error( "GameObject._destroyDebugRenderer was called without _debugRenderer instantiated" );
    return;
  }
  
  this.removeChild( this._debugRenderer );
  this._debugRenderer.destroy( { children: true, texture: true, baseTexture: true } );
  this._debugRenderer = null;
}

/**
 * move gameObject with a vector 2
 * @memberOf GameObject
 * @public
 * @param {Vector2} vector2
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 * @example myObject.translate( { "x": 10, "y": 5 }, false );
 */
GameObject.prototype.translate = function( pos, absolute, ignoreDeltaTime )
{
  this.vector2.translate( pos, absolute, ignoreDeltaTime );
  return this;
};
/**
 * move gameObject along x axe
 * @public
 * @memberOf GameObject
 * @param {Float} distance
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 */
GameObject.prototype.translateX = function( distance, absolute, ignoreDelta )
{
  this.translate( { x: distance, y: 0 }, absolute, ignoreDelta );
  return this;
};
/**
 * move gameObject along y axe
 * @public
 * @memberOf GameObject
 * @param {Float} distance
 * @param {Boolean} absolute
 * if absolute, object will move on world axis instead this own axis
 */
GameObject.prototype.translateY = function( distance, absolute, ignoreDelta )
{
  this.translate( { x: 0, y: distance }, absolute, ignoreDelta );
  return this;
};

/**
 * quick access to position.rotate
 * @public
 * @memberOf GameObject
 * @param {Float} angle
 */
GameObject.prototype.rotate = function( angle, ignoreDelta )
{
  this.vector2.rotate( angle, ignoreDelta );
};

/**
 * rotate the GameObject to look at the given 2D position
 * @public
 * @memberOf GameObject
 * @param {Vector2/GameObject} vector2
 * @param {angleOffset}
 * can be a simple position x-y
 */
GameObject.prototype.lookAt = function( vector2, angleOffset )
{
  var origin = { x: 0, y: 0 };
  var otherPos = vector2.toGlobal ? vector2.toGlobal( origin ) : vector2;
  this.rotation = this.vector2.getAngle( otherPos ) + ( angleOffset || 0 );
  return this;
};

GameObject.prototype.moveTo = function()
{
  
}
GameObject.prototype.applyMoveTo = function()
{
  
}

GameObject.prototype.addRenderer = function( rd )
{
  if ( rd.anchor ) {
    rd.anchor.set( 0.5, 0.5 );
  }
  
  this.renderers.push( rd );
  this.addChild( rd );
};

/**
 * add all given gameObjects as children's, if you add only one gameObject, call addOne
 * you can call this method with array, single object, or multi arguments objects, look at examples.
 * @public
 * @memberOf GameObject
 * @param {GameObject} gameObject gameObject to add
 * @example myObject.add( car ); // just one object, you should call addOne instead
 * @example myObject.add( car, car2, car3, banana, turtle ); // using multi arguments
 * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
 * myObject.add( myArray ); // then call add with array directly
 * @example var myArray = [ object1, object2, object3 ]; // declare an array with object inside as you wish
 * var myArray2 = [ object4, object5, object6 ]; // declare a second array with object inside as you wish
 * myObject.add( myArray, myArray2 ); // then call add with array and multi arguments
 */
GameObject.prototype.add = function()
{
  var args = Array.prototype.slice.call( arguments );
  for ( var i = 0; i < args.length; ++i )
  {
    if ( args[ i ].length !== undefined ) {
      for ( var o = 0, m = args[ i ].length || 0; o < m; ++o )
      {
        this.addOne( args[ i ][ o ] );
      }
    }
    else {
      this.addOne( args[ i ] );
    }
  }
  // this.sortChildren();
};

/**
 * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
 * @public
 * @memberOf GameObject
 * @param {GameObject} gameObject gameObject to add
 * @example myObject.addOne( car );
 */
GameObject.prototype.addOne = function( object )
{
  if ( !( object instanceof GameObject ) ) {
    throw new Error( "DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please" );
    return;
  }
  
  if ( object.parent !== undefined ) {
    object.parent.remove( object );
  }
  
  this.gameObjects.push( object );
  this.addChild( object );
  
  if ( CONFIG.DEBUG ) {
    object._createDebugRender();
  }
};

/**
 * remove a the given child in this GameObject gameObjects
 * also call PIXI.removeChild
 * @public
 * @memberOf GameObject
 * @param {GameObject} object
 * object reference
 */
GameObject.prototype.remove = function( object )
{
  if ( isNaN( object ) ) {
    var index = this.gameObjects.indexOf( object );
    
    if ( index !== - 1 ) {
      this.gameObjects.splice( index, 1 );
      this.removeChild( object );
    }
  }
  else {
    this.gameObjects.splice( object, 1 );
    this.removeChildAt( object );
  }
};