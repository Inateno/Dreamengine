/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 customize WP8.1 methods and propertys when plugins Windows8App init
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  function customizeWP8_1( WP8Plugin )
  {
    WP8Plugin.onSettings = function()
    {
    };
    WP8Plugin.onBackClick = function()
    {
      DE.Event.trigger( "platformBackButton" );
    };
    
    WP8Plugin.appLinkKey = "Dreamirl.Finger-Rocket_b2ycza82k38da";
  }
  
  return customizeWP8_1;
} );