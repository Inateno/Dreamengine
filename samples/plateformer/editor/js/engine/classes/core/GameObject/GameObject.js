/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* GameObject
This need :
- Vector2
- render
- update

**/

define( [ 'DE.Vector2', 'DE.GameObject.render', 'DE.GameObject.update', 'DE.CONFIG', 'DE.Sizes' ],
function( Vector2, render, update, CONFIG, Sizes )
{
  function GameObject( param )
  {
    this.DEName = "GameObject";
    
    param    = param || {};
    
    this.id     = param.id || Math.random() * 999999999;
    this.name  = param.name || '';
    this.tag    = param.tag || 'none';
    this.scene= null;
    this.disable = false;
    
    this.sceneIndex = 0;
    this.parent    = param.parent || undefined;
    this.childrens  = param.childrens || new Array();
    
    this.position = param.position || new Vector2( param.x || 0, param.y || 0, param.z || 0 );
    this.parentPosition = null;
    this.biggerOffset = new Sizes( 0, 0, 1, 1 );
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
  };

  GameObject.prototype = {
    
    constructor: GameObject
    
    /**
    * @translate
    translate the gameObject
    Need a Vector2 and a bool local
    **/  
    , translate: function( vector2, local )
    {
      this.moved();
      if ( !local ){ local = true; }
      this.position.translate( vector2, local );
    }

    /**
    * @translateX
    translate the gameObject horizontaly
    Need a int in px and a bool local
    **/
    , translateX: function( distance, local )
    {
      if ( !local ){ local = true; }
      this.translate( { x: distance, y: 0 }, local );
    }
    
    /**
    * @translateY
    translate the gameObject verticcaly
    Need a int in px and a bool local
    **/
    , translateY: function( distance, local )
    {
      if ( !local ){ local = true; }
      this.translate( { x: 0, y: distance }, local );
    }
    
    , getPos: function()
    {
      if ( this.parent )
      {
        var pos = this.parent.getPos();
        var harmonics = this.parent.getHarmonics();
        return { x: -(-this.position.x * harmonics.cos + this.position.y * harmonics.sin) + pos.x
        , y: -(-this.position.x * harmonics.sin + this.position.y * -harmonics.cos) + pos.y };
      }
      return { x: this.position.x, y: this.position.y };
    }
    
    , getHarmonics: function()
    {
      if ( this.parent )
      {
        return this.position.getHarmonics( this.getRotation() );
      }
      return this.position.getHarmonics();
    }
    
    , rotate: function( angle )
    {
      this.moved();
      this.position.rotate( angle );
    }
    
    , getRotation: function()
    {
      if ( this.parent )
      {
        return this.position.rotation + this.parent.getRotation();
      }
      return this.position.rotation;
    }
    /**
    * @lookAt
    rotate the GameObject to look at a position
    Need the position / Vector2 to look at 
    **/
    , lookAt: function( vector2 )
    {
      this.moved();
      if ( this.parent )
      {
        var pos = this.getPos();
        this.position.setRotation( -Math.atan2( vector2.x - ( pos.x )
                                  , vector2.y - ( pos.y ) ) + Math.PI - this.parent.getRotation() );
        return;
      }
      this.position.setRotation( -Math.atan2( ( vector2.x - this.position.x ), ( vector2.y - this.position.y ) ) + Math.PI );
    }
    
    /**
    * @add
    add a GameObject as child as this GameObject
    Need the new child object
    **/
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
              if ( x + ren.sizes.width > this.biggerOffset.width ){ this.biggerOffset.width = x + ren.sizes.width;}
              
              if ( y + ren.sizes.height > this.biggerOffset.height ){ this.biggerOffset.height = y + ren.sizes.height;}
            }
            else if ( ren.radius )
            {
              if ( x + ren.radius > this.biggerOffset.width ){ this.biggerOffset.width = x + ren.radius;}
              if ( y + ren.radius > this.biggerOffset.height ){ this.biggerOffset.height = y + ren.radius;}
            }
          }
        }
      }
    }
    
    /**
    *** @remove
    ** remove a GameObject as child as this GameObject
    ** Need the child object to remove
    **/
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
    
    /**
    *** @getChildByName
    ** look for a children GameObject
    ** Need the string child name's and a bool recursive
    **/
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
    
    , moved: function()
    {
      var parent = this;
      
      while ( parent.parent !== undefined )
      {
        parent = parent.parent;
      }
      
      parent.isMoved = true;
    }
    
    /**
    * @addRenderer
    // add given Renderer to this GameObject
    **/
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
    }
  };
  
  /***
  * @delete
  can be object reference or index directly
  ***/
  GameObject.prototype.delete = function( object )
  {
    // if its an index
    if ( this.childrens[ object ] )
    {
      var child = this.childrens[ object ];
        child[ object ].killMePlease();
      this.childrens[ object ] = null;
      delete child;
      this.childrens.splice( object, 1 );
      return;
    }
    var index = this.childrens.indexOf( object );
    
    if ( index !== - 1 )
    {
      object.killMePlease();
      this.childrens[ index ] = null;
      this.childrens.splice( index, 1 );
      delete object;
    }
  }
  
  GameObject.prototype.onMouseDown = false;
  GameObject.prototype.onMouseUp = false;
  GameObject.prototype.onMouseMove = false;
  /***
  * @askToKill
  want to kill the object by the scene
  ***/
  GameObject.prototype.askToKill = function()
  {
    this.disable = true;
    this.flag = "delete";
  }
  
  /***
  * @killMePlease
  ***/
  GameObject.prototype.onKill = false;
  GameObject.prototype.killMePlease = function()
  {
    if ( this.onKill )
      this.onKill();
    for ( var i = 0, r; r = this.renderers[ i ]; i++ )
    {
      this.renderers[ i ] = null;
      delete r;
      this.renderers.splice( i, 1 );
    }
    delete this.collider;
    
    for ( var i = 0, c; c = this.childrens[ i ]; i++ )
    {
      c.killMePlease();
      this.childrens[ i ] = null;
      delete c;
      this.childrens.splice( i, 1 );
    }
  }
  
  GameObject.prototype.render = render;
  GameObject.prototype.update = update;
  
  /***
  * @addAutomatism
  ***/
  GameObject.prototype.addAutomatism = function( id, object )
  {
    if ( !this[ object.type ])
    {
      console.log( "Couldn't found the method " + object.type + " in GameObject prototype" );
      return false;
    }
    if ( object.interval )
    {
      object.lastCall = Date.now();
    }
    object.value1 = object.value1 || undefined;
    object.value2 = object.value2 || undefined;
    this.automatism[ id ] = object;
  }
  
  GameObject.prototype.removeAutomatism = function( id )
  {
    if ( !this.automatism[ id ] )
    {
      console.log( "[RemoveAutomatism] Automatism " + id + " not found" );
      return;
    }
    
    delete this.automatism[ id ];
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "GameObject loaded" );
  }
  return GameObject;
} );