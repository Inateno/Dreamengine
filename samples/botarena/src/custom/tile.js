/**
* Author
 @Grimka

***
Tile declaration
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  function Tile( data )
  {
    this.type = data.type;

    var spriteName = this.type;
    if ( this.type === "ground" )
      spriteName += Math.floor( Math.random() * 2 );
    else if ( this.type === "playerSpawn" )
      spriteName = "ground" + Math.floor( Math.random() * 2 );

    DE.GameObject.call(this, {
      x        : data.x
      ,y       : data.y
      ,renderer: new DE.TextureRenderer( { spriteName: spriteName  } )
    });
  }

  Tile.Types = {
    ground      : { r: 100, g: 100, b: 100 }

    ,wall       : { r: 0,   g: 0,   b: 0 }

    ,ennemiSpawn: { r: 100, g: 0,   b: 100 }
    ,playerSpawn: { r: 0,   g: 100, b: 0 }
  }

  Tile.getTypeFromPixel = function ( pixel )
  {
    for ( var type in Tile.Types )
    {
      if ( Tile.Types[type].r == pixel.r
        && Tile.Types[type].g == pixel.g
        && Tile.Types[type].b == pixel.b )
      {
        return type;
      }
    }

    //default
    return "wall";
  }

  Tile.Size = { 
    x : 60
    ,y: 60 
  };

  Tile.prototype            = new DE.GameObject();
  Tile.prototype.constructor= Tile;
  Tile.prototype.supr       = DE.GameObject.prototype;

  return Tile;

} );