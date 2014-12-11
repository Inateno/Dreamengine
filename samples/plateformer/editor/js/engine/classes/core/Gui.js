/***
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @Gui
***/
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.Inputs', 'DE.CanvasBuffer' ],
function( CONFIG, COLORS, InputHandler, CanvasBuffer )
{
  function Gui( camera, param )
  {
    this.DEName = "Gui";
    if ( !camera ){ return;}
    
    param = param || {};
    
    this.id = param.id || undefined;
    this.isVisible = param.isVisible || true;
    this.opacity = param.opacity || 1;
    
    this.components = param.components || {};
    
    var _buffer = new CanvasBuffer( camera.sizes.width, camera.sizes.height );
    
    this.needUpdate = true;
    
    /***
    * @update
    ***/
    this.update = function( deltaTime ) 
    {
      //update all components if necessary
      if ( this.needUpdate )
      {
        for ( var i in Gui.components )
        {
          var component = Gui.components[i];
          if ( typeof( component.update ) !== "undefined" )
            component.update( deltaTime );
        }
      }
    }
    
    /***
    * @render
    ***/
    this.render = function( ctx, sizes )
    {
      if ( this.needUpdate )
      {
        for ( var i in this.components )
        {
          if ( this.components[ i ].disable )
          {
            if ( !this.components[ i ].isDisable )
              this.components[ i ].clearMe( _buffer.ctx );
            continue;
          }
          this.components[ i ].oRender( _buffer.ctx, sizes );
        }
        
        if ( CONFIG.DEBUG )
        {
          _buffer.ctx.fillStyle = COLORS.DEBUG.GUI;
          _buffer.ctx.fillText( "GUI " + this.id, 20, _buffer.canvas.height - 20 );
        }
        this.needUpdate = false;
      }
      
      var oldAlpha = ctx.globalAlpha;
      ctx.globalAlpha = this.opacity;
      ctx.drawImage( _buffer.canvas, 0, 0 );
      ctx.globalAlpha = oldAlpha;
    }
    
    /***
    * @add
    add a given component
    ***/
    this.add = function( component )
    {
      if ( this.components[ component.id ] )
      {
        console.log( "Component overwrite an older:: " + component.id );
        delete this.components[ component.id ];
      }

      this.components[ component.id ] = component;
      this.components[ component.id ].gui = this;
    }
    
    /***
    * @remove
    remove a given component
    ***/
    this.remove = function( id )
    {
      if ( !this.components[ id ] )
      {
        console.log( "Component " + id + " couldn't be found");
        return;
      }
      
      this.components[ id ].gui = null;
      delete this.components[ id ];
    }
    
    /***
    * @EVENTS @onMouseMove
    */
    this.onMouseMove = function( mouse )
    {
      for ( var i in this.components )
      {
        if ( this.components[ i ].disable ){ continue; }
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.onMouseMove();
          return true;
        }
      }
      return false;
    }
    
    /***
    * @EVENTS @onMouseDown
    */
    this.onMouseDown = function( mouse )
    {
      for ( var i in this.components )
      {
        if ( this.components[ i ].disable ){ continue; }
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.onMouseDown();
          component.isClicked = true;
          return true;
        }
      }
      return false;
    }
    
    /***
    * @EVENTS @onMouseUp
    */
    this.onMouseUp = function( mouse )
    {
      for ( var i in this.components )
      {
        if ( this.components[ i ].disable ){ continue; }
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.isClicked = false;
          component.onMouseUp();
          return true;
        }
      }
      return false;
    }
    
    /***
    * @EVENTS @onMouseClick
    */
    this.onMouseClick = function( mouseEvent )
    {
      //get mouse coordinates 
      InputHandler.mouseMove( mouseEvent );
      
      //launch click on components 
      for ( var i in Gui.components )
      {
        if ( Gui.components[ i ].disable ){ continue; }
        var component = Gui.components[i];
        if ( typeof( component.checkState ) !== "undefined" )
        {
          Gui.isFocus = component.checkState( InputHandler.mouse, true ); //if focus obtained via click return it in function
        }
      }
    }
    
    this.onKeyDown = function( keyEvent )
    {
      //send onKeyDown event to all components . NOTE : component MUST HAVE FOCUS to receive the event (test is made)
      for ( var i in Gui.components )
      {
        if ( Gui.components[ i ].disable ){ continue; }
        var component = Gui.components[i];
        if ( typeof( component.onKeyDown ) !== "undefined" )
        {
          component.onKeyDown( keyEvent );
        }
      }
    }
  }
  
  //static boolean to handle focus events
  Gui.isFocus = false;
  
  //static components for event handling
  Gui.components = {};
  
  return Gui
} );