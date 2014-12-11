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
  COLORS.defaultColor          = "white";
  COLORS.DEBUG                 = {};
  COLORS.DEBUG.GAME_OBJECT     = "white";
  COLORS.DEBUG.GUI             = "purple";
  COLORS.DEBUG.X_AXIS          = "red";
  COLORS.DEBUG.Y_AXIS          = "rgb(0,205,0)";
  COLORS.DEBUG.COLLIDER        = "rgb(205,20,100)";
  COLORS.DEBUG.CIRCLE_COLLIDER = "rgb(205,50,100)";
  
  CONFIG.debug.log( "COLORS loaded", 3 );
  return COLORS;
} );