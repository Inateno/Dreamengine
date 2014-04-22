define( [ "datas", "DREAM_ENGINE" ]
, function( datas, DE )
{
  // args are written with a _ because they become private (we use args later in methods)
  // player reference is optionnal, only when it's an enemy instantiating a bullet
  function Bullet( _screenSizes, _parent, _player )
  {
    DE.GameObject.call( this, {
      "x": _parent.position.x, "y": _parent.position.y, "zindex": _parent.zindex + 1
      , "tag": _parent.tag == "player" ? "b-p" : "b-e"
      , "renderer": new DE.SpriteRenderer( { "spriteName": ( _parent.tag == "player" ? "p" : "e" ) + "-fire"
                                          , "scale": 0.7 } )
      , "collider": new DE.CircleCollider( 30 )
    } );
    this.vector = { x: 0, y: 0 };
    
    if ( _parent.tag == "player" )
    {
      this.vector.y = -10;
      this.position.y -= 50;
      this.tag = "p-bullet";
      this.renderers[ 0 ].onAnimEnd = function()
      {
        this.startFrame = 8;
        this.isLoop = true;
        this.restartAnim();
      }
    }
    else
    {
      this.position.y += datas.enemies[ _parent.name ].bulletOffset;
      this.vector.y = 10;
      this.tag = "e-bullet";
    }
    
    this.gameLogic = function()
    {
      this.translate( this.vector );
      
      if ( this.position.y < -50 || this.position.y > _screenSizes.h + 50 )
        this.askToKill();
      
      if ( _player )
      {
        if ( _player.enable && !_player.flipping
            && DE.CollisionSystem.circleCollision( this.collider, _player.collider ) )
        {
          this.askToKill();
          _player.getDamage();
        }
      }
      else
      {
        // player bullets, checking collisions with all objects in the scene
        var gos = this.scene.gameObjects;
        for ( var n = 0, t = gos.length, g; n < t; ++n )
        {
          g = gos[ n ];
          if ( g.tag == "enemy" && DE.CollisionSystem.circleCollision( this.collider, g.collider ) )
          {
            g.getDamage();
            this.askToKill();
            return;
          }
        }
      }
    }
    
    this.addAutomatism( "logic", "gameLogic" );
  }
  
  Bullet.prototype = new DE.GameObject();
  Bullet.prototype.constructor = Bullet;
  Bullet.prototype.supr        = DE.GameObject.prototype;
  
  return Bullet;
} );