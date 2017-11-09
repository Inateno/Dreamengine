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
   * give a target to this gameObject, then it will focus it until you changed or removed it
   * you can lock independent axes, and set offsets
   * @public
   * @memberOf GameObject
   * @param {GameObject} gameObject is the target to focus on
   * @param {Object} [params] optional parameters, set offsets or lock
   * @example // create a fx for your ship, decal a little on left, and lock y
   * fx.focus( player, { lock: { y: true }, offsets: { x: -200, y: 0 } } );
   */
  GameObject.prototype.focus = function( gameObject, params )
  {
    params = params || {};
    this.target = gameObject;
    this.focusLock  = params.lock || {};
    this.focusOffset= params.offsets || { x: 0, y: 0 };
    
    return this;
  };
  
  /**
   * apply focus on target if there is one
   * You shouldn't call or change this method
   * @protected
   * @memberOf Camera
   */
  GameObject.prototype.applyFocus = function()
  {
    if ( !this.target ) {
      return;
    }
    
    var pos = this.target;
    
    if ( this.target.getGlobalPosition ) {
      pos = this.target.getGlobalPosition();
    }
    
    var parentPos = this.parent.getGlobalPosition();
    
    /* TODO required only if there is camera in the engine // focus a camera ?
    if ( !pos ) {
      pos = this.target.sceneContainer;
    }*/
    
    if ( !this.focusLock.x ) {
      this.x = pos.x + ( this.focusOffset.x || 0 ) - parentPos.x;
    }
    if ( !this.focusLock.y ) {
      this.y = pos.y + ( this.focusOffset.y || 0 ) - parentPos.y;
    }
  };
  
  return GameObject;
} );