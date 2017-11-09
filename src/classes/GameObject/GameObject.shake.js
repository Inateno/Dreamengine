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
   * create a shake with given range
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Int} xRange max X gameObject will move to shake
   * @param {Int} yRange max Y gameObject will move to shake
   * @param {Int} [duration=500] time duration
   * @example // shake with 10-10 force during 1sec
   * player.shake( 10, 10, 1000 );
   */
  GameObject.prototype.shake = function( xRange, yRange, duration, callback )
  {
    this._shakeData = {
      // "startedAt" : Date.now()
      "duration"  : duration || 500
      ,"xRange"   : xRange
      ,"yRange"   : yRange
      ,"prevX"    : this._shakeData ? this._shakeData.prevX : 0
      ,"prevY"    : this._shakeData ? this._shakeData.prevY : 0
      ,"callback" : callback
    };
    
    return this;
  };
  
  /**
   * apply the shake each update
   * You shouldn't call or change this method
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyShake = function()
  {
    if ( this._shakeData.done ) {
      return;
    }
    
    var shake = this._shakeData;
    // restore previous shake
    this.x -= shake.prevX;
    this.y -= shake.prevY;
    shake.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    // old way - Date.now() - this._shakeData.startedAt > this._shakeData.duration )
    if ( shake.duration <= 0 ) {
      
      if ( shake.callback ) {
        shake.callback.call( this, shake.callback );
      }
      
      shake.done = true;
      shake.prevX = 0;
      shake.prevY = 0;
      this.trigger( "shakeEnd" );
      return;
    }
    
    shake.prevX = - ( Math.random() * shake.xRange ) + ( Math.random() * shake.xRange ) >> 0;
    shake.prevY = - ( Math.random() * shake.yRange ) + ( Math.random() * shake.yRange ) >> 0;
    
    this.x += shake.prevX;
    this.y += shake.prevY;
  };
  
  return GameObject;
} );