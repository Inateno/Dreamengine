/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * currently this provide only triggering method for circle and fixedBox (also with points)
 * TODO:
 *  - provide collisions resolutions (giving an exit vector, working with multiple resolutions)
 *  - collision detection circle vs fixedBox
 *  - collision detection with orientedBox (have to finish this one)
 * @namespace CollisionSystem
 */
define( [ 'PIXI', 'DE.CONFIG' ],
function( PIXI, CONFIG )
{
  var CollisionSystem = new function()
  {
    this.DEName = "CollisionSystem";
    
    this._tempPoint = new PIXI.Point( 0, 0 );
    this._tempPoint2= new PIXI.Point( 0, 0 );
    
    // TRY A NEW WAY WITH PIXI - should work with all primitive -> circle / rectangle / rounded / shape
    this.pointColliderCollision = function( point, collider )
    {
      if ( !collider.enable || ( collider.gameObject && !collider.gameObject.enable ) )
        return false;
      
      this._tempPoint2.copy( point );
      if ( point.getGlobalPosition )
        point.getGlobalPosition( this._tempPoint2 );
      
      collider.gameObject.worldTransform.applyInverse( this._tempPoint2, this._tempPoint );
      return collider.contains( this._tempPoint.x, this._tempPoint.y );
    };
    
    /**
     * detect if the point is inside a box
     * @memberOf CollisionSystem
     * @protected
     * @param {Vector2} point
     * @param {FixedBoxCollider} box
     * @param {object} params optional parameters, can prevent3D (will use positions x, y as it come without z conversion)
     * @returns {Boolean} is colliding ?
     */
    this.pointFixedBoxCollision = function( point, collider, params )
    {
      if ( !collider.enable || ( collider.gameObject && !collider.gameObject.enable ) )
        return false;
      
      var rot = collider.gameObject.rotation;
      collider.gameObject.position.rotation = 0;
      collider.gameObject.updateTransform();
      var r = this.pointColliderCollision( point, collider );
      collider.gameObject.rotation = rot;
      collider.gameObject.updateTransform();
      return r;
    }
    
    /**
     * detect if a point is inside a box, useful for standalone collision (without context)
     */
    this.standardPointFixedBoxCollision = function( point, box )
    {
      if ( point.x < box.x
        || point.y < box.y
        || point.y > box.y + box.height
        || point.x > box.x + box.width
        || ( box.gameObject && !box.gameObject.enable )
        || !box.enable )
        return false;
      return true;
    };
    
    /**
     * detect if 2 box are colliding
     * @memberOf CollisionSystem
     * @protected
     * @param {FixedBoxCollider} boxA
     * @param {FixedBoxCollider} boxB
     * @param {object} params optional parameters, can prevent3D (will use positions x, y as it come without z conversion)
     * @returns {Boolean} is colliding ?
     */
    this.fixedBoxCollision = function( boxA, boxB, params )
    {
      if ( !boxA.enable || !boxB.enable
        || ( boxA.gameObject && !boxA.gameObject.enable )
        || ( boxB.gameObject && !boxB.gameObject.enable ) )
        return false;
      
      var boxAPoints = boxA.getWorldTransform();
      var boxBPoints = boxB.getWorldTransform();
      
      if ( boxAPoints.z != boxBPoints.z && ( !params || !params.prevent3D ) )
        return false;
      
      if ( ( boxBPoints.x >= boxAPoints.x + boxAPoints.width )
        || ( boxBPoints.x + boxBPoints.width <= boxAPoints.x )
        || ( boxBPoints.y >= boxAPoints.y + boxAPoints.height )
        || ( boxBPoints.y + boxBPoints.height <= boxAPoints.y ) )  
        return false; 
      else
        return true; 
    }
    
    /**
     * detect if a point is inside a circle
     * @memberOf CollisionSystem
     * @protected
     * @param {Vector2} point
     * @param {CircleCollider} C
     * @param {object} params optional parameters, can prevent3D (will use positions x, y as it come without z conversion)
     * @returns {Boolean} is colliding ?
     */
    // this.pointCircleCollision = this.pointColliderCollision; // not working mmh ?
    this.pointCircleCollision = function( p, c, params )
    {
      if ( !c.enable  || ( c.gameObject && !c.gameObject.enable ) )
        return false;
      var cpos = c.getWorldTransform();
      
      if ( p.z && cpos.z != p.z && ( !params || !params.prevent3D ) )
        return false;
      
      var allowedDistance = cpos.radius * cpos.radius;
      
      var realDistance = ( ( p.x - cpos.x ) * ( p.x - cpos.x ) )
                       + ( ( p.y - cpos.y ) * ( p.y - cpos.y ) );
      
      return ( realDistance < allowedDistance ) ? true : false;
    };
    /*function( point, C, params )
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
    }*/
    
    /**
     * detect if a two circles collide
     * @memberOf CollisionSystem
     * @protected
     * @param {CircleCollider} circleA
     * @param {CircleCollider} circleB
     * @param {object} params optional parameters, can prevent3D (will use positions x, y as it come without z conversion)
     * @returns {Boolean} is colliding ?
     */
    this.circleCollision = function( circleA, circleB, params )
    {
      if ( !circleA.enable || !circleB.enable
        || ( circleA.gameObject && !circleA.gameObject.enable )
        || ( circleB.gameObject && !circleB.gameObject.enable ) )
        return false;
      var realPosA = circleA.getWorldTransform()
        , realPosB = circleB.getWorldTransform();
      
      if ( realPosA.z != realPosB.z && ( !params || !params.prevent3D ) )
        return false;
      
      var allowedDistance = ( realPosB.radius + realPosA.radius ) * ( realPosB.radius + realPosA.radius );
      
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
      if ( !boxA.enable || !boxB.enable 
         || ( boxA.gameObject && !boxA.gameObject.enable )
         || ( boxB.gameObject && !boxB.gameObject.enable ) )
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