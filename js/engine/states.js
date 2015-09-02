/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@States
 states of the engine, make sure don't remove the needed states
 
 you can add some of course but be prudent
 - don't use them in a gameloop it's work with events system !
**/
define( [ 'DE.Event', 'DE.CONFIG' ],
function( Event, CONFIG )
{
  var states = {
    isLoadingImages : false
    ,isReady        : false
    ,isInited       : false
    ,isLoading      : true
  };
  
  var States = new function()
  {
    this.DEName = "States";
    
    this.up = function( who )
    {
      CONFIG.debug.log( "State up " + who, 3 );
      checkIsReady( who, true );
      Event.trigger( who, true );
      states[ who ] = true;
    }
    
    this.down = function( who, preventReady )
    {
      CONFIG.debug.log( "State down " + who, 3 );
      if ( !preventReady )
        checkIsReady( who, false );
      Event.trigger( "not" + who, false );
      states[ who ] = false;
    }
    
    this.get = function( who )
    {
      return states[ who ];
    }
  };
  
  var checkIsReady = function( what, state )
  {
    if ( what == "isReady" || what == "isLoading" )
      return;
    
    // if we are gonna to load image prevent here
    if ( what == "isLoadingImages" && state === true )
      return;
    var st = states;
    
    // if not loading images or if not gonna to load image
    if ( ( !st.isLoadingImages || ( what == "isLoadingImages" && state === false ) )
      // and check the engine is inited or is gonna to be loaded now
      && ( st.isInited || ( what == "isInited" && state === true ) ) )
    {
      States.up( 'isReady' );
    }
  };
  
  CONFIG.debug.log( "states loaded", 3 );
  return States;
} );