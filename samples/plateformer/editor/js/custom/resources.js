define( [],
function()
{
  // tag : steps = escalier, bounce = fait rebondir (sur l'axe y )
  var resources = {
    components: {
      "floor_large":{
        "name":"floor_large","tag":"block","sprite":"platform","isTile":1
        ,"sx":0,"sy":0,"tw":512,"th":512,"w":512,"h":512
        ,"collider":{"type":"box","w":512,"h":512,"r":50,"l":0,"t":0},"zindex":0
      }
      , "wall":{
        "name":"wall","tag":"block","sprite":"platform","isTile":1
        ,"sx":0,"sy":0,"tw":128,"th":512,"w":128,"h":512
        ,"collider":{"type":"box","w":128,"h":512,"r":50,"l":0,"t":0},"zindex":0
      }
      ,"platform":{
        "name":"platform","tag":"block","sprite":"platform","isTile":1
        ,"sx":0,"sy":0,"tw":512,"th":128,"w":512,"h":128
        ,"collider":{"type":"box","w":512,"h":128,"r":50,"l":0,"t":0},"zindex":0
      }
    }
    
    , gridsize: 32 // taille de la grille d'émantation
    , scene: null
    , currentEl: null
    , elGui: null
  };
  window.resources = resources;
  return resources;
} );