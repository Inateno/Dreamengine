define( [ 'DE.CollisionSystem' ],
function( CollisionSystem )
{
  /****
   * _gameObjectMouseEvent@bool( eventType@string, g@GameObject, mouse@MouseVector2 )
   */
  function _gameObjectMouseEvent( eventType, g, mouse, propagationEvent )
  {
    if ( !g.enable )
      return false;
    
    var wasOver = g.indexMouseOver[ mouse.index ];
    if ( g.collider && ( g[ "onMouse" + eventType ] || g.onMouseLeave || g.onMouseEnter ) )
    {
      if ( CollisionSystem.checkCollisionWith( mouse, g.collider ) )
      {
        // mouseEnter event occurs here
        g.indexMouseOver[ mouse.index ] = true;
        if ( g.cursorOnOver )
          propagationEvent.cursor = "pointer";
        if ( !wasOver && g.onMouseEnter && g.onMouseEnter( mouse, propagationEvent ) )
          return true;
        if ( g[ "onMouse" + eventType ] && g[ "onMouse" + eventType ]( mouse, propagationEvent ) )
          return true;
      }
      // no collision but was over last frame, there is a leave event
      else if ( wasOver )
      {
        if ( g.cursorOnOver )
          propagationEvent.cursor = "default";
        g.indexMouseOver[ mouse.index ] = false;
        if ( g.onMouseLeave && g.onMouseLeave( mouse, propagationEvent ) )
          return true;
      }
    }
    else if ( g.collider && g.cursorOnOver )
    {
      if ( CollisionSystem.checkCollisionWith( mouse, g.collider ) )
      {
        g.indexMouseOver[ mouse.index ] = true;
        propagationEvent.cursor = "pointer";
      }
      else if ( wasOver )
      {
        g.indexMouseOver[ mouse.index ] = false;
        propagationEvent.cursor = "default";
      }
    }
    
    for ( var c = g.gameObjects.length - 1, co; c >= 0; --c )
    {
      if ( _gameObjectMouseEvent( eventType, g.gameObjects[ c ], mouse, propagationEvent ) )
        return true;
    }
  }
  
  return _gameObjectMouseEvent;
} );