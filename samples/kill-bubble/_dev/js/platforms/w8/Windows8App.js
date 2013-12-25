/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Windows8App
 provide a starter toolkit to bind you game with W8 required components
 (lang, settings button, snapped view)
 you can do more stuff in the customizeW8 file, this one should stay as it is
**/
define( [ 'DREAM_ENGINE', 'customizeW8' ],
function( DE, customizeW8 )
{
  var Windows8App = new function()
  {
    var _self = null;
    this.appLinkKey = "no_link_key"; // used if you want to ask to rate
    this.init = function( params )
    {
      _self = this;
      if ( !WinJS )
        throw new Error( "WinJS is not defined, a Windows8App need it !" );
      var settingsPane = Windows.UI.ApplicationSettings.SettingsPane.getForCurrentView();
      settingsPane.addEventListener( "commandsrequested", function (e)
      {
        var customButton = new Windows.UI.ApplicationSettings.SettingsCommand(
          "Options", DE.LangSystem.get( 'settings' ) || 'Settings'
          , function( e )
          {
            // go on settings menu
            _self.onSettings();
          }
        );
        e.request.applicationCommands.append(customButton);
      } );
      
      WinJS.Application.onsettings = function(e)
      {
        _self.onSettingsPanel( e );
      }
      
      WinJS.Application.onunload = function(e)
      {
        _self.onUnload( e );
      }
      
      WinJS.Application.start();
      DE.LangSystem.getLang( Windows.Globalization.Language.currentInputMethodLanguageTag );
      window.addEventListener( "resize", function(){ _self.checkResize(); }, false );
      
      customizeW8( this );
    }
    
    this.onSettingsPanel = function(e){}
    this.onSettings = function(e){}
    this.onUnload = function(e){}
    this.onResize = function( isOverridingMainLoop ){}
    
    this.checkResize = function()
    {
      if ( document.documentElement.offsetWidth < 330 )
      {
        for ( var i = 0, j; j = DE.MainLoop.renders[ i ]; i++ )
        {
          j.canvas.parentElement.previousState = j.canvas.parentElement.style.display;
          j.canvas.parentElement.style.display = "none";
          j.canvas.previousState = j.canvas.style.display;
          j.canvas.style.display = "none";
        }
        // display my render and hide others
        if ( this.render )
        {
          this.render.canvas.parentElement.style.display = "block";
          this.render.canvas.style.display = "inline-block";
        }
        // display DOM ?
        if ( this.elem )
          this.elem.style.display = "block";
        this.onResize( true );
        this.isOverridingMainLoop = true;
      }
      else if ( this.isOverridingMainLoop )
      {
        // display my render and hide others
        if ( this.render )
        {
          this.render.canvas.parentElement.style.display = "none";
          this.render.canvas.style.display = "none";
        }
        // display DOM ?
        if ( this.elem )
          this.elem.style.display = "none";
        for ( var i = 0, j; j = DE.MainLoop.renders[ i ]; i++ )
        {
          j.canvas.parentElement.style.display = j.canvas.parentElement.previousState;
          j.canvas.style.display = j.canvas.previousState;
        }
        this.onResize( false );
        this.isOverridingMainLoop = false;
      }
    }
    
    this.plugToGamePadLib = function()
    {
      if ( !DE.GamePad )
        return;
      if ( !window[ 'GameController' ] )
      {
        console.log( "%c[WARNING] Can't find W8 Gamepad component, gamepad configuration aborted", "color:orange" );
        return;
      }
      //First arg is cpp->javascript class , second arg is nbr max of gamepads
      DE.GamePad.adaptToWindowsLib( GameController, 4 );
      if ( DE.CONFIG.notifications.gamepadEnable )
        DE.Notifications.create( DE.LangSystem.get( "gamepadAvalaible" )
                                || DE.CONFIG.notifications.gamepadAvalaible );
    }
    
    // sample to see your application rated
    this.askToRateIf = "playedOnce";
    this.askToRate = function()
    {
      var lang = DE.LangSystem.currentLang;
      var askToRateIf = ( this.askToRateIf != null ) ? DE.SaveSystem.get( this.askToRateIf ) : true;
      if ( askToRateIf && !DE.SaveSystem.get( 'rated' ) )
      {
        var md = new Windows.UI.Popups.MessageDialog( DE.LangSystem.get( 'askToRate' )
                                                      || "Don't forget rate this game if you like it !" );
        var result, resultOptions = [
          DE.LangSystem.get( "rateYep" ) || "Yes"
          , DE.LangSystem.get( "rateLater" ) || "Later"
          , DE.LangSystem.get( "rateNop" ) || "No, never"
        ];
        for (var i = 0, cmd; i < resultOptions.length; ++i )
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
          DE.SaveSystem.save( 'rated', true );
        } );
      }
    }
  };
  
  return Windows8App;
} );