define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var ChoicesBox = new function()
  {
    this.DEName       = "ChoicesBox";
    this.cboxs        = {};
    this.nCboxs       = 0;
    this.selector     = "choicesBoxContainer";
    this.el           = null;
    // this.templateName = "choicesBoxTemplate";
    // this.template     = null;
    this.inited       = false;
    var _self = this;
    
    this.init = function( params )
    {
      if ( this.inited )
        return;
      params = params || {};
      
      this.selector = params.selector || this.selector;
      // this.templateName = params.templateName || this.templateName;
      
      this.el = document.getElementById( this.selector );
      // this.template = document.getElementById( this.templateName ).innerHTML;
      
      if ( !this.el /*|| !this.template*/ )
      {
        throw new Error( "FATAL ERROR: Can't init ChoicesBox without an element -- " //AND a template -- "
                        + "selector:: " + this.selector + " -- templateName:: " + this.templateName );
        return;
      }
      this.inited = true;
      // document.body.removeChild( document.getElementById( this.templateName ) );
      
      var _lastAxeMoved = Date.now();
      var _lastForce = 0;
      DE.Inputs.on( "axeMoved", "vaxe", function( val )
      {
        if ( _lastForce > 0.4 || Math.abs( val ) < 0.5 || Date.now() - _lastAxeMoved < DE.CONFIG.joystickSelectInterval )
        {
          _lastForce = val;
          return;
        }
        _lastAxeMoved = Date.now();
        _lastForce = 1;
        _self.changeSelected( val > 0 ? 1 : -1 );
      } );
      DE.Inputs.on( "keyDown", "up", function(){ _self.changeSelected( -1 ); } );
      DE.Inputs.on( "keyDown", "down", function(){ _self.changeSelected( 1 ); } );
      DE.Inputs.on( "keyDown", "confirm", function()
      {
        if ( !_self.currentId )
          return;
        _self.cboxs[ _self.currentId ].childNodes[ _self.currentChoice ].onclick();
        return true;
      } );
    }
    
    this.changeSelected = function( dir )
    {
      if ( !this.currentId )
        return;
      
      _self.cboxs[ _self.currentId ].childNodes[ _self.currentChoice ].className = _self.cboxs[ _self.currentId ].childNodes[
        _self.currentChoice ].className.replace( "active", "" );
      
      if ( dir == 1 )
      {
        if ( ++_self.currentChoice == _self.cboxs[ _self.currentId ].childNodes.length )
          _self.currentChoice = 0;
      }
      else
      {
        if ( --_self.currentChoice < 0 )
          _self.currentChoice = _self.cboxs[ _self.currentId ].childNodes.length - 1;
      }
      _self.cboxs[ _self.currentId ].childNodes[ _self.currentChoice ].className += " active";
    }

    /****
     * create a message box in the window, fill to window with js detection
     text is the content
     callback when close is called
      -> if there is a close className, it will close the ChoicesBox on click
      -> you can configure an "closeChoicesBox" inputs in the list to closes the messagesBox
     */
    this.create = function( choices, callback, context, sound, converters )
    {
      if ( !this.inited )
        return;
      
      var id = Date.now() + "-" + ( Math.random() * 100 >> 0 );
      var cbox = document.createElement( 'div' );
        cbox.id = 'ChoicesBox' + id;
        cbox.className = 'choicesBox';
      this.currentId = cbox.id;
      this.currentChoice = 0;
      
      for ( var i = 0, ch; i < choices.length; ++i )
      {
        ch = document.createElement( "div" );
        ch.className = "choice";
        ch.target    = choices[ i ].target;
        ch.innerHTML = DE.LangSystem.get( choices[ i ].msg ) || choices[ i ].msg;
        
        if ( converters )
        {
          for ( var c in converters )
            ch.innerHTML = ch.innerHTML.replace( converters[ c ].match, converters[ c ].value );
        }
        
        if ( i == 0 )
          ch.className += " active";
        
        ch.onclick = function( e )
        {
          if ( sound || _self.defaultSound )
            DE.AudioManager.fx.play( sound || _self.defaultSound );
          
          _self.remove( cbox.id );
          callback.call( context, this.target );
          
          if ( e )
            e.preventDefault();
          return true;
        };
        ch.addEventListener( "pointerup", function( e )
        {
          this.onclick( e );
        } );
        cbox.appendChild( ch );
      }
      
      this.el.appendChild( cbox );
      
      this.cboxs[ cbox.id ] = cbox;
      ++this.nCboxs;
      
      this.trigger( "create", cbox );
      window.preventSkipMessage = true;
      
      return cbox;
    }

    this.remove = function( id )
    {
      window.preventSkipMessage = false;
      console.log( "remove choice " + id )
      if ( !id )
        return;
      this.el.removeChild( this.cboxs[ id ] );
      this.currentId = null;
      this.trigger( "kill" );
      if ( --this.nCboxs == 0 )
        this.trigger( "zeroChoicesBox" );
    }
  };

  DE.Event.addEventCapabilities( ChoicesBox );
  //window.ChoicesBox = ChoicesBox;
  return ChoicesBox;
} );