/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the audios list sample that will be loaded by the project
 * Please declare in the same way than this example.
 * To automatically preload a file just set "preload" to true.
 */
var audios = [
  // MUSICS
  [ "test_music", "audio/test_music", [ 'mp3' ], { "preload": true, "loop": true, "isMusic": true } ]
  , [ "test_sprite_music", "audio/test_music", [ 'mp3' ], { "preload": true, "loop": true, "isMusic": true
    , "sprite": {
      first: [ 0, 5000 ]
      ,second: [ 10000, 20000 ]
    } } ]
  
  // // FX
  // ,[ "achievement-unlocked", "audio/achievement-unlocked", [ 'mp3', 'ogg' ], { "preload": true, "loop": false } ]
  ,[ "piew", "audio/piew", [ 'mp3' ], { "preload": true, "loop": false, "pool": 10 } ]
];