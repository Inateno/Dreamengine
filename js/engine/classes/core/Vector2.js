/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* Vector2( x, y, z )
 so, this is strange I assume, there is a z.
 But this z isn't a real axis, it's usefull to make a fake 3D scale on objects and
 ordering GameObject by z and z-index (order is important, lower z will be under higher z of course)
 So it's a Vector2 because you can't rotate or do anything on z axe, z is totally optionnal
 TODO - check dotProduct call and getAngle method if it's ok
**/
define( [ 'DE.Time', 'DE.CONFIG' ],
function( Time, CONFIG )
{
  var _PI = Math.PI;
  function Vector2( x, y, z )
  {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.rotation = 0;
    
    var _cosAngle = 0;
    var _sinAngle = 0;
    
    /****
     * setRotation@radian( newAngle@radian )
      set the rotation between 0 and 2PI
     */
    this.setRotation = function( newAngle )
    {
      this.rotation = newAngle % ( _PI * 2 );
      
      if ( this.rotation == 0 )
      {
        _sinAngle = 0;
        _cosAngle = 0;
      }
      else
      {
        _sinAngle = Math.sin( this.rotation );
        _cosAngle = Math.cos( this.rotation );
      }
      return this.rotation;
    }
    
    /****
     * setPosition@Vector2( first@Vector2 || Int, y@Int )
      first can be a vector or an object with x and y
      otherwhise can pass x and y directly
     */
    this.setPosition = function( first, y )
    {
      if ( first.x && first.y )
      {
        this.x = first.x;
        this.y = first.y;
        return this;
      }
      this.x = first;
      this.y = y;
      return this;
    }

    /****
     * rotate@radian( angle@radian, [ignoreDelta@bool] )
      rotate this vector by adding given angle
      trunk final value between 0 and 2PI
      can ignore deltaTime
     */
    this.rotate = function( angle, ignoreDelta )
    {
      if ( ignoreDelta )
        return this.setRotation( this.rotation + angle );
      return this.setRotation( this.rotation + ( angle * Time.deltaTime ) );
    }
    
    /****
     * multiply@Vector2( coef@float )
      multiply this vector with coef
     */
    this.multiply = function( coef )
    {
      this.x *= coef;
      this.y *= coef;
      return this;
    }
    
    /****
     * translate@void( vector2@Vector2, [absolute@bool, ignoreDelta@bool] )
      add the given vector to current
      if absolute, will ignore the current Vector2 rotation
      can ignore deltaTime
     */
    this.translate = function ( vector2, absolute, ignoreDelta )
    {
      if ( ( !vector2.x && vector2.x != 0 ) || ( !vector2.y && vector2.y != 0 ) )
        throw new Error( vector2 + " is not a Vector2" );
      
      if ( !ignoreDelta )
      {
        var vector2 = {
          x : ( vector2.x * Time.deltaTime ) >> 0
          ,y: ( vector2.y * Time.deltaTime ) >> 0
        }
      }
      
      if ( !absolute )
      {
        if ( _cosAngle && _sinAngle )
        {
          this.x -= -vector2.x * _cosAngle + vector2.y * _sinAngle;
          this.y -= -vector2.x * _sinAngle + vector2.y * -_cosAngle;
        }
        else
        {
          this.x += vector2.x;
          this.y += vector2.y;
        }
      }
      else
      {
        this.x += vector2.x;
        this.y += vector2.y;
      }
      return this;
    }
    
    /****
     * normalize@Vector2
      change the vector length to 1 (check wikipedia normalize if you want know more about)
     */
    this.normalize = function()
    {
      var len = Math.sqrt( this.x * this.x + this.y * this.y );
      this.x = this.x / len >> 0;
      this.y = this.y / len >> 0;
      return this;
    }
    
    /****
     * getVector@Vector2( a@Vector2, b@Vector2 )
      return the Vector between two Vector2
     */
    this.getVector = function( a, b )
    {
      if ( (!a.x && a.x != 0) || (!a.y && a.y != 0)
        || (!b.x && b.x != 0) || (!b.y && b.y != 0) )
        throw new Error( "Vector2 need two Vector2 to return getVector" );
      
      this.x = b.x - a.x;
      this.y = b.y - a.y;
      return this;
    }
    
    /****
     * dotProduct@Vector2( a@Vector2, b@Vector2 )
      return the dotProduct between two Vector
      See wikipedia dot product for more informations
     */
    this.dotProduct = function( a, b )
    {    
      if ( !a.x || !a.y )
        throw new Error( "Vector2 need two Vector2 to return dotProduct" );
        // || (!b.x && b.x != 0) || (!b.y && b.y != 0) )
      
      /* this was previous code but it's wrong, but if it was here, it's probably for a reason
      this.x = b.x * a.x;
      this.y = b.y * a.y;
      return this;*/
      if ( b.x )
        return a.x * b.x + a.y * b.y;
      return this.x * a.x + this.y * a.y;
    }
    
    /****
     * getAngle@radian( a@Vector2, b@Vector2 )
      return the angle (radians) between two vector2
     */
    this.getAngle = function ( a, b )
    {
      var tmp_vectorB = null;
      if ( b.x )
        tmp_vectorB = new Vector2( b.x, b.y ).normalize();
      else
        tmp_vectorB = new Vector2( this.x, this.y ).normalize();
      var tmp_vectorA = new Vector2( a.x, a.y ).normalize();
      return Math.acos( tmp_vectorA.dotProduct( tmp_vectorB ) );
    }
    
    /****
     * getDistance@Int( other@Vector2 )
      return real pixel distance with an other Vector2 
     */
    this.getDistance = function( other )
    {
      var x = this.x - other.x;
        x *= x;
      var y = this.y - other.y;
        y *= y;
      return Math.sqrt( x + y ) >> 0;
    }
    
    /****
     * isInRangeFrom@bool( other@Vector2, range@Int )
      trigger a circle collision with an other Vector and a range
     */
    this.isInRangeFrom = function( other, range )
    {
      range *= range;
      var x = this.x - other.x;
        x *= x;
      var y = this.y - other.y;
        y *= y;
      var dist = x + y;
      if ( dist <= range )
        return true;
      return false;
    }
    
    /****
     * getHarmonics@harmonics( [rotation@radian] )
      return the harmonics value
      can pass a rotation to get harmonics with this rotation
     */
    this.getHarmonics = function( rotation )
    {
      if ( rotation )
        return { cos: Math.cos( rotation )
        , sin: Math.sin( rotation ) };
      return { 'cos': _cosAngle, 'sin': _sinAngle };
    }
    
    return this;
  }
  Vector2.prototype.DEName = "Vector2";
  
  CONFIG.debug.log( "Vector2 loaded", 3 );
  return Vector2;
} );