/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* @inputsList
this is the inputsList will be available in the project.
Please declare in the same way than this example.
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var inputsList = {
    "left":{"keycodes":[ "K.left" , 'K.a', 'K.q' ] }
    ,"right":{"keycodes":[ "K.right" , 'K.d' ] }
    ,"up":{"keycodes":[ "K.up" , 'K.z', 'K.w' ] }
    ,"down":{"keycodes":[ "K.down" , 'K.s' ] }
    ,"jump":{"keycodes":[ 'G0.B.A', "K.space" ], "stayOn": true }
    
    ,"haxe":{"keycodes":[ "G0.A.LHorizontal" ] }
    ,"vaxe":{"keycodes":[ "G0.A.LVertical" ] }
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );