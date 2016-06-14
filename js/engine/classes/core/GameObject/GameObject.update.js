/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* standalone update method for GameObject.prototype.update
**/

define( [ 'DE.CollisionSystem', 'DE.CONFIG', 'DE.Time' ],
function(  CollisionSystem, CONFIG, Time )
{
  function update( time )
  {
    if ( !this.enable )
      return;
    // execute registered automatisms
    for ( var a in this.automatism )
    {
      var auto = this.automatism[ a ];
      if ( auto.interval && time - auto.lastCall < auto.interval / Time.scaleDelta ){ continue;}
      auto.lastCall = time;
      // only 2 vals max, I could make a this[ auto.methodName ].apply( this, args ) but it's slower
      // I think
      this[ auto.methodName ]( auto.value1, auto.value2 );
      
      // if this one isn't persistent delete it
      if ( !auto.persistent )
        delete this.automatism[ a ];
    }
    
    // childs update
    for ( var c = 0; child = this.gameObjects[ c ]; c++ )
    {
      if ( child.flag !== null )
      {
        switch( child.flag )
        {
          case "delete":
            this.delete( c );
            --c;
            continue;
            break;
        }
      }
      child.update( time );
    }
    
    this.applyFocus();
    this.applyShake();
    this.applyMove();
    
    // used for collision trigger
    if ( !this.isMoved || !this.collider )
    {
      return;
    }
    
    // Working on a simple collision system, not finished :( this is the whorst part I think :D
    
    
    // WRITE COLLISION HERE
    /* remove colliders array, just one ? some colliders exists ? test collisions on */
    // for ( var nc = 0, col; nc < this.colliders.length; nc++ )
    // {
      // var notCollideAtAll = true;
      // col = this.colliders[ nc ];
      // col.collideWith = new Array();
      
      // /* on each gameObjects ? make an octree should be great */
      // for ( var n = 0, t = gameObjects.length, o; n < t; n++ )
      // {
        // o = gameObjects[ n ];
        // if ( o == this || o == this.parent)
        // {
          // continue;
        // }
        
        // I think we should'nt use physic on childs because it will be very tricky
        // and the goal of this little physic engine is to privde something *simple*
        // but we should let "triggering" methods "on"
        // (add an arg that allow or deny parent triggering with childs ?)
        
        // if ( this.parent != undefined )
        // {
          // var parent = this.parent, nextObject = false;
          // while ( parent.parent != undefined && !nextObject )
          // {
            // if ( o == parent.parent )
            // {
              // nextObject = true;
            // }
            // parent = parent.parent;
          // }
          // if ( nextObject )
          // {
            // continue;
          // }
        // }
        
        // /* for each other gameObject colliders */
        // for ( var i = 0, otcol; i < o.colliders.length; i++ )
        // {
          // otcol = o.colliders[ i ];
          // collide = CollisionSystem.checkCollisionWith( col, otcol );
          
          // if ( collide )
          // {
            // col.isColliding = collide;
            // otcol.isColliding = collide;
            
            // col.collideWith.push( otcol );
            // otcol.collideWith.push( col );
            
            // notCollideAtAll = false;
          // }
        // }
      // }
      // if ( notCollideAtAll )
      // {
        // col.isColliding = false;
      // }
    // }
  };
  
  CONFIG.debug.log( "GameObject.update loaded", 3 );
  return update;
} );