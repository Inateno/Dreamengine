define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var COLORS = {};
  
  COLORS.DEName = "COLORS";
  COLORS.defaultColor = "white";
  COLORS.DEBUG    = {};
  COLORS.DEBUG.GAME_OBJECT= "white";
  COLORS.DEBUG.GUI        = "purple";
  COLORS.DEBUG.X_AXIS    = "blue";
  COLORS.DEBUG.Y_AXIS    = "red";
  COLORS.DEBUG.COLLIDER  = "rgb(205,20,100)";
  COLORS.DEBUG.CIRCLE_COLLIDER  = "rgb(205,50,100)";
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "COLORS loaded" );
  }
  return COLORS;
} );