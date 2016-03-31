/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* audioList
this is the audioList will be available in the project.
Please declare in the same way than this example.
To load audio as default just set "preload" to true.
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var audioList = [];
  CONFIG.debug.log( "audioList loaded", 3 );
  return audioList;
} );