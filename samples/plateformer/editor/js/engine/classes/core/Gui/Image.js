/**
* @ContributorsList
* @Shocoben
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui @Image
**/
define( [ 'DE.CONFIG', 'DE.BaseGui', 'DE.TileRenderer', 'DE.SpriteRenderer' ],
function( CONFIG, BaseGui, TileRenderer, SpriteRenderer )
{
  function Image( param, isNotTile )
  {
    this.DEName = "GuiImage";
    if ( !param )
      return;
    
    BaseGui.call( this, param );
    
    if ( param.spriteName )
      this.renderer = new SpriteRenderer( param );
    else if ( param.imageName )
      this.renderer = new TileRenderer( param );
    else
      throw new Error( "[GUI IMAGE] Declaring a Gui image but can't find spriteName or imageName" );
    
    this.renderer.localPosition.x = 0;
    this.renderer.localPosition.y = 0;
    
    /***
    * @public @override @render
    * @param @canvasContext2D ctx
    - renderise
    */
    this.render = function( ctx )
    {
      ctx.translate( this.position.x, this.position.y );
      this.renderer.render( ctx, 1 );
      ctx.translate( -this.position.x, -this.position.y );
    }
  }
  
  Image.prototype = new BaseGui();
  Image.prototype.constructor = BaseGui;
  Image.prototype.supr = BaseGui.prototype;
  
  return Image;
} );