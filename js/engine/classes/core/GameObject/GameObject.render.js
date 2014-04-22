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
  function render( ctx, physicRatio, ratioz, position, sizes )
  {
    if ( !this.enable )
      return;
    physicRatio = physicRatio || 1;
    ratioz      = ratioz || 1;
    position    = position || { x:0, y:0 };
    sizes       = sizes || { width:0, height:0 };
    
    if ( this.renderers.length == 0 && this.childrens.length == 0 && !CONFIG.DEBUG )
    {
      return;
    }
    
    // hum, not sure what I did here D: (I think I wrote this a night lol)
    if ( this.parent )
      ctx.translate( ( this.position.x - position.x ) * physicRatio * ratioz >> 0
                  , ( this.position.y - position.y ) * physicRatio * ratioz >> 0 );
    else
      ctx.translate( ( this.position.x - position.x ) * physicRatio >> 0
                  , ( this.position.y - position.y ) * physicRatio >> 0 );
    ctx.rotate( this.position.rotation );
    
    // calls renderers rendering
    for ( var i = 0, r; r = this.renderers[ i ]; i++ )
    {
      r.render( ctx, physicRatio, ratioz );
    }
    
    // AXIS debug
    if ( CONFIG.DEBUG_LEVEL > 1 )
    {
      ctx.fillStyle = COLORS.DEBUG.GAME_OBJECT;
      ctx.fillRect ( 0, 0, 1 ,1 );
      
      ctx.fillStyle = COLORS.DEBUG.X_AXIS;
      ctx.fillRect ( 0, 0, 20 ,2 );
      ctx.fillStyle = COLORS.DEBUG.Y_AXIS;
      ctx.fillRect ( 0, 0, 2 ,20 );
      
      if ( this.collider !== null )
        this.collider.debugRender( ctx, physicRatio, ratioz );
    }
    
    // childs rendering
    for ( var i = 0, child; child = this.childrens[ i ]; i++ )
    {
      child.render( ctx, physicRatio, ratioz );
    }
    ctx.rotate( -this.position.rotation );
    
    // again not sure why (ok I'll correct that fuck later :D )
    if ( this.parent )
      ctx.translate( -( this.position.x - position.x ) * physicRatio * ratioz >> 0
                  , -( this.position.y - position.y ) * physicRatio * ratioz >> 0 );
    else
      ctx.translate( -( this.position.x - position.x ) * physicRatio >> 0
                  , -( this.position.y - position.y ) * physicRatio >> 0 );
  };
  
  CONFIG.debug.log( "GameObject.render loaded", 3 );
  return render;
} );