define( [
  'PIXI'
  , 'DE.Time'
],
function(
  PIXI
  , Time
)
{
  var _PI = Math.PI;
  function Vector2( x, y, gameObject )
  {
    this._x         = x || 0;
    this._y         = y || 0;
    this._rotation  = 0;
    this._cosAngle  = 1;
    this._sinAngle  = 0;
    this.gameObject = gameObject;
  }

  Vector2.prototype = Object.create( PIXI.Container.prototype );
  Vector2.prototype.constructor = Vector2;

  Object.defineProperties( Vector2.prototype, {
    /**
     * @public
     * @memberOf Vector2
     * @type {Float}
     */
    x: {
      get: function()
      {
        return this.gameObject.x || this._x;
      }
      , set: function( value )
      {
        this._x = value;
        if ( this.gameObject ) {
          this.gameObject.x = value;
        }
      }
    }
    , y: {
      get: function()
      {
        return this.gameObject.y || this._y;
      }
      , set: function( value )
      {
        this._y = value;
        if ( this.gameObject ) {
          this.gameObject.y = value;
        }
      }
    }
    , rotation: {
      get: function()
      {
        return this.gameObject.rotation || this._rotation;
      }
      , set: function( value )
      {
        this._updateRotation( value );
        if ( this.gameObject ) {
          this.gameObject.rotation = value;
        }
      }
    }
  } );

  Vector2.prototype._updateRotation = function( value )
  {
    this._rotation = value;
    if ( this._rotation == 0 ) {
      this._sinAngle = 0;
      this._cosAngle = 1;
    }
    else {
      this._sinAngle = Math.sin( this._rotation );
      this._cosAngle = Math.cos( this._rotation );
    }
  };
  /**
   * move position along the given Vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} vector2 vector to translate along
   * @param {Boolean} absolute if absolute, translation will ignore current rotation
   * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.translate = function( vector2, absolute, ignoreDelta )
  {
    if ( ( !vector2.x && vector2.x != 0 ) || ( !vector2.y && vector2.y != 0 ) ) {
      throw new Error( vector2 + " is not a Vector2" );
    }
    
    if ( !ignoreDelta ) {
      vector2 = {
        x : ( vector2.x * Time.deltaTime )
        ,y: ( vector2.y * Time.deltaTime )
      };
    }
    
    if ( !absolute ) {
      if ( this.rotation == 0 ) {
        this.x += vector2.x;
        this.y += vector2.y;
      }
      else {
        this.x -= -vector2.x * this._cosAngle + vector2.y * this._sinAngle;
        this.y -= -vector2.x * this._sinAngle + vector2.y * -this._cosAngle;
      }
    }
    else {
      this.x += vector2.x;
      this.y += vector2.y;
    }
    return this;
  };

  /**
   * set precise rotation
   * @public
   * @memberOf Vector2
   * @param {Float} newAngle
   * @returns {Float} this.rotation current rotation
   */
  Vector2.prototype.setRotation = function( newAngle )
  {
    this.rotation = newAngle % ( _PI * 2 );
    return this.rotation;
  }

  /**
   * apply the given angle to rotation
   * @public
   * @memberOf Vector2
   * @param {Float} angle rotation value
   * @param {Boolean} [ignoreDelta] if you want to prevent deltaTime adjustment
   * @returns {Float} this.rotation current rotation
   */
  Vector2.prototype.rotate = function( angle, ignoreDelta )
  {
    if ( ignoreDelta )
      return this.setRotation( this.rotation + angle );
    return this.setRotation( this.rotation + ( angle * Time.deltaTime ) );
  }

  /**
   * multiply this vector with coef
   * @public
   * @memberOf Vector2
   * @param {Float} coef
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.multiply = function( coef )
  {
    this.x *= coef;
    this.y *= coef;
    return this;
  }

  /**
   * change the vector length to 1 (check wikipedia normalize if you want know more about)
   * @public
   * @memberOf Vector2
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.normalize = function()
  {
    if ( this.x == 0 && this.y == 0 ) {
      this.x = 0;
      this.y = 0;
      return this;
    }
    var len = Math.sqrt( this.x * this.x + this.y * this.y );
    this.x = this.x / len;
    this.y = this.y / len;
    return this;
  };

  /**
   * return the Vector between two Vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.getVector = function( a, b )
  {
    if ( (!a.x && a.x != 0) || (!a.y && a.y != 0)
      || (!b.x && b.x != 0) || (!b.y && b.y != 0) ) {
      throw new Error( "Vector2 need two Vector2 to return getVector" );
    }
    
    this.x = b.x - a.x;
    this.y = b.y - a.y;
    return this;
  };

  /**
   * return the angle from a vector usefull for moves / translations without rotation
   * @public
   * @memberOf Vector2
   * @param {Vector2} vector2
   * @returns {Float} radians value
   */
  Vector2.prototype.getVectorAngle = function( vector2 )
  {
    return ( Math.atan2( vector2.y, vector2.x ) + _PI * 0.5 ) % ( _PI * 2 );
  };

  /**
   * return the dotProduct between two Vector<br>
   * See wikipedia dot product for more informations
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Float} dotProduct result
   */
  Vector2.prototype.dotProduct = function( a, b )
  {    
    if ( !a.x || !a.y ) {
      throw new Error( "Vector2 need two Vector2 to return dotProduct" );
    }
    if ( b && b.x ) {
      return a.x * b.x + a.y * b.y;
    }
    return this.x * a.x + this.y * a.y;
  };

  /**
   * return the angle (radians) between two vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} a first vector2
   * @param {Vector2} b second vector2
   * @returns {Float} angle result
   */
  Vector2.prototype.getAngle = function( otherA, otherB )
  {
    if ( !otherB ) {
      otherB = this;
      
      if ( this.gameObject ) {
        otherB = this.gameObject.toGlobal( { x: 0, y: 0 } );
      }
    }
    return Math.atan2( otherA.y - otherB.y, otherA.x - otherB.x );
  };

  /**
   * I keep this function because I accidentally coded something fun with, so... :D
   */
  Vector2.prototype.wtfAngle = function( a, b )
  {
    var tmp_vectorB = null;
    if ( b && b.x ) {
      tmp_vectorB = new Vector2( b.x, b.y ).normalize();
    }
    else {
      tmp_vectorB = new Vector2( this.x, this.y ).normalize();
    }
    var tmp_vectorA = new Vector2( a.x, a.y ).normalize();
    return Math.acos( tmp_vectorA.dotProduct( tmp_vectorB ) );
  };

  /**
   * return real pixel distance with an other Vector2
   * @public
   * @memberOf Vector2
   * @param {Vector2} other
   * @returns {Int} distance result
   */
  /****
   * getDistance@Int( other@Vector2 )
   */
  Vector2.prototype.getDistance = function( other )
  {
    var x = this.x - other.x;
      x *= x;
    var y = this.y - other.y;
      y *= y;
    return Math.sqrt( x + y ) >> 0;
  };

  /**
   * trigger a circle collision with an other Vector and a range
   * @public
   * @memberOf Vector2
   * @param {Vector2} other
   * @param {Float} range
   * @returns {Boolean} isInRange result
   */
  Vector2.prototype.isInRangeFrom = function( other, range )
  {
    range *= range;
    var x = this.x - other.x;
      x *= x;
    var y = this.y - other.y;
      y *= y;
    var dist = x + y;
    if ( dist <= range ) {
      return true;
    }
    return false;
  };

  /**
   * return the harmonics value<br>
   * can pass a rotation to get harmonics with this rotation
   * @public
   * @memberOf Vector2
   * @param {Float} [rotation] used by gameObjects in getPos and other
   * @returns {Harmonics} harmonics (cosinus and sinus)
   */
  Vector2.prototype.getHarmonics = function( rotation )
  {
    if ( rotation ) {
      return { cos: Math.cos( rotation + this.rotation )
      , sin: Math.sin( rotation + this.rotation ) };
    }
    return { 'cos': this._cosAngle, 'sin': this._sinAngle };
  };


  /**
   * set precise position - fall-back for older dreamengine version - DEPRECATED - use PIXI.DisplayObject.position.set
   * @public
   * @memberOf Vector2
   * @param {Vector2|Float} Vector2 or x / y
   * @returns {Vector2} this current instance
   */
  Vector2.prototype.setPosition = function( first, y )
  {
    if ( first.x !== undefined || first.y !== undefined )
    {
      this.x = first.x != undefined ? first.x : this.x;
      this.y = first.y != undefined ? first.y : this.y;
      return this;
    }
    this.x = first != undefined ? first : this.x;
    this.y = y != undefined ? y : this.y;
    return this;
  };
  Vector2.prototype.set = Vector2.prototype.setPosition;

  /**
   * simple clone method
   * @public
   * @memberOf Vector2
   */
  Vector2.prototype.clone = function()
  {
    return new Vector2( this.x, this.y, this._z );
  };

  /**
   * return a positive angle difference between 2 angles.
    Example, if A = 0 and B = PI*2, then difference is 0.
    (or A = 0.1 B = 6, difference is 0.383185307179586)
   */
  Vector2.prototype.getAnglesDifference = function( angleA, angleB )
  {
    if ( angleB === undefined ) {
      angleB = this.rotation;
    }
    
    var difference = angleA - angleB;
    if ( difference < -_PI ) {
      difference += _PI*2;
    }
    else if ( difference > _PI ) {
      difference -= _PI*2;
    }
    return Math.abs( difference );
  };
  
  Vector2.prototype.DEName = "Vector2";
  return Vector2;
} );