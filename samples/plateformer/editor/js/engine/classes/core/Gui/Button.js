/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui @Button
**/
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.BaseGui', 'DE.Vector2', 'DE.TextRenderer', 'DE.SpriteRenderer' ],
function( CONFIG, COLORS, BaseGui, Vector2, TextRenderer, SpriteRenderer )
{
  function Button ( param )
  {
    this.DEName = "GuiButton";
    if ( !param )
      return;
    
    BaseGui.call( this, param );
    
    if ( this.sizes.width == CONFIG.DEFAULT_SIZES.GUI.WIDTH )
      this.sizes.width = CONFIG.DEFAULT_SIZES.BUTTON.WIDTH;
    if ( this.sizes.height == CONFIG.DEFAULT_SIZES.GUI.HEIGHT )
      this.sizes.height = CONFIG.DEFAULT_SIZES.BUTTON.HEIGHT;
    
    this.noChangeOnRelease = param.noChangeOnRelease || false;
    this.buffer = null;
    
    this.padding = new Vector2( param.padding || param.paddingX || 5, param.padding || param.paddingY || 5 );
    
    // need replace by a textRenderer
    this.text          = param.text || undefined;
    this.fontSize      = param.fontSize || CONFIG.DEFAULT_SIZES.BUTTON.FONT_SIZE;
    this.textOffsets    = new Vector2( param.width * 0.5 || CONFIG.DEFAULT_SIZES.BUTTON.WIDTH * 0.5,
                      param.height * 0.5 + CONFIG.DEFAULT_SIZES.BUTTON.OFFSET_TOP
                        || CONFIG.DEFAULT_SIZES.BUTTON.HEIGHT * 0.5 + CONFIG.DEFAULT_SIZES.BUTTON.OFFSET_TOP );
    // states
    this.currentState = 0;
    this.maxState = 3;
    
    /***
    * @declare and @create @renderer
    ***/
    this.init = function( param )
    {
      this.buffer = document.createElement( "canvas" );
      this.buffer.width = this.sizes.width * this.maxState;
      this.buffer.height= this.sizes.height;
      this.buffer.context = this.buffer.getContext("2d");
      this.buffer.context.clearRect( 0, 0, this.buffer.width, this.buffer.height );
      var  renderer;
      // generate Button Renderer
      if ( param.spriteName )
      {
        renderer = new SpriteRenderer( { "spriteName": param.spriteName
                            , "width": this.sizes.width, "height":this.sizes.height } );
        renderer.localPosition.x += this.sizes.width*0.5;
        renderer.localPosition.y += this.sizes.height*0.5;
        var nFrame = ( renderer.endFrame > this.maxState ) ? this.maxState : renderer.endFrame;
        
        for ( var i = 0; i < this.maxState; i++ )
        {
          if ( i < nFrame )
          {
            renderer.setFrame( i );
          }
          renderer.render( this.buffer.context, 1 );
          renderer.localPosition.x += this.sizes.width;
        }
      }
      // not a sprite renderer - do it as you can
      else
      {
        for ( var i = 0, x = 0; i < this.maxState; i++ )
        {
          this.buffer.context.fillStyle = "rgb(100,"+ ( 70 + 70 * i ) +",100)";
          this.buffer.context.fillRect( x, 0, this.sizes.width, this.sizes.height );
          x += this.sizes.width;
        }
      }
      // Generate textRenderer
      if ( this.text != undefined )
      {
        if ( !param.textRenderer )
        {
          param.textRenderer = new TextRenderer( { 'fillColor': param.fillColor || undefined, 'strokeColor': param.strokeColor || undefined, 'fontSize': this.fontSize,
                  "x": this.padding.x, "y": this.padding.y, 'offsetX': 0, 'offsetY': 0 },
                  this.sizes.width - this.padding.x*2, this.sizes.height - this.padding.x*2, this.text );
        }
        // check if user give other state for text
        if ( !param.textOverRenderer )
        {
          param.textOverRenderer = param.textRenderer;
        }
        if ( !param.textClickRenderer )
        {
          param.textClickRenderer = param.textRenderer;
        }
        // now render text inside buffer
        var x = this.sizes.width;
        param.textRenderer.render( this.buffer.context, 1 );
        
        param.textOverRenderer.localPosition.x += x;
        param.textOverRenderer.render( this.buffer.context, 1 );
        
        param.textClickRenderer.localPosition.x += x;
        param.textClickRenderer.render( this.buffer.context, 1 );
      }
    }
    
    /***
    * @public @override @render
    * @param @canvasContext2D ctx
    - renderise
    */
    this.render = function( ctx )
    {
      this.currentState = 0;
      if ( this.isClicked )
      {
        this.currentState = 2;
      }
      else if ( this.isOver )
      {
        this.currentState = 1;
      }
      ctx.clearRect( this.position.x, this.position.y, this.sizes.width, this.sizes.height );
      ctx.drawImage( this.buffer, this.currentState * this.sizes.width, 0, this.sizes.width, this.sizes.height,
                        this.position.x, this.position.y, this.sizes.width, this.sizes.height );
    }
    
    this.init( param );
  }
  
  Button.prototype = new BaseGui();
  Button.prototype.constructor = BaseGui;
  Button.prototype.supr = BaseGui.prototype;
  
  return Button;
} );