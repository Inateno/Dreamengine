// version with RequireJS, call the mainFile as a launcher and give it the engine
require( [ 'DREAM_ENGINE', 'main' ],
function( de, launch )
{
  launch( de );
  return de;
} );