/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* CollisionSystem
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var CollisionSystem = new function()
  {
    this.DEName = "CollisionSystem";
    
    /** ////////////////////////////////
      @fixedBoxPointCollision
    // -> Point with FIXED_BOX
    */
    this.pointFixedBoxCollision = function( point, box )
    {
      var boxpoints = ( box.getRealPosition ) ? box.getRealPosition() : { x: box.x, y: box.y };
       if (point.x >= boxpoints.x
        && point.x < boxpoints.x + box.width
        && point.y >= boxpoints.y
        && point.y < boxpoints.y + box.height)
           return true;
       else
           return false;
    }
    /** ////////////////////////////////
      @fixedBoxCollision
    // -> FIXED_BOX with FIXED_BOX
    */
    this.fixedBoxCollision = function( boxA, boxB )
    {
      var boxAPoints = ( boxA.getRealPosition ) ? boxA.getRealPosition() : { x: boxA.x, y: boxA.y };
      var boxBPoints = ( boxB.getRealPosition ) ? boxB.getRealPosition() : { x: boxB.x, y: boxB.y };
      if ((boxBPoints.x >= boxAPoints.x + boxA.width) 
      || (boxBPoints.x + boxB.width <= boxAPoints.x) 
      || (boxBPoints.y >= boxAPoints.y + boxA.height)
      || (boxBPoints.y + boxB.height <= boxAPoints.y))  
              return false; 
         else
              return true; 
    }
    
    /** ////////////////////////////////
      @pointCircleCollision
    // -> point with Circle
    */
    this.pointCircleCollision = function( point, C )
    {
      var Cpoints = C.getRealPosition();
      var d2 = (point.x- Cpoints.x)*(point.x - Cpoints.x) + (point.y- Cpoints.y)*(point.y - Cpoints.y);
         if (d2 > C.radius*C.radius){
            return false;
         }
        return true;
    }

    /** ////////////////////////////////
      @circleCollision
    // -> CIRCLE with CIRCLE
    */
    this.circleCollision = function( circleA, circleB )
    {
      var allowedDistance = ( circleB.radius + circleA.radius )*( circleB.radius + circleA.radius );
      
      var realPosA = circleA.getRealPosition()
        , realPosB = circleB.getRealPosition();
      
      var realDistance = ( ( realPosB.x - realPosA.x ) * ( realPosB.x - realPosA.x ) ) + ( ( realPosB.y - realPosA.y ) * ( realPosB.y - realPosA.y ) );
      
      return ( realDistance < allowedDistance ) ? true : false;
    }
    
    /** ////////////////////////////////
      @orientedBoxCollision
    // -> ORIENTED_BOX with ORIENTED_BOX
    */
    this.orientedBoxCollision = function( boxA, boxB )
    {
      var aExtCircle = boxA.getExternCircle()
        , bExtCircle = boxB.getExternCircle();
      
      // test de collision avec cercle circonscris
      var extDistance = ( aExtCircle.radius + bExtCircle.radius );
        extDistance*= extDistance;
      
      var realPosBoxA    = boxA.getRealPosition()
        , realPosBoxB  = boxB.getRealPosition();
      
      var distance = ( realPosBoxB.x - realPosBoxA.x ) * ( realPosBoxB.x - realPosBoxA.x )
                + ( realPosBoxB.y - realPosBoxA.y ) * ( realPosBoxB.y - realPosBoxA.y );
      if ( distance > extDistance )
      {
        return false;
      }
      return true;
    }
    
    /** ////////////////////////////////
      @fixedBoxWithOrientedBoxCollision
    // -> FIXED_BOX with ORIENTED_BOX
    // is the same than ORIENTED_BOX with ORIENTED_BOX
    */
    this.fixedBoxWithOrientedBoxCollision = function( fixedBox, orientedBox )
    {
      if ( fixedBox.rotation == orientedBox.rotation )
      {
      }
      
      return this.orientedBoxCollision ( fixedBox, orientedBox );
    }
    
    /** ////////////////////////////////
      @orientedBoxWithCircleCollision
    // -> CIRCLE with ORIENTED_BOX
    */
    this.orientedBoxWithCircleCollision = function( orientedBox, circle )
    {
      
    }
    
    /** ////////////////////////////////
      @fixedBoxWithCircleCollision
    // -> CIRCLE with FIXED_BOX
    */
    this.fixedBoxWithCircleCollision = function( fixedBox, circle )
    {
    }
    
    this.checkCollisionWith = function( first, second )
    {
      var collision = false;
      if ( second.type == first.type )
      {
        switch ( first.type )
        {
          /* FIXED_BOX */
          case CONFIG.COLLISION_TYPE.FIXED_BOX:
            collision = CONFIG.CollisionSystem.fixedBoxCollision ( first, second );
            break;
          
          /* CIRCLES */
          case CONFIG.COLLISION_TYPE.CIRCLES:
            collision = CONFIG.CollisionSystem.circleCollision ( first, second );
            break;
          
          /* ORIENTED_BOX */
          case CONFIG.COLLISION_TYPE.ORIENTED_BOX:
            collision = CONFIG.CollisionSystem.orientedBoxCollision ( first, second );
            break;
        }
        return collision;
      }
      
      /* FIXED_BOX with ORIENTED_BOX */
      if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
        && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        collision = CONFIG.CollisionSystem.fixedBoxWithOrientedBoxCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        collision = CONFIG.CollisionSystem.fixedBoxWithOrientedBoxCollision ( second, first );
      }
      /* CIRCLE with ORIENTED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        collision = CONFIG.CollisionSystem.orientedBoxWithCircleCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
        && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        collision = CONFIG.CollisionSystem.orientedBoxWithCircleCollision ( second, first );
      }
      /* CIRCLE with FIXED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
        && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        collision = CONFIG.CollisionSystem.fixedBoxWithCircleCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
        && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        collision = CONFIG.CollisionSystem.fixedBoxWithCircleCollision ( second, first );
      }

      var point = null;
      var object = null;
      if (!first.type)
      {  
        
        point = first;
        object = second;
      }
      if (!second.type)
      {
        point = second;
        object= first;
      }
      if (point && object)
      {

        if (object.type == CONFIG.COLLISION_TYPE.CIRCLE)
        {

          collision = this.pointCircleCollision( point, object );
        }
        if (object.type == CONFIG.COLLISION_TYPE.FIXED_BOX)
        {
          collision = this.pointFixedBoxCollision( point, object );
        }  
      }
      return collision;
    }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "CollisionSystem loaded" );
  }
  return CollisionSystem;
} );