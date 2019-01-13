/**
* Author
 @Grimka

***
HUD declaration
**/
define( [ 'DREAM_ENGINE'],
function( DE )
{
  function HUD(data)
  {
    this.topLeftTextStyle = {
            fill           : 'white',
            fontSize       : 35,
            fontFamily     : 'Snippet, Monaco, monospace',
            strokeThickness: 3,
            align          : "left"
          };

    this.upgradePanelTextStyle = {
            fill           : 'white',
            fontSize       : 35,
            fontFamily     : 'Snippet, Monaco, monospace',
            strokeThickness: 3,
            align          : "center"
          };

    this.waveNumber = new DE.TextRenderer( "Wave number : ", {
          y: 15
          ,textStyle: this.topLeftTextStyle } );
    this.waveNumber.x = this.waveNumber.width / 2;

    this.remainingEnnemies = new DE.TextRenderer( "Remaining ennemies : ", {
          y: 65
          ,textStyle: this.topLeftTextStyle } );
    this.remainingEnnemies.x = this.remainingEnnemies.width / 2;

    this.score = new DE.TextRenderer( "Score : 0", {
          y: 115
          ,textStyle: this.topLeftTextStyle } );
    this.score.x = this.score.width / 2;

    this.deadText = new DE.GameObject({
      x:960,y:250
      ,renderer: new DE.TextRenderer("You died...", {
        textStyle:{
              fill           : 'white',
              fontSize       : 128,
              fontFamily     : 'Snippet, Monaco, monospace',
              strokeThickness: 15,
              align          : "center"
            }})});
    this.deadText.visible = false;
    this.deadText.fadeOut();

    this.upgradePanel = new DE.GameObject({
      x:960,y:800
      ,visible: false
      ,renderers: [
        new DE.SpriteRenderer( {spriteName : "upgradePanel" })
        ,new DE.TextRenderer( "Choose an upgrade !", {
          y: -75, zindex:10
          ,textStyle: this.upgradePanelTextStyle
        })
        ,new DE.TextRenderer( "Gatling", {
          x:-245, y:-25, zindex:10
          ,textStyle: this.upgradePanelTextStyle
        })
        ,new DE.TextRenderer( "Canon", {
          y:-25, zindex:10
          ,textStyle: this.upgradePanelTextStyle
        })
        ,new DE.TextRenderer( "Mine", {
          x:245, y:-25, zindex:10
          ,textStyle: this.upgradePanelTextStyle
        })]
      ,gameObjects:[
       this.createUpgradeButton(-295, 40, "Dmg", "upgradeGatlingDmg")
       ,this.createUpgradeButton(-185, 40, "Rate", "upgradeGatlingFireRate")
       ,this.createUpgradeButton(-55, 40, "Dmg",  "upgradeCanonDmg")
       ,this.createUpgradeButton(55, 40, "Aoe",  "upgradeCanonAoe")
       ,this.createUpgradeButton(185, 40, "Dmg",  "upgradeMineDmg")
       ,this.createUpgradeButton(295, 40, "Aoe",  "upgradeMineAoe") ]});

    this.hideUpgradePanel();

    DE.GameObject.call(this, { 
      zindex : 450
      ,gameObjects : [this.upgradePanel, this.deadText]
      ,renderers: [ this.waveNumber, this.remainingEnnemies, this.score ] } );
  }

  HUD.prototype = new DE.GameObject();
  HUD.prototype.constructor = HUD;
  HUD.prototype.supr        = DE.GameObject.prototype;

  topLeftTextStyle = undefined;
  upgradePanelTextStyle = undefined;
  upgradePanel = undefined;
  waveNumber = undefined;
  remainingEnnemies = undefined;
  score = undefined;


  HUD.prototype.createUpgradeButton = function(x, y, text, fName)
  {
    var self = this;
    return new DE.GameObject({
      x:x,y:y
      ,renderers : [
        new DE.SpriteRenderer( {spriteName : "btnUpgrade" })
        ,new DE.TextRenderer( text, { textStyle:this.upgradePanelTextStyle })]
      ,interactive:true
      ,pointerdown:function(e){ Game.world.player[fName](); e.stopPropagation(); self.hideUpgradePanel(); }});
  }

  HUD.prototype.setWaveNumber = function(number)
  {
    this.waveNumber.text = "Wave number : " + number;
    this.waveNumber.x = this.waveNumber.width / 2;
  }

  HUD.prototype.setRemainingEnnemies = function(number)
  {
    this.remainingEnnemies.text = "Remaining ennemies : " + number;
    this.remainingEnnemies.x = this.remainingEnnemies.width / 2;
  }

  HUD.prototype.setScore = function(number)
  {
    this.score.text = "Score : " + number;
    this.score.x = this.score.width / 2;
  }

  HUD.prototype.hideUpgradePanel = function()
  {
    this.upgradePanel.fadeOut();

    //desactivate sub gameObjects interactivity (to avoid cheat by spam clicking the buttons)
    for (var i = 0; i < this.upgradePanel.gameObjects.length; i++) {
      this.upgradePanel.gameObjects[i].interactive = false;
    }
  }

  HUD.prototype.showUpgradePanel = function()
  {
    this.upgradePanel.fadeIn();

    //activate sub gameObjects interactivity
    for (var i = 0; i < this.upgradePanel.gameObjects.length; i++) {
      this.upgradePanel.gameObjects[i].interactive = true;
    }
  }

  HUD.prototype.showDead = function(score)
  {
    this.deadText.fadeIn();
    this.deadText.renderer.text += "\nYour score : " + score;
    this.addAutomatism("openHome", "openHome", {interval: 3000});
  }

  HUD.prototype.openHome = function()
  {
    this.removeAutomatism("openHome");
    Game.openHome();
  }

  return HUD;

} );