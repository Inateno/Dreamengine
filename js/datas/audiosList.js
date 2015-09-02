/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
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
    [ "game_music", "audio/music", [ 'mp3' ], { "preload": true, "loop": true, "isMusic": true
      , "sprite": {
        first: [ 0, 23000 ]
        ,second: [ 23000, 46000 ]
      } } ]
    
    // FX
    ,[ "achievement-unlocked", "audio/achievement-unlocked", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
    ,[ "mouseclick1", "audio/mouseclick1", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
  ];
  CONFIG.debug.log( "audioList loaded", 3 );
  return audioList;
} );