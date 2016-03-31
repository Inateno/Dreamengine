/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* Camera

**/
define( [ 'DE.CONFIG', 'DE.Sizes', 'DE.Vector2', 'DE.CanvasBuffer', 'DE.CollisionSystem', 'DE.ImageManager' ],
function( CONFIG, Sizes, Vector2, CanvasBuffer, CollisionSystem, ImageManager )
{
  function Camera( width, height, x, y, param )
  {
    this.DEName = "Camera";
    param = param || {};
    
    this.name   = param.name || "";
    this.tag    = param.tag || "";
    this.scene  = null;
    this.gui = undefined;
    
    this.sizes  = new Sizes( width, height, param.scale || param.scaleX || 1, param.scale || param.scaleY || 1 );
    
    // position in the scene
    this.position  = new Vector2( x + width * 0.5, y + height * 0.5, param.z || -10 );
    
    // position inside the sceneworld
    this.realposition = new Vector2( param.realx || x, param.realy || y , param.realz || param.z || -10 );
    
    this.opacity = param.opacity || 1;
    this.backgroundColor = param.backgroundColor || null;
    this.backgroundImage = param.backgroundImage || null;
    
    this.cameras = new Array();
    this.maxCameras  = 0;
    
    this.freeze  = false;
    this.sleep  = false;
    
    this.startX = 0
    this.startY = 0
    var buffer  = new CanvasBuffer( this.sizes.width, this.sizes.height );
    var _gameObjects = new Array();
    /***
    * @render
    renderise the view in the scene
    ***/
    this.render = function( ctx )
    {
      if ( this.sleep )
      {
        return;
      }
      
      if ( !this.freeze )
      {
        buffer.ctx.globalAlpha  = this.opacity;
        
        if ( this.backgroundColor != null )
        {
          buffer.ctx.fillStyle = this.backgroundColor;
          buffer.ctx.fillRect( 0, 0, this.sizes.width, this.sizes.height );
        }
        if ( this.backgroundImage != null )
        {
          buffer.ctx.drawImage( ImageManager.images[ this.backgroundImage ], 0, 0, this.sizes.width, this.sizes.height );
        }
        
        buffer.ctx.save();
        // renderize here game objects
        if ( this.scene )
        {
          _gameObjects = this.scene.getGameObjects();
          for ( var i = 0, t = _gameObjects.length, g,ratioz; i < t; i++ )
          {
            g = _gameObjects[ i ];
            if ( g && !g.disable
              && g.position.z > this.realposition.z
              && ( g.position.x + g.biggerOffset.width >= this.realposition.x
                && g.position.x - g.biggerOffset.width <= this.realposition.x + this.sizes.width )
              && ( g.position.y + g.biggerOffset.height >= this.realposition.y
                && g.position.y - g.biggerOffset.height <= this.realposition.y + this.sizes.height )
            )
            {
              ratioz = ( ( this.realposition.z - g.position.z ) + 10 ) / 10 + 1;
              g.render( buffer.ctx, ratioz, this.realposition, this.sizes );
            }
          }
        }
        else
        {
          buffer.ctx.textAlign = "center";
          buffer.ctx.fillStyle = "white";
          buffer.ctx.fillText( "No scene affiliated :(", this.sizes.width * 0.5, this.sizes.height * 0.5 );
        }
        
        buffer.ctx.restore();
        buffer.ctx.globalAlpha = this.opacity;
        
        if ( CONFIG.DEBUG )
        {
          buffer.ctx.fillStyle = "white";
          buffer.ctx.textAligne= "left";
          buffer.ctx.fillText( "Camera " + this.name, 10, 20);
          
          buffer.ctx.strokeStyle = "red";
          buffer.ctx.strokeRect( 0, 0, this.sizes.width, this.sizes.height );
        }
      }
      
      ctx.translate( this.position.x, this.position.y );
      ctx.rotate( this.position.rotation );
      
      ctx.drawImage( buffer.canvas, -this.sizes.width * 0.5, -this.sizes.height * 0.5
            , this.sizes.width * this.sizes.scaleX, this.sizes.height * this.sizes.scaleY );
      
      ctx.rotate( -this.position.rotation );
      ctx.translate( -this.position.x, -this.position.y );
      
      if ( this.gui )
      {
        this.gui.render( ctx, this.sizes );
      }
    }
    
    /**
    * @add
    add a camera on this camera
    **/
    this.add = function( camera )
    {
      this.cameras.push( camera );
      this.maxCameras++;
    }
    
    /**
    * @remove
    remove a camera affilied in this camera ( not deleted ! )
    **/
    this.remove = function( camera )
    {
      var pos = this.cameras.indexOf( scene );
      if ( pos == -1 )
      {
        console.log( "Remove camera not found ", camera );
        return;
      }
      
      this.cameras.splice( pos, 1 );
      this.maxCameras--;
    }
    
    /***
    * @option custom events
    return true if you want stop propagation
    */
    this.onMouseDown = function(){};
    this.onMouseUp = function(){};
    this.onMouseMove = function(){};
    
    /* last event, called after all */
    this.lastOnMouseMove = function(){};
    this.lastOnMouseDown = function(){};
    this.lastOnMouseUp = function(){};
    
    /***
    * @EVENTS @onMouseDown
    */
    this.oOnMouseDown = function( mouse )
    {
      mouse = { x: mouse.x / this.sizes.scaleX, y: mouse.y / this.sizes.scaleY };
      if ( this.onMouseDown( mouse ) || mouse.stopPropagation )
        return;
      if ( this.gui && this.gui.onMouseDown( mouse ) || mouse.stopPropagation )
        return;
      
      mouse.x += this.realposition.x;
      mouse.y += this.realposition.y;
      for ( var i = _gameObjects.length - 1; i >= 0; --i )
      {
        if ( !_gameObjects[ i ].collider || !_gameObjects[ i ].onMouseDown){ continue; }
        if ( CollisionSystem.checkCollisionWith( mouse, _gameObjects[ i ].collider ) )
        {
          if ( _gameObjects[ i ].onMouseDown( mouse ) )
            break;
        }
      }
      
      if ( !mouse.stopPropagation )
        this.lastOnMouseDown( mouse );
    }
    
    /***
    * @EVENTS @onMouseUp
    */
    this.oOnMouseUp = function( mouse )
    {
      mouse = { x: mouse.x / this.sizes.scaleX, y: mouse.y / this.sizes.scaleY };
      if ( this.onMouseUp( mouse ) || mouse.stopPropagation )
        return;
      if ( this.gui && this.gui.onMouseUp( mouse ) || mouse.stopPropagation )
        return;
      
      mouse.x += this.realposition.x;
      mouse.y += this.realposition.y;
      for ( var i = 0, t = _gameObjects.length; i < t; i++ )
      {
        if ( !_gameObjects[ i ].collider || !_gameObjects[ i ].onMouseUp){ continue; }
        if ( CollisionSystem.checkCollisionWith( mouse, _gameObjects[ i ].collider ) )
        {
          if ( _gameObjects[ i ].onMouseUp( mouse ) )
            break;
        }
      }
      
      if ( !mouse.stopPropagation )
        this.lastOnMouseUp( mouse );
    }
    
    /***
    * @EVENTS @onMouseMove
    */
    this.oOnMouseMove = function( mouse )
    {
      mouse = { x: mouse.x / this.sizes.scaleX, y: mouse.y / this.sizes.scaleY };
      if ( this.onMouseMove( mouse ) || mouse.stopPropagation )
        return;
      if ( this.gui && this.gui.onMouseMove( mouse ) || mouse.stopPropagation )
        return;
      
      mouse.x += this.realposition.x;
      mouse.y += this.realposition.y;
      for ( var i = 0, t = _gameObjects.length; i < t; i++ )
      {
        if ( !_gameObjects[ i ].collider || !_gameObjects[ i ].onMouseMove){ continue; }
        if ( CollisionSystem.checkCollisionWith( mouse, _gameObjects[ i ].collider ) )
        {
          if ( _gameObjects[ i ].onMouseMove( mouse ) )
            return;
        }
      }
      
      if ( !mouse.stopPropagation )
        this.lastOnMouseMove( mouse );
    }
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Camera loaded" );
  }
  return Camera;
} );