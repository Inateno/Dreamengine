define( [ 'DE.about', 'DE.Event', 'DE.SaveSystem', 'DE.LangSystem'
        , 'DE.Notifications', 'DE.AchievementSystem' ],
function( about, Event, SaveSystem, LangSystem
        , Notifications, AchievementSystem )
{
  var _offLineTemplate = "<div class='centeredModal'><div class='close'>X</div><h3 class='title'></h3><p class='about'></p><div class='btns'><button class='yesLoad'></button><button class='noLoad'></button></div></div>";
  var _offLineVignet = "<div class='vignet'><img src='data:image/png;base64,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' /></div>";
  
  var _langs = {
    "en": {
      "nebula-bad-namespace": "No namespace given for the game, disable Nebula or set a valid namespace in about"
      ,"nebula-title"        : "Connect to Nebula system"
      ,"nebula-description"  : "Login to synchronize and save your progressions on Dreamirl's servers, you'll synchronize the same progression on your mobile, computer, laptop, whatever!<br />Not registered yet ? You can do by clicking Login."
      ,"nebula-login"        : "Login"
      ,"nebula-nop"          : "No thank you"
      ,"nebula-firewall"     : "Cannot load, seems you firewall block connexion, or the server is down"
    }
    , "fr": {
      "nebula-bad-namespace": "Aucun namespace valide n'a été trouvé, désactivation du module Nebula (vous pouvez aussi le désactiver automatiquement)"
      ,"nebula-title"        : "Connexion au système Nebula"
      ,"nebula-description"  : "Connectez vous pour synchroniser et sauvegarder votre progression sur les serveur Dreamirl, vous pourrez ainsi conserver le même avancement sur votre mobile, votre pc ou votre pc portable !<br />Vous n'êtes pas encore inscrit ? Vous pouvez le faire en cliquant Se connecter!"
      ,"nebula-login"        : "Se connecter"
      ,"nebula-nop"          : "Non merci"
      ,"nebula-firewall"     : "Chargement impossible, il semble que votre pare-feu bloque la connexion, ou le serveur est down"
    }
  };
  var NebulaOffline = new function()
  {
    var _self = this;
    this.el        = null;
    this.container = null;
    this.isNebula  = true;
    
    this.init = function( elId )
    {
      if ( !_langs[ LangSystem.currentLang ] )
        _langs[ LangSystem.currentLang ] = {};
      
      if ( !about.namespace )
      {
        alert( _langs[ LangSystem.currentLang ][ "nebula-bad-namespace" ] || _langs[ "en" ][ "nebula-bad-namespace" ] );
        return;
      }
      var elParent = document.getElementById( elId || "Dreamirl-Nebula" );
      if ( !elParent )
        elParent = document.body;
      var el = document.createElement( "div" );
      el.id = "NebulaClient";
      el.innerHTML = _offLineTemplate;
      this.elParent = elParent;
      elParent.appendChild( el );
      el.getElementsByClassName( "title" )[ 0 ].innerHTML = _langs[ LangSystem.currentLang ][ "nebula-title" ] || _langs[ "en" ][ "nebula-title" ];
      el.getElementsByClassName( "about" )[ 0 ].innerHTML = _langs[ LangSystem.currentLang ][ "nebula-description" ] || _langs[ "en" ][ "nebula-description" ];
      var ybtn = el.getElementsByClassName( "yesLoad" )[ 0 ];
      ybtn.innerHTML = _langs[ LangSystem.currentLang ][ "nebula-login" ] || _langs[ "en" ][ "nebula-login" ];
      ybtn.addEventListener( "click", function( e )
      {
        _self.loadClient();
      }, true );
      var nbtn = el.getElementsByClassName( "noLoad" )[ 0 ];
      nbtn.innerHTML = _langs[ LangSystem.currentLang ][ "nebula-nop" ] || _langs[ "en" ][ "nebula-nop" ];
      nbtn.addEventListener( "click", function( e )
      {
        _self.hide();
      }, true );
      el.getElementsByClassName( "close" )[ 0 ].addEventListener( "click", function()
      {
        _self.hide();
      }, true );
      this.container = el;
      
      var vi = document.createElement( "div" );
      vi.id = "NebulaVignet";
      vi.innerHTML = _offLineVignet;
      elParent.appendChild( vi );
      this.vignet = vi;
      vi.addEventListener( "click", function()
      {
        _self.show();
      }, true );
      Event.trigger( "nebula-show" );
      Event.on( "close-nebula", this.hide, this );
      Event.on( "toggle-nebula", function()
      {
        if ( this.visible )
          this.hide();
        else
          this.show();
      }, this );
      this.show();
    };
    
    this.hide = function()
    {
      this.visible = false;
      Event.trigger( "nebula-hide" );
      _self.container.className += _self.container.className += " fading";
      setTimeout( function()
      {
        _self.container.className += " hided";
      }, 200 );
    };
    this.show = function()
    {
      this.visible = true;
      Event.trigger( "nebula-show" );
      _self.container.className = _self.container.className.replace( /hided/gi, "" ).replace( /  /gi, "" );
      setTimeout( function()
      {
        _self.container.className = _self.container.className.replace( /fading/gi, "" );
      }, 50 );
      setTimeout( function()
      {
        _self.container.className = _self.container.className.replace( /hided/gi, "" );
      }, 250 );
    };
    
    this.loadClient = function()
    {
      // display loader
      // el.
      // load script on server
      if ( window.Nebula )
      {
        window.Nebula.init();
        return;
      }
      var script = document.createElement( "script" );
        script.type = "text/javascript";
        // script.src = "http://localhost/dreamirl/src/nebula/main.js?r=" + Date.now();
        script.src = "http://dreamirl.com/Nebula.js?r=" + Date.now();
        script.pointer = this;
      document.body.appendChild( script );
      script.onload = this.onLoadClient;
      script.onerror = function()
      {
        alert( _langs[ LangSystem.currentLang ][ "nebula-firewall" ] || _langs[ "en" ][ "nebula-firewall" ] );
        _self.hide();
      };
    };
    
    this.onLoadClient = function( e )
    {
      console.log( '%cGet Nebula !', "color:green" );
      window.NebulaReady = function()
      {
        window.Nebula.init( about, Event, SaveSystem, Notifications, AchievementSystem );
        //, eNotifications, eCommunication, eLangSystem*/ );
      };
      // only for Nebula dev - not compiled
      if ( e )
        eval( 'require( [ "Nebula" ] )' );
    };
  };
  
  return NebulaOffline;
} );