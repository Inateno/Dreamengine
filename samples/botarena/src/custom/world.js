/**
* Author
 @Grimka

***
World declaration
**/
define( [ 'DREAM_ENGINE', 'Player' , 'Map', 'Ennemi', 'HUD' ],
function( DE , Player, Map, Ennemi, HUD)
{
  function World()
  {
    DE.GameObject.call(this);

    this.targetPointer = undefined;
    this.map = undefined;
    this.HUD = undefined;
    this.player = undefined;

    this.ennemies = [];
    this.playerScore = 0;
    this.scorePerKill = 10;
    
    this.waveCounter = 1;
    this.numberWaveEnnemies = 5;
    this.remainingWaveEnnemies = 5;
    this.spawnedEnnemies = 0;
    this.ennemiSpawnInterval = 500;
    this.toughnessRatio = 1;
    this.intervalBetweenWaves = 3000;

    this.targetPointer = new DE.GameObject( {
      zindex:500
      ,renderer: new DE.SpriteRenderer( { spriteName: "target" } )
    } );

    this.map = new Map(PIXI.utils.TextureCache["map"]);
    this.player = new Player({ startX : this.map.playerSpawn.x, startY : this.map.playerSpawn.y , target : this.targetPointer});

    this.HUD = new HUD();

    this.add( this.map, this.player, this.targetPointer, this.HUD );

    this.updateCamera();

    this.addAutomatism("updateCamera", "updateCamera");

    this.addAutomatism("checkPlayerProjectiles", "checkPlayerProjectiles");
    this.addAutomatism("checkPlayerExplosions", "checkPlayerExplosions");
    this.addAutomatism("checkEnnemiHitPlayer", "checkEnnemiHitPlayer");

    this.startWave();
  }

  World.prototype = new DE.GameObject();
  World.prototype.constructor = World;
  World.prototype.supr        = DE.GameObject.prototype;

  World.prototype.checkMouseEvent = function(event)
  {
    this.player.checkMouseEvent(event);
  }

  World.prototype.moveTarget = function(pos)
  {
    this.targetPointer.moveTo(pos, -1);
  }

  World.prototype.addEnnemi = function(data)
  {
    var ennemi = new Ennemi(data);
    this.ennemies.push(ennemi);
    this.add(ennemi);
  }

  World.prototype.createSmallEnnemi = function()
  {
    var randomSpawn = this.map.getRandomEnnemiSpawn();
    this.addEnnemi({type: "small", health:30 * this.toughnessRatio, damage:10 , x:randomSpawn.x, y:randomSpawn.y});
  }

  World.prototype.createMediumEnnemi = function()
  {
    var randomSpawn = this.map.getRandomEnnemiSpawn();
    this.addEnnemi({type:"medium", scale: 2, health:60 * this.toughnessRatio, damage:20 , x:randomSpawn.x, y:randomSpawn.y});
  }

  World.prototype.createBigEnnemi = function()
  {
    var randomSpawn = this.map.getRandomEnnemiSpawn();
    this.addEnnemi({type:"big", scale: 3, health:90 * this.toughnessRatio, damage:30 , x:randomSpawn.x, y:randomSpawn.y});
  }


  World.prototype.nextWave = function()
  {
    this.waveCounter++;
    this.toughnessRatio += 0.05;
    this.numberWaveEnnemies = Math.ceil(this.numberWaveEnnemies * 1.15);
    this.remainingWaveEnnemies = this.numberWaveEnnemies;
    this.spawnedEnnemies = 0;

    this.removeAutomatism("nextWave");

    this.startWave();
  }

  World.prototype.startWave = function()
  {
    this.HUD.setWaveNumber(this.waveCounter);
    this.HUD.setRemainingEnnemies(this.numberWaveEnnemies);
    this.addAutomatism("spawnWave", "spawnWave", {interval : this.ennemiSpawnInterval});
  }

  World.prototype.spawnWave = function()
  {
    this.spawnedEnnemies++;

    if(this.spawnedEnnemies%10 == 0)
      this.createBigEnnemi();
    else if(this.spawnedEnnemies%3 == 0)
      this.createMediumEnnemi();
    else
      this.createSmallEnnemi();
      

    if(this.spawnedEnnemies == this.numberWaveEnnemies)
      this.removeAutomatism("spawnWave");
  }

  World.prototype.updateCamera = function()
  {
    var oldX = Game.camera.x;
    var oldY = Game.camera.y;

    Game.camera.x = -(this.player.x - 1920);
    Game.camera.y = -(this.player.y - 1080);

    //when camera move we also move the targetPointer and the hud (there might be a better way to do this since i don't want those to follow the camera anyway...)
    this.targetPointer.x += oldX - Game.camera.x;
    this.targetPointer.y += oldY - Game.camera.y;

    this.HUD.x += oldX - Game.camera.x;
    this.HUD.y += oldY - Game.camera.y;
  }

  World.prototype.checkEndWave = function()
  {
    this.HUD.setRemainingEnnemies(this.remainingWaveEnnemies);

    if(this.remainingWaveEnnemies == 0)
    {
      this.HUD.showUpgradePanel();
      this.addAutomatism("nextWave", "nextWave", {interval: this.intervalBetweenWaves})
    }
  }

  World.prototype.addScore = function(amount)
  {
    this.playerScore += amount;
    this.HUD.setScore(this.playerScore);
  }

  World.prototype.onKillEnnemi = function(ennemi, suicide)
  {
    this.remainingWaveEnnemies--;

    if(!suicide)
      this.addScore(Math.ceil(this.scorePerKill * this.toughnessRatio * (ennemi.type == "big" ? 3 : (ennemi.type == "medium" ? 2 : 1))));

    this.checkEndWave();
  }

  World.prototype.checkPlayerProjectiles = function()
  {
    for (var i = 0; i < this.player.projectiles.length; i++) {
      var proj = this.player.projectiles[i];
      if(proj.type === "mine")
        continue;

      for (var j = 0; j < this.ennemies.length; j++) {
        var ennemi = this.ennemies[j]

        if(proj.vector2.isInRangeFrom(ennemi.vector2, ennemi.radius * ennemi.scale.x))
        {
          proj.askToKill();
          ennemi.takeDamage(proj.data.damage);

          if(ennemi.dead)
          {
            ennemi.askToKill();

            this.ennemies.splice(j, 1);
            j--

            this.onKillEnnemi(ennemi, false);
          }

          break;
        }
      }
    }
  }

  World.prototype.checkPlayerExplosions = function()
  {
    for (var i = 0; i < this.player.explosions.length; i++) {
      var explo = this.player.explosions[i];
      
      if(!explo.activeDmg)
        continue;

      for (var j = 0; j < this.ennemies.length; j++) {
        var ennemi = this.ennemies[j]

        if(explo.vector2.isInRangeFrom(ennemi.vector2, ennemi.radius * ennemi.scale.x + explo.radius))
        {
          ennemi.takeDamage(explo.data.damage);

          if(ennemi.dead)
          {
            ennemi.askToKill();

            this.ennemies.splice(j, 1);
            j--

            this.onKillEnnemi(ennemi, false);
          }
        }
      }

      explo.activeDmg = false;
    }
  }

  World.prototype.checkEnnemiHitPlayer = function()
  {
    for (var i = 0; i < this.ennemies.length; i++) {
      var ennemi = this.ennemies[i];

      if(ennemi.vector2.isInRangeFrom(this.player.vector2,ennemi.radius + this.player.radius))
      {
        ennemi.askToKill();
        this.ennemies.splice(i, 1);

        this.onKillEnnemi(ennemi, true);

        this.player.takeDamage(ennemi.damage);

        if(this.player.dead)
        {
          this.remove(this.player);
          this.removeAutomatism("updateCamera");
          this.removeAutomatism("checkEnnemiHitPlayer");
          this.HUD.showDead(this.playerScore);
          break;
        }
      }
    }
  }

  return World;

} );