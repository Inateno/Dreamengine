/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* GameObject
The core of the engine, all is based on GameObjects
They can get renderers, collider (can add more than one but not in an array)
You can make groups by adding a GameObject to an other (no recursive limit but be prudent with that,
I tried a 5 levels hierarchy and this work perfectly, but you shouldn't have to make a lot )
**/

define( [ 'DE.Vector2', 'DE.GameObject.render', 'DE.GameObject.update', 'DE.CONFIG', 'DE.Sizes', 'DE.Event' ],
function( Vector2, render, update, CONFIG, Sizes, Event )
{
  var PI = Math.PI;
  function GameObject( param )
  {
    param    = param || {};
    
    this.id     = param.id || Math.random() * 999999999;
    this.name   = param.name || '';
    this.tag    = param.tag || 'none';
    this.scene  = null;
    this.disable = false;
    
    this.sceneIndex = 0;
    this.parent    = param.parent || undefined;
    this.childrens  = param.childrens || new Array();
    
    this.position = param.position || new Vector2( param.x || 0, param.y || 0, param.z || 0 );
    this.parentPosition = null;
    this.biggerOffset = new Sizes( 1, 1, 1, 1 );
    this.automatism  = {}; // push an object inside with what, value and frequences
    this.flag = null;
    this.zindex = param.zindex || 0;
    
    this.renderers  = new Array();
    if ( param.renderers && param.renderers.length > 0 )
    {
      for ( var i = 0, r; r = param.renderers[ i ]; i++ )
      {
        r.gameObject = this;
        this.addRenderer( r );
      }
    }
    if ( param.renderer )
    {
      param.renderer.gameObject = this;
      this.addRenderer( param.renderer );
    }
    
    this.indexMouseOver = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.isMoved = false;
    this.collider= param.collider || null;
    if ( this.collider !== null )
    {
      this.collider.gameObject = this;
    }
    
    this.rigibody  = param.rigibody || undefined;
    if ( this.rigibody && this.rigibody.gameObject != this )
    {
      this.rigibody.gameObject = this;
    }
    
    Event.addEventComponents( this );
  };

  GameObject.prototype = {
    
    constructor: GameObject
    /****
     * @translate gameObject on x & y axe
      vector2@Vector2 - absolute@bool
      if absolute, object will move on world axis instead this own axis
     */
    , translate: function( vector2, absolute )
    {
      this.moved();
      absolute = absolute || false;
      this.position.translate( vector2, absolute );
    }

    /****
     * @translateX gameObject on x axe
      distance@int absolute@bool
      if absolute, object will move on world axis instead this own axis
     */
    , translateX: function( distance, absolute )
    {
      absolute = absolute || false;
      this.translate( { x: distance, y: 0 }, absolute );
    }
    
    /****
     * @translateY gameObject on y axe
      distance@int absolute@bool
      if absolute, object will move on world axis instead this own axis
     */
    , translateY: function( distance, absolute )
    {
      absolute = absolute || false;
      this.translate( { x: 0, y: distance }, absolute );
    }
    /****
     * return object real position
     */
    , getPos: function()
    {
      if ( this.parent )
      {
        var pos = this.parent.getPos();
        var harmonics = this.getHarmonics();
        if ( harmonics.sin == 0 && harmonics.cos == 0 )
          return { x: this.position.x + pos.x, y: this.position.y + pos.y, z: this.position.z + pos.z };
        return { x: -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) + pos.x
          , y: -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) + pos.y
          , z: this.position.z + pos.z
        };
      }
      return { x: this.position.x, y: this.position.y, z: this.position.z };
    }
    
    /****
     * return real position harmonics (sin, cos)
     */
    , getHarmonics: function()
    {
      if ( this.parent )
      {
        return this.position.getHarmonics( this.parent.getRotation() );
      }
      return this.position.getHarmonics();
    }
    
    /****
     *
     */
    , getRotation: function()
    {
      if ( this.parent )
      {
        return ( this.position.rotation + this.parent.getRotation() ) % ( PI * 2 );
      }
      return this.position.rotation % ( PI * 2 );
    }
    
    , rotate: function( angle )
    {
      this.moved();
      this.position.rotate( angle );
    }
    /****
     * @lookAt
      rotate the GameObject to look at a the given 2D position
      Need the position / Vector2 to look at 
     */
    , lookAt: function( vector2 )
    {
      this.moved();
      if ( this.parent )
      {
        var pos = this.getPos();
        this.position.setRotation( -Math.atan2( vector2.x - ( pos.x )
                                  , vector2.y - ( pos.y ) ) - this.parent.getRotation() );
        return;
      }
      this.position.setRotation( -Math.atan2( ( vector2.x - this.position.x ), ( vector2.y - this.position.y ) ) + PI );
    }
    
    /****
     * @add
      add a GameObject as child as this GameObject
      Need the new child object
     */
    , add: function( object )
    {
      if ( object === this )
      {
        console.warn( 'DREAM_ENGINE.GameObject.add: An object can\'t be added as a child of itself.' );
        return;
      }
      
      if ( object instanceof GameObject )
      {
        if ( object.parent !== undefined )
        {
          object.parent.remove( object );
        }
        
        object.parent = this;
        object.parentPosition = this.position;
        this.childrens.push( object );
        
        if ( object.renderers.length > 0 )
        {
          var x = object.position.x, y = object.position.y;
          for ( var i = 0, ren; ren = object.renderers[ i ]; i++ )
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
      }
    }
    
    /****
     * remove@void ( object@GameObject )
      remove a GameObject as child as this GameObject
      Need the child object to remove
     */
    , remove: function( object )
    {
      var index = this.childrens.indexOf( object );
      
      if ( index !== - 1 )
      {
        object.parent = undefined;
        object.parentPosition = null;
        this.childrens.splice( index, 1 );
      }
    }
    
    /****
     * getChildByName@gameObject ( name@string, [ recursive@bool ] )
      look for a children GameObject
      Need the string child name's and a bool recursive
     */
    , getChildByName: function( name, recursive )
    {
      var c, child;
      for ( c = 0; child = this.childrens[ c ]; c ++ )
      {
        if ( child.name === name )
        {
          return child;
        }
        
        if ( recursive )
        {
          child = child.getChildByName( name, recursive );
          if ( child !== undefined )
          {
            return child;
          }
        }
      }
      return undefined;
    }
    
    /****
     * moved@void
     helper to know if an object has moved since last frame
     (usefull for collisions or custom buffer optimisation)
     */
    , moved: function()
    {
      var parent = this;
      while ( parent.parent !== undefined )
      {
        parent = parent.parent;
      }
      parent.isMoved = true;
      return this;
    }
    
    /****
     * addRenderer@void ( renderer@Renderer )
     add given Renderer to this GameObject
     return current instance
     */
    , addRenderer: function( renderer )
    {
      renderer.gameObject = this;
      this.renderers.push( renderer );
      
      if ( renderer.sizes )
      {
        if ( renderer.sizes.width > this.biggerOffset.width ){ this.biggerOffset.width = renderer.sizes.width;}
        
        if ( renderer.sizes.height > this.biggerOffset.height ){ this.biggerOffset.height = renderer.sizes.height;}
      }
      else if ( renderer.radius )
      {
        if ( renderer.radius > this.biggerOffset.width ){ this.biggerOffset.width = renderer.radius;}
        if ( renderer.radius > this.biggerOffset.height ){ this.biggerOffset.height = renderer.radius;}
      }
      return this;
    }
  };
  
  /****
   * delete@void ( object@GameObject || object@Int )
   can be object reference or index directly
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
  }
  
  /****
   intern mouse events functions are undefined, have to write your own handler for GameObjects
   the camera trigger the events and give you a mouse attributes that contain
   x, y, pointerId 
  */
  GameObject.prototype.onMouseDown  = undefined;
  GameObject.prototype.onMouseUp    = undefined;
  GameObject.prototype.onMouseMove  = undefined;
  GameObject.prototype.onMouseEnter = undefined;
  GameObject.prototype.onMouseLeave = undefined;
  
  /****
   * askToKill@void
   this is the good way to destroy an object in the scene
   the object is disable and the mainloop will destroy it at the next frame
   trigger a kill event with current instance
   */
  GameObject.prototype.askToKill = function()
  {
    this.disable = true;
    this.flag = "delete";
    this.trigger( "kill", this );
  }
  
  /****
   * onKill@void
   if you want to get an intern method when your object is killed
   (there is also a "killed" event triggered but if you want to get the method in your class and not a "on" inside your class/initialisation)
   usefull when you make your own GameObjects classes, and don't want to herit all the "on("kill")" events registered
   */
  GameObject.prototype.onKill = false;
  
  /****
   * killMePlease@void
   this function is called when the mainLoop remove this GameObject (after an askToKill call)
   you shouldn't call it directly, if you do it, maybe other GameObjects in the current frame are dealing with this one and should produce errors
   */
  GameObject.prototype.killMePlease = function()
  {
    if ( this.onKill )
      this.onKill();
    this.trigger( "killed", this );
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
  }
  
  /****
   * default render method, you can override it if you want but it's not recommanded
   prefer use custom Renderers for specific rendering
   */
  GameObject.prototype.render = render;
  /****
   * default update method, you can override it if you want but it's not recommanded
   prefer use custom addAutomatism who give you a better support
   */
  GameObject.prototype.update = update;
  
  /****
   * addAutomatism@void ( id@string, object@{ type@methodName,
    [ value1@??, value2@??, interval@MS, persistant@bool ] } )
   addAutomatism provide you a way to make your custom update / logic
   you set a name on your automatism (to be able to remove it/change it later)
   passing an object with params (at least the methodName to call)
   if you set an interval, this automatism will be called each MS given
   if you set persistant to false, it will be removed after the first call
  */
  GameObject.prototype.addAutomatism = function( id, object )
  {
    if ( !this[ object.type ] )
    {
      CONFIG.debug.log( "%cCouldn't found the method " + object.type + " in GameObject prototype", 1, "color:red" );
      return false;
    }
    if ( object.interval )
    {
      object.lastCall = Date.now();
    }
    // only 2 vals max, I could allow a value by array
    // and call the method with apply, but it's slower (I have to try and bench the difference)
    // (to see the call go in GameObject.update)
    object.value1 = object.value1 || undefined;
    object.value2 = object.value2 || undefined;
    object.persistant = ( object.persistant != false ) ? true : false;
    this.automatism[ id ] = object;
  }
  
  /****
   * removeAutomatism@void
   remove the automatism (by id you provided on creation)
   */
  GameObject.prototype.removeAutomatism = function( id )
  {
    if ( !this.automatism[ id ] )
    {
      CONFIG.debug.log( "%c[RemoveAutomatism] Automatism " + id + " not found", 1, "color:orange" );
      return;
    }
    delete this.automatism[ id ];
  }
  
  /****
   * removeAutomatisms@void
   remove all automatism registered
   */
  GameObject.prototype.removeAutomatisms = function()
  {
    for ( var i in this.automatism )
      delete this.automatism[ i ];
  }
  
  /****
   * provide Events methods on GameObjects (on -> trigger)
   */
  Event.addEventCapabilities( GameObject );
  
  GameObject.prototype.DEName = "GameObject";
  CONFIG.debug.log( "GameObject loaded", 3 );
  return GameObject;
} );