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

define( [ 'DE.ImageManager', 'DE.CONFIG', 'DE.Time' ],
function( ImageManager, CONFIG, Time )
{
  function SpriteRender( ctx, ratioz )
  {
    if ( this.spriteName === undefined )
    {
      console.log( "WARN: No image name on a SpriteRenderer" );
      return false;
    }
    if ( this.isAnimated && !this.isPaused )
    {
      if ( Time.currentTime - this.lastAnim > this.eachAnim )
      {
        var nLoop = ( Time.currentTime - this.lastAnim ) / this.eachAnim >> 0;
        this.lastAnim = Time.currentTime;
        
        while ( nLoop > 0 )
        {
          if ( !this.isReversed )
          {
            if ( !this.loop && this.currentFrame+1 >= this.endFrame )
            {
              this.onAnimEnd();
              this.isOver = true;
            }
            else
            {
              this.currentFrame = ( this.currentFrame+1 >= this.endFrame ) ? this.startFrame : this.currentFrame+1 ;
            }
          }
          else
          {
            if ( !this.loop && this.currentFrame-1 <= this.startFrame )
            {
              this.onAnimEnd();
              this.isOver = true;
            }
            else
            {
              this.currentFrame = ( this.currentFrame-1 <= this.startFrame ) ? this.endFrame-1 : this.currentFrame-1 ;
            }
          }
          nLoop--;
        }
      }
    }
    
    ctx.globalAlpha = this.alpha;
    ctx.drawImage( ImageManager.images[ this.spriteName ]
            , this.frameSizes.width * this.currentFrame, this.frameSizes.height * this.currentLine
            , this.frameSizes.width, this.frameSizes.height
            , this.localPosition.x * ratioz
            , this.localPosition.y * ratioz
            , this.sizes.width * this.sizes.scaleX * ratioz, this.sizes.height * this.sizes.scaleY * ratioz );
    ctx.globalAlpha = 1;
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "SpriteRenderer.render loaded" );
  }
  return SpriteRender;
} );