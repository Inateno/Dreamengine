/**
* Author
 @Grimka

***
Ennemi declaration
**/
define( [ 'DREAM_ENGINE', 'astar', 'Lifebar' ],
function( DE, astar, Lifebar )
{

  function Ennemi( data )
  {
    this.lifebar = new Lifebar( { maxHealth:data.health } );
    this.lifebar.y = -20;

    DE.GameObject.call( this,{
      x           : data.x
      ,y          : data.y
      ,scale      : data.scale || 1
      ,axes       : new DE.Vector2( 0, 0 )
      ,gameObjects: [ this.lifebar ]
      ,renderer   : new DE.SpriteRenderer( { spriteName: "spider" } )
    });

    this.type = data.type;

    this.health   = data.health;
    this.moveSpeed= 2;
    this.radius   = 20;
    this.damage   = data.damage;

    this.findPath();

    this.addAutomatism( "findPath", "findPath", { interval: 100 } );
    this.addAutomatism( "move", "move" );
    this.addAutomatism( "lookAt", "lookAt", { value1: this.axes, value2: Math.PI * 1.5 } );
  }

  Ennemi.prototype            = new DE.GameObject();
  Ennemi.prototype.constructor= Ennemi;
  Ennemi.prototype.supr       = DE.GameObject.prototype;

  //override ennemi lookat to handle specific behaviour
	Ennemi.prototype.lookAt = function( vector2, angleOffset )
	{
		if ( vector2.x === 0 && vector2.y === 0 )
			return this;

		var origin = { x: 0, y: 0 };
		this.renderer.rotation = vector2.getAngle( origin ) + ( angleOffset || 0 );

		return this;
	};

  Ennemi.prototype.findPath = function()
  {
  	var selfPos = Game.world.map.posToCell( this );
  	var playerPos = Game.world.map.posToCell( Game.world.player );

  	var start = Game.world.map.graph.grid[ selfPos.y ][ selfPos.x ];
  	var end = Game.world.map.graph.grid[ playerPos.y ][ playerPos.x ];

  	this.path = astar.astar.search( Game.world.map.graph, start, end, { heuristic: astar.astar.heuristics.diagonal } );
  }

  Ennemi.prototype.move = function()
  {
  	if ( this.path.length == 0 )
		{
      var target = Game.world.player

      this.axes.x = target.x - this.x;
      this.axes.y = target.y - this.y;
    }
    else
    {
      var target = Game.world.map.cellToPos( this.path[ 0 ] );

      this.axes.x = target.y - this.x;
      this.axes.y = target.x - this.y;
    }

    this.axes.normalize();
    this.translate( { x: this.axes.x * this.moveSpeed, y: this.axes.y * this.moveSpeed }, true );
  }

  Ennemi.prototype.takeDamage = function( amount )
  {
    this.health -= amount;
    if (this.health <= 0 )
      this.dead = true;

    this.lifebar.setCurrentHealth( this.health );
  }

  return Ennemi;

} );