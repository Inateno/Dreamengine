define( [ 'DE.CONFIG' ]
, function( CONFIG )
{
  var dictionary = {
    "en": {
      "play": "Play"
      ,"settings": "Settings"
      ,"credits": "Credits"
      ,"pause": "Pause"
    }
    , "fr" : {
      "play": "Jouer"
      ,"settings": "Options"
      ,"credits": "Credits"
      ,"pause": "Pause"
    }
  };
  CONFIG.debug.log( "dictionary loaded", 3 );
  return dictionary;
} );