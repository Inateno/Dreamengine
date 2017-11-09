/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the dictionary file sample that will be loaded by the project in the Localization module
 * Please declare in the same way than this example.
 */

define( []
, function()
{
  var dictionary = {
    "en": {
      "play": "Play"
      ,"settings": "Settings"
      ,"credits": "Credits"
      ,"pause": "Pause"
      
      ,"nebula-bad-namespace": "No namespace given for the game, disable Nebula or set a valid namespace in about"
      ,"nebula-title"        : "Connect to Nebula system"
      ,"nebula-description"  : "Login to synchronize and save your progressions on Dreamirl's servers, you'll synchronize the same progression on your mobile, computer, laptop, whatever!<br />No registered ? You can do it from interface, click Login."
      ,"nebula-login"        : "Login"
      ,"nebula-nop"          : "No thank you"
      ,"nebula-firewall"     : "Cannot load, seems you firewall block connexion, or server is down"
    }
    , "fr" : {
      "play": "Jouer"
      ,"settings": "Options"
      ,"credits": "Credits"
      ,"pause": "Pause"
      
      ,"nebula-bad-namespace": "Aucun namespace valide n'a été trouvé, désactivation du module Nebula (vous pouvez aussi le désactiver automatiquement)"
      ,"nebula-title"        : "Connexion au système Nebula"
      ,"nebula-description"  : "Connectez vous pour synchroniser et sauvegarder votre progression sur les serveur Dreamirl, vous pourrez ainsi conserver le même avancement sur votre mobile, votre pc ou votre pc portable !<br />Pas inscrit ? Vous pouvez le faire depuis l'interface!"
      ,"nebula-login"        : "Se connecter"
      ,"nebula-nop"          : "Non merci"
      ,"nebula-firewall"     : "Chargement impossible, il semble que votre pare-feu bloque la connexion, ou le serveur est down"
    }
  };
  
  return dictionary;
} );