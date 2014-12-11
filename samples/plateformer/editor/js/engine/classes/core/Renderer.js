/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @constructor
* Renderer
**/
  
/**
** The Renderer is needed for a GameObject to be visible on screen
** list of params:
**                alpha :         alpha for the color (float between 0 & 1)
**                fillColor :     color of the GameObject (rgb)
**                method :        "fill" or "stroke" or "fillAndStroke"
**                localPosition : position of the renderer (Vector2)
**/

define( [ 'DE.COLORS', 'DE.Vector2', 'DE.CONFIG' ],
function( COLORS, Vector2, CONFIG )
{
  function Renderer( param )
  {
    this.DEName = "Renderer";
    
    param = param || {};
    this.gameObject  = param.gameObject || undefined;
    
    this.alpha      = param.alpha || 1;
    this.fillColor    = param.fillColor  || COLORS.defaultColor;
    this.strokeColor  = param.strokeColor  || COLORS.defaultColor;
    this.method      = param.method || "fill";
    this.localPosition  = param.localPosition ||
      new Vector2( param.offsetx || param.offsetX || param.left || param.x || param.offsetLeft || 0
                  , param.offsety || param.offsetY || param.top || param.y || param.offsetTop || 0 );
  }
  Renderer.prototype.render = function( ctx ){}

  Renderer.prototype = {

    constructor: Renderer
    /***
    * @translate
    * translate the renderer NOT THE GAMEOBJECT
    * Need a Vector2
    */
    , translate: function( vector2 )
    {
      this.localPosition.translate( vector2 );
    }
    
    /***
    * @translateX
    * translate the renderer horizontaly NOT THE GAMEOBJECT
    * Need a int in px
    */
    , translateX: function ( distance )
    {
      this.translate( { x: distance, y: 0 } );
    }
    
    /***
    * @translateY
    * translate the renderer verticaly NOT THE GAMEOBJECT
    * Need a int in px
    */
    , translateY: function ( distance )
    {
      this.translate( { x: 0, y: distance } );
    }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Renderer loaded" );
  }
  return Renderer;
} );