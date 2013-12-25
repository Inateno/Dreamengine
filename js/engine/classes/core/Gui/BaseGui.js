/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui @BaseGui
herits this class to create a GUI components, look at GuiButton / GuiImage or GuiLabel for example
**/
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.Vector2', 'DE.Sizes' ],
function( CONFIG, COLORS, Vector2, Sizes )
{
  function BaseGui( param )
  {
    if ( !param )
      throw new Error( "BaseGui :: You have to pass arguments object to instantiate -- see the doc" );
    if ( param.ignore )
      return;
    
    this.gui       = null;
    this.id        = param.id || param.name || Date.now() + Math.random() * Date.now() >> 0;
    this.name      = param.name || null;
    this.disable   = param.disable || false;
    this.isDisable = false;
    
    param.scaleX = param.scale || param.scaleX || param.scalex || 1;
    param.scaleY = param.scale || param.scaleY || param.scaley || 1;
    
    this.position = new Vector2( param.x || param.posX || param.posx || param.X || 0, param.y || param.posY || param.posy || param.Y || 0 );
    this.sizes = new Sizes( param.width || param.w || CONFIG.DEFAULT_SIZES.GUI.WIDTH
                      , param.height || param.h || CONFIG.DEFAULT_SIZES.GUI.HEIGHT
                      , param.scaleX, param.scaleY );
    
    // events states
    this.isOver     = false;
    this.isClicked  = false;
    
    /***
    * @EVENTCALL @onMouseUp
    - fired by Gui if mouse was up or click over him
    - need to be overrited to run
    */
    this.onMouseUp = function(){};
    this.onMouseMove = function(){};
    this.onMouseDown = function(){};
    
    /***
    * @public @oRender
    @param @canvasContext2D ctx
    * don't override it !
    Clear the ctx with sizes, where this Gui is
    then call @render
    */
    this.oRender = function( ctx )
    {
      this.isDisable = false;
      ctx.clearRect( this.position.x
                    , this.position.y
                    , this.sizes.width * this.sizes.scaleX
                    , this.sizes.height * this.sizes.scaleY );
      this.render( ctx );
      
      if ( CONFIG.DEBUG )
      {
        ctx.fillStyle = COLORS.DEBUG.X_AXIS;
        ctx.fillRect( this.position.x, this.position.y, 20, 2 );
        ctx.fillStyle = COLORS.DEBUG.Y_AXIS;
        ctx.fillRect( this.position.x, this.position.y, 2, 20 );
        
        ctx.strokeStyle = COLORS.DEBUG.GUI;
        ctx.strokeRect( this.position.x + 1
                       , this.position.y + 1
                       , this.sizes.width * this.sizes.scaleX - 2
                       , this.sizes.height * this.sizes.scaleY - 2 );
      }
    }
    
    /***
    * @public @clearMe
    @param @canvasContext2D ctx
    Clear the ctx with sizes, where this Gui is
    */
    this.clearMe = function( ctx )
    {
      this.isDisable = true;
      ctx.clearRect( this.position.x
                    , this.position.y
                    , this.sizes.width * this.sizes.scaleX
                    , this.sizes.height * this.sizes.scaleY );
    }
    
    /***
    * @public @render
    * @param @canvasContext2D ctx
    * @override
    */
    this.render = function( ctx, physicRatio, render ){}
    
    /***
    * @checkState
    * @params
    - verify the visual state of button
    */
    this.checkState = function( pos, click )
    {
      if ( pos.x >= this.position.x && pos.x <= this.position.x + this.sizes.width
        && pos.y >= this.position.y && pos.y <= this.position.y + this.sizes.height )
      {
        this.isOver = true;
        this.gui.needUpdate = true;
        return true;
      }
      else if ( this.isOver )
      {
        this.isOver = false;
        this.gui.needUpdate = true;
      }
      
      this.isClicked = 0;
      return false;
    }
    
    /***
    * @hide - hide current gui component
    */
    this.hide = function()
    {
      if ( !this.disable )
        this.gui.needUpdate = true;
      this.disable = true;
    }
    
    /***
    * @show - show current gui component
    */
    this.show = function()
    {
      if ( this.disable )
        this.gui.needUpdate = true;
      this.disable = false;
    }
    
    /***
    * @toggle - toggle current gui component
    */
    this.toggle = function()
    {
      this.disable = Game.camera.gui.components[ 'Click me plz' ].disable^1;
      this.gui.needUpdate = true;
    }
  }
  
  BaseGui.prototype.DEName = "BaseGui";
  
  return BaseGui;
} );