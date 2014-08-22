define( [ 'DE.about', 'DE.Event', 'DE.Inputs', 'DE.SaveSystem', 'DE.LangSystem'
        , 'DE.Notifications', 'DE.AchievementSystem' ],
function( about, Event, Inputs, SaveSystem, LangSystem
        , Notifications, AchievementSystem )
{
  var _offLineTemplate = "<div class='centeredModal'><div class='close'>X</div><h3 class='title'></h3><p class='about'></p><div class='btns'><button class='yesLoad'></button><button class='noLoad'></button></div></div>";
  var _offLineVignet = "<div class='vignet'>Op</div>";
  
  var _langs = {
    "en": {
      "nebula-bad-namespace": "No namespace given for the game, disable Nebula or set a valid namespace in about"
      ,"nebula-title"        : "Connect to Nebula system"
      ,"nebula-description"  : "Login to synchronize and save your progressions on Dreamirl's servers, you'll synchronize the same progression on your mobile, computer, laptop, whatever!<br />No registered ? You can do it from interface, click Login."
      ,"nebula-login"        : "Login"
      ,"nebula-nop"          : "No thank you"
      ,"nebula-firewall"     : "Cannot load, seems you firewall block connexion, or server is down"
    }
    , "fr": {
      "nebula-bad-namespace": "Aucun namespace valide n'a été trouvé, désactivation du module Nebula (vous pouvez aussi le désactiver automatiquement)"
      ,"nebula-title"        : "Connexion au système Nebula"
      ,"nebula-description"  : "Connectez vous pour synchroniser et sauvegarder votre progression sur les serveur Dreamirl, vous pourrez ainsi conserver le même avancement sur votre mobile, votre pc ou votre pc portable !<br />Pas inscrit ? Vous pouvez le faire depuis l'interface!"
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
      vi.innerHTML = "OP";
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
        window.Nebula.init( about, Event, Inputs, SaveSystem, Notifications, AchievementSystem );
        //, eNotifications, eCommunication, eLangSystem*/ );
      };
      // only for Nebula dev - not compiled
      if ( e )
        eval( 'require( [ "Nebula" ] )' );
    };
  };
  
  return NebulaOffline;
} );