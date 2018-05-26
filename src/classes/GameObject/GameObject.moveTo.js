define( [
  'DE.GameObject'
  , 'DE.Time'
],
function(
  GameObject
  , Time
)
{
  /**
   * create a fluid move translation
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object / GameObject / PIXI.DisplayObject} pos give x, y, and z destination
   * @param {Int} [duration=500] time duration
   * @param {Function} callback will be called in the current object context
   * @example // move to 100,100 in 1 second
   * player.moveTo( { x: 100, y: 100 }, 1000 );
   * @example // move to bonus position
   * player.moveTo( bonus, 1000, function(){ console.log( this ) } );
   */
  GameObject.prototype.moveTo = function( pos, duration, callback, curveName ) // TODO add curveName (not coded)
  {
    if ( pos.getGlobalPosition ) {
      var z = pos.z;
      pos = pos.getGlobalPosition();
      pos.z = z;
      var parentPos = this.parent.getGlobalPosition();
      
      pos.x = pos.x - parentPos.x;
      pos.y = pos.y - parentPos.y;
      pos.z = pos.z - this.parent.z;
    }
    
    var myPos = this;
    
    this._moveData = {
      "distX"     : - ( myPos.x - ( pos.x !== undefined ? pos.x : myPos.x ) )
      ,"distY"    : - ( myPos.y - ( pos.y !== undefined ? pos.y : myPos.y ) )
      ,"distZ"    : - ( myPos.z - ( pos.z !== undefined ? pos.z : myPos.z ) )
      ,"dirX"     : myPos.x > pos.x ? 1 : -1
      ,"dirY"     : myPos.y > pos.y ? 1 : -1
      ,"dirZ"     : myPos.z > pos.z ? 1 : -1
      ,"duration" : Number.isInteger( duration ) ? duration : 500
      ,"oDuration": Number.isInteger( duration ) ? duration : 500
      ,"curveName": curveName || "linear"
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"stepValZ" : 0
      ,"destX"    : pos.x
      ,"destY"    : pos.y
      ,"destZ"    : pos.z
      ,"callback" : callback
    };
    this._moveData.leftX = this._moveData.distX;
    this._moveData.leftY = this._moveData.distY;
    this._moveData.leftZ = this._moveData.distZ;
    
    return this;
  };
  
  /**
   * apply the move transition each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyMove = function()
  {
    if ( this._moveData.done )
      return;
    
    var move = this._moveData;
    
    if ( move.distX != 0 ) {
      move.stepValX = Time.timeSinceLastFrame / move.oDuration * move.distX * Time.scaleDelta;
      move.leftX -= move.stepValX;
      this.x += move.stepValX;
    }
    
    if ( move.distY != 0 ) {
      move.stepValY = Time.timeSinceLastFrame / move.oDuration * move.distY * Time.scaleDelta;
      move.leftY -= move.stepValY * move.dirY; // * dirY because y is inverted
      this.y += move.stepValY;
    }
    
    if ( move.distZ != 0 ) {
      move.stepValZ = Time.timeSinceLastFrame / move.oDuration * move.distZ * Time.scaleDelta;
      move.leftZ -= move.stepValZ * move.dirZ; // * dirZ because z is inverted
      this.z += move.stepValZ;
    }
    
    move.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check pos
    if ( move.dirX < 0 && move.leftX < 0 ) {
      this.x += move.leftX;
    }
    else if ( move.dirX > 0 && move.leftX > 0 ) {
      this.x -= move.leftX;
    }
    
    if ( move.dirY < 0 && move.leftY < 0 ) {
      this.y += move.leftY;
    }
    else if ( move.dirY > 0 && move.leftY > 0 ) {
      this.y -= move.leftY;
    }
    
    if ( move.dirZ < 0 && move.leftZ < 0 ) {
      this.z += move.leftZ;
    }
    else if ( move.dirZ > 0 && move.leftZ > 0 ) {
      this.z -= move.leftZ;
    }
    
    if ( move.duration <= 0 ) {
      this._moveData.done = true;
      this.position.set(
        move.destX !== undefined ? move.destX : this.x
        , move.destY !== undefined ? move.destY : this.y
      );
      this.z = move.destZ !== undefined ? move.destZ : this.z;
      
      if ( move.callback ) {
        move.callback.call( this, move.callback );
      }
      
      this.trigger( "moveEnd" );
    }
  };
  
  return GameObject;
} );
