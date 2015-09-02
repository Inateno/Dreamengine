/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple gameLoop example
**/

define( [ 'DREAM_ENGINE', 'Game' ],
function( DE, Game )
{
  function gameLoop( time )
  {
    // Game.otherObject.lookAt( Game.simpleObject );
    // you can ask for a key state like this
    // if ( DE.Inputs.key("left") )
    // {
    //   // Game.ship.translateX( -10 );
    //   Game.ship.rotate( -0.05 );
    //   Game.ship.renderers[ 0 ].setFrame( 9 );
    // }
    // else if ( DE.Inputs.key( "right" ) )
    // {
    //   // Game.ship.translateX( 10 );
    //   Game.ship.rotate( 0.05 );
    //   Game.ship.renderers[ 0 ].setFrame( 1 );
    // }
    // else
    // {
    //   Game.ship.renderers[ 0 ].setFrame( 0 );
    // }
    
    // if ( DE.Inputs.key( "up" ) )
    // {
    //   Game.ship.translateY( -5 );
    // }
    // if ( DE.Inputs.key( "down" ) )
    // {
    //   Game.ship.translateY( 5 );
    // }
    
    // if ( DE.Inputs.key( 'fire' ) )
    // {
    //   Game.ship.fire( 1 );
    // }
    // if ( DE.Inputs.key( 'deep' ) )
    // {
    //   Game.ship.fire( -1 );
    // }
    
    // Game.camera.position.rotate( 0.001 );
  }
  
  return gameLoop;
} );