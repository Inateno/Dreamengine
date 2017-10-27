function GameObject( params )
{
  var _params = params || {};
  
  PIXI.Container.call( this );
  
  this.position.set( _params.x || 0, _params.y || 0 );
  this.renderers = _params.renderers || [];
  
  if ( _params.renderer ) {
    this.renderers.unshift( _params.renderer );
  }
  
  if ( this.renderers ) {
    for ( var i = 0; i < this.renderers.length; ++i )
    {
      this.addRenderer( this.renderers[ i ] );
    }
  }
  
  if ( DEBUG && DEBUG_LEVEL >= 5 ) {
    this._createDebugRenderer();
  }
}

GameObject.prototype = Object.create( PIXI.Container.prototype );
GameObject.prototype.constructor = GameObject;

GameObject.prototype._createDebugRenderer = function()
{
  if ( this._debugRenderer ) {
    console.error( "GameObject._createDebugRenderer was called but _debugRenderer already exist" );
    return;
  }
  
  this._debugRenderer = new RectRenderer(
    [
      { beginFill: "0x00FF00" }
      , { drawRect: [ 0, 0, 20, 2 ] }
      , { beginFill: "0xFF0000" }
      , { drawRect: [ 0, 0, 2, 20 ] }
    ]
  );
  this.addChild( this._debugRenderer );
}

GameObject.prototype._destroyDebugRenderer = function()
{
  if ( !this._debugRenderer ) {
    console.error( "GameObject._destroyDebugRenderer was called without _debugRenderer instantiated" );
    return;
  }
  
  this.removeChild( this._debugRenderer );
  this._debugRenderer.destroy( { children: true, texture: true, baseTexture: true } );
  this._debugRenderer = null;
}

GameObject.prototype.moveTo = function()
{
  
}
GameObject.prototype.applyMoveTo = function()
{
  
}
GameObject.prototype.addAutomatism = function()
{
  
}
GameObject.prototype.update = function()
{
  
}
GameObject.prototype.add = function( object )
{
  this.addChild( object );
  // TODO this.sortChildren
}
GameObject.prototype.addRenderer = function( rd )
{
  if ( rd.anchor ) {
    rd.anchor.set( 0.5, 0.5 );
  }
  
  this.addChild( rd );
}