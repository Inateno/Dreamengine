/**
 * by Fangh44 @FanghGD
 * @example var touchInput = new TouchControl({
        "x": 100
        ,"y": 100
        ,"zindex": 100
      },{
        "collider": { 'radius': 80 }
        ,"backgroundSpriteRenderer" : {"spriteName": "touchControlBackground" }
        ,"stickSpriteRenderer" : {"spriteName": "touchControlStick" }
        ,"camera": Game.camera
        ,"appearOnTouch": true
        ,"fadeInTime": 200
        ,"fadeOutTime" : 200
        , onStickMoved: function( position )
        {
          Game.ship.translateX( position.x );
          Game.ship.translateY( position.y )
        }
      });
 */
define( [ 'DREAM_ENGINE' ],
function( DE )
{
  function TouchControl( objectParams, touchControlParams )
  {
    this.isTouched              = false;
    this.camera                 = null;
    this.normalizedPosition     = { "x": 0, "y":0 };
    objectParams.renderers      = [];
    
    if ( !touchControlParams.collider )
      console.log( "%cNo collider on a touch control, it'll not work..", "color:red;background:black;" );
    else if ( touchControlParams.collider.radius )
      objectParams.collider = new DE.CircleCollider( touchControlParams.collider.radius );
    
    if ( touchControlParams.backgroundSpriteRenderer )
      objectParams.renderers.push( new DE.SpriteRenderer( touchControlParams.backgroundSpriteRenderer ) );
    else if ( DE.ImageManager.images["touchControlBackground"] )
      objectParams.renderers.push( new DE.SpriteRenderer( {spriteName : "touchControlBackground"} ) );
    else
      objectParams.renderers.push( new DE.CircleRenderer( {"fillColor": "white"}, touchControlParams.collider.radius || 100 ) );
    
    DE.GameObject.call( this, objectParams );
    
    if ( touchControlParams.spriteRenderer )
      this.sprite = this.renderer;   
    
    this.stick = new DE.GameObject({
      "x": 0
      ,"y": 0
    });
    
    if ( touchControlParams.stickSpriteRenderer )
      this.stick.addRenderer( new DE.SpriteRenderer( touchControlParams.stickSpriteRenderer ) );
    else if ( DE.ImageManager.images["touchControlStick"] )
      this.stick.addRenderer( new DE.SpriteRenderer( {spriteName : "touchControlStick"}  ) );
    else
      this.stick.addRenderer( new DE.CircleRenderer( {"fillColor": "black"}, touchControlParams.collider.radius * 0.5 || 50 ) );
    
    if( touchControlParams.camera )
      this.camera = touchControlParams.camera;
    else
      console.log( "%cNo camera on a touch control, it'll not work..", "color:red;background:black;" );
    
    this.add(this.stick);
    
    this.onStickMoved = touchControlParams.onStickMoved || touchControlParams.onStickMove || function(){};
    
    if( touchControlParams.appearOnTouch == undefined )
      touchControlParams.appearOnTouch = false;
    
    if ( touchControlParams.fadeOutTime == undefined )
      touchControlParams.fadeOutTime = 200;
    
    if( touchControlParams.fadeInTime == undefined )
      touchControlParams.fadeInTime = 200;    
    
    this.camera.on( "mouseMove", function( mouse )
    {
      if( this.isTouched )
      {
        mouse.stopPropagation = true;
        if ( DE.CollisionSystem.pointCircleCollision( mouse, this.collider ) )
        {
          this.stick.position.setPosition( { "x": mouse.x - this.position.x, "y": mouse.y - this.position.y} )
        }
        else
        {
          var angle = this.position.getAngle( mouse );          
          this.stick.position.setPosition( Math.cos( angle ) * this.collider.radius, Math.sin( angle )* this.collider.radius);
        }
      }
      
      this.normalizedPosition = this.getNormalizedPosition( this.stick.position.x, -this.stick.position.y, this.collider.radius ); 
      this.onStickMoved( this.normalizedPosition );
      this.trigger( "stickMoved", this.normalizedPosition );
      
    }, this);
    
    this.camera.on( "mouseUp", function( mouse )
    {
      mouse.stopPropagation = true;
      this.isTouched = false;
      this.stick.position.setPosition( 0, 0 );
      
      this.onStickMoved( { "x":0, "y": 0 } );
      this.trigger( "stickStopped", this.normalizedPosition );
      
      if ( touchControlParams.appearOnTouch )
      {
        this.renderer.fadeOut( touchControlParams.fadeOutTime );
        this.stick.renderer.fadeOut ( touchControlParams.fadeOutTime );
      }
    }, this );
    
    this.camera.on( "mouseDown", function( mouse )
    {
      if ( touchControlParams.appearOnTouch )
      {
        this.renderer.fadeIn( touchControlParams.fadeInTime );
        this.stick.renderer.fadeIn( touchControlParams.fadeInTime );
        this.position.setPosition( mouse );
      }      
    }, this);   
    
    this.getNormalizedPosition = function(x, y, radius)
    {
      var position = {"x": 0, "y": 0}
      
      position.x = x / radius;
      position.y = y / radius;
      
      if (position.x > 1)
        position.x = 1;
      if (position.y > 1)
        position.y = 1;
      if (position.x < -1)
        position.x = -1;
      if (position.y < -1)
        position.y = -1;
      
      position.y *= -1;
      
      return position;   
    }
  }
  
  TouchControl.prototype             = new DE.GameObject();
  TouchControl.prototype.constructor = TouchControl;
  TouchControl.prototype.supr        = DE.GameObject.prototype;
    
  TouchControl.prototype.onMouseDown = function( mouse, propagation )
  {
    mouse.stopPropagation = true;
    this.isTouched = true;
  };
  
  return TouchControl;
} );