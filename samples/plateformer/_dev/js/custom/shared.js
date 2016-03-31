define( [],
function()
{
  var shared = {
    levels: {
      "test": {
        components: [{"x":3744,"y":832,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":3744,"y":320,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":3232,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":3232,"y":0,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":2720,"y":-512,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":2720,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":2720,"y":0,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":2208,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":1952,"y":224,"z":0,"name":"wall","zindex":0,"rotation":0},{"x":1696,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":1632,"y":-864,"z":0,"name":"platform","zindex":0,"rotation":0},{"x":1632,"y":32,"z":0,"name":"platform","zindex":0,"rotation":0},{"x":1184,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":864,"y":-384,"z":0,"name":"platform","zindex":0,"rotation":0},{"x":672,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":672,"y":384,"z":0,"name":"platform","zindex":0,"rotation":0},{"x":352,"y":192,"z":0,"name":"wall","zindex":0,"rotation":0},{"x":160,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-352,"y":1024,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-352,"y":-512,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-352,"y":512,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-864,"y":-256,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-864,"y":512,"z":0,"name":"floor_large","zindex":0,"rotation":0},{"x":-1376,"y":128,"z":0,"name":"floor_large","zindex":0,"rotation":0}]
      }
    }
    
    , components: {
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
  };
  
  return shared;
} );