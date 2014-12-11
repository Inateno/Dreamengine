/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @states
states of the engine, mae sure don't remove the needed states

you can add some of course but be prudent
- don't use them in a gameloop it's work with events system !
**/
define( [ 'DE.Event', 'DE.CONFIG' ],
function( Event, CONFIG )
{
  var states = {
    isLoadingImages: false
    ,isReady  : false
    ,isInited  : false
  };
  
  var States = new function()
  {
    this.DEName = "States";
    
    this.up = function( who )
    {
      console.log( "upped " + who );
      checkIsReady( who, true );
      Event.emit( who, true );
      states[ who ] = true;
    }
    
    this.down = function( who )
    {
      checkIsReady( who, false );
      Event.emit( "not" + who, false );
      states[ who ] = false;
    }
    
    this.get = function( who )
    {
      return states[ who ];
    }
  };
  
  var checkIsReady = function( what, state )
  {
    if ( what == "isReady" )
    {
      return;
    }
    var st = states;
    if ( ( !st.isLoadingImages || ( what == "isLoadingImages" && state === false ) )
    && ( st.isInited || ( what == "isInited" && state === true ) )
    )
    {
      States.up( 'isReady' );
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "states loaded" );
  }
  return States;
} );