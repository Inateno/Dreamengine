/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/* TODO - add DOM Gui possible, remove specific GuiComponents and use GameObjects
 So I don't comment methods here because this will change a lot */

/**
 * @constructor Gui
 * @class used to create a CanvasGui binded on the given camera
 */
define( [ 'DE.CONFIG', 'DE.COLORS', 'DE.Inputs', 'DE.CanvasBuffer' ],
function( CONFIG, COLORS, InputHandler, CanvasBuffer )
{
  function Gui( camera, params )
  {
    if ( !camera )
      throw new Error( "Gui :: You have to pass at least a camera to instantiate -- see the doc" );
    
    params = params || {};
    
    this.id        = params.id || undefined;
    this.isVisible = params.isVisible || true;
    this.opacity   = params.opacity || 1;
    
    this.components = params.components || {};
    
    var _buffer = new CanvasBuffer( camera.renderSizes.width, camera.renderSizes.height );
    
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
    this.render = function( ctx, position, sizes, drawRatio, pr )
    {
      if ( this.needUpdate )
      {
        for ( var i in this.components )
        {
          if ( !this.components[ i ].enable )
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
      ctx.drawImage( _buffer.canvas
                    , -sizes.width * sizes.scaleX * drawRatio * 0.5 >> 0
                    , -sizes.height * sizes.scaleY * drawRatio * 0.5 >> 0
                    , sizes.width * sizes.scaleX * drawRatio >> 0
                    , sizes.height * sizes.scaleY * drawRatio >> 0 );
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
        CONFIG.debug.log( "%cComponent override an older:: " + component.id, 1, "color:orange" );
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
        CONFIG.debug.log( "%cComponent " + id + " couldn't be found", 1, "color:orange" );
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
        if ( !this.components[ i ].enable )
          continue;
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.onMouseMove( mouse );
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
        if ( !this.components[ i ].enable )
          continue;
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.onMouseDown( mouse );
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
        if ( !this.components[ i ].enable )
          continue;
        var component = this.components[ i ];
        if (  component.checkState && component.checkState( mouse ) )
        {
          component.isClicked = false;
          component.onMouseUp( mouse );
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
      //launch click on components 
      for ( var i in this.components )
      {
        if ( !this.components[ i ].enable )
          continue;
        var component = this.components[i];
        if ( typeof( component.checkState ) !== "undefined" )
        {
          this.isFocus = component.checkState( InputHandler.mouse, true ); //if focus obtained via click return it in function
        }
      }
    }
    
    this.onKeyDown = function( keyEvent )
    {
      //send onKeyDown event to all components . NOTE : component MUST HAVE FOCUS to receive the event (test is made)
      for ( var i in Gui.components )
      {
        if ( !Gui.components[ i ].enable )
          continue;
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
  Gui.prototype.DEName = "Gui";
  
  CONFIG.debug.log( "Gui loaded", 3 );
  return Gui
} );