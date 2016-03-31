/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* SpriteRenderer
**/

/**
** The SpriteRenderer is child of Renderer
** It draws a sprite for the gameObject
** need the GameObject to draw
** list of params are the sames as Renderer
**/

define( [ 'DE.Renderer', 'DE.ImageManager', 'DE.Sizes', 'DE.SpriteRenderer.render', 'DE.CONFIG' ],
function( Renderer, ImageManager, Sizes, SpriteRender, CONFIG )
{
  function SpriteRenderer( param )
  {
    param = param || {};
    Renderer.call( this, param );
    
    this.DEName = "SpriteRenderer";
    
    param.spriteName = param.spriteName || undefined;
    
    this.spriteName = param.spriteName || undefined;
    if ( !this.spriteName )
    {
      if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
      {
        console.log( "WARN: SpriteRenderer :: No spriteName defined -- declaration canceled" );
      }
      return false;
    }
    console.log( this.spriteName );
    this.startFrame = param.startFrame || 0;
    this.endFrame  = param.endFrame || ImageManager.images[ this.spriteName ].totalFrame || 0;
    this.totalLine  = param.totalLine || ImageManager.images[ this.spriteName ].totalLine || 0;
    
    this.eachAnim  = param.eachAnim || ImageManager.images[ this.spriteName ].eachAnim || 0;
    this.lastAnim  = Date.now();
    
    this.frameSizes = new Sizes( ImageManager.images[ this.spriteName ].widthFrame
                    , ImageManager.images[ this.spriteName ].heightFrame
                    , 1, 1 );

    param.scaleX = param.scale || param.scaleX || param.scalex || 1;
    param.scaleY = param.scale || param.scaleY || param.scaley || 1;
    this.sizes  = new Sizes( param.width || param.w || ImageManager.images[ this.spriteName ].widthFrame
                  , param.height  || param.h || ImageManager.images[ this.spriteName ].heightFrame
                  , param.scaleX, param.scaleY );

    this.isAnimated = ImageManager.images[ this.spriteName ].isAnimated;
    this.isPaused  = param.paused || param.isPaused || false;
    this.isReversed  = param.reversed || param.isreversed || param.isReversed || false;
    this.isOver = false;
    this.loop = ( param.loop != undefined ) ? param.loop : true;
    
    this.currentFrame  = this.startFrame || 0;
    this.currentLine  = param.startLine || 0;
    
    this.localPosition.x -= ( this.sizes.width * this.sizes.scaleX * 0.5 );
    this.localPosition.y -= ( this.sizes.height * this.sizes.scaleY * 0.5 );
    
    this.setFrame = function( frame )
    {
      if ( frame+1 >= this.endFrame )
      {
        this.currentFrame = this.endFrame-1;
      }
      else if ( frame < this.startFrame )
      {
        this.currentFrame = this.startFrame;
      }
      else
      {
        this.currentFrame = frame;
      }
    }
    
    this.onAnimEnd = function(){}
  }

  SpriteRenderer.prototype = new Renderer();
  SpriteRenderer.prototype.constructor = SpriteRenderer;
  SpriteRenderer.prototype.supr = Renderer.prototype;
  
  SpriteRenderer.prototype.render = SpriteRender;
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "SpriteRenderer loaded" );
  }
  
  return SpriteRenderer;
} );