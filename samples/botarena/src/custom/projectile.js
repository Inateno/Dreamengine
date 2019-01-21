/**
* Author
 @Grimka

***
Projectile declaration
**/
define( [ 'DREAM_ENGINE', 'Explosion' ],
function( DE , Explosion )
{
  function Projectile( data )
  {
    var bulletFx = DE.Audio.fx.get( data.bulletFx );
    bulletFx.volume( 0.05 );
    bulletFx.play();

    DE.GameObject.call(this, {
        x        : data.x
        ,y       : data.y
        ,rotation: data.rotation + ( data.accuracy ? ( Math.random() * data.accuracy - data.accuracy / 2 ) * ( Math.PI / 180 ) : 0 )
        ,renderer: new DE.TextureRenderer( { spriteName: data.type + "Green" } )
      } );

    this.data = data;
    this.type = data.type;
    this.owner= data.owner;

    this.addAutomatism( "checkWallCollision", "checkWallCollision" );

    if ( data.speed && data.speed > 0 )
      this.addAutomatism( "translateY", "translateY", { value1: -data.speed  } );
    if ( data.lifetime && data.lifetime > 0 )
      this.addAutomatism( "askToKill", "askToKill", { interval: data.lifetime, persistent: false } );
  }

  Projectile.prototype            = new DE.GameObject();
  Projectile.prototype.constructor= Projectile;
  Projectile.prototype.supr       = DE.GameObject.prototype;

  Projectile.prototype.checkWallCollision = function()
  {
    if ( Game.world.map.checkWallCollision( { x: this.x, y: this.y, width: 0, height: 0} ) )
        this.askToKill();
  }

  Projectile.prototype.onKill = function()
  {
    this.owner.projectiles.splice( this.owner.projectiles.indexOf( this ), 1 );

    if ( this.data.explosion )
    {
      this.data.explosion.owner = this.owner;
      this.data.explosion.x = this.x;
      this.data.explosion.y = this.y;
      this.data.explosion.rotation = this.rotation;
      
      var explosion = new Explosion( this.data.explosion );
      Game.world.add( explosion );

      this.owner.explosions.push( explosion );
    }
  }

  return Projectile;

} );