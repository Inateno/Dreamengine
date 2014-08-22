/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
 customize W8 methods and propertys when plugins Windows8App init
**/
define( [ 'Game' ],
function( Game )
{
  function customizeW8( W8Plugin )
  {
    W8Plugin.onSettings = function()
    {
      // screens.launchMenu( "settings" ); // in my case I do this
    };
    
    W8Plugin.onUnload = function( e )
    {
    };
    
    // you can create a Dreamengine render with object inside etc... if you prefer :)
    // W8Plugin.elem = document.getElementById( "snapped" );
    W8Plugin.appLinkKey = "";
    
    // W8Plugin.privacyLink = "http://dreamirl.com/#privacy";
    W8Plugin.useSettingsCharm = false;
    W8Plugin.usePrivacyCharm = true;
  }
  
  return customizeW8;
} );