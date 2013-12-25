/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* FixedBoxCollider
**/

define( [ 'DE.Collider', 'DE.CONFIG', 'DE.CanvasBuffer', 'DE.COLORS' ],
function( Collider, CONFIG, CanvasBuffer, COLORS )
{
  function OrientedBoxCollider( width, height, param )
  {
    param = param || {};
    param.type = CONFIG.COLLISION_TYPE.ORIENTED_BOX;
    
    Collider.call( this, param );
    
    var _points    = new Array();
    var _inCircles = new Array();
    var _extCircle = { x: this.localPosition.x, y: this.localPosition.y, radius: undefined };
    
    this.width  = width || 1;
    this.height = height || 1;
      
    var _left  = -this.width * 0.5
     , _right  = this.width * 0.5
     , _top    = -this.height * 0.5
     , _bottom = this.height * 0.5;
    
    this.init = function()
    {
      _points.push( { x: _left,  y: _top } );
      _points.push( { x: _left,  y: _bottom } );
      _points.push( { x: _right,  y: _bottom } );
      _points.push( { x: _right,  y: _top } );
      
      for (var i = 0, p; p = _points[i]; i++)
      {
        p.ox = p.x;
        p.oy = p.y;
      }
      
      var valx = this.localPosition.x - (this.localPosition.x + _points[0].x);
      valx *= valx;
      
      var valy = this.localPosition.y - (this.localPosition.y + _points[0].y);
      valy *= valy;
      
      _extCircle.radius = Math.sqrt( valx + valy );
      
      
      var inRadius = this.width * 0.5;
      _inCircles.push( { "x": 0, "y": 0, "radius": inRadius, "isColliding": false } );
      
      if ( this.height < this.width )
      {
        inRadius = this.height * 0.5;
        _inCircles[0] = { "x": 0, "y": 0, "radius": inRadius, "isColliding": false };
      }
      
      // generate _inCircles
      var nIn = ( this.width - inRadius * 2 ) / ( inRadius * 2 ) / 2;
      var horizontal = true;
      if ( nIn <= 0 )
      {
        nIn = ( this.height - inRadius * 2 ) / ( inRadius * 2 ) / 2;
        horizontal = false;
      }
      if ( nIn > 0 )
      {
        nIn >>= 0;
        nIn++;
        while ( nIn > 0 )
        {
          if ( horizontal )
          {
            _inCircles.push( { "x": -inRadius + _left + (inRadius * 2 * nIn), "y": 0, "radius": inRadius, "isColliding": false } );
            _inCircles.push( { "x": inRadius - _left - (inRadius * 2 * nIn), "y": 0, "radius": inRadius, "isColliding": false } );
          }
          else
          {
            _inCircles.push( { "x": 0, "y": -inRadius + _top + (inRadius * 2 * nIn), "radius": inRadius, "isColliding": false } );
            _inCircles.push( { "x": 0, "y": inRadius - _top - (inRadius * 2 * nIn), "radius": inRadius, "isColliding": false } );
          }
          nIn--;
        }
      }
      
      if ( CONFIG.DEBUG_LEVEL > 1 )
        this.createDebugRenderer();
    }
    
    this.createDebugRenderer = function()
    {
      
    // DEBUG level ?
    // if ( CONFIG.DEBUG_LEVEL > 1 )
    // {
      this.debugBuffer = new CanvasBuffer( _extCircle.radius, _extCircle.radius );
      this.debugBuffer.ctx.lineWidth = 2;
      this.debugBuffer.ctx.strokeStyle = COLORS.DEBUG.COLLIDER;
      this.debugBuffer.ctx.strokeRect( 0, 0, this.width, this.height);
      
      // if ( CONFIG.DEBUG_LEVEL > 1 )
      // {
        // cercle circonscri
        this.debugBuffer.ctx.strokeStyle = "blue";
        this.debugBuffer.ctx.beginPath();
        this.debugBuffer.ctx.arc(this.localPosition.x, this.localPosition.y, _extCircle.radius, 0, Math.PI*2, true);
        this.debugBuffer.ctx.stroke();
        this.debugBuffer.ctx.closePath();
        
        // cercles inscrits
        for (var i = 0, c; c = _inCircles[i]; i++)
        {
          this.debugBuffer.ctx.strokeStyle = "blue";
          if (this.isColliding)
            this.debugBuffer.ctx.strokeStyle = "green";
          this.debugBuffer.ctx.beginPath();
          this.debugBuffer.ctx.arc(this.localPosition.x + c.x, this.localPosition.y + c.y, c.radius, 0, Math.PI*2, true);
          this.debugBuffer.ctx.stroke();
          this.debugBuffer.ctx.closePath();
        }
        
        for ( var i = 0, p; p = _points[i]; i++ )
        {
          this.debugBuffer.ctx.strokeStyle = "red";
          this.debugBuffer.ctx.fillRect( p.x-1, p.y-1, 2, 2 );
        }
      // }
    }
    
    this.debugRender = function( ctx )
    {
      ctx.rotate( -this.gameObject.position.rotation );
      ctx.drawImage( this.debugBuffer.canvas
                      , this.localPosition.x - this.debugBuffer.canvas.width * 0.5 >> 0
                      , this.localPosition.y - this.debugBuffer.canvas.height * 0.5 >> 0 );
      ctx.rotate( this.gameObject.position.rotation );
    }
    
    this.getExternCircle = function()
    {
      return _extCircle;
    }
    
    this.getInternCircles = function()
    {
      return _inCircles;
    }
    
    this.init();
  };

  OrientedBoxCollider.prototype = new Collider();
  OrientedBoxCollider.prototype.constructor = OrientedBoxCollider;
  OrientedBoxCollider.prototype.supr        = Collider.prototype;
  OrientedBoxCollider.prototype.DEName      = "OrientedBoxCollider";
  
  CONFIG.debug.log( "OrientedBoxCollider loaded", 3 );
  return OrientedBoxCollider;
} );