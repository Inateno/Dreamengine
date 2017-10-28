define( [],
function()
{
  var about = {};
  
  about.DEName = "about";
  about.engineVersion= "2.0";
  about.gameName    = "My-Dreamengine-Game";
  about.gameVersion = "0.1.0";
  about.gameAuthor  = "Dreamirl";
  
  about.set = function( values )
  {
    values = values || {};
    about.gameName    = values.gameName || about.gameName;
    about.gameVersion = values.gameVersion || about.gameVersion;
    about.gameAuthor  = values.gameAuthor || about.gameAuthor;
    about.namespace   = values.namespace || null;
    about.gamePrice   = values.gamePrice || null;
    about.packPrice   = values.packPrice || null;
  };
  
  return about;
} );