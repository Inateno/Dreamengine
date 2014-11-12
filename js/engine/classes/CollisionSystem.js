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
    this.pointFixedBoxCollision = function( point, box, params )
    {
      if ( !box.enable )
        return false;
      var boxpoints = ( box.getRealPosition ) ? box.getRealPosition() : { x: box.x, y: box.y, z: 0 };
      var ratioz = 1;
      
      // when mouse click in the camera field, we have to convert the 3D position from the object to 2D
      if ( point.scenePosition !== undefined && ( !params || !params.prevent3D ) && point.scenePosition.z != boxpoints.z )
      {
        // convert 3D pos to 2D, z on point should be a z from a camera
        ratioz = ( 10 / ( boxpoints.z - point.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          boxpoints.x = ( boxpoints.x - ( point.scenePosition.x + point.fieldSizes.width * 0.5 ) ) * ratioz + ( point.scenePosition.x + point.fieldSizes.width * 0.5 );
          boxpoints.y = ( boxpoints.y - ( point.scenePosition.y + point.fieldSizes.height * 0.5 ) ) * ratioz + ( point.scenePosition.y + point.fieldSizes.height * 0.5 );
        }
      }
      
      if ( point.x >= boxpoints.x
        && point.x < boxpoints.x + box.width * ratioz
        && point.y >= boxpoints.y
        && point.y < boxpoints.y + box.height * ratioz )
        return true;
      else
        return false;
    }
    
    /****
     * fixedBoxCollision@Bool( box1@FixedBoxCollider, boxB@FixedBoxCollider )
      FixedBox Collision triggering
     */
    this.fixedBoxCollision = function( boxA, boxB, params )
    {
      if ( !boxA.enable || !boxB.enable )
        return false;
      
      var boxAPoints = ( boxA.getRealPosition ) ? boxA.getRealPosition() : { x: boxA.x, y: boxA.y };
      var boxBPoints = ( boxB.getRealPosition ) ? boxB.getRealPosition() : { x: boxB.x, y: boxB.y };
      
      // can convert 3D position to 2D position to test a collision with what player see
      if ( params && params.convert3D && boxAPoints.z != boxBPoints.z )
      {
        if ( !params.camera )
        {
          console.log( "Error: you have to pass a camera to convert 3D position to 2D position - fixedBoxCollision" );
          return false;
        }
        var ratioz = ( 10 / ( boxAPoints.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          boxAPoints.x = ( boxAPoints.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          boxAPoints.y = ( boxAPoints.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
        ratioz = ( 10 / ( boxBPoints.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          boxBPoints.x = ( boxBPoints.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          boxBPoints.y = ( boxBPoints.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
      }
      // if !prevent3D and if z is different, ignore collision
      else if ( ( !params || !params.prevent3D ) && boxAPoints.z >> 0 != boxBPoints.z >> 0 )
        return false;
      
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
    this.pointCircleCollision = function( point, C, params )
    {
      if ( !C.enable )
        return false;
      var Cpoints = C.getRealPosition();
      var ratioz = 1;
      
      // when mouse click in the camera field, we have to convert the 3D position from the object to 2D
      if ( point.scenePosition !== undefined && ( !params || !params.prevent3D ) && point.scenePosition.z != Cpoints.z )
      {
        // convert 3D pos to 2D, z on point should be a z from a camera
        ratioz = ( 10 / ( Cpoints.z - point.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          Cpoints.x = ( Cpoints.x - ( point.scenePosition.x + point.fieldSizes.width * 0.5 ) ) * ratioz + ( point.scenePosition.x + point.fieldSizes.width * 0.5 );
          Cpoints.y = ( Cpoints.y - ( point.scenePosition.y + point.fieldSizes.height * 0.5 ) ) * ratioz + ( point.scenePosition.y + point.fieldSizes.height * 0.5 );
        }
      }
      
      var d2 = ( point.x - Cpoints.x ) * ( point.x - Cpoints.x )
             + ( point.y - Cpoints.y ) * ( point.y - Cpoints.y );
      if ( d2 > ( C.radius * ratioz ) * ( C.radius * ratioz ) )
        return false;
      return true;
    }

    /****
     * circleCollision@Bool( circleA@CircleCollider, circleB@CircleCollider )
      return colliders triggering
     */
    this.circleCollision = function( circleA, circleB, params )
    {
      if ( !circleA.enable || !circleB.enable )
        return false;
      var realPosA = circleA.getRealPosition()
        , realPosB = circleB.getRealPosition();
      
      // can convert 3D position to 2D position to test a collision with what player see
      if ( params && params.convert3D && realPosA.z != realPosB.z )
      {
        if ( !params.camera )
        {
          console.log( "Error: you have to pass a camera to convert 3D position to 2D position - fixedBoxCollision" );
          return false;
        }
        var ratioz = ( 10 / ( realPosA.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          realPosA.x = ( realPosA.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          realPosA.y = ( realPosA.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
        ratioz = ( 10 / ( realPosB.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          realPosB.x = ( realPosB.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          realPosB.y = ( realPosB.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
      }
      // if !prevent3D and if z is different, ignore collision
      else if ( ( !params || !params.prevent3D ) && realPosA.z >> 0 != realPosB.z >> 0 )
        return false;
      
      var allowedDistance = ( circleB.radius + circleA.radius ) * ( circleB.radius + circleA.radius );
      
      
      var realDistance = ( ( realPosB.x - realPosA.x ) * ( realPosB.x - realPosA.x ) )
                       + ( ( realPosB.y - realPosA.y ) * ( realPosB.y - realPosA.y ) );
      
      return ( realDistance < allowedDistance ) ? true : false;
    }
    
    /****
     * orientedBoxCollision@Bool( boxA@OrientedBoxCollider, boxB@OrientedBoxCollider )
      TODO
     */
    this.orientedBoxCollision = function( boxA, boxB, params )
    {
      if ( !boxA.enable || !boxB.enable )
        return false;
      var realPosBoxA  = boxA.getRealPosition()
        , realPosBoxB  = boxB.getRealPosition();
      
      // can convert 3D position to 2D position to test a collision with what player see
      if ( params && params.convert3D && realPosBoxA.z != realPosBoxB.z )
      {
        if ( !params.camera )
        {
          console.log( "Error: you have to pass a camera to convert 3D position to 2D position - fixedBoxCollision" );
          return false;
        }
        var ratioz = ( 10 / ( realPosBoxA.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          realPosBoxA.x = ( realPosBoxA.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          realPosBoxA.y = ( realPosBoxA.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
        ratioz = ( 10 / ( realPosBoxB.z - params.camera.scenePosition.z ) );
        if ( ratioz != 1 )
        {
          realPosBoxB.x = ( realPosBoxB.x - ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 ) ) * ratioz + ( params.camera.scenePosition.x + params.camera.fieldSizes.width * 0.5 );
          realPosBoxB.y = ( realPosBoxB.y - ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 ) ) * ratioz + ( params.camera.scenePosition.y + params.camera.fieldSizes.height * 0.5 );
        }
      }
      // if !prevent3D and if z is different, ignore collision
      else if ( ( !params || !params.prevent3D ) && realPosBoxA.z >> 0 != realPosBoxB.z >> 0 )
        return false;
      
      var aExtCircle = boxA.getExternCircle()
        , bExtCircle = boxB.getExternCircle();
      
      // try collision with outside circle
      var extDistance = ( aExtCircle.radius + bExtCircle.radius );
        extDistance *= extDistance;
      
      
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
    this.checkCollisionWith = function( first, second, params )
    {
      if ( second.type == first.type )
      {
        switch ( first.type )
        {
          /* FIXED_BOX */
          case CONFIG.COLLISION_TYPE.FIXED_BOX:
            return this.fixedBoxCollision( first, second, params );
          
          /* CIRCLES */
          case CONFIG.COLLISION_TYPE.CIRCLES:
            return this.circleCollision( first, second, params );
          
          /* ORIENTED_BOX */
          case CONFIG.COLLISION_TYPE.ORIENTED_BOX:
            return this.orientedBoxCollision( first, second, params );
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
            return this.pointCircleCollision( point, collider, params );
          case CONFIG.COLLISION_TYPE.FIXED_BOX:
            return this.pointFixedBoxCollision( point, collider, params );
        }
        return null;
      }
      
      /* match other types */
      if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
        && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        return this.fixedBoxWithOrientedBoxCollision ( first, second, params );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        return this.fixedBoxWithOrientedBoxCollision ( second, first, params );
      }
      /* CIRCLE with ORIENTED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
        && first.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX )
      {
        return this.orientedBoxWithCircleCollision ( first, second, params );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.ORIENTED_BOX
          && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        return this.orientedBoxWithCircleCollision ( second, first, params );
      }
      /* CIRCLE with FIXED_BOX */
      else if ( second.type == CONFIG.COLLISION_TYPE.CIRCLE
          && first.type == CONFIG.COLLISION_TYPE.FIXED_BOX )
      {
        return this.fixedBoxWithCircleCollision ( first, second, params );
      }
      else if ( second.type == CONFIG.COLLISION_TYPE.FIXED_BOX
          && first.type == CONFIG.COLLISION_TYPE.CIRCLE )
      {
        return this.fixedBoxWithCircleCollision ( second, first, params );
      }
      return null;
    }
  };
  
  CONFIG.debug.log( "CollisionSystem loaded", 3 );
  return CollisionSystem;
} );