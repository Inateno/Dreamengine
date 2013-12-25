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
    // for "smooth" action (you need each frame)
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
    
    // in this case it's checked each frame but called only when interval is ok
    if ( DreamE.Inputs.key( 'fire' ) )
    {
      Game.ship.fire();
    }
  }
  
  return gameLoop;
} );