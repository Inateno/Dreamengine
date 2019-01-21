/**
* Author
 @Grimka

***
Map declaration
**/
define( [ 'DREAM_ENGINE', 'Tile', 'astar' ],
function( DE , Tile, astar )
{

  function Map( data )
  {
    DE.GameObject.call( this );

    this.tiles = [];
    this.walls = [];
    this.ennemiSpawns = [];

    //use a canvas then draw the map inside to allow pixel by pixel color reading
    var pixelReader = document.createElement( 'canvas' ).getContext( '2d' );
    pixelReader.drawImage(data.baseTexture.source, 0, 0);

    //store map data as 0 (wall) or 1 (ground) in a grid to run a* later
    var astarGrid = [];

    for ( var y = 0; y < data.width; y++ )
    {
      var gridLine = [];

      for ( var x = 0; x < data.width; x++ )
      {
        var rawData = pixelReader.getImageData( x, y, 1, 1 ).data;
        var pixel = { r: rawData[0], g: rawData[1], b: rawData[2] };
        var tileType = Tile.getTypeFromPixel( pixel );

        var tile = new Tile( { 
          type: tileType
          ,x  : x * Tile.Size.x + Tile.Size.x / 2
          ,y  : y * Tile.Size.y + Tile.Size.y / 2 
        } );

        this.add( tile );

        this.tiles.push( tile );

        if ( tileType === "wall" || tileType === "ennemiSpawn" )
          this.walls.push( tile );

        if ( tileType === "ennemiSpawn" )
          this.ennemiSpawns.push( tile );

        if ( tileType === "playerSpawn" )
          this.playerSpawn = tile;

        gridLine.push( tileType === "wall" ? 0 : 1 );
      }

      astarGrid.push( gridLine );
    }

    //generating wall/ground graph for the pathfinder api
    this.graph = new astar.Graph( astarGrid, { diagonal: true } );

    this.cacheAsBitmap = true;
  }

  Map.prototype            = new DE.GameObject();
  Map.prototype.constructor= Map;
  Map.prototype.supr       = DE.GameObject.prototype;

  Map.prototype.checkWallCollision = function( box )
  {
    var wallBox = {
      x: 0
      ,y: 0
      ,width: Tile.Size.x
      ,height: Tile.Size.y
    };

    for ( var i = 0; i < this.walls.length; i++ ) {
      wallBox.x = this.walls[i].x - Tile.Size.x / 2;
      wallBox.y = this.walls[i].y - Tile.Size.y / 2;

      if( !( box.x > wallBox.x + wallBox.width
          || box.y > wallBox.y + wallBox.height
          || box.x + box.width < wallBox.x
          || box.y + box.height < wallBox.y ) ) {
        return true;
      }
    }

    return false;
  }

  Map.prototype.posToCell = function( pos )
  {
    return { x: Math.floor( pos.x / Tile.Size.x ), y: Math.floor( pos.y / Tile.Size.y ) };
  }

  Map.prototype.cellToPos = function( pos )
  {
    return { x: pos.x * Tile.Size.x + Tile.Size.x / 2, y: pos.y * Tile.Size.y + Tile.Size.y / 2};
  }

  Map.prototype.getRandomEnnemiSpawn = function()
  {
    return this.ennemiSpawns[ Math.floor( Math.random() * this.ennemiSpawns.length ) ];
  }

  return Map;

} );