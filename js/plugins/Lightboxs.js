define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var Lightboxs = new function()
  {
    this.DEName       = "Lightboxs";
    this.lightboxs    = {};
    this.nLightboxs   = 0;
    this.selector     = "lightboxsContainer";
    this.el           = null;
    this.templateName = "lightboxTemplate";
    this.template     = null;
    this.inited       = false;
    this.fadeOutTime  = 500;
    var _self = this;
    
    this.init = function( params )
    {
      if ( this.inited )
        return;
      params = params || {};
      
      this.selector = params.selector || this.selector;
      this.templateName = params.templateName || this.templateName;
      
      this.el = document.getElementById( this.selector );
      this.template = document.getElementById( this.templateName ).innerHTML;
      
      if ( !this.el || !this.template )
      {
        throw new Error( "FATAL ERROR: Can't init Lightboxs without an element AND a template -- "
                        + "selector:: " + this.selector + " -- templateName:: " + this.templateName );
        return;
      }
      this.inited = true;
      document.body.removeChild( document.getElementById( this.templateName ) );
    }
    
    /****
     * create a Lightbox in the windw, fill to window with js detection
     */
    this.create = function( content, callback, soundClose )
    {
      if ( !this.inited )
        return;
      
      var id = Date.now() + "-" + ( Math.random() * 100 >> 0 );
      var lightbox = document.createElement( 'div' );
        lightbox.innerHTML = this.template;
        lightbox.getElementsByClassName( 'content' )[ 0 ].innerHTML = content;
        lightbox.id = 'lightbox' + id;
        lightbox.className = 'lightbox';
        
        lightbox.getElementsByClassName( 'lightboxClose' )[ 0 ].addEventListener( 'pointerup'
        , function( e )
        {
          e.stopPropagation();
          e.preventDefault();
          // in this case, closes is the sound
          if ( soundClose )
            DE.AudioManager.fx.play( soundClose );
          if ( callback )
            callback();
          _self.remove( lightbox.id );
          return false;
        } );
        
      this.el.appendChild( lightbox );
      
      this.lightboxs[ lightbox.id ] = lightbox;
      ++this.nLightboxs;
      
      this.trigger( "create", lightbox );
      setTimeout( function()
      {
        lightbox.className += ' fadeIn';
      }, 50 );
      return lightbox;
    }
    
    this.remove = function( id )
    {
      this.lightboxs[ id ].className = this.lightboxs[ id ].className.replace( "fadeIn", "" );
      setTimeout( function()
      {
        _self.el.removeChild( _self.lightboxs[ id ] );
      }, this.fadeOutTime );
      this.trigger( "kill" );
      if ( --this.nLightboxs == 0 )
      {
        this.trigger( "zeroLightboxs" );
      }
    }
  };
  
  DE.Event.addEventCapabilities( Lightboxs );
  return Lightboxs;
} );