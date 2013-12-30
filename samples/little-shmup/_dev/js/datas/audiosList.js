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
  var audioList = [
    // MUSICS
    [ "music", "audio/awake10_megaWall", [ 'ogg', 'mp3' ], { "preload": true, "loop": true, "isMusic": true } ]
    
    // FX
    ,[ "piew", "audio/piew", [ 'ogg', 'mp3' ], { "preload": true, "loop": false, "isMusic": false } ]
  ];
  CONFIG.debug.log( "audioList loaded", 3 );
  return audioList;
} );