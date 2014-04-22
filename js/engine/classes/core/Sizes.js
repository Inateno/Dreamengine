/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/**
 * @constructor Sizes
 * @class it's a simple class to contain Sizes with scaling values and methods
 * @param {Int} width
 * @param {Int} height
 * @param {Float} scaleX
 * @param {Float} scaleY
 * @example var size = new DE.Sizes( 500, 455, 1.2, 1.2 );
 */
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  function Sizes( width, height, scaleX, scaleY, parent )
  {
    if ( !width || !height )
      throw new Error( "Sizes :: You have to pass a width and height when instantiate -- see the doc" );
    this.width  = width;
    this.height = height;
    this.scaleX = scaleX || 1;
    this.scaleY = scaleY || 1;
    this.parent = parent;
    
    /**
     * change scales, will remove centering then apply again (if there is a parent)
     * @public
     * @memberOf Sizes
     * @param {Float} val valX or valX and Y if no Y given
     * @param {Float} [valY]
     * @returns {Sizes} this current instance
     */
    this.setScale = function( val, valY )
    {
      this._uncenter();
      if ( val.x && val.y )
      {
        this.scaleX = val.x;
        this.scaleY = val.y;
      }
      else if ( !valY )
      {
        this.scaleX = val;
        this.scaleY = val;
      }
      else
      {
        this.scaleX = val;
        this.scaleY = valY;
      }
      this._center();
      return this;
    }
    
    /**
     * center the parent localPosition according to these sizes
     * @protected
     * @memberOf Sizes
     * @returns {Sizes} this current instance
     */
    this._center = function()
    {
      if ( this.parent )
      {
        this.parent.localPosition.x -= ( this.width * this.scaleX * 0.5 ) >> 0;
        this.parent.localPosition.y -= ( this.height * this.scaleY * 0.5 ) >> 0;
      }
      return this;
    }
    
    /**
     * center the parent localPosition according to these sizes
     * @protected
     * @memberOf Sizes
     * @returns {Sizes} this current instance
     */
    this._uncenter = function()
    {
      if ( this.parent )
      {
        this.parent.localPosition.x += ( this.width * this.scaleX * 0.5 ) >> 0;
        this.parent.localPosition.y += ( this.height * this.scaleY * 0.5 ) >> 0;
      }
      return this;
    }
    
    /** TODO **/
    /**
     * <b>Work In Progress, don't use it</b><br>
     * scaleTo provide a middleware to make scale animation
     * @protected
     * @memberOf Sizes
     * @param {Vector2} val value to scale X and Y
     * @param {Int} time in milliseconds
     * @returns {Sizes} this current instance
     */
    this.scaleTo = function( val, time )
    {
      this._uncenter();
      if ( val.x && val.y )
      {
        this.scaleX = val.x;
        this.scaleY = val.y;
      }
      else
      {
        this.scaleX = val;
        this.scaleY = val;
      }
      this._center();
      return this;
    }
    
    
    /** TODO **/
    /**
     * <b>Work In Progress, don't use it</b><br>
     * scaleXTo provide a middleware to make scaleX animation
     * @protected
     * @memberOf Sizes
     * @param {Vector2} val value scale X
     * @param {Int} time in milliseconds
     * @returns {Sizes} this current instance
     */
    this.scaleXTo = function( val, time )
    {
      this._uncenter();
      this.scaleX = valX;
      this._center();
      return this;
    }
    
    /** TODO **/
    /**
     * <b>Work In Progress, don't use it</b><br>
     * scaleYTo provide a middleware to make scaleY animation
     * @protected
     * @memberOf Sizes
     * @param {Float} val value scale Y
     * @param {Int} time in milliseconds
     * @returns {Sizes} this current instance
     */
    this.scaleYTo = function( val )
    {
      this._uncenter();
      this.scaleY = valY;
      this._center();
      return this;
    }
    
    /**
     * set current sizes to given sizes,
     * if you provide only first as Int, will make a boxed sizes
     * @protected
     * @memberOf Sizes
     * @param {Vector2} first sizes values X and Y
     * @param {Int} [height] height value if first corresponding to width
     * @returns {Sizes} this current instance
     */
    this.setSizes = function( first, height )
    {
      this._uncenter();
      if ( first.width )
      {
        this.width = first.width;
        this.height= first.height || this.height;
      }
      else if ( first && !height )
      {
        this.width = first;
        this.height= first;
      }
      else
      {
        this.width = first;
        this.height= height;
      }
      this._center();
      return this;
    }
  }
  Sizes.prototype.DEName = "Sizes";
  
  CONFIG.debug.log( "Sizes loaded", 3 );
  return Sizes;
} );