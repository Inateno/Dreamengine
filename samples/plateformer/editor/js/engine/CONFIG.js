/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @CONFIG
The engine configuration
**/
define( [],
function()
{
  var CONFIG = {};
  
  CONFIG.DEName = "CONFIG";
  CONFIG.DEBUG = 1;
  CONFIG.DEBUG_LEVEL = 1; // 0 = disable -- 1 = DEBUG SIMPLE -- 2 = DEBUG ADVANCED -- 3 = FULL INFOS and LOAD MODULES/IMAGES

  /* COLLISION */
  CONFIG.COLLISION_TYPE = {
    ORIENTED_BOX: 1
    ,FIXED_BOX  : 2
    ,CIRCLE    : 3
  };
  
  CONFIG.DEFAULT_SIZES = {
    BUTTON:{
      WIDTH: 120
      ,HEIGHT: 50
      ,OFFSET_TOP : 10
      , FONT_SIZE : 25
    }
    , GUI: {
      WIDTH: 100
      , HEIGHT: 100
    }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "CONFIG loaded" );
  }
  return CONFIG;
} );