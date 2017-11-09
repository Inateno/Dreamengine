/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Event
 you can add some Events on what you want, by default there are on engine "states".
 When you want create an event callback, create it like that: on( 'something', function(){ myfunction(); } )
 because callbacks are deleted if you dont set persistent true.
 
 Also, this provide an modular Event binder, so just call Event.addEventCapabilities, but if you want to add events
 on a prototype, you'll have to call addEventComponents inside the constructor
 Nb: GameObjects - Camera have already Events
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var Event = new function()
  {
    this.DEName = "Event";
  };
  
  Event.callbacks   = {};
  Event.contexts    = {};
  Event.persistents = {};
  /****
   * on@void( eventName@String, callback@Function, [context@Reference, persistent@Bool] )
    register a callback on the given eventName, if not persistant, it will be removed
    after call
   */
  Event.on = function( eventName, callback, context, persistent )
  {
    if ( !Event.callbacks[ eventName ] )
    {
      Event.callbacks[ eventName ]   = new Array();
      Event.contexts[ eventName ]    = new Array();
      Event.persistents[ eventName ] = new Array();
    }
    Event.callbacks[ eventName ].push( callback );
    Event.contexts[ eventName ].push( context || window );
    Event.persistents[ eventName ].push( ( persistent !== undefined ) ? persistent : true );
  };
  
  /****
    trigger eventName
   */
  Event.trigger = function()
  {
    var args = Array.prototype.slice.call( arguments );
    var eventName = args.shift();
    
    var callbacks = Event.callbacks[ eventName ] || [];
    var contexts = Event.contexts[ eventName ] || [];
    var persistents = Event.persistents[ eventName ] || [];
    for ( var i = 0; i < callbacks.length; i++ )
    {
      callbacks[ i ].apply( contexts[ i ], args );
      // not persistents event are removed
      if ( !persistents[ i ] )
      {
        delete callbacks[ i ];
        delete contexts[ i ];
        delete persistents[ i ];
        callbacks.splice( i, 1 );
        contexts.splice( i, 1 );
        persistents.splice( i, 1 );
        --i;
      }
    }
  };
  
  Event.stopListen = function( eventName, f )
  {
    if ( !f )
    {
      delete this.callbacks[ eventName ];
      delete this.contexts[ eventName ];
      delete this.persistents[ eventName ];
      return true;
    }
    else
    {
      for ( var i in this.callbacks[ eventName ] )
      {
        if ( this.callbacks[ eventName ][ i ] == f )
        {
          this.callbacks[ eventName ].splice( i, 1 );
          this.contexts[ eventName ].splice( i, 1 );
          this.persistents[ eventName ].splice( i, 1 );
          return true;
        }
      }
    }
    return false;
  }
  
  CONFIG.debug.log( "Event loaded", 3 );
  
  /****
   * addEventComponents@void( object@Instance )
    this add events components, if the object isn't an prototyped instance
    you shouldn't use it
   */
  Event.addEventComponents = function( object )
  {
    object.callbacks = {};
    object.contexts  = {};
  };
  /****
   * addEventCapabilities@void( object@Object )
    add events methods to your objects, if it's a prototype you have to call
    addEventComponents in the constructor
   */
  Event.addEventCapabilities = function( object ) 
  {
    if ( !object.prototype )
    {
      object.callbacks  = {};
      object.contexts   = {};
      object.on         = onFunc;
      object.trigger    = triggerFunc;
      object.stopListen = stopListeningFunc;
    }
    else
    {
      object.prototype.on         = onFunc;
      object.prototype.trigger    = triggerFunc;
      object.prototype.stopListen = stopListeningFunc;
    }
  };
  
  var onFunc = function( eventName, callback, context )
  {
    if ( !this.callbacks[ eventName ] )
    {
      this.callbacks[ eventName ] = [];
      this.contexts[ eventName ]  = [];
    }
    this.callbacks[ eventName ].push( callback );
    this.contexts[ eventName ].push( context || this );
  };
  
  var triggerFunc = function()
  {
    var args = Array.prototype.slice.call( arguments );
    var eventName = args.shift();
    var listeners = this.callbacks[eventName] || [];
    
    for ( var i = 0; i < listeners.length; ++i )
    {
      listeners[ i ].apply( this.contexts[ eventName ][ i ], args );
    }
  };

  var stopListeningFunc = function( eventName, f )
  {
    if ( !f )
    {
      delete this.callbacks[ eventName ];
      delete this.contexts[ eventName ];
      return true;
    }
    else
    {
      for ( var i in this.callbacks[ eventName ] )
      {
        if ( this.callbacks[ eventName ][ i ] == f )
        {
          this.callbacks[ eventName ].splice( i, 1 );
          this.contexts[ eventName ].splice( i, 1 );
          return true;
        }
      }
    }
    return false;
  }
  
  CONFIG.debug.log( "Event classes loaded", 3 );
  return Event;
} );