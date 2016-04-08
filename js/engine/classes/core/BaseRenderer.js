define( [ 'DE.Time' ],
function( Time )
{
  var _inherits = [
    "center", "uncenter", "setScale", "applyFade", "fade", "fadeIn", "fateTo", "fadeOut", "scaleTo", "applyScale"
  ];
  var _attributes = [
    "fadeData", "scaleData"
  ];
  BaseRenderer = new function()
  {
    /**
     * object used to apply fade on final BaseRenderer rendering
     * @protected
     * @memberOf BaseRenderer
     * @type {Object}
     */
    this.fadeData = {
      "from"     : 1
      ,"to"      : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    /**
     * object used to apply scale on final Renderer rendering
     * @protected
     * @memberOf Renderer
     * @type {Object}
     */
    this.scaleData = {
      "fromx"    : 1
      ,"tox"     : 0
      ,"fromy"   : 1
      ,"toy"     : 0
      ,"duration": 1000
      ,"done"    : true
    };
    
    this.inherits = function( target )
    {
      for ( var i = 0; i < _inherits.length; ++i )
        target.prototype[ _inherits[ i ] ] = this[ _inherits[ i ] ];
    };
    
    this.instantiate = function( target )
    {
      for ( var i = 0; i < _attributes.length; ++i )
        target[ _attributes[ i ] ] = this[ _attributes[ i ] ];
    };
  };
  
  BaseRenderer.center = function()
  {
    if ( this._isCentered )
      return;
    this._isCentered = true;
    var b = null;
    if ( !this.width && !this.height )
    {
      b = this.getBounds();
      this.position.x -= b.width * 0.5 >> 0;
      this.position.y -= b.height * 0.5 >> 0;
    }
    else
    {
      this.position.x -= this.width * 0.5 >> 0;
      this.position.y -= this.height * 0.5 >> 0;
    }
  };
  
  BaseRenderer.uncenter = function()
  {
    if ( !this._isCentered )
      return;
    this._isCentered = false;
    var b = null;
    if ( !this.width && !this.height )
    {
      b = this.getBounds();
      this.position.x += b.width * 0.5 >> 0;
      this.position.y += b.height * 0.5 >> 0;
    }
    else
    {
      this.position.x += this.width * 0.5 >> 0;
      this.position.y += this.height * 0.5 >> 0;
    }
  };
  
  BaseRenderer.setScale = function( x, y )
  {
    if ( !this.preventCenter )
      this.uncenter();
    if ( y === undefined )
    {
      if ( x.x )
        this.scale.set( x.x, x.y );
      else
        this.scale.set( x, x );
    }
    else
      this.scale.set( x, y );
    
    if ( !this.preventCenter )
      this.center();
  };
  
  
  /**
   * apply the current fade
   * @protected
   * @memberOf BaseRenderer
   */
  BaseRenderer.applyFade = function()
  {
    if ( this.fadeData.done )
      return;
  
    this.fadeData.stepVal = Time.timeSinceLastFrame / this.fadeData.oDuration
                            * this.fadeData.dir * this.fadeData.fadeScale;
    this.alpha += this.fadeData.stepVal * Time.scaleDelta;
    this.fadeData.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    if ( ( this.fadeData.dir < 0 && this.alpha <= this.fadeData.to )
        || ( this.fadeData.dir > 0 && this.alpha >= this.fadeData.to )
        || this.alpha < 0 || this.alpha > 1 )
    {
      this.alpha = this.fadeData.to;
    }
    if ( this.fadeData.duration <= 0 )
    {
      this.fadeData.done = true;
      if ( this.alpha == 1 || this.alpha == 0 )
      {
        if ( this.alpha == 0 )
          this.sleep = true;
      }
      if ( this.gameObject )
        this.gameObject.trigger( "fadeEnd", this );
    }
  };
  
  /**
   * create a fade from val, to val, with given duration time
   * @public
   * @memberOf BaseRenderer
   * @param {Float} from start value
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fade( 0.5, 1, 850 );
   */
  BaseRenderer.fade = function( from, to, duration )
  {
    this.sleep = false;
    var data = {
      from      : from || 1
      ,to       : to != undefined ? to : 0
      ,duration : duration || 500
      ,oDuration: duration || 500
      ,fadeScale: Math.abs( from - to )
      ,done     : false
    };
    data.dir = data.from > to ? -1 : 1;
    this.alpha = from;
    this.fadeData = data;
  };
  
  /**
   * create a fade to val, from current alpha value with given duration time
   * @public
   * @memberOf BaseRenderer
   * @param {Float} [to=0] end value
   * @param {Int} [duration=500] fade duration in ms
   * @example myObject.renderers[ 0 ].fadeTo( 0.5, 850 ); // don't care if alpha is 0.2 or 0.8
   */
  BaseRenderer.fadeTo = function( to, duration )
  {
    this.sleep = false;
    this.fade( this.alpha, to, duration );
  };
  
  /**
   * fade the BaseRenderer to alpha 0 with given duration time
   * fade start to the current alpha or 1 if force is true
   * @public
   * @memberOf BaseRenderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 1 before fade
   * @example // alpha = 0 in 850ms
   * myObject.renderers[ 0 ].fadeOut( 850 );
   */
  BaseRenderer.fadeOut = function( duration, force )
  {
    this.sleep = false;
    if ( force )
      this.alpha = 1;
    this.fade( this.alpha, 0, duration );
  };
  
  /**
   * fade the BaseRenderer to alpha 1 with given duration time
   * fade start to the current alpha, or 0 if force is true
   * @public
   * @memberOf BaseRenderer
   * @param {Int} [duration=500] fade duration in ms
   * @param {Boolean} [force=false] if true will set alpha at 0 before fade
   * @example // alpha = 1 in 850ms
   * myObject.renderers[ 0 ].fadeIn( 850 );
   */
  BaseRenderer.fadeIn = function( duration, force )
  {
    this.sleep = false;
    if ( force )
      this.alpha = 0;
    this.fade( this.alpha, 1, duration );
  };
  
  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf BaseRenderer
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myRenderer.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  BaseRenderer.scaleTo = function( scale, duration )
  {
    var dscale = {
      "x"     : !isNaN( scale ) ? scale : scale.x
      ,"y"    : !isNaN( scale ) ? scale : scale.y
    };
    this.scaleData = {
      "valX"     : - ( this.scale.x - ( dscale.x !== undefined ? dscale.x : this.scale.x ) )
      ,"valY"    : - ( this.scale.y - ( dscale.y !== undefined ? dscale.y : this.scale.y ) )
      ,"dirX"     : this.scale.x > dscale.x ? 1 : -1
      ,"dirY"     : this.scale.y > dscale.y ? 1 : -1
      ,"duration" : duration || 500
      ,"oDuration": duration || 500
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"destX"    : dscale.x
      ,"destY"    : dscale.y
      ,"scaleX"   : this.scale.x
      ,"scaleY"   : this.scale.y
    };
    this.scaleData.leftX = this.scaleData.valX;
    this.scaleData.leftY = this.scaleData.valY;
  };
  
  /**
   * apply the current scale
   * @protected
   * @memberOf BaseRenderer
   */
  BaseRenderer.applyScale = function()
  {
    if ( this.scaleData.done )
      return;
    
    var scaleD = this.scaleData;
    
    if ( scaleD.valX != 0 )
    {
      scaleD.stepValX = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valX * Time.scaleDelta;
      scaleD.leftX    -= scaleD.stepValX;
      scaleD.scaleX   += scaleD.stepValX;
    }
    
    if ( scaleD.valY != 0 )
    {
      scaleD.stepValY = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valY * Time.scaleDelta;
      scaleD.leftY    -= scaleD.stepValY;
      scaleD.scaleY   += scaleD.stepValY;
    }
    scaleD.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check scale
    if ( scaleD.dirX < 0 && scaleD.leftX < 0 )
      scaleD.scaleX += scaleD.leftX;
    else if ( scaleD.dirX > 0 && scaleD.leftX > 0 )
      scaleD.scaleX -= scaleD.leftX;
    
    if ( scaleD.dirY < 0 && scaleD.leftY < 0 )
      scaleD.scaleY += scaleD.leftY;
    else if ( scaleD.dirY > 0 && scaleD.leftY > 0 )
      scaleD.scaleY -= scaleD.leftY;
    
    this.setScale( scaleD.scaleX, scaleD.scaleY );
    
    if ( scaleD.duration <= 0 )
    {
      this.scaleData.done = true;
      this.setScale( scaleD.destX, scaleD.destY );
      if ( this.gameObject )
        this.gameObject.trigger( "scaleEnd", this );
    }
  };
  BaseRenderer.DEName = "BaseRenderer";
  
  return BaseRenderer;
} );