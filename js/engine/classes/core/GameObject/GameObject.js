/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor GameObject
 * @class The core of the engine, all is based on GameObjects
 * They can get renderers, collider (can add more than one but not in an array)
 * You can make groups by adding a GameObject to an other (no recursive limit but be prudent with that,
 * I tried a 5 levels hierarchy and this work perfectly, but you shouldn't have to make a lot)
 * @param {object} params - All parameters are optional
 * @author Inateno
 * @example // the most simple example
 * var ship = new DE.GameObject();
 * @example // with positions
 * var ship = new DE.GameObject( { "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player" } );
 * @example // a complete GameObject with a sprite and a CircleCollider
 * var ship = new DE.GameObject( {
 *   "x": 100, "y": 200, "zindex": 1, "name": "ship", "tag": "player"
 *   ,"renderers": [ new DE.SpriteRenderer( { "spriteName": "ship", "offsetY": 100 } ) ]
 *   ,"collider": new DE.CircleCollider( 60, { "offsetY": 50 } )
 * } );
 * @property {String} [id="0-999999999"] the gameObject id
 * @property {String} [name="noname"] use name to detect precise type (example player)
 * @property {String} [tag="none"] use tags for quick type recognition (example characters)
 * @property {GameObject} [parent=null] if you want to set it a parent on creation
 * @property {Array-GameObject} [childrens=[]] if you want to give childs on creation
 * @property {Vector2} [position] if you give a Vector2, this have to be Vector2 class not a nested object
 * @property {Float} [x=0] x position
 * @property {Float} [y=0] y position
 * @property {Float} [z=0] z position
 * @property {Int} [zindex=0] zindex to order the same z axis objects
 * @property {Renderer} [renderer] give a renderer
 * @property {Array-Renderer} [renderers] give some renderers
 * @property {Collider} [collider]
 * @property {RigidBody} [rigidbody] work in progress
 */
define( [ 'DE.Vector2', 'DE.GameObject.render', 'DE.GameObject.update', 'DE.CONFIG', 'DE.Sizes', 'DE.Event', 'DE.Time' ],
function( Vector2, render, update, CONFIG, Sizes, Event, Time )
{
  var PI = Math.PI;
  function GameObject( params )
  {
    params    = params || {};
    
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.id      = params.id || Math.random() * 999999999 >> 0;
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.name    = params.name;
    /**
     * @public
     * @memberOf GameObject
     * @type {String}
     */
    this.tag     = params.tag;
    /**
     * @public
     * @memberOf GameObject
     * @type {Boolean}
     */
    this.enable = true;
    /**
     * @protected
     * @memberOf GameObject
     * @type {Scene}
     */
    this.scene   = null;
    /**
     * @private
     * @memberOf GameObject
     * @type {Object}
     */
    this.killArgs= {};
    
    // TODO - define if stay or not
      // this.parentPosition = null;
      this.sceneIndex = 0;
    
    /**
     * @public
     * @memberOf GameObject
     * @type {GameObject}
     */
    this.parent = params.parent || undefined;
    
    /**
     * @public
     * @memberOf GameObject
     * @type {Int}
     */
    this.zindex = params.zindex || 0;
    
    /**
     * set true will automatically change cursor to pointer on over, and remove it on not over
     * the GameObject must have a collider
     * @public
     * @memberOf GameObject
     * @type {Bool}
     */
    this.cursorOnOver = params.cursorOnOver || false;
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Array-GameObject}
     */
    this.childrens = params.childrens || new Array();
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Vector2}
     */
    this.position = params.position || new Vector2( params.x || 0, params.y || 0, params.z || 0 );
    
    /**
     * @private
     * @memberOf GameObject
     * @type {Object}
     */
    this.automatism = {};
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {String}
     */
    this.flag = null;
    
    /**
     * register which cursor is over (used to fire Enter and Leave events)
     * @protected
     * @memberOf GameObject
     * @type {Array}
     */
    this.indexMouseOver = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    
    /**
     * register if moved, can be used for collisions, advanced buffers
     * @protected
     * @memberOf GameObject
     * @type {Boolean}
     */
    this.isMoved = false;
    
    /**
     * @private
     * @memberOf GameObject
     * @type {Sizes}
     */
    this.biggerOffset = new Sizes( 1, 1, 1, 1 );
    
    /**
     * quick access to renderers[ 0 ] (in 90% of cases we use the one renderer)
     * @protected
     * @memberOf GameObject
     * @type {Renderer}
     */
    this.renderer = undefined;
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Array-Renderer}
     */
    this.renderers  = new Array();
    if ( params.renderers && params.renderers.length > 0 )
    {
      for ( var i = 0, r; r = params.renderers[ i ]; ++i )
        this.addRenderer( r );
    }
    if ( params.renderer )
      this.addRenderer( params.renderer );
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {Collider}
     */
    this.collider = null;
    if ( params.collider )
      this.setCollider( params.collider )
    
    /**
     * @protected
     * @memberOf GameObject
     * @type {RigidBody}
     */
    this.rigidbody  = params.rigidbody || undefined;
    if ( this.rigidbody && this.rigidbody.gameObject != this )
      this.rigidbody.gameObject = this;
    
    if ( params.create )
    {
      for ( var i in params.create )
        if ( !this[ i ] )
          this[ i ] = params.create[ i ];
    }
    Event.addEventComponents( this );
  };
  
  GameObject.prototype = { constructor: GameObject };
  
  
  /**
   * create a shake with given range
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Int} xRange max X gameObject will move to shake
   * @param {Int} yRange max Y gameObject will move to shake
   * @param {Int} [duration=500] time duration
   * @example // shake with 10-10 force during 1sec
   * player.shake( 10, 10, 1000 );
   */
  GameObject.prototype.shake = function( xRange, yRange, duration )
  {
    this.shakeData = {
      // "startedAt" : Date.now()
      "duration"  : duration || 500
      ,"xRange"   : xRange
      ,"yRange"   : yRange
      ,"prevX"    : this.shakeData ? this.shakeData.prevX : 0
      ,"prevY"    : this.shakeData ? this.shakeData.prevY : 0
    };
  };
  
  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyShake = function()
  {
    if ( !this.shakeData )
      return;
    
    var shake = this.shakeData;
    // restore previous shake
    this.position.x -= shake.prevX;
    this.position.y -= shake.prevY;
    this.shakeData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    // old way - Date.now() - this.shakeData.startedAt > this.shakeData.duration )
    if ( this.shakeData.duration <= 0 )
    {
      delete this.shakeData;
      return;
    }
    
    shake.prevX = - ( Math.random() * shake.xRange ) + ( Math.random() * shake.xRange ) >> 0;
    shake.prevY = - ( Math.random() * shake.yRange ) + ( Math.random() * shake.yRange ) >> 0;
    
    this.position.x += shake.prevX;
    this.position.y += shake.prevY;
  };
  
  /**
   * give a target to this gameObject, then it will focus it until you changed or removed it
   * you can lock independent axes, and set offsets
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject is the target to focus on
   * @param {Object} [params] optional parameters, set offsets or lock
   * @example // create a fx for your ship, decal a little on left, and lock y
   * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
   */
  GameObject.prototype.focus = function( gameObject, params )
  {
    params = params || {};
    this.target = gameObject;
    this.focusLock  = params.lock || {};
    this.focusOffset= params.offsets || { x: 0, y: 0 };
  };
  
  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  GameObject.prototype.applyFocus = function()
  {
    if ( !this.target )
      return;
    var pos = this.target.position;
    if ( this.target.getPos )
      pos = this.target.getPos();
    // focus a camera ?
    if ( !pos )
      pos = this.target.scenePosition;
    
    if ( !this.focusLock.x )
      this.position.x = pos.x + ( this.focusOffset.x || 0 );
    if ( !this.focusLock.y )
      this.position.y = pos.y + ( this.focusOffset.y || 0 );
  };
  
  /**
   * move gameObject with a vector 2
   * @memberOf GameObject
   * @public
   * @param {Vector2} vector2
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   * @example myObject.translate( { "x": 10, "y": 5 }, false );
   */
  GameObject.prototype.translate = function( vector2, absolute )
  {
    this.moved();
    absolute = absolute || false;
    this.position.translate( vector2, absolute );
  };
  
  /**
   * move gameObject along x axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  GameObject.prototype.translateX = function( distance, absolute )
  {
    absolute = absolute || false;
    this.translate( { x: distance, y: 0 }, absolute );
  };

  /**
   * move gameObject along y axe
   * @public
   * @memberOf GameObject
   * @param {Float} distance
   * @param {Boolean} absolute
   * if absolute, object will move on world axis instead this own axis
   */
  GameObject.prototype.translateY = function( distance, absolute )
  {
    absolute = absolute || false;
    this.translate( { x: 0, y: distance }, absolute );
  };
  
  /**
   * return absolute position
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getPos = function()
  {
    if ( this.parent )
    {
      var pos = this.parent.getPos();
      var harmonics = this.parent.getHarmonics();
      // if ( harmonics.sin == 0 && harmonics.cos == 1 )
      //   return { x: this.position.x + pos.x, y: this.position.y + pos.y, z: this.position.z + pos.z };
      return { x: -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) + pos.x
        , y: -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) + pos.y
        , z: this.position.z + pos.z
      };
    }
    return { x: this.position.x, y: this.position.y, z: this.position.z };
  };
    
  /**
   * return absolute harmonics (sin, cos)
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getHarmonics = function()
  {
    if ( this.parent )
      return this.position.getHarmonics( this.parent.getRotation() );
    
    return this.position.getHarmonics();
  }
    
  /**
   * return the absolute rotation
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.getRotation = function()
  {
    if ( this.parent )
      return ( this.position.rotation + this.parent.getRotation() ) % ( PI * 2 );
    
    return this.position.rotation % ( PI * 2 );
  };
    
  /**
   * quick access to position.rotate
   * @public
   * @memberOf GameObject
   * @param {Float} angle
   */
  GameObject.prototype.rotate = function( angle )
  {
    this.moved();
    this.position.rotate( angle );
  };
  
  /**
   * rotate the GameObject to look at the given 2D position
   * @public
   * @memberOf GameObject
   * @param {Vector2} vector2
   * can be a simple position x-y
   */
  GameObject.prototype.lookAt = function( vector2 )
  {
    this.moved();
    if ( this.parent )
    {
      var pos = this.getPos();
      this.position.setRotation( -Math.atan2( vector2.x - ( pos.x )
                                , vector2.y - ( pos.y ) ) - ( this.parent.getRotation() - Math.PI ) );
      return;
    }
    this.position.setRotation( -Math.atan2( ( vector2.x - this.position.x ), ( vector2.y - this.position.y ) ) + PI );
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
   * add one gameObject as child, call this one if you have only 1 gameObject to add, it's faster
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject gameObject to add
   * @example myObject.addOne( car );
   */
  GameObject.prototype.addOne = function( object )
  {
    if ( !( object instanceof GameObject ) )
    {
      throw new Error( "DREAM_ENGINE.GameObject.add: this not inherit from GameObject, do it well please" );
      return;
    }
    
    if ( object.parent !== undefined )
      object.parent.remove( object );
    
    object.parent = this;
    // object.parentPosition = this.position;
    this.childrens.push( object );
    
    if ( object.renderers.length > 0 )
    {
      var x = object.position.x, y = object.position.y;
      for ( var i = 0, ren; ren = object.renderers[ i ]; ++i )
      {
        if ( ren.sizes )
        {
          if ( x + ren.sizes.width > this.biggerOffset.width )
            this.biggerOffset.width = x + ren.sizes.width;
          else if ( x - ren.sizes.width > this.biggerOffset.width )
            this.biggerOffset.width = x - ren.sizes.width;
          
          if ( y + ren.sizes.height > this.biggerOffset.height )
            this.biggerOffset.height = y + ren.sizes.height;
          else if ( y - ren.sizes.height > this.biggerOffset.height )
            this.biggerOffset.height = y - ren.sizes.height;
        }
        else if ( ren.radius )
        {
          if ( x + ren.radius > this.biggerOffset.width )
            this.biggerOffset.width = x + ren.radius;
          else if ( x - ren.radius > this.biggerOffset.width )
            this.biggerOffset.width = x - ren.radius;
          
          if ( y + ren.radius > this.biggerOffset.height )
            this.biggerOffset.height = y + ren.radius;
          else if ( y - ren.radius > this.biggerOffset.height )
            this.biggerOffset.height = y - ren.radius;
        }
      }
    }
  };
    
  /**
   * remove a the given child in this GameObject childrens
   * @public
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference
   */
  GameObject.prototype.remove = function( object )
  {
    var index = this.childrens.indexOf( object );
    
    if ( index !== - 1 )
    {
      object.parent = undefined;
      // object.parentPosition = null;
      this.childrens.splice( index, 1 );
    }
  };
  
  /**
   * return the children by name
   * @public
   * @memberOf GameObject
   * @param {String} name
   * name of the GameObject
   * @param {Boolean} recursive
   * if you want to look in childrens childs
   */
  GameObject.prototype.getChildByName = function( name, recursive )
  {
    var c, child;
    for ( c = 0; child = this.childrens[ c ]; c ++ )
    {
      if ( child.name === name )
        return child;
      
      if ( recursive )
      {
        child = child.getChildByName( name, recursive );
        if ( child !== undefined )
          return child;
      }
    }
    return undefined;
  };
  
  /**
   * bind a global event on the scene
   * use this but be sure to declared target function before
   * @public
   * @memberOf GameObject
   * @param {String} eventType
   * Down, Up, Move, case sensitive
   * @param {Boolean} [isLast]
   * if you want this event have to be called after all other of the same type was
   */
  GameObject.prototype.bindGlobalEvent = function( eventType, isLast )
  {
    if ( !this.scene )
    {
      console.log( "%cCall bindGlobalEvent without adding the object in a scene", "color:red" )
      return;
    }
    this.scene[ "on" + ( isLast ? "Last" : "" ) + "GlobalMouse" + eventType ][ this.id ] = this;
  };
  
  /**
   * sort childrens by zindex and z<br>
   * engine use this, but you can call it to if you need a to force sort when adding objects for example
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.sortChildrens = function()
  {
    this.childrens.sort( function( a, b )
    {
      if ( b.position.z == a.position.z )
        return a.zindex - b.zindex;
      return b.position.z - a.position.z;
    } );
  };
  
  /**
   * add given Renderer to this GameObject and return current GameObject instance
   * @public
   * @memberOf GameObject
   * @param {Renderer} renderer
   * @example myObject.addRenderer( new DE.SpriteRenderer( { "spriteName": "ship" } ) );
   */
  GameObject.prototype.addRenderer = function( renderer )
  {
    renderer.gameObject = this;
    this.renderers.push( renderer );
    
    if ( this.renderers.length == 1 )
      this.renderer = renderer;
    if ( renderer.sizes )
    {
      if ( renderer.sizes.width * renderer.sizes.scaleX + renderer.localPosition.x > this.biggerOffset.width )
        this.biggerOffset.width = renderer.sizes.width * renderer.sizes.scaleX + renderer.localPosition.x;
      
      if ( renderer.sizes.height * renderer.sizes.scaleY + renderer.localPosition.y > this.biggerOffset.height )
        this.biggerOffset.height = renderer.sizes.height * renderer.sizes.scaleY + renderer.localPosition.y;
    }
    else if ( renderer.radius )
    {
      if ( renderer.radius + renderer.localPosition.x > this.biggerOffset.width )
        this.biggerOffset.width = renderer.radius + renderer.localPosition.x;
      if ( renderer.radius + renderer.localPosition.y > this.biggerOffset.height )
        this.biggerOffset.height = renderer.radius + renderer.localPosition.y;
    }
    return this;
  };
  
  /**
   * set given Collider to this GameObject and return current GameObject instance
   * @public
   * @memberOf GameObject
   * @param {Collider} collider
   * @example myObject.setCollider( new DE.FixedBoxCollider( 100, 200 ) );
   */
  GameObject.prototype.setCollider = function( collider )
  {
    collider.gameObject = this;
    this.collider = collider;
    
    if ( collider.radius )
    {
      if ( collider.radius > this.biggerOffset.width )
        this.biggerOffset.width = collider.radius + collider.localPosition.x;
      
      if ( collider.radius > this.biggerOffset.height )
        this.biggerOffset.height = collider.radius + collider.localPosition.y;
    }
    else if ( collider.width && collider.height )
    {
      if ( collider.width + collider.localPosition.x > this.biggerOffset.width )
        this.biggerOffset.width = collider.width + collider.localPosition.x;
      if ( collider.height + collider.localPosition.y > this.biggerOffset.height )
        this.biggerOffset.height = collider.height + collider.localPosition.y;
    }
    return this;
  };
  
  /**
   * helper to know if an object has moved since last frame
   * (usefull for collisions or custom buffer optimisation)<br/>
   * it's used by the engine but you can use it to, to improve renderings or collisions
   * @protected
   * @memberOf GameObject
   * @returns {GameObject}
   * current instance
   */
  GameObject.prototype.moved = function()
  {
    var parent = this;
    while ( parent.parent !== undefined )
      parent = parent.parent;
    
    parent.isMoved = true;
    return this;
  };
  
  /**
   * delete the object
   * @protected
   * @memberOf GameObject
   * @param {GameObject} object
   * object reference or object index in the childrens array
   */
  GameObject.prototype.delete = function( object )
  {
    // if its an index
    if ( this.childrens[ object ] )
    {
      this.childrens[ object ].killMePlease();
      delete this.childrens[ object ];
      this.childrens.splice( object, 1 );
      return;
    }
    var index = this.childrens.indexOf( object );
    
    if ( index !== - 1 )
    {
      object.killMePlease();
      this.childrens[ index ] = null;
      this.childrens.splice( index, 1 );
      return;
    }
  };
  
  /****
   intern mouse events functions are undefined, have to write your own handler for GameObjects
   the camera trigger the events and give you a mouse attributes that contain
   x, y, pointerId 
  */
  /**
   * onMouse[type] event, override it with the own GameObject's method<br>
   * not used as default<br>
   * mouses events can be triggered only if the current GameObject have a
   * supported Collider (actually, FixedBoxCollider and CircleCollider)<br>
   * here is the full events list (so override with this name) ordered by call order:<br>
   * - onMouseDown<br>
   * - onMouseEnter<br>
   * - onMouseMove<br>
   * - onMouseLeave<br>
   * - onMouseClick<br>
   * - onMouseUp<br>
   * you can stop the propagation to the "Last" events, prevent other types, or kill the current GameObject loop, check examples
   * @public
   * @memberOf GameObject
   * @function
   * @param {MouseEvent} mouse
   * is an engine custom mouse event
   * @config {Int} [x] x position
   * @config {Int} [y] y position
   * @config {Boolean} [isDown] if current cursor is down
   * @config {Int} [index] cursor id (for multi-touch)
   * @param {PropagationEvent} propagation
   * can kill event that append further current event
   * @example // simple event
   * myObject.onMouseDown = function( event, propagation )
   * {
   *   console.log( event, propagation ); // event contain x, y, isDown, index (touchId)
   * };
   * @example // here I want to catch the Click event, but I want to kill the Up and don't want other GameObject can catch events
   * so by returning true and stoping propagation, we kill the event
   * myObject.onMouseClick = function( event, propagation )
   * {
   *   // do stuff here
   *   event.stopPropagation = true; // prevent the camera.onLastMouseClick and all onLastGlobalMouseClick for those who listen Global
   *   return true; // other GameObjects will not handle the event
   * };
   */
  GameObject.prototype.onMouseDown  = undefined;
  GameObject.prototype.onMouseEnter = undefined;
  GameObject.prototype.onMouseMove  = undefined;
  GameObject.prototype.onMouseLeave = undefined;
  GameObject.prototype.onMouseClick = undefined;
  GameObject.prototype.onMouseUp    = undefined;
  
  /**
   * delete the object<br>
   * this is the good way to destroy an object in the scene<br>
   * the object is disable and the mainloop will destroy it at the next frame<br>
   * trigger a kill event with current instance, and call onKill method if provided
   * @public
   * @memberOf GameObject
   * @param {Object} [params]
   * @property {Boolean} [preventEvents] will prevent all kill events
   * @property {Boolean} [preventKillEvent] will prevent the kill event
   * @property {Boolean} [preventKilledEvent] will prevent the killed event
   * if you provide preventEvents, all kill events will be prevented
   * @example myObject.askToKill();
   * @example myObject.askToKill( { preventEvents: true } );
   */
  GameObject.prototype.askToKill = function( params )
  {
    this.scene.cleanObjectBinding( this );
    this.enable   = false;
    this.flag     = "delete";
    this.killArgs = params || {};
    if ( !this.killArgs.preventEvents && !this.killArgs.preventKillEvent )
    {
      if ( this.onKill )
        this.onKill();
      this.trigger( "kill", this );
    }
  };
  
  /**
   * If you want to get an intern method when your object is killed<br>
   * usefull when you make your own GameObjects classes, and don't want to inherit all the "on("kill")" events registered<br>
   * here the list of killed events:<br>
   * - onKill: when you called askToKill<br>
   * - onKilled: when your object is deleted (just before we remove collider and childs, so you can still do actions on)
   * @public
   * @override
   * @memberOf GameObject
   * @function
   * @example myObject.onKill = function(){ console.log( "I'm dead in 16 milliseconds !" ); };
   * @example myObject.onKilled = function(){ console.log( "Ok, now I'm dead" ); };
   * @example myObject.on( "kill", function( currentObject ){ console.log( "I'm dead in 16 milliseconds !" ); } );
   * @example myObject.on( "killed", function( currentObject ){ console.log( "Ok, now I'm dead" ); } );
   */
  GameObject.prototype.onKill   = undefined;
  GameObject.prototype.onKilled = undefined;
  
  /**
   * this function is called when the mainLoop remove this GameObject (after an askToKill call)<br>
   * you shouldn't call it directly, if you do it, maybe other GameObjects in the current 
   * frame are dealing with this one and should produce errors<br>
   * <b>if you provided to askToKill a preventEvents or a preventKilledEvent this will 
   * not trigger killed event and will not call onKilled method if provided</b>
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.killMePlease = function()
  {
    if ( !this.killArgs.preventEvents && !this.killArgs.preventKilledEvent )
    {
      if ( this.onKilled )
        this.onKilled();
      this.trigger( "killed", this );
    }
    
    delete this.renderer;
    for ( var i = 0; i < this.renderers.length; ++i )
    {
      delete this.renderers[ i ];
      this.renderers.splice( i, 1 );
    }
    delete this.collider;
    
    for ( i = 0; i < this.childrens.length; ++i )
    {
      this.childrens[ i ].killMePlease();
      delete this.childrens[ i ];
      this.childrens.splice( i, 1 );
    }
  };
  
  /****
   * default render method, you can override it if you want but it's not recommended at all<br>
   * prefer use custom Renderers for specific rendering
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype.render = render;
  /****
   * default update method, you can override it if you want but it's not recommended<br>
   * prefer use custom addAutomatism who give you a better control/dry
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype.update = update;
  
  /**
   * This provide you a way to make your custom update / logic<br>
   * You have to set a name on your automatism (to be able to remove it/change it later)
   * if you provide a name already used you automatism will be overred<br>
   * - if you set an interval, this automatism will be called each MS given<br>
   * - if you set persistent to false, it will be removed after the first call<br>
   *<b>This method call only a protected/public method member of your GameObject</b>
   * @public
   * @memberOf GameObject
   * @param {String} id unique id to be able to remove it later
   * @param {String} methodName the method to call each time
   * @param {Object} [params] parameters see below
   * @property {Int} [interval] delay between 2 calls
   * @property {Boolean} [persistent] if false, your automatism will be called only once
   * @property {Undefined} [value1] you can provide a first value
   * @property {undefined} [value2] you can provide a second value
   * if you provide preventEvents, all kill events will be prevented
   * @example
   * // this will call myObject.gameLogic() each updates
   * myObject.addAutomatism( "logic", "gameLogic" );
   * @example
   * // this will call myObject.checkInputs() each 500ms
   * myObject.addAutomatism( "inputs", "checkInputs", { "interval": 500 } );
   * @example
   * // this will call myObject.askToKill() in 2.5 seconds
   * // with parameters preventsEvents = true and will remove itself after
   * myObject.addAutomatism( "killMeLater", "askToKill", {
   *   "interval": 2500
   *   , "value1": { preventEvents: true } // we want prevent the kills events fired when die
   *   , "persistent": false
   * } );
  */
  GameObject.prototype.addAutomatism = function( id, methodName, params )
  {
    params = params || {};
    // if using the old way - TODO - remove it on version 0.2.0
    if ( methodName.type )
    {
      console.error( "You use the old way to call addAutomatism, check the doc please" );
      params = methodName;
      methodName = params.type;
    }
    if ( !this[ methodName ] )
    {
      CONFIG.debug.log( "%cCouldn't found the method " + methodName + " in your GameObject prototype", 1, "color:red" );
      return false;
    }
    if ( params.interval )
      params.lastCall = Date.now();
    
    // only 2 vals max, I could allow a value by array
    // and call the method with apply, but it's slower (I have to try and bench the difference)
    // (to see the call go in GameObject.update)
    params.methodName = methodName;
    params.value1 = params.value1 || undefined;
    params.value2 = params.value2 || undefined;
    params.persistent = ( params.persistent != false ) ? true : false;
    this.automatism[ id ] = params;
  };
  
  /**
   * remove the automatism by id you provided on creation
   * @public
   * @memberOf GameObject
   * @param {String} id automatism id to remove
   * @example
   * // remove the gameLogic previously added
   * myObject.removeAutomatism( "logic" );
   */
  GameObject.prototype.removeAutomatism = function( id )
  {
    if ( !this.automatism[ id ] )
    {
      CONFIG.debug.log( "%c[RemoveAutomatism] Automatism " + id + " not found", 1, "color:orange" );
      return;
    }
    delete this.automatism[ id ];
  };
  
  /**
   * remove all automatisms
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.removeAutomatisms = function()
  {
    for ( var i in this.automatism )
      delete this.automatism[ i ];
  };
  
  /****
   * provide Events handler
   * @memberOf GameObject
   * @public
   */
  Event.addEventCapabilities( GameObject );
  
  // propagation methods to renderers
    /**
     * create a fade from alpha to alpha on all renderers, with given duration time
     * @public
     * @memberOf GameObject
     * @param {Float} from start value
     * @param {Float} [to=0] end value
     * @param {Int} [duration=500] fade duration in ms
     * @example myObject.fade( 0.5, 1, 850 );
     */
    GameObject.prototype.fade = function( from, to, duration )
    {
      for ( var i = 0, r, child; r = this.renderers[ i ]; ++i )
        r.fade( from, to, duration );
      for ( i = 0; child = this.childrens[ i ]; ++i )
        child.fade( from, to, duration );
    };
    
    /**
     * create a fade to val on all renderers, from current alpha value with given duration time
     * @public
     * @memberOf GameObject
     * @param {Float} [to=0] end value
     * @param {Int} [duration=500] fade duration in ms
     * @example myObject.fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
     */
    GameObject.prototype.fadeTo = function( to, duration )
    {
      for ( var i = 0, r, child; r = this.renderers[ i ]; ++i )
        r.fadeTo( to, duration );
      for ( i = 0; child = this.childrens[ i ]; ++i )
        child.fadeTo( to, duration );
    };
    
    /**
     * fade all renderers to alpha 0 with given duration time
     * fade start to the current alpha or 1 if force is true
     * @public
     * @memberOf GameObject
     * @param {Int} [duration=500] fade duration in ms
     * @param {Boolean} [force=false] if true will set alpha at 1 before fade
     * @example // alpha = 0 in 850ms
     * myObject.fadeOut( 850 );
     */
    GameObject.prototype.fadeOut = function( duration, force )
    {
      for ( var i = 0, r, child; r = this.renderers[ i ]; ++i )
        r.fadeOut( duration, force );
      for ( i = 0; child = this.childrens[ i ]; ++i )
        child.fadeOut( duration, force );
    };
    
    /**
     * fade all renderers to alpha 1 with given duration time
     * fade start to the current alpha, or 0 if force is true
     * @public
     * @memberOf GameObject
     * @param {Int} [duration=500] fade duration in ms
     * @param {Boolean} [force=false] if true will set alpha at 0
     * @example // alpha = 1 in 850ms
     * myObject.fadeIn( 850 );
     */
    GameObject.prototype.fadeIn = function( duration, force )
    {
      for ( var i = 0, r, child; r = this.renderers[ i ]; ++i )
        r.fadeIn( duration, force );
      for ( i = 0; child = this.childrens[ i ]; ++i )
        child.fadeIn( duration, force );
    };
    
  GameObject.prototype.DEName = "GameObject";
  CONFIG.debug.log( "GameObject loaded", 3 );
  return GameObject;
} );