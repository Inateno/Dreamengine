define( [ 'datas', 'DREAM_ENGINE', 'Bullet' ],
function( datas, DE, Bullet )
{
  // args are written with a _ because they become private (we use args later in methods)
  // optimising performances here by passing the player to check collisions only with this objects
  // (we don't need to search it inside all gameObjects,
  //  and we will give the player's reference to Bullets to do the same)
  function Enemy( _screenSizes, params, _player )
  {
    var _myd = datas.enemies[ params.name ];
    DE.GameObject.call( this, {
      "x": params.x, "y": params.y, "name": params.name, "tag": "enemy"
      ,"renderer": new DE.SpriteRenderer( { "spriteName": _myd.spriteName
                                         , "startFrame": _myd.frame, "scale": _myd.scale || 1 } )
      ,"collider": new DE.CircleCollider( _myd.radius || 50
                        , { "offsetX": _myd.colOffsetX || 0, "offsetY": _myd.colOffsetY || 0 } )
    } );
    
    this.lastFire   = Date.now();
    this.fireRate   = _myd.fireRate;
    this.life       = _myd.life;
    this.offsetFire = _myd.offsetFire || 0;
    this.speed      = _myd.speed || 4;
    
    this.gameLogic = function()
    {
      if ( this.position.y > 1400 )
        this.askToKill();
      if ( _player.enable && !_player.flipping
          && DE.CollisionSystem.circleCollision( this.collider, _player.collider ) )
      {
        this.askToKill();
        _player.getDamage();
      }
      this.translateY( this.speed );
      this.fire();
    }
    // very simple fire method, just a fireRate
    this.fire = function()
    {
      if ( !this.enable || !this.fireRate || Date.now() - this.lastFire < this.fireRate )
        return;
      this.lastFire = Date.now();
      this.scene.add( new Bullet( _screenSizes, this, _player ) );
    }
    
    this.getDamage = function()
    {
      this.life--;
      if ( this.life <= 0 )
        this.askToKill();
    }
    
    this.addAutomatism( "IA", "gameLogic" );
  };
  
  Enemy.prototype = new DE.GameObject();
  Enemy.prototype.constructor = Enemy;
  Enemy.prototype.supr        = DE.GameObject.prototype;
  
  return Enemy;
} );