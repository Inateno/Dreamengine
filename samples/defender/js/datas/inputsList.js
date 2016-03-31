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
    "shoot": { keycodes: [ "K.space" ], interval: 200 }
    ,"up": { keycodes: [ "K.up", "K.z" ] }
    ,"left": { keycodes: [ "K.left", "K.q" ] }
    ,"right": { keycodes: [ "K.right", "K.d" ] }
    ,"down": { keycodes: [ "K.down", "K.s" ] }
  };
  CONFIG.debug.log( "inputsList loaded", 3 );
  return inputsList;
} );