/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 customize WP8.1 methods and propertys when plugins Windows8App init
**/
define( [ 'Game' ],
function( Game )
{
  function customizeWP8_1( WP8_1Plugin )
  {
    WP8_1Plugin.onSettings = function()
    {
      // Game.launchMenu( "settings" ); // in my case I do this
    };
    WP8_1Plugin.onBackClick = function()
    {
      // var prevent = true;
      // if ( screens.getCurrentName() == "main" )
      //   prevent = false;
      // DE.Event.trigger( "platformBackButton" );
      // return prevent;
    };
    
    // WP8_1Plugin.appLinkKey = "";
    
    // WP8_1Plugin.askToRate();
  }
  
  return customizeWP8_1;
} );