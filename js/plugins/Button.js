/**
 *
 * @example var button = new DE.Button( {
 *   'x': 250, 'y': 250, 'zindex': 10
 * }, {
 *   spriteRenderer: { 'spriteName': 'btn', 'startFrame': 0, 'startLine': 0 }
 *   ,textRenderer: {
 *      'color': 'white', 'fontSize': 28
 *     ,'textWidth': 500, 'textHeight': 70, 'text': "ClickMe"
 *    }
 *   , collider: { 'width': 530, 'height': 100 }
 *   ,'direction': 'horizontal'
 * }, {
 *   onMouseClick: function()
 *   {
 *     console.log( "You clicked me wow" );
 *   }
 * } );
 */
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  function Button( objectParams, buttonParams, events )
  {
    objectParams.renderers = [];
    if ( buttonParams.spriteRenderer )
      objectParams.renderers.push( new DE.SpriteRenderer( buttonParams.spriteRenderer ) );
    if ( buttonParams.textRenderer )
    {
      var tr = buttonParams.textRenderer;
      objectParams.renderers.push( new DE.TextRenderer( tr, tr.textWidth, tr.textHeight, tr.text ) );
    }
    
    if ( !buttonParams.collider )
      console.log( "%cNo collider on a button, it'll not work..", "color:red;background:black;" );
    else if ( buttonParams.collider.radius )
      objectParams.collider = new DE.CircleCollider( buttonParams.collider.radius );
    else if ( buttonParams.collider.width )
      objectParams.collider = new DE.FixedBoxCollider( buttonParams.collider.width, buttonParams.collider.height || buttonParams.collider.width );
    this.direction = buttonParams.direction || "horizontal";
    
    DE.GameObject.call( this, objectParams );
    
    if ( buttonParams.spriteRenderer )
      this.sprite = this.renderers[ 0 ];
    if ( buttonParams.spriteRenderer && buttonParams.textRenderer )
      this.text = this.renderers[ 1 ];
    else if ( buttonParams.textRenderer )
      this.text = this.renderers[ 0 ];
    
    this.customonMouseClick = function(){};
    this.customonMouseDown  = function(){};
    this.customonMouseEnter = function(){};
    this.customonMouseLeave = function(){};
    this.customonMouseUp = function(){};
    for ( var i in events )
      this[ "custom" + i ] = events[ i ];
    this.stateOnClick = buttonParams.stateOnClick || "hover";
    this.stateOnUp = buttonParams.stateOnUp || "hover";
    
    this.sound = buttonParams.sound;
  }
  
  Button.prototype = new DE.GameObject();
  Button.prototype.constructor = Button;
  Button.prototype.supr        = DE.GameObject.prototype;
  
  Button.prototype.onMouseClick = function( mouse, propagation )
  {
    if ( this.sound )
      DE.AudioManager.fx.play( this.sound );
    this.changeState( propagation, this.stateOnClick );
    mouse.stopPropagation = true;
    propagation.preventUp = true;
    this.customonMouseClick( mouse, propagation );
    return true;
  };
  // let user choose if he want to use it
  Button.prototype.onMouseUp = function( mouse, propagation )
  {
    this.changeState( propagation, this.stateOnUp );
    mouse.stopPropagation = true;
    this.customonMouseUp( mouse, propagation );
    return true;
  };
  
  Button.prototype.onMouseDown = function( mouse, propagation )
  {
    this.changeState( propagation, "active" );
    var e = this.customonMouseDown( mouse, propagation );
    if ( e )
      return e;
    // killing events
    mouse.stopPropagation = true;
    return true;
  };
  
  Button.prototype.onMouseEnter = function( mouse, propagation )
  {
    this.changeState( propagation, "hover" );
    var e = this.customonMouseEnter( mouse, propagation );
    if ( e )
      return e;
  };
  
  Button.prototype.onMouseLeave = function( mouse, propagation )
  {
    this.changeState( propagation, "null" );
    var e = this.customonMouseLeave( mouse, propagation );
    if ( e )
      return e;
  };
  
  Button.prototype.changeState = function( propagation, type )
  {
    var dir = 0;
    switch( type )
    {
      case "hover":
        dir = 1;
        propagation.cursor = "pointer";
        break;
      case "active":
        propagation.cursor = "pointer";
        dir = 2;
        break;
      default:
        propagation.cursor = "default";
    }
    if ( this.direction == "horizontal" )
    {
      if ( this.sprite )
        this.sprite.setFrame( this.sprite.startFrame + dir );
    }
    else
    {
      if ( this.sprite )
        this.sprite.setLine( this.sprite.startLine + dir );
    }
  }
  
  return Button;
} );