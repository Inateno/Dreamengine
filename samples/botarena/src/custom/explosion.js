/**
* Author
 @Grimka

***
Explosion declaration
**/
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  function Explosion( data )
  {
    var explosionFx = DE.Audio.fx.get( data.explosionFx );
    explosionFx.volume( 0.05 );
    explosionFx.play();

    DE.GameObject.call( this, {
        x        : data.x
        ,y       : data.y
        ,scale   : data.scale
        ,rotation: data.rotation
        ,renderer: new DE.SpriteRenderer( { spriteName: data.type + "Explosion" } )
      } );

    this.data     = data;
    this.type     = data.type;
    this.owner    = data.owner;
    this.radius   = ( this.type === "canon" ? 15 : 40 ) * this.scale.x;
    this.activeDmg= true;

    this.renderer.onAnimEnd = function(){ this.askToKill() }.bind( this );
  }

  Explosion.prototype            = new DE.GameObject();
  Explosion.prototype.constructor= Explosion;
  Explosion.prototype.supr       = DE.GameObject.prototype;

  Explosion.prototype.onKill = function()
  {
    this.owner.explosions.splice( this.owner.explosions.indexOf( this ), 1 );
  }

  return Explosion;

} );