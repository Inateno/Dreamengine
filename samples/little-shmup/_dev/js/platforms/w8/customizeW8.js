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
      // when W8 settings button in charm bar is clicked, what to do ?
      // Game.launchMenu( "settings" ); // in my case I do this
    }
    // override gamepads detection, bind it manually (if you don't need it, remove it)
    //W8Plugin.plugToGamePadLib();
    
    // you can create a Dreamengine render with object inside etc... if you prefer :)
    W8Plugin.elem = document.getElementById( "snapped" );
    W8Plugin.appLinkKey = "_your_link_key_here_";
  }
  
  return customizeW8;
} );