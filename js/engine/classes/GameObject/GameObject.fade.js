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
   * create a fade from alpha to alpha, with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fade( 0.5, 1, 850 );
   */
  GameObject.prototype.fade = function( from, to, duration, force )
  {
    if ( force ) {
      this.enable = true;
    }
    
    var data = {
      from      : from != undefined ? from : 1
      ,to       : to != undefined ? to : 0
      ,duration : duration || 500
      ,oDuration: duration || 500
      ,fadeScale: Math.abs( from - to )
      ,done     : false
    };
    data.dir      = data.from > to ? -1 : 1;
    this.alpha    = from;
    this.fadeData = data;
    
    if ( !this.visible && to > 0 ) {
      this.visible = true;
    }
  };
  
  /**
   * create a fade from current alpha to given value with given duration time
   * @public
   * @memberOf GameObject
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  GameObject.prototype.fadeTo = function( to, duration, force )
  {
    this.fade( this.alpha, to, duration, force );
  };
  
  /**
   * fade to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.fadeOut( 850 );
   */
  GameObject.prototype.fadeOut = function( duration, force )
  {
    if ( force ) {
      this.enable = true;
      this.alpha = 1;
    }
    
    this.fade( this.alpha, 0, duration, force );
    return this;
  };
  
  /**
   * fade to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf GameObject
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0
   * @example // alpha = 1 in 850ms
   * myObject.fadeIn( 850 );
   */
  GameObject.prototype.fadeIn = function( duration, force )
  {
    if ( force ) {
      this.enable = true;
      this.alpha = 0;
    }
    
    this.fade( this.alpha, 1, duration, force );
    return this;
  };
  
  /**
   * apply the current fade
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyFade = function()
  {
    if ( !this.fadeData.done ) {
      this.fadeData.stepVal = Time.timeSinceLastFrame / this.fadeData.oDuration
                              * this.fadeData.dir * this.fadeData.fadeScale;
      this.alpha += this.fadeData.stepVal * Time.scaleDelta;
      this.fadeData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
      
      if ( ( this.fadeData.dir < 0 && this.alpha <= this.fadeData.to )
          || ( this.fadeData.dir > 0 && this.alpha >= this.fadeData.to )
          || this.alpha < 0 || this.alpha > 1 ) {
        this.alpha = this.fadeData.to;
      }
      
      if ( this.fadeData.duration <= 0 ) {
        this.fadeData.done = true;
        
        if ( this.alpha == 0 ) {
          this.visible = false;
        }
        this.trigger( "fadeEnd", this );
      }
    }
  };
  
  return GameObject;
} );