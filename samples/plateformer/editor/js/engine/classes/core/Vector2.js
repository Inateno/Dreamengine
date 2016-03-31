/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
**/

define( [ 'DE.Time', 'DE.CONFIG' ],
function( Time, CONFIG )
{
  function Vector2( x, y, z )
  {
    this.DEName = "Vector2";
    
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.rotation = 0;
    this.zratio  = 1;
    
    var _cosAngle = 0;
    var _sinAngle = 0;
    
    /**
    * @setRotation
    **/
    this.setRotation = function ( newAngle )
    {
      this.rotation = newAngle;
      
      _sinAngle = Math.sin( this.rotation );
      _cosAngle = Math.cos( this.rotation );
    }
    
    /**
    * @setPosition
    * first can be a vector or an object with x and y
    * otherwhise can pass x and y directly
    **/
    this.setPosition = function( first, y )
    {
      if ( first.x && first.y )
      {
        this.x = first.x;
        this.y = first.y;
        return;
      }
      this.x = first;
      this.y = y;
    }

    /**
    *** @rotate
    ** rotate this vector
    ** Need an angle in radians
    **/
    this.rotate = function ( angle )
    {
      this.rotation += angle * Time.deltaTime;
      
      _sinAngle = Math.sin( this.rotation );
      _cosAngle = Math.cos( this.rotation );
    }
    
    /**
    *** @multiply
    ** multiply this vector
    ** Need a coef
    **/
    this.multiply = function ( mult )
    {
      this.x *= mult;
      this.y *= mult;
    }
    
    /**
    *** @translate
    ** translate the vector with given vector
    **/
    this.translate = function ( vector2, local )
    {
      if ( (!vector2.x && vector2.x != 0) || (!vector2.y && vector2.y != 0) )
      {
        throw new Error( vector2 + " is not a Vector2" );
        return;
      }
      
      vector2.x = ( vector2.x * Time.deltaTime ) >> 0;
      vector2.y = ( vector2.y * Time.deltaTime ) >> 0;
      if ( local )
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
    }
    
    /**
    *** @normalize
    ** Change the vector length to 1
    **/
    this.normalize = function ()
    {
      var len = Math.sqrt(this.x * this.x + this.y * this.y);
      this.x /= len;
      this.y /= len;
    }
    
    /**
    * @getVector
    Need two Vector2()
    return the vector between two object position
    **/
    this.getVector = function ( pointA, pointB )
    {
      if ( (!pointA.x && pointA.x != 0) || (!pointA.y && pontA.y != 0)
        || (!pointB.x && pointB.x != 0) || (!pointB.y && pontB.y != 0) )
      {
        throw new Error("Please, give me two Vector2");
        return;
      }
      
      this.x = pointB.x - pointA.x;
      this.y = pointB.y - pointA.y;
    }
    
    /**
    * @dotProduct
    Return the dotProduct between two Vector2
    if = 0, the vectors are perpendiculare
    if = 1 they are in the same direction
    if = -1, they are facing
    Need two Vector2()
    **/
    this.dotProduct = function ( vectorA, vectorB )
    {    
      if ( (!vectorA.x && vectorA.x != 0) || (!vectorA.y && vectorA.y != 0)
        || (!vectorB.x && vectorB.x != 0) || (!vectorB.y && vectorB.y != 0) )
      {
        throw new Error("Please, give me two Vector2");
        return;
      }
      
      this.x = vectorB.x * vectorA.x;
      this.y = vectorB.y * vectorA.y;
    }
    
    /** 
    * @getAngle
    Need two Vector2()
    return the angle (radians) between two vector2
    **/
    this.getAngle = function ( vectorA, vectorB )
    {
      var tmp_vectorA = new Vector2( vectorA.x, vectorA.y )
        , tmp_vectorB = new Vector2( vectorB.x, vectorB.y )
        ;
      
      tmp_vectorA.normalize();
      tmp_vectorB.normalize();
      // var dot = tmp_vectorA.dotProduct(tmp_vectorB)
        // ,angle = Math.acos(dot)
        // ;
      return Math.acos( tmp_vectorA.dotProduct( tmp_vectorB ) );
    }
    
    /***
    * @isInRangeFrom
    ***/
    this.isInRangeFrom = function( other, range )
    {
      range *= range;
      var x = this.x - other.x;
        x *= x;
      var y = this.y - other.y;
        y *= y;
      var dist = x + y;
      if ( dist <= range )
      {
        return true;
      }
      return false;
    }
    
    /***
    * @getHarmonics
    return the harmonics value
    */
    this.getHarmonics = function( rotation )
    {
      if ( rotation )
      {
        return { cos: Math.cos( rotation )
        , sin: Math.sin( rotation ) }
      }
      return { 'cos': _cosAngle, 'sin': _sinAngle };
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Vector2 loaded" );
  }
  return Vector2;
} );