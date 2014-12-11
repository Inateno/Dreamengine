/**
* @ContributorsList
* @Shocoben
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui @Label
to create a simple text in the GUI
**/
define( [ 'DE.CONFIG', 'DE.BaseGui', 'DE.TextRenderer' ],
function( CONFIG, BaseGui, TextRenderer )
{
  function Label( param, text )
  {
    this.DEName = "GuiLabel";
    
    if ( !param )
      return;
    
    BaseGui.call( this, param );
    
    this.text = text;
    if ( !param.fillColor && !param.strokeColor )
      param.fillColor = "white";
    param.x = this.sizes.width * 0.5;
    param.y = this.sizes.height * 0.5;
    this.renderer = new TextRenderer( param, this.sizes.width, this.sizes.height, text );
    
    /***
    * @public @override @render
    * @param @canvasContext2D ctx
    - renderise
    */
    this.render = function( ctx )
    {
      ctx.translate( this.position.x, this.position.y );
      this.renderer.render( ctx, 1 );
      ctx.fillRect( 0, 0, 50, 10 );
      ctx.translate( -this.position.x, -this.position.y );
    }
    
    this.setText = function( text )
    {
      this.renderer.text = text;
      this.renderer.clearBuffer();
      if ( this.gui )
        this.gui.needUpdate = true;
      if ( this.onSetText )
        this.onSetText( text );
    }
    
    this.onSetText = false;
  }
  
  Label.prototype = new BaseGui();
  Label.prototype.constructor = BaseGui;
  Label.prototype.supr = BaseGui.prototype;
  
  return Label;
});