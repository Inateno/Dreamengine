/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@WP8App
 provide a starter toolkit to bind you game with WP8 required components
 (lang, settings button, snapped view)
 you can do more stuff in the customizeWP8 file, this one should stay as it is
**/
define( [ 'DREAM_ENGINE', 'customizeWP8' ],
function( DE, customizeWP8 )
{
  var WP8App = new function()
  {
    // kill fxs on windows phone
    DE.AudioManager.fx.play = function(){};
    
    var _self = null;
    this.appLinkKey = "no_link_key"; // used if you want to ask to rate
    this.init = function( params )
    {
      _self = this;
      document.addEventListener( "deviceready", function()
      {
        document.addEventListener( "backbutton", _self.onBackClick, true );
      }, false);
    }
    
    this.onBackClick = function(e){}
    this.onSettingsPanel = function(e){}
    this.onSettings = function(e){}
    this.onUnload = function(e){}
    this.onResize = function( isOverridingMainLoop ){}
    
    // sample to see your application rated
    this.askToRateIf = "playedOnce";
    this.askToRate = function()
    {
      var lang = DE.LangSystem.currentLang;
      var askToRateIf = ( this.askToRateIf != null ) ? DE.SaveSystem.get( this.askToRateIf ) : true;
      if ( askToRateIf && !DE.SaveSystem.get( 'platformRated' ) )
      {
        var md = new Windows.UI.Popups.MessageDialog( DE.LangSystem.get( 'askToRate' )
                                                      || "Don't forget rate this game if you like it !" );
        var result, resultOptions = [
          DE.LangSystem.get( "rateYep" ) || "Yes"
          , DE.LangSystem.get( "rateLater" ) || "Later"
          , DE.LangSystem.get( "rateNop" ) || "No, never"
        ];
        /*for (var i = 0, cmd; i < resultOptions.length; ++i )
        {
          cmd = new Windows.UI.Popups.UICommand();
          cmd.label = resultOptions[ i ];
          cmd.id = i;
          cmd.invoked = function( c )
          {
            result = c.id;
          }
          md.commands.append( cmd );
        }
        
        // var _self = this;
        md.showAsync().then( function( c )
        {
          if ( result == 1 )
            return;
          if ( result == 0 )
          {
            Windows.System.Launcher.launchUriAsync(
              new Windows.Foundation.Uri("ms-windows-store:REVIEW?PFN=" + _self.appLinkKey )
            );
          }
          DE.SaveSystem.save( 'platformRated', true );
        } );*/
      }
    }
  };
  
  return WP8App;
} );