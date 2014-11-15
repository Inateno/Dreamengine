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
    // "up":{"keycodes":[ "K.space" , 'G0.B.A' ] } // simple input using space key and button a button on gamepad 0
    // ,"haxe":{"keycodes":[ "G0.A.LHorizontal" ] } // example making an horizontal axe
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );