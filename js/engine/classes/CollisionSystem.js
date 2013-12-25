/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@CollisionSystem
 at the moment provide only triggers method but in the future should provide Collisions resolutions.
 Miss trigger for orientedBox with all others and circle vs fixedBox
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var CollisionSystem = new function()
  {
    this.DEName = "CollisionSystem";
    
    /****
     * pointFixedBoxCollision@Bool( point@Vector2, box@FixedBoxCollider )
      trigger point in FixedBoxCollider
     */
    this.pointFixedBoxCollision = function( point, box )
    {
      var boxpoints = ( box.getRealPosition ) ? box.getRealPosition() : { x: box.x, y: box.y };
      if ( point.x >= boxpoints.x
        && point.x < boxpoints.x + box.width
        && point.y >= boxpoints.y
        && point.y < boxpoints.y + box.height )
        return true;
      else
        return false;
    }
    
    /****
     * fixedBoxCollision@Bool( box1@FixedBoxCollider, boxB@FixedBoxCollider )
      FixedBox Collision triggering
     */
    this.fixedBoxCollision = function( boxA, boxB )
    {
      var boxAPoints = ( boxA.getRealPosition ) ? boxA.getRealPosition() : { x: boxA.x, y: boxA.y };
      var boxBPoints = ( boxB.getRealPosition ) ? boxB.getRealPosition() : { x: boxB.x, y: boxB.y };
      if ( ( boxBPoints.x >= boxAPoints.x + boxA.width )
        || ( boxBPoints.x + boxB.width <= boxAPoints.x )
        || ( boxBPoints.y >= boxAPoints.y + boxA.height )
        || ( boxBPoints.y + boxB.height <= boxAPoints.y ) )  
        return false; 
      else
        return true; 
    }
    
    /****
     * pointCircleCollision@Bool( point@Vector2, C@CircleCollider )
      trigger point in CircleCollider
     */
    this.pointCircleCollision = function( point, C )
    {
      var Cpoints = C.getRealPosition();
      var d2 = ( point.x - Cpoints.x ) * ( point.x - Cpoints.x )
             + ( point.y - Cpoints.y ) * ( point.y - Cpoints.y );
      if ( d2 > C.radius * C.radius )
        return false;
      return true;
    }

    /****
     * circleCollision@Bool( circleA@CircleCollider, circleB@CircleCollider )
      return colliders triggering
     */
    this.circleCollision = function( circleA, circleB )
    {
      var allowedDistance = ( circleB.radius + circleA.radius ) * ( circleB.radius + circleA.radius );
      
      var realPosA = circleA.getRealPosition()
        , realPosB = circleB.getRealPosition();
      
      var realDistance = ( ( realPosB.x - realPosA.x ) * ( realPosB.x - realPosA.x ) )
                       + ( ( realPosB.y - realPosA.y ) * ( realPosB.y - realPosA.y ) );
      
      return ( realDistance < allowedDistance ) ? true : false;
    }
    
    /****
     * orientedBoxCollision@Bool( boxA@OrientedBoxCollider, boxB@OrientedBoxCollider )
      TODO
     */
    this.orientedBoxCollision = function( boxA, boxB )
    {
      var aExtCircle = boxA.getExternCircle()
        , bExtCircle = boxB.getExternCircle();
      
      // try collision with outside circle
      var extDistance = ( aExtCircle.radius + bExtCircle.radius );
      extDistance *= extDistance;
      
      var realPosBoxA  = boxA.getRealPosition()
        , realPosBoxB  = boxB.getRealPosition();
      
      var distance = ( realPosBoxB.x - realPosBoxA.x ) * ( realPosBoxB.x - realPosBoxA.x )
                + ( realPosBoxB.y - realPosBoxA.y ) * ( realPosBoxB.y - realPosBoxA.y );
      if ( distance > extDistance )
        return false;
      // ok extern circles are triggering, now catch inside
      return true;
    }
    
    /****
     * fixedBoxWithOrientedBoxCollision@Bool( fixedBox@FixedBoxCollider, orientedBox@OrientedBoxCollider )
      TODO
     */
    this.fixedBoxWithOrientedBoxCollision = function( fixedBox, orientedBox )
    {
    }
    
    /****
     * orientedBoxWithCircleCollision@Bool( orientedBox@OrientedBoxCollider, circle@CircleCollider )
      TODO
     */
    this.orientedBoxWithCircleCollision = function( orientedBox, circle )
    {
    }
    
    /****
     * fixedBoxWithCircleCollision@Bool( fixedBox@FixedBoxCollider, Circle@CircleCollider )
      TODO
     */
    this.fixedBoxWithCircleCollision = function( fixedBox, circle )
    {
    }
    
    /****
     * checkCollisionWith@Bool( first@Collider, second@Collider )
      ordered by probability
      very badbad big if D:
     */
    this.checkCollisionWith = function( first, second )
    {
      if ( second.type == first.type )
      {
        switch ( first.type )
        {
          /* FIXED_BOX */
          case CONFIG.COLLISION_TYPE.FIXED_BOX:
            return this.fixedBoxCollision( first, second );
          
          /* CIRCLES */
          case CONFIG.COLLISION_TYPE.CIRCLES:
            return this.circleCollision( first, second );
          
          /* ORIENTED_BOX */
          case CONFIG.COLLISION_TYPE.ORIENTED_BOX:
            return this.orientedBoxCollision( first, second );
        }
        return null;
      }
      // point collision
      else if ( !first.type || !second.type )
      {
        var point = first;
        var collider = second;
        if (!second.type)
        {
          point    = second;
          collider = first;
        }
        switch( collider.type )
        {
          case CONFIG.COLLISION_TYPE.CIRCLE:
            return this.pointCircleCollision( point, collider );
          case CONFIG.COLLISION_TYPE.FIXED_BOX:
            return this.pointFixedBoxCollision( point, collider );
        }
        return null;
      }
      
      /* match other types */
      if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
        && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        return this.fixedBoxWithOrientedBoxCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        return this.fixedBoxWithOrientedBoxCollision ( second, first );
      }
      /* CIRCLE with ORIENTED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        return this.orientedBoxWithCircleCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
          && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        return this.orientedBoxWithCircleCollision ( second, first );
      }
      /* CIRCLE with FIXED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
          && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        return this.fixedBoxWithCircleCollision ( first, second );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
          && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        return this.fixedBoxWithCircleCollision ( second, first );
      }
      return null;
    }
  };
  
  CONFIG.debug.log( "CollisionSystem loaded", 3 );
  return CollisionSystem;
} );