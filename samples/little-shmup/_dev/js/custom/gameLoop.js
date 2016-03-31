/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
simple gameLoop example
**/

define( [ 'DREAM_ENGINE', 'Game' ],
function( DreamE, Game )
{
  function gameLoop( time )
  {
    Game.checkSpawns( time );
  }
  
  return gameLoop;
} );