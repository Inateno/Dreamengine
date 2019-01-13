/**
* Author
 @Grimka

***
Home declaration
**/
define( [ 'DREAM_ENGINE'],
function( DE )
{
  function Home()
  {
    DE.GameObject.call(this);

    //title
    this.gameTitle = new DE.GameObject({
    	x:960,y:250
    	,renderer: new DE.TextRenderer("BotArena", {
	    	textStyle:{
	            fill           : 'white',
	            fontSize       : 128,
	            fontFamily     : 'Snippet, Monaco, monospace',
	            strokeThickness: 15,
	            align          : "center"
	          }})});

    this.add(this.gameTitle);

    //btn play
    this.startBtn = new DE.GameObject({
      x:960,y:600
      ,renderers : [
        new DE.SpriteRenderer( {spriteName : "btnPlay" })
        ,new DE.TextRenderer( "Play", { textStyle:{
	            fill           : 'white',
	            fontSize       : 64,
	            fontFamily     : 'Snippet, Monaco, monospace',
	            strokeThickness: 15,
	            align          : "center"
	          } })]
      ,interactive:true
      ,pointerdown:function(e){ Game.play(); }});

    this.add(this.startBtn);
  }

  Home.prototype = new DE.GameObject();
  Home.prototype.constructor = Home;
  Home.prototype.supr        = DE.GameObject.prototype;

  return Home;

} );