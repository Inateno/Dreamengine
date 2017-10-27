function Scene()
{
  PIXI.Container.call( this );
}

Scene.prototype = Object.create( PIXI.Container.prototype );
Scene.prototype.constructor = Scene;

Scene.prototype.add = function()
{
  var args = Array.prototype.slice.call( arguments );
  for ( var i = 0; i < args.length; ++i )
  {
    if ( args[ i ].length ) {
      this.add( args[ i ] );
    }
    else {
      this.addOne( args[ i ] );
    }
  }
}
Scene.prototype.addOne = function( gameObject )
{
  if ( !( gameObject instanceof GameObject ) )
  {
    console.error( "Tried to add something in a scene that is not a GameObject. Please inherit from GameObject" );
    return;
  }
  
  // TODO tags, name, pools
  
  // add in PIXI Container
  this.addChild( gameObject );
  
  // TODO event trigger "updateChildren"
}