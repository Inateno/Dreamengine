/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* CONFIG
 engine configuration
**/
define( [],
function()
{
  var CONFIG = {};
  
  CONFIG.DEName = "CONFIG";
  CONFIG.DEBUG  = 0;
  CONFIG.DEBUG_LEVEL = 0; // 0 = disable -- 1 = DEBUG SIMPLE -- 2 = DEBUG ADVANCED -- 3 = FULL INFOS and LOAD MODULES/IMAGES
  
  CONFIG.CLICK_DELAY = 200; // delay between a down and a up to be considered as a click
  
  /* COLLISION */
  CONFIG.COLLISION_TYPE = {
    ORIENTED_BOX : 1
    ,FIXED_BOX   : 2
    ,CIRCLE      : 3
  };
  
  CONFIG.DEFAULT_SIZES = {
    BUTTON:{
      WIDTH       : 120
      ,HEIGHT     : 50
      ,OFFSET_TOP : 10
      ,FONT_SIZE  : 25
    }
    , GUI: {
      WIDTH   : 100
      ,HEIGHT : 100
    }
  };
  
  CONFIG.debug = {
    log: function( msg, level )
    {
      if ( CONFIG.DEBUG && ( !level || CONFIG.DEBUG_LEVEL >= level ) )
      {
        var arg = [];
        for ( var i in arguments )
          arg.push( arguments[ i ] );
        arg.splice( 1, 1 );
        console.log.apply( console, arg );
      }
    }
  };
  
  CONFIG.notifications = {
    gamepadEnable     : true
    ,gamepadAvalaible : "Gamepad avalaible !"
    ,gamepadChange    : true
    ,achievementUnlockDuration: 8000
  };
  
  CONFIG.debug.log( "CONFIG loaded", 3 );
  return CONFIG;
} );