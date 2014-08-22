define( [ 'DE.CONFIG' ]
, function( CONFIG )
{
  var achievements = [
    {
      "namespace"    : "rock-breaker"
      ,"names"        : { "fr": "Nom fr", "en": "En name" }
      ,"descriptions" : { "fr": "Des détails sur le succès", "en": "Details about achievement" }
      ,"objectives"   : { "im-packet-name": { "target": 10, "type": "increment" } }
      ,"reward"       : []
      ,"order"        : 0
    } 
  ];
  CONFIG.debug.log( "achievements loaded", 3 );
  return achievements;
} );