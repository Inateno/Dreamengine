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
  function BaseGui( params )
  {
    if ( !params )
      throw new Error( "BaseGui :: You have to pass arguments object to instantiate -- see the doc" );
    if ( params.ignore )
      return;
    
    this.gui       = null;
    this.id        = params.id || params.name || Date.now() + Math.random() * Date.now() >> 0;
    this.name      = params.name || null;
    this.enable    = params.enable === false ? false : true;
    this.isDisable = false;
    
    params.scaleX = params.scale || params.scaleX || params.scalex || 1;
    params.scaleY = params.scale || params.scaleY || params.scaley || 1;
    
    this.position = new Vector2( params.x || params.posX || params.posx || params.X || 0, params.y || params.posY || params.posy || params.Y || 0 );
    this.sizes = new Sizes( params.width || params.w || CONFIG.DEFAULT_SIZES.GUI.WIDTH
                      , params.height || params.h || CONFIG.DEFAULT_SIZES.GUI.HEIGHT
                      , params.scaleX, params.scaleY );
    
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
    @params @canvasContext2D ctx
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
    @params @canvasContext2D ctx
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
    * @params @canvasContext2D ctx
    * @override
    */
    this.render = function( ctx, physicRatio, render ){}
    
    /***
    * @checkState
    * @paramss
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
      if ( this.enable )
        this.gui.needUpdate = true;
      this.enable = false;
    }
    
    /***
    * @show - show current gui component
    */
    this.show = function()
    {
      if ( !this.enable )
        this.gui.needUpdate = true;
      this.enable = true;
    }
    
    /***
    * @toggle - toggle current gui component
    */
    this.toggle = function()
    {
      this.enable = Game.camera.gui.components[ 'Click me plz' ].enable^1;
      this.gui.needUpdate = true;
    }
  }
  
  BaseGui.prototype.DEName = "BaseGui";
  
  return BaseGui;
} );