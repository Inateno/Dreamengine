define( [ 'DE.about', 'DE.Event', 'DE.LangSystem' ],
function( about, Event, LangSystem )
{
  var _demoTemplate = "<div class='centeredModal'><div class='close'>X</div><h3 class='title'></h3><div class='about'></div></div>";
  var _endDemoTemplate = "<div class='centeredModal'><div class='close'>X</div><h3 class='title'></h3><div class='about'></div></div>";
  
  var _langs = {
    "en": {
      "bad-namespace": "No valid namespace has been found, disabling Demo (you can also disable it manually)"
      ,"demo-title"  : "Trial version"
      ,"demo-launch" : "<p>You are currently playing a trial version.<br />Please go to <a target='_blank' href='http://dreamirl.com/#Shop/Shop'>the website</a> to unlock all the games.</p>"
      
      ,"demo-title-end"          : "End of the trial version"
      ,"demo-end"                : "<p>You have finished the trial version. To continue playing the game you have to unlock it. You have the choice to:</p>"
      ,"demo-end-choice"         : "<div class='nebula-demo-choice'>\
          <div>\
            <h3>Buy a pack</h3>\
            <p>\
            Buy a pack once to unlock a life access to all the games which are on Dreamirl,\
            even those which are not released yet.\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop' class='btn btn-primary'>Buy a pack on the website</a>\
          </div>\
          <div>\
            <h3>Buy only the game</h3>\
            <p>\
            You can buy only the game if you don't want to buy a pack.\
              <br>\
              <br>\
              <br>\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop/Basket/addGame/%namespace%' class='btn btn-primary buyGame'>Buy the game on the website</a>\
          </div>\
        </div>"
      ,"demo-end-choice-complete": "<div class='nebula-demo-choice'>\
          <div>\
            <h3>Buy a Pack</h3>\
            <p>\
            Buy a pack once to unlock a life access to all the games which are on Dreamirl,\
            even those which are not released yet.\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop' class='btn btn-primary'>Buy a pack starting from %packPrice%€</a>\
          </div>\
          <div>\
            <h3>Buy only the game</h3>\
            <p>\
              You can buy only the game if you don't want to buy a pack.\
              <br>\
              <br>\
              <br>\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop/Basket/addGame/%namespace%' class='btn btn-primary buyGame'>Buy the game for %gamePrice%€</a>\
          </div>\
        </div>"
      ,"demo-end-about": "<p>By buying a pack or the game you will have the all game updates for free.</p>"
    }
    , "fr": {
      "bad-namespace": "Aucun namespace valide n'a été trouvé, désactivation du module Nebula (vous pouvez aussi le désactiver automatiquement)"
      ,"demo-title"  : "Version de démonstration"
      ,"demo-launch": "<p>Vous jouez actuellement à une version demo.<br />Visitez <a target='_blank' href='http://dreamirl.com/#Shop/Shop'>notre site</a> pour obtenir l'accès complet à tout nos jeux.</p>"
      
      ,"demo-title-end"          : "Fin de la version démo"
      ,"demo-end"                : "<p>Vous êtes arrivé à la fin de la démo. Pour continuer à jouer vous devez débloquer le jeu. Vous avez le choix:</p>"
      ,"demo-end-choice"         : "<div class='nebula-demo-choice'>\
          <div>\
            <h3>Acheter un pack</h3>\
            <p>\
              Achetez un pack une seule fois pour obtenir l'accès à vie à tout les jeux qui sont sur la plateforme,\
               y compris ceux qui sortirons plus tard.\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop' class='btn btn-primary'>Acheter un pack sur notre site</a>\
          </div>\
          <div>\
            <h3>Acheter le jeu uniquement</h3>\
            <p>\
              Vous pouvez acheter le jeu seul si le pack ne vous intéresse pas.\
              <br>\
              <br>\
              <br>\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop/Basket/addGame/%namespace%' class='btn btn-primary'>Acheter le jeu sur notre site</a>\
          </div>\
        </div>"
      ,"demo-end-choice-complete": "<div class='nebula-demo-choice'>\
          <div>\
            <h3>Acheter un pack</h3>\
            <p>\
              Achetez un pack une seule fois pour obtenir l'accès à vie à tout les jeux qui sont sur la plateforme,\
               y compris ceux qui sortirons plus tard.\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop' class='btn btn-primary'>Acheter un pack à partir de %packPrice%€</a>\
          </div>\
          <div>\
            <h3>Acheter le jeu uniquement</h3>\
            <p>\
              Vous pouvez acheter le jeu seul si le pack ne vous intéresse pas.\
              <br>\
              <br>\
              <br>\
            </p>\
            <a target='_blank' href='http://dreamirl.com/#Shop/Basket/addGame/%namespace%' class='btn btn-primary'>Acheter le jeu pour %gamePrice%€</a>\
          </div>\
        </div>"
      ,"demo-end-about": "<p>En achetant le pack ou le jeu seul, vous obtiendrez toutes les futures mises à jours du jeu gratuitement.</p>"
    }
  };
  
  var DemoPopups = new function()
  {
    var _self = this;
    this.elParent  = null;
    this.container = null;
    this.tempLoader= null;
    this.DEName    = "DemoPopups";
    
    this.init = function( elId )
    {
      if ( !_langs[ LangSystem.currentLang ] )
        _langs[ LangSystem.currentLang ] = {};
      
      if ( !about.namespace )
      {
        alert( _langs[ LangSystem.currentLang ][ "bad-namespace" ] || _langs[ "en" ][ "bad-namespace" ] );
        return;
      }
      var elParent = elId ? document.getElementById( elId ) || document.body : document.body;
      var el = document.createElement( "div" );
      el.id = "NebulaDemo";
      el.innerHTML = _demoTemplate;
      this.elParent = elParent;
      elParent.appendChild( el );
      
      el.getElementsByClassName( "title" )[ 0 ].innerHTML = _langs[ LangSystem.currentLang ][ "demo-title" ] || _langs[ "en" ][ "demo-title" ];
      el.getElementsByClassName( "about" )[ 0 ].innerHTML = _langs[ LangSystem.currentLang ][ "demo-launch" ] || _langs[ "en" ][ "demo-launch" ];
      
      el.getElementsByClassName( "close" )[ 0 ].addEventListener( "click", function()
      {
        _self.hide();
      }, true );
      this.container = el;
      
      // disply first popup when images load end
      Event.on( 'notisLoadingImages', function()
      {
        _self.show();
      } );
      Event.on( 'demo-end', function()
      {
        _self.showEndPopup();
      } );
    };
    
    this.showEndPopup = function()
    {
      this.container.getElementsByClassName( "title" )[ 0 ].innerHTML = _langs[ LangSystem.currentLang ][ "demo-title-end" ] || _langs[ "en" ][ "demo-title-end" ];
      
      if ( about.packPrice && about.gamePrice )
      {
        var abouttxt = ( _langs[ LangSystem.currentLang ][ "demo-end" ] || _langs[ "en" ][ "demo-end" ] ) +
          ( _langs[ LangSystem.currentLang ][ "demo-end-choice-complete" ] || _langs[ "en" ][ "demo-end-choice-complete" ] )
          + ( _langs[ LangSystem.currentLang ][ "demo-end-about" ] || _langs[ "en" ][ "demo-end-about" ] );
        abouttxt = abouttxt.replace( "%packPrice%", about.packPrice ).replace( "%gamePrice%", about.gamePrice );
      }
      else
      {
        var abouttxt = ( _langs[ LangSystem.currentLang ][ "demo-end" ] || _langs[ "en" ][ "demo-end" ] ) +
          ( _langs[ LangSystem.currentLang ][ "demo-end-choice" ] || _langs[ "en" ][ "demo-end-choice" ] )
          + ( _langs[ LangSystem.currentLang ][ "demo-end-about" ] || _langs[ "en" ][ "demo-end-about" ] );
      }
      abouttxt = abouttxt.replace( "%namespace%", about.namespace );
      this.container.getElementsByClassName( "about" )[ 0 ].innerHTML = abouttxt;
      this.show();
    }
    
    this.hide = function()
    {
      this.visible = false;
      this.container.className += this.container.className += " fading";
      setTimeout( function()
      {
        _self.container.className += " hided";
      }, 200 );
    };
    this.show = function()
    {
      this.visible = true;
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
  };
  
  return DemoPopups;
} );