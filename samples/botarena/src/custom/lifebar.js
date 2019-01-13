/**
* Author
 @Grimka

***
Lifebar declaration
**/
define( [ 'DREAM_ENGINE'],
function( DE )
{
  function Lifebar(data)
  {
    DE.GameObject.call(this, {
        renderer: new DE.GraphicRenderer([{"beginFill": "0xff0000"}, { "drawRect": [ 0, 0, 40, 3 ] }, { "endFill": [] }])
      } );

    this.x = -this.width/2;

    this.data = data;
    this.currentHealth = data.maxHealth;
  }

  Lifebar.prototype = new DE.GameObject();
  Lifebar.prototype.constructor = Lifebar;
  Lifebar.prototype.supr        = DE.GameObject.prototype;

  Lifebar.prototype.setCurrentHealth = function(health)
  {
    this.currentHealth = health;
    
    this.renderer.clear();
    this.renderer.beginFill(0xff0000);
    this.renderer.drawRect(0,0,Math.max(40 * (this.currentHealth / this.data.maxHealth), 0), 3);
    this.renderer.endFill();
  }

  return Lifebar;

} );