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
    // if ( DE.Inputs.key( "shoot" ) )
    if ( DE.Inputs.key( "up" ) )
    {
      
      Game.camera.sceneContainer.z += 0.5;
      Game.camera.sceneContainer.x -= 25;
      // Game.camera.sceneContainer.y -= 40;
    }
    if ( DE.Inputs.key( "left" ) )
      Game.camera.sceneContainer.x += 4;
    if ( DE.Inputs.key( "right" ) )
      Game.camera.sceneContainer.x -= 4;
    if ( DE.Inputs.key( "down" ) )
    {
      Game.camera.sceneContainer.z -= 0.5;
      Game.camera.sceneContainer.x += 25;
      // Game.camera.sceneContainer.y += 40;
    }
    
  }
  
  return gameLoop;
} );