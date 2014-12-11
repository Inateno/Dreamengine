define( [ 'data', 'DREAM_ENGINE' ],
function( data, DE )
{
  var _abs = Math.abs;
  // args are written with a _ because they become private (and we use args later in methods)
  function Character( x, y, tag, colliderW, colliderH, sprite )
  {
    DE.GameObject.call( this, {
      "x": x, "y": y, "zindex": 11, "tag": tag
      ,"collider": new DE.FixedBoxCollider( colliderW, colliderH )
    } );
    
    // use sprite
    if ( sprite )
      this.addRenderer( new DE.SpriteRenderer( { spriteName: sprite } ) );
    else
      this.addRenderer( new DE.BoxRenderer( { fillColor: "rgb(180,180,180)", alpha: 0.4 }, colliderW - 2, colliderH - 2 ) );
    
    this.moveSpeed     = data.character.moveSpeed;
    this.jumpForce     = data.character.jumpForce;
    this.jumpImpulsion = data.character.jumpImpulsion;
    this.mass          = data.character.mass;
    this.axes          = { x: 0, y: 0 };
    this.gravity       = { x: 0, y: 0 };
    this.onFloor       = false;
    this.jumpedTimes   = 0;
    this.jumpLimit     = 3;
    
    // used to work with a sprite
    this.dir           = 1;
    
    var _self = this;
    this.logic = function()
    {
      this.move();
      this.makeCollision();
    }
    
    this.on( "on-floor", function()
    {
      this.jumpedTimes = 0;
    }, this );
    
    this.move = function()
    {
      var axeH = this.axes.x;
      
      if ( axeH < 0 )
        this.dir = -1;
      else if ( axeH > 0 )
        this.dir = 1;
      
      if ( this.gravity.x > data.maxGravityX )
        this.gravity.x = data.maxGravityX;
      else if ( this.gravity.x < -data.maxGravityX )
        this.gravity.x = -data.maxGravityX;
      
      if ( this.gravity.y > data.maxGravityY )
        this.gravity.y = data.maxGravityY;
      else if ( this.gravity.y < -data.maxGravityY )
        this.gravity.y = -data.maxGravityY;
      
      var y = 0;
      if ( this.gravity.y > 0 )
        y = this.mass * this.gravity.y * data.coefAirFriction >> 0;
      else
        y = this.jumpImpulsion * this.gravity.y * data.coefAirFriction >> 0;

      this.gravity.y += ( ( _abs( this.gravity.y * this.mass ) > data.maxAttractionForce ) ? 0 : data.attractionForce );
      this.gravity.y = ( this.gravity.y * 1000 >> 0 ) / 1000;
      
      if ( !this.onFloor && this.axes.y > 0 )
        this.gravity.y += data.coefAirControlY * this.axes.y;
      
      if ( this.onFloor )
      {
        this.gravity.x += axeH * this.currentBlock.physicCoefImpulsion;
      }
      else if ( axeH != 0 )
      {
        var oldgx = this.gravity.x;
        this.gravity.x += axeH * data.coefAirControlX;
        if ( oldgx > 0 && oldgx > 1 && oldgx < this.gravity.x )
          this.gravity.x = oldgx;
        else if ( oldgx < 0 && oldgx < -1 && oldgx > this.gravity.x )
          this.gravity.x = oldgx;
      }
      
      var x = this.moveSpeed * this.gravity.x * data.coefAirFriction >> 0;
      if ( this.onFloor && this.currentBlock )
        this.gravity.x *= this.currentBlock.physicCoefReductor;
      this.gravity.x = ( this.gravity.x * 100 >> 0 ) / 100;
      
      var pos = this.getPos();
      this.previousPosition = { x: pos.x, y: pos.y };
      this.previousGravity = { x: this.gravity.x, y: this.gravity.y };
      this.translate( { x: x >> 0, y: y >> 0 } );
      this.previousMove = { x: this.position.x - this.previousPosition.x, y: this.position.y - this.previousPosition.y  };
    }
    
    this.makeCollision = function()
    {
      var obj = this.scene.collideObjects;
      var colpos = this.collider.getRealPosition();
      var T = colpos.y
        , L = colpos.x
        , R = colpos.x + this.collider.width
        , B = colpos.y + this.collider.height
        , PT = colpos.y - this.previousMove.y
        , PL = colpos.x - this.previousMove.x
        , PR = colpos.x - this.previousMove.x + this.collider.width
        , PB = colpos.y - this.previousMove.y + this.collider.height;
      var collide = { l: 0, r: 0, t: 0, b: 0 };
      var vectorOut = { x: 0, y: 0 };
      var changedPos = { x: 0, y: 0 };
      var cols = [], colx, coly; // all block with collision
      for ( var i = 0, col, o, ocolpos; i < obj.length; ++i, col = false )
      {
        colx = false;
        coly = false;
        
        o = obj[ i ];
        if ( o.enable && DE.CollisionSystem.fixedBoxCollision( this.collider, o.collider ) )
        {
          ocolpos = o.collider.getRealPosition();
          var OT = ocolpos.y
            , OL = ocolpos.x
            , OR = ocolpos.x + o.collider.width
            , OB = ocolpos.y + o.collider.height;
            
          // actual difference between colliders
          var l = OL - R // left side
            , r = L - OR // right side of the collided object etc..
            , t = OT - B
            , b = T - OB;
          
          // same as before but with previous pos
          var pl = OL - PR
            , pr = PL - OR
            , pt = OT - PB
            , pb = PT - OB;
          
          // is coming from diagonal
          if ( this.previousMove.x != 0 && this.previousMove.y != 0 )
          {
            if ( ( ( pl >= 0 && l < 0 ) || ( pl > 0 && l <= 0 ) ) && this.previousMove.x > 0 )
            {
              vectorOut.x = OL - ( this.collider.width * 0.5 + 1 ) >> 0;
              colx = true;
            }
            else if ( ( ( pr >= 0 && r < 0 ) || ( pr > 0 && r <= 0 ) ) && this.previousMove.x < 0 )
            {
              vectorOut.x = OR + this.collider.width * 0.5 + 1 >> 0;
              colx = true;
            }
            else if ( ( ( pt >= 0 && t < 0 ) || ( pt > 0 && t <= 0 ) ) && this.previousMove.y > 0 )
            {
              vectorOut.y = OT - ( this.collider.height * 0.5 + 1 ) >> 0;
              coly = true;
            }
            else if ( pb >= 0 && b < 0 && this.previousMove.y < 0 )
            {
              vectorOut.y = OB + this.collider.height * 0.5 + 1 >> 0;
              coly = true;
            }
          }
          else if ( this.previousMove.x != 0 )
          {
            // coming from left side - will stuck on left side
            if ( this.previousMove.x > 0 )
              vectorOut.x = OL - ( this.collider.width * 0.5 + 1 ) >> 0;
            // same for right
            else if ( this.previousMove.x < 0 )
              vectorOut.x = OR + this.collider.width * 0.5 + 1 >> 0;
            colx = true
          }
          else if ( this.previousMove.y != 0 )
          {
            // coming from left side - will stuck on left side
            if ( this.previousMove.y > 0 )
              vectorOut.y = OT - ( this.collider.height * 0.5 + 1 ) >> 0;
            // same for right
            else if ( this.previousMove.y < 0 )
              vectorOut.y = OB + this.collider.height * 0.5 + 1 >> 0;
            coly = true;
          }
          
          if ( coly )
            this.gravity.y = 0;
          if ( colx )
            this.gravity.x = 0;
          
          this.position.x = vectorOut.x || this.position.x;
          this.position.y = vectorOut.y || this.position.y;
          
          // check if we restore the previous pos, does it still collide with previous tested objects ?
          if ( this.previousMove.x > 0 && this.previousMove.y != 0 && cols.length )
          {
            var savedX = this.position.x;
            this.position.x = this.previousPosition.x + this.previousMove.x;
            var preventRestore = false;
            for ( var po = 0; po < cols.length; ++po )
            {
              if ( DE.CollisionSystem.fixedBoxCollision( this.collider, cols[ po ].collider ) )
                preventRestore = true;
              else
                cols.splice( po, 1 );
            }
            if ( preventRestore )
              this.position.x = savedX;
            else
              this.gravity.x = this.previousGravity.x;
          }
          changedPos.x = vectorOut.x != 0 ? vectorOut.x - this.position.x : changedPos.x;
          changedPos.y = vectorOut.y != 0 ? vectorOut.y - this.position.y : changedPos.y;
          
          cols.push( o );
        }
      }
      for ( var po = 0; po < cols.length; ++po )
      {
        this.trigger( "collision-enter", cols[ po ] );
        cols[ po ].trigger( "collision-enter", this );
      }
      
      if ( vectorOut.y != 0 && this.previousMove.y > 0 )
      {
        if ( !this.onFloor )
          this.trigger( "on-floor" );
        this.onFloor = true;
        this.gravity.y = 0;
        this.currentBlock = cols[ 0 ];
      }
      
      if ( !this.onFloor )
      {
        if ( this.currentBlock )
        {
          this.currentBlock.trigger( "collision-leave", this );
          this.trigger( "collision-leave", this.currentBlock );
        }
        this.currentBlock = null;
      }
    }
    
    this.bindControls = function()
    {
      DE.Inputs.on( "axeMoved", "haxe", function(val){ _self.updateAxes( val, undefined ); } );
      DE.Inputs.on( "axeMoved", "vaxe", function(val){ _self.updateAxes( undefined, val ); } );
      DE.Inputs.on( "axeStop", "haxe", function(){ _self.updateAxes( 0, undefined ); } );
      DE.Inputs.on( "axeStop", "vaxe", function(){ _self.updateAxes( undefined, 0 ); } );
      DE.Inputs.on( "keyUp", "left", function(){
        if ( DE.Inputs.key( 'right' ) )
          return;
        _self.updateAxes( 0, undefined );
      } );
      DE.Inputs.on( "keyUp", "right", function(){
        if ( DE.Inputs.key( 'left' ) )
          return;
        _self.updateAxes( 0, undefined );
      } );
      DE.Inputs.on( "keyDown", "left", function(){ _self.updateAxes( -1, undefined ); } );
      DE.Inputs.on( "keyDown", "right", function(){ _self.updateAxes( 1, undefined ); } );
      DE.Inputs.on( "keyDown", "up", function(){ _self.updateAxes( undefined, -1 ); } );
      DE.Inputs.on( "keyDown", "down", function(){ _self.updateAxes( undefined, 1 ); } );
      DE.Inputs.on( "keyUp", "up", function(){ _self.updateAxes( undefined, 0 ); } );
      DE.Inputs.on( "keyUp", "down", function(){ _self.updateAxes( undefined, 0 ); } );
      DE.Inputs.on( "keyDown", "jump", function(){ _self.jump(); } );
      DE.Inputs.on( "keyUp", "jump", function(){ _self.resetJump(); } );
      
      return this;
    };
    
    this.jump = function()
    {
      if ( !this.onFloor && this.jumpedTimes >= this.jumpLimit )
        return;
      this.jumpedTimes++;
      this.onFloor   = false;
      this.gravity.y = this.jumpForce;
    };
    
    this.resetJump = function()
    {
      if ( this.gravity.y < this.jumpForce / 2 )
        this.gravity.y = this.jumpForce / 2;
    };
    
    this.addAutomatism( "logic", "logic" );
    return this;
  };

  Character.prototype = new DE.GameObject();
  Character.prototype.constructor = Character;
  Character.prototype.supr        = DE.GameObject.prototype;
  
  // bind this method on controls or AI to make your character move
  Character.prototype.updateAxes = function( x, y )
  {
    this.axes = {
      'x': x !== undefined ? x : this.axes.x
      ,'y': y !== undefined ? y : this.axes.y
    };
  };
  
  return Character;
} );
