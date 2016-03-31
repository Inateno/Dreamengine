/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @GameObject
* @update
* @time : currentTime
* @gameObjects : gameObjects in area
**/

define( [ 'DE.CollisionSystem', 'DE.CONFIG', 'DE.Time' ],
function(  CollisionSystem, CONFIG, Time )
{
  function update( time )
  {
    if ( this.disable ){ return; }
    // execute automatism here by switching on the type
    for ( var a in this.automatism )
    {
      var auto = this.automatism[ a ];
      if ( time - auto.lastCall < auto.interval / Time.scaleDelta ){ continue;}
      auto.lastCall = time;
      this[ auto.type ]( auto.value1, auto.value2 );
    }
    
    for ( var c = 0; child = this.childrens[ c ]; c++ )
    {
      child.update( time );
    }
    
    if ( !this.isMoved )
    {
      return;
    }
    
    // WRITE COLLISION HERE
    /* some colliders exists ? test collisions on */
    // for ( var nc = 0, col; nc < this.colliders.length; nc++ )
    // {
      // var notCollideAtAll = true;
      // col = this.colliders[ nc ];
      // col.collideWith = new Array();
      
      // /* on each gameObjects */
      // for ( var n = 0, t = gameObjects.length, o; n < t; n++ )
      // {
        // o = gameObjects[ n ];
        // if ( o == this || o == this.parent)
        // {
          // continue;
        // }
        
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
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "GameObject.update loaded" );
  }
  return update;
} );