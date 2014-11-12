/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* standalone render method for GameObject.prototype.render
**/
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.Time' ],
function( CONFIG, COLORS, Time )
{
  function render( ctx, physicRatio, camPosition, camSizes, ratiozParent )
  {
    if ( !this.enable )
      return;
    // distance from 10 between object and camera is ratio 1
    var ratioz = ratiozParent || ( 10 / ( this.position.z - camPosition.z ) ), px = 0, py = 0;
    
    if ( this.renderers.length == 0 && this.childrens.length == 0 && !CONFIG.DEBUG )
      return;
    
    if ( this.parent )
      ctx.translate( this.position.x * physicRatio * ratioz >> 0
                  , this.position.y * physicRatio * ratioz >> 0 );
    else
    {
      px = ( this.position.x - ( camPosition.x + camSizes.width * 0.5 ) ) * ratioz;
      py = ( this.position.y - ( camPosition.y + camSizes.height * 0.5 ) ) * ratioz;
      ctx.translate( ( px + camSizes.width * 0.5 ) * physicRatio >> 0, ( py + camSizes.height * 0.5 ) * physicRatio >> 0 );
    }
    ctx.rotate( this.position.rotation );
    
    // calls renderers rendering
    for ( var i = 0, r; r = this.renderers[ i ]; ++i )
    {
      if ( r.sleep )
        continue;
      r.render( ctx, physicRatio, ratioz );
      r.applyFade();
    }
    
    // AXIS debug
    if ( CONFIG.DEBUG_LEVEL > 1 )
    {
      ctx.fillStyle = COLORS.DEBUG.GAME_OBJECT;
      ctx.fillRect ( 0, 0, 1 ,1 );
      
      ctx.fillStyle = COLORS.DEBUG.X_AXIS;
      ctx.fillRect ( 0, 0, 20 * physicRatio, 2 );
      ctx.fillStyle = COLORS.DEBUG.Y_AXIS;
      ctx.fillRect ( 0, 0, 2, 20 * physicRatio );
      
      if ( this.collider !== null )
        this.collider.debugRender( ctx, physicRatio, ratioz );
    }
    
    var child;
    // childs rendering
    for ( i = 0; child = this.childrens[ i ]; ++i )
      child.render( ctx, physicRatio, camPosition, camSizes, ratioz );
    
    ctx.rotate( -this.position.rotation );
    
    if ( this.parent )
      ctx.translate( -this.position.x * physicRatio * ratioz >> 0
                  , -this.position.y * physicRatio * ratioz >> 0 );
    else
      ctx.translate( -( px + camSizes.width * 0.5 ) * physicRatio >> 0, -( py + camSizes.height * 0.5 ) * physicRatio >> 0 );
  };
  
  CONFIG.debug.log( "GameObject.render loaded", 3 );
  return render;
} );