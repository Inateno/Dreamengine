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
    "left":{"keycodes":[ "K.q", "K.left" ] }
    ,"right":{"keycodes":[ "K.d", "K.right" ] }
    ,"up":{"keycodes":[ "K.z", "K.up" ] }
    ,"down":{"keycodes":[ "K.s", "K.down" ] }
    ,"fire":{"keycodes":[ "K.space" , 'G0.B.A'], "interval": 266 }
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );