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
  function CheckBox( objectParams, buttonParams, events )
  {
    objectParams.renderers = [];
    DE.GameObject.call( this, objectParams );
    
    this.init = function()
    {
      var tr = buttonParams.textRenderer;
      var colliderW = buttonParams.colliderWidth;
      
      this.addRenderer( new DE.SpriteRenderer( buttonParams.spriteRenderer ) );
      this.renderers[ 0 ].x -= colliderW / 2
        - buttonParams.spriteRenderer.width / 2 >> 0;
      
      // tr.x = -colliderW / 2
      //   + ( buttonParams.spriteRenderer.width + tr.textWidth / 2 ) >> 0;
      // tr.borderColor = "red";
      // tr.align = "left";
      this.addRenderer( new DE.TextRenderer( tr.text, tr ) );
      
      this.setCollider( new DE.FixedBoxCollider( colliderW, buttonParams.colliderHeight || 100 ) );
    };
    
    this.direction = buttonParams.direction || "horizontal";
    
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
    
    this.sound = buttonParams.sound || "click";
    
    this.isChecked = false;
    this.init();
  }
  
  CheckBox.prototype = new DE.GameObject();
  CheckBox.prototype.constructor = CheckBox;
  CheckBox.prototype.supr        = DE.GameObject.prototype;
  
  CheckBox.prototype.onMouseClick = function( mouse, propagation )
  {
    if ( this.sound )
      DE.AudioManager.fx.play( this.sound );
    this.isChecked = !this.isChecked;
    this.changeState( propagation, this.stateOnClick );
    mouse.stopPropagation = true;
    propagation.preventUp = true;
    this.customonMouseClick( mouse, propagation );
    return true;
  };
  // let user choose if he want to use it
  CheckBox.prototype.onMouseUp = function( mouse, propagation )
  {
    this.isChecked = !this.isChecked;
    this.changeState( propagation, this.stateOnUp );
    mouse.stopPropagation = true;
    this.customonMouseUp( mouse, propagation );
    return true;
  };
  
  CheckBox.prototype.onMouseDown = function( mouse, propagation )
  {
    this.changeState( propagation, "active" );
    var e = this.customonMouseDown( mouse, propagation );
    if ( e )
      return e;
    // killing events
    mouse.stopPropagation = true;
    return true;
  };
  
  CheckBox.prototype.onMouseEnter = function( mouse, propagation )
  {
    this.changeState( propagation, "hover" );
    var e = this.customonMouseEnter( mouse, propagation );
    if ( e )
      return e;
  };
  
  CheckBox.prototype.onMouseLeave = function( mouse, propagation )
  {
    this.changeState( propagation, "null" );
    var e = this.customonMouseLeave( mouse, propagation );
    if ( e )
      return e;
  };
  
  CheckBox.prototype.changeState = function( propagation, type )
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
      case "null":
        propagation.cursor = "default";
    }
    if ( this.direction == "horizontal" )
    {
      this.renderer.setLine( this.renderer.startLine + this.isChecked );
      this.renderer.setFrame( this.renderer.startFrame + dir );
    }
    else
    {
      this.renderer.setLine( this.renderer.startFrame + this.isChecked );
      this.renderer.setLine( this.renderer.startLine + dir );
    }
  };
  
  return CheckBox;
} );