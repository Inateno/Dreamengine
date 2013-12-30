define( [ 'DE.CONFIG' ]
, function( CONFIG )
{
  var dictionary = {
    "en": {
      "loose"   : "You are dead"
      ,"replay" : "Replay ?"
      ,"play"   : "Play"
      ,"benchmark"   : "Run benchmark"
    }
    , "fr" : {
      "loose"   : "Vous êtes mort"
      ,"replay" : "Rejouer ?"
      ,"play"   : "Jouer"
      ,"benchmark"   : "Lancer le test"
    }
  };
  CONFIG.debug.log( "dictionary loaded", 3 );
  return dictionary;
} );