define( [
  'DE.GameObject'
  , 'DE.Time'
  , 'DE.config'
],
function(
  GameObject
  , Time
  , config
)
{
  /**
   * Because we use a complex scaling system (with z modifier), we have to use this middle-ware to trigger updateScale
   * if you call directly .scale.set it will work but not if there is a z modifier
   * @public
   * @memberOf GameObject
   */
  GameObject.prototype.setScale = function( x, y )
  {
    this.scale.set( x, y );
    this._updateScale();
    
    return this;
  };
  
  /**
   * when z change we restore saved scale, then change it again to final values and update worldScale
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateZScale = function()
  {
    // this come from old Camera render (working fine as excepted...)
    // zMaxDepth is 10 by default so if z is 1 scale modifier will be 0.9 (1 - 0.1)
    var zscale = 1 - ( this.z / config.zMaxDepth );
    this._zscale = zscale;
    
    this.scale.x = zscale * this.savedScale.x;
    this.scale.y = zscale * this.savedScale.y;
    
    // update worldScale
    this._updateWorldScale();
    for ( var i = 0; i < this.gameObjects.length; ++i )
    {
      this.gameObjects[ i ]._updateWorldScale();
    }
  };
  
  /**
   * when we change the scale manually, we need to re-apply z deformation
   * directly save the old scale before zscale applies (this way we can recalculate things from the beginning)
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateScale = function()
  {
    this.savedScale.copy( this.scale );
    this.scale.x = this._zscale * this.scale.x;
    this.scale.y = this._zscale * this.scale.y;
    
    // PIXI update worldScale
    this._updateWorldScale();
    for ( var i = 0; i < this.gameObjects.length; ++i )
    {
      this.gameObjects[ i ]._updateWorldScale();
    }
  };
  
  /**
   * _updateWorldScale is the same as _updateScale but it take every parent scale in consideration.
   * use worldScale when you want to know what is the "real" scale of the current object
   * for example, with Ship contain Reactor.
   * if Ship.scale = 0.5 then Reactor.wordScale = 0.5
   * if Ship.scale = 0.5 and Reactor.scale = 0.5 then Reactor.worldScale = 0.25
   * @private
   * @memberOf GameObject
   */
  GameObject.prototype._updateWorldScale = function()
  {
    this.worldScale.set( this.scale.x, this.scale.y );
    
    if ( !this.parent || !this.parent._isGameObject ) {
      return;
    }
    
    this.worldScale.x = this.worldScale.x * this.parent.worldScale.x;
    this.worldScale.y = this.worldScale.y * this.parent.worldScale.y;
    
    return this;
  };
  
  /**
   * create a fluid scale
   * you can only have one at a time
   * @public
   * @memberOf GameObject
   * @param {Object} scale give final x, and final y
   * @param {Int} [duration=500] time duration
   * @example // scale to 2,3 in 1 second
   * myGameObject.scaleTo( { x: 2, y: 3 }, 1000 );
   */
  GameObject.prototype.scaleTo = function( scale, duration )
  {
    var dscale = {
      "x"     : !isNaN( scale ) ? scale : scale.x
      ,"y"    : !isNaN( scale ) ? scale : scale.y
    };
    this._scaleData = {
      "valX"      : - ( this.savedScale.x - ( dscale.x !== undefined ? dscale.x : this.savedScale.x ) )
      ,"valY"     : - ( this.savedScale.y - ( dscale.y !== undefined ? dscale.y : this.savedScale.y ) )
      ,"dirX"     : this.savedScale.x > dscale.x ? 1 : -1
      ,"dirY"     : this.savedScale.y > dscale.y ? 1 : -1
      ,"duration" : duration || 500
      ,"oDuration": duration || 500
      ,"done"     : false
      ,"stepValX" : 0
      ,"stepValY" : 0
      ,"destX"    : dscale.x
      ,"destY"    : dscale.y
      ,"scaleX"   : this.savedScale.x
      ,"scaleY"   : this.savedScale.y
    };
    this._scaleData.leftX = this._scaleData.valX;
    this._scaleData.leftY = this._scaleData.valY;
    
    return this;
  };
  
  /**
   * apply the current scale
   * @protected
   * @memberOf GameObject
   */
  GameObject.prototype.applyScale = function()
  {
    if ( this._scaleData.done ) {
      return;
    }
    
    var scaleD = this._scaleData;
    
    if ( scaleD.valX != 0 ) {
      scaleD.stepValX = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valX * Time.scaleDelta;
      scaleD.leftX    -= scaleD.stepValX;
      scaleD.scaleX   += scaleD.stepValX;
    }
    
    if ( scaleD.valY != 0 ) {
      scaleD.stepValY = Time.timeSinceLastFrame / scaleD.oDuration * scaleD.valY * Time.scaleDelta;
      scaleD.leftY    -= scaleD.stepValY;
      scaleD.scaleY   += scaleD.stepValY;
    }
    scaleD.duration -= Time.timeSinceLastFrame * Time.scaleDelta;
    
    // check scale
    if ( scaleD.dirX < 0 && scaleD.leftX < 0 ) {
      scaleD.scaleX += scaleD.leftX;
    }
    else if ( scaleD.dirX > 0 && scaleD.leftX > 0 ) {
      scaleD.scaleX -= scaleD.leftX;
    }
    
    if ( scaleD.dirY < 0 && scaleD.leftY < 0 ) {
      scaleD.scaleY += scaleD.leftY;
    }
    else if ( scaleD.dirY > 0 && scaleD.leftY > 0 ) {
      scaleD.scaleY -= scaleD.leftY;
    }
    
    this.scale.set( scaleD.scaleX, scaleD.scaleY );
    
    if ( scaleD.duration <= 0 ) {
      this._scaleData.done = true;
      this.scale.set( scaleD.destX, scaleD.destY );
      this.emit( "scale-end", this );
    }
    
    this._updateScale();
  };
  
  return GameObject;
} );