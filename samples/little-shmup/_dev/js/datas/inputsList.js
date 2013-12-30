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
    ,"haxe":{"keycodes":[ "G0.A.LHorizontal" ] }
    ,"vaxe":{"keycodes":[ "G0.A.LVertical" ] }
    ,"fire":{"keycodes":[ "K.space" , 'G0.B.A' ], "interval": 100 }
    ,"confirm":{"keycodes":[ 'K.enter', 'G0.B.A' ], "interval": 500 }
    ,"back":{"keycodes":[ 'K.escape', 'G0.B.B' ], "interval": 500 }
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );