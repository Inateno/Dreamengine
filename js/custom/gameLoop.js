/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
simple gameLoop example
**/

define( [ 'DREAM_ENGINE', 'Game' ],
function( DreamE, Game )
{
  function gameLoop( time )
  {
    // you can ask for a key state like this
    if ( DreamE.Inputs.key("left") )
    {
      Game.ship.translateX( -10 );
      Game.ship.renderers[ 0 ].setFrame( 9 );
    }
    else if ( DreamE.Inputs.key( "right" ) )
    {
      Game.ship.translateX( 10 );
      Game.ship.renderers[ 0 ].setFrame( 1 );
    }
    else
    {
      Game.ship.renderers[ 0 ].setFrame( 0 );
    }
    
    if ( DreamE.Inputs.key( "up" ) )
    {
      Game.ship.translateY( -5 );
    }
    if ( DreamE.Inputs.key( "down" ) )
    {
      Game.ship.translateY( 5 );
    }
    
    if ( DreamE.Inputs.key( 'fire' ) )
    {
      Game.ship.fire();
    }
    
    // Game.camera.position.rotate( 0.001 );
  }
  
  return gameLoop;
} );