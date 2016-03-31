/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @author Inateno / http://inateno.com / http://dreamirl.com
* @constructor
* GameObject.render
**/

define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.Time' ],
function( CONFIG, COLORS, Time )
{
  function render( ctx, ratioz, position, sizes )
  {
    if ( this.disable ){ return; }
    ratioz = ratioz || 1;
    position = position || { x:0, y:0 };
    sizes = sizes || { width:0, height:0 };
    
    if ( this.renderers.length == 0 && this.childrens.length == 0 && !CONFIG.DEBUG )
    {
      return;
    }
    
    ctx.translate( this.position.x - position.x, this.position.y - position.y );
    ctx.rotate( this.position.rotation );
    
    for ( var i = 0, r; r = this.renderers[ i ]; i++ )
    {
      r.render( ctx, ratioz, position, sizes );
    }
    
    
    if ( CONFIG.DEBUG_LEVEL > 1 )
    {
      ctx.fillStyle = COLORS.DEBUG.GAME_OBJECT;
      ctx.fillRect ( 0, 0, 1 ,1 );
      
      ctx.fillStyle = COLORS.DEBUG.X_AXIS;
      ctx.fillRect ( 0, 0, 20 ,2 );
      ctx.fillStyle = COLORS.DEBUG.Y_AXIS;
      ctx.fillRect ( 0, -20, 2 ,20 );
      
      if ( this.collider !== null )
        this.collider.debugRender( ctx );
    }
    
    for ( var i = 0, child; child = this.childrens[ i ]; i++ )
    {
      child.render( ctx );
    }
    ctx.rotate( -this.position.rotation );
    ctx.translate( -( this.position.x - position.x ), -( this.position.y - position.y ) );
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "GameObject.render loaded" );
  }
  return render;
} );