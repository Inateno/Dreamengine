define( [ 'screens' ],
function( screens )
{
  function customize( systemDetect )
  {
    document.addEventListener( 'tizenhwkey', function( e )
    {
      if ( e.keyName === "back" )
      {
        var menu = screens.current();
        if ( menu && menu.objects.backBtn )
        {
          menu.backBtn.onMouseUp( {} );
        }
        else
        {
          tizen.application.getCurrentApplication().exit();
        }
      }
    } );
  }
  
  return customize;
} );