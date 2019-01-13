/**
* Author
 @Grimka 

***
Player declaration
**/
define( [ 'DREAM_ENGINE', "Projectile", 'Lifebar'],
function( DE , Projectile, Lifebar)
{

  function Player(data)
  {
    this.health = 100;
    this.lifebar = new Lifebar({maxHealth:this.health});
    this.lifebar.y = -25;

    this.timeSinceLastGatlingFire = 0;
    this.gatlingFireInterval = 10;
    this.gatlingDmg = 10;

    this.timeSinceLastCanonFire = 0;
    this.canonFireInterval = 90;
    this.canonDmg = 50;
    this.canonAoe = 2;

    this.timeSinceLastMineFire = 0;
    this.mineFireInterval = 300;
    this.mineDmg = 100;
    this.mineAoe = 2;

    this.explosions = [];
    this.projectiles = [];

    this.boxCollider = {x:0, y:0, width:35, height:35};
    this.htestBox = {x:0, y:0, width:35, height:35};
    this.vtestBox = {x:0, y:0, width:35, height:35};
    this.radius = 20 * this.scale.x;

    this.turret = new DE.GameObject({renderer : new DE.TextureRenderer( { spriteName: "turret" } )});
    this.wheels = new DE.GameObject({renderer : new DE.SpriteRenderer( { spriteName: "playerWheels" } )});

    //override wheels lookat to handle specific behaviour
    this.wheels.lookAt = function( vector2, angleOffset )
    {
      if(vector2.x === 0 && vector2.y === 0)
        return this;
      
      var origin = { x: 0, y: 0 };
      this.rotation = vector2.getAngle( origin ) + ( angleOffset || 0 );
      
      return this;
    };

    DE.GameObject.call(this,{
      x : data.startX, y:data.startY, scale : 1.5
      , gameObjects:[ this.wheels, this.turret, this.lifebar ]
      , axes : new DE.Vector2( 0, 0)
      , moveSpeed : 3.5
      , automatisms: [ [ "move", "move" ] ]
    });


    this.add(this.lifebar);

    this.turret.addAutomatism("lookAt", "lookAt", { value1: data.target, value2: Math.PI/2 });
    this.wheels.addAutomatism("lookAt", "lookAt", { value1: this.axes, value2: Math.PI/2 });

    this.addAutomatism("updateWeapons", "updateWeapons");

    this.bindInputs();

    this.updateColliders();
  }

  Player.prototype = new DE.GameObject();
  Player.prototype.constructor = Player;
  Player.prototype.supr        = DE.GameObject.prototype;

  Player.prototype.bindInputs = function()
  {
    var self = this;

    DE.Inputs.on( "keyDown", "left", function() { self.axes.x = -1; } );
    DE.Inputs.on( "keyDown", "right", function() { self.axes.x = 1; } );
    DE.Inputs.on( "keyUp", "right", function() { self.axes.x = 0; } );
    DE.Inputs.on( "keyUp", "left", function() { self.axes.x = 0; } );
    
    DE.Inputs.on( "keyDown", "up", function() { self.axes.y = -1; } );
    DE.Inputs.on( "keyDown", "down", function() { self.axes.y = 1; } );
    DE.Inputs.on( "keyUp", "down", function() { self.axes.y = 0; } );
    DE.Inputs.on( "keyUp", "up", function() { self.axes.y = 0; } );

    DE.Inputs.on( "keyDown", "useMine", function() { self.useMine(); } );
  }

  Player.prototype.updateColliders = function()
  {
    this.boxCollider.x = this.x - this.boxCollider.width/2;
    this.boxCollider.y = this.y - this.boxCollider.height/2;

    this.htestBox.x = this.boxCollider.x;
    this.htestBox.y = this.boxCollider.y;
    this.vtestBox.x = this.boxCollider.x;
    this.vtestBox.y = this.boxCollider.y;
  }

  Player.prototype.move = function()
  {
    if(this.axes.x === 0 && this.axes.y === 0)
    {
      this.wheels.renderer.setPause(true);
      return;
    }

    this.wheels.renderer.setPause(false);

    this.axes.normalize();

    var newAxes = new DE.Vector2(this.axes.x, this.axes.y);

    this.htestBox.x += newAxes.x * this.moveSpeed * DE.Time.deltaTime;
    if(Game.world.map.checkWallCollision(this.htestBox))
      newAxes.x = 0;

    this.vtestBox.y += newAxes.y * this.moveSpeed * DE.Time.deltaTime;
    if(Game.world.map.checkWallCollision(this.vtestBox))
      newAxes.y = 0;

    this.translate( { x: newAxes.x * this.moveSpeed, y: newAxes.y * this.moveSpeed }, true );

    this.updateColliders();
  }

  Player.prototype.checkMouseEvent = function(e)
  {
    if(e.data.button === 0) {
      if(e.type === "pointerdown")
        this.addAutomatism("fireGatling", "fireGatling");
      else
        this.removeAutomatism("fireGatling");
    }
    else if(e.data.button === 2 && e.type === "pointerdown") {
      this.shootCanon();
    }
  }

  Player.prototype.updateWeapons = function()
  {
    this.timeSinceLastGatlingFire -= DE.Time.deltaTime;
    this.timeSinceLastCanonFire -= DE.Time.deltaTime;
    this.timeSinceLastMineFire -= DE.Time.deltaTime;
  }

  Player.prototype.fireGatling = function()
  {
    if(this.timeSinceLastGatlingFire <= 0)
    {
      this.timeSinceLastGatlingFire = this.gatlingFireInterval;

      this.createBullet( { type:"smallBullet", speed:15, damage:this.gatlingDmg, accuracy:5, bulletFx:"piew" } );
    }
  }

  Player.prototype.shootCanon = function()
  {
    if(this.timeSinceLastCanonFire <= 0)
    {
      this.timeSinceLastCanonFire = this.canonFireInterval;

      this.createBullet( { type:"bigBullet", speed:7.5, damage:this.canonDmg * 0.2, bulletFx:"piew", explosion:{ type:"canon", explosionFx:"piew", scale:this.canonAoe, damage: this.canonDmg } } );
    }
  }

  Player.prototype.useMine = function()
  {
    if(this.timeSinceLastMineFire <= 0)
    {
      this.timeSinceLastMineFire = this.mineFireInterval;

      this.createBullet( { type:"mine", lifetime:3000, bulletFx:"piew", explosion:{ type:"mine", explosionFx:"piew", scale:this.mineAoe, damage:this.mineDmg } } );
    } else { //if a mine is alive, make it manually explode
      for (var i = 0; i < this.projectiles.length; i++)
      {
        var proj = this.projectiles[i];

        if(proj.type === "mine")
        {
          proj.askToKill();
          this.projectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  Player.prototype.createBullet = function(data)
  {
    data.owner = this;
    data.x = this.x;
    data.y = this.y;
    data.rotation = this.turret.rotation;
    var projectile = new Projectile(data);

    Game.world.add(projectile);
    this.projectiles.push(projectile);
  }

  Player.prototype.takeDamage = function(amount)
  {
    this.health -= amount;
    if(this.health <= 0)
      this.dead = true;

    this.lifebar.setCurrentHealth(this.health);
  }

  Player.prototype.upgradeGatlingDmg = function()
  {
    this.gatlingDmg *= 1.1;
  }

  Player.prototype.upgradeGatlingFireRate = function()
  {
    this.gatlingFireInterval *= 0.9;
  }

  Player.prototype.upgradeCanonDmg = function()
  {
    this.canonDmg *= 1.1;
  }

  Player.prototype.upgradeCanonAoe = function()
  {
    this.canonAoe *= 1.1;
  }

  Player.prototype.upgradeMineDmg = function()
  {
    this.mineDmg *= 1.1;
  }

  Player.prototype.upgradeMineAoe = function()
  {
    this.mineAoe *= 1.1;
  }


  return Player;

} );