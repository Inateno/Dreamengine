/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
Event

you can add some Events on what you want, by default there are on engine "states".
When you want create an event callback, create it like that: on( 'somethin', function(){ myfunction(); } ) because callbacks are deleted
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var Event = new function()
  {
    this.DEName = "Event";
  };
  
  Event.listenersFor = {};
  Event.persistentFor = {};
  Event.on = function( eventName, callback, persistent )
  {
    if ( !Event.listenersFor[ eventName ] )
    {
      Event.listenersFor[ eventName ] = new Array();
      Event.persistentFor[ eventName ] = new Array();
    }
    Event.listenersFor[ eventName ].push( callback );
    Event.persistentFor[ eventName ].push( persistent || false );
  };
  
  Event.emit = function()
  {
    var args = Array.prototype.slice.call( arguments );
    var eventName = args.shift();
    
    var listeners = Event.listenersFor[ eventName ] || [];
    var persistent = Event.persistentFor[ eventName ] || [];
    for ( var i = 0; i < listeners.length; i++ )
    {
      /*try
      {*/
        listeners[ i ].apply( Event, args );
        // not persistents event are removed
        if ( persistent && !persistent[ i ] )
        {
          var pers = persistent[ i ];
          var callback = listeners[ i ];
          listeners.splice( i, 1 );
          persistent.splice( i, 1 );
          delete pers;
          delete callback;
          i--;
        }
      /*}
      catch ( e )
      {
        console.warn( 'Error on event ' + eventName );
        throw( e );
      }*/
    }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Event loaded" );
  }
  return Event;
} );