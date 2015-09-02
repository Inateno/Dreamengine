/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* COLORS
 Colors used as default or for debug
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var COLORS = {};
  
  COLORS.DEName                = "COLORS";
  COLORS.defaultColor          = "0xffffff";
  COLORS.DEBUG                 = {};
  COLORS.DEBUG.GAME_OBJECT     = "0xffffff";
  COLORS.DEBUG.GUI             = "purple";
  COLORS.DEBUG.X_AXIS          = "0xff0000";
  COLORS.DEBUG.Y_AXIS          = "0x009900";
  COLORS.DEBUG.COLLIDER        = "0xBB1155";
  COLORS.DEBUG.CIRCLE_COLLIDER = "0x991144";
  
  CONFIG.debug.log( "COLORS loaded", 3 );
  return COLORS;
} );