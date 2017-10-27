function SpriteRenderer( params )
{
  var _params = params;
  if ( !_params.spriteName && !_params.spriteUrl ) {
    console.error( "A SpriteRenderer need a spriteName or a spriteUrl argument" );
    return;
  }
  
  PIXI.Sprite.call( this, PIXI.loader.resources[ _params.spriteName || _params.spriteUrl ].texture );
}

SpriteRenderer.prototype = Object.create( PIXI.Sprite.prototype );
SpriteRenderer.prototype.constructor = SpriteRenderer;