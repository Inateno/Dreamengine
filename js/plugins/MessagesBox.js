define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var Popups = new function()
  {
    this.DEName       = "MessagesBox";
    this.popups       = {};
    this.nPopups      = 0;
    this.selector     = "MessagesBoxContainer";
    this.el           = null;
    this.templateName = "messageBoxTemplate";
    this.template     = null;
    this.inited       = false;
    var _self = this;
    
    this.init = function( params )
    {
      if ( this.inited )
        return;
      params = params || {};
      params.notifications = params.notifications || {};
      
      this.selector = params.notifications.selector || this.selector;
      this.templateName = params.notifications.templateName || this.templateName;
      
      this.el = document.getElementById( this.selector );
      this.template = document.getElementById( this.templateName ).innerHTML;
      
      if ( !this.el || !this.template )
      {
        throw new Error( "FATAL ERROR: Can't init Popups without an element AND a template -- "
                        + "selector:: " + this.selector + " -- templateName:: " + this.templateName );
        return;
      }
      this.inited = true;
      document.body.removeChild( document.getElementById( this.templateName ) );
    }
    
    /****
     * create a popup in the windw, fill to window with js detection
     text is the content, type = prompt || info
     if you use prompt type, callbacks and contexts args are objects with yes and no values
     if you use info (default), callbacks and contexts args are directly functions
     */
    this.create = function( text, type, callbacks, contexts, closes )
    {
      if ( !this.inited )
        return;
      
      var id = Date.now() + "-" + ( Math.random() * 100 >> 0 );
      var popup = document.createElement( 'div' );
        popup.innerHTML = this.template;
        popup.getElementsByClassName( 'content' )[ 0 ].innerHTML = text;
        
        popup.getElementsByClassName( 'buttonsPrompt' )[ 0 ].style.display = "none";
        popup.getElementsByClassName( 'buttonsCustom' )[ 0 ].style.display = "none";
        popup.id = 'popup' + id;
        popup.className = 'popup';
        switch( type )
        {
          case "prompt":
            if ( contexts && !contexts.yes )
              contexts = { yes: contexts, no: contexts };
            if ( !contexts )
              contexts = { yes: window, no: window };
            popup.getElementsByClassName( 'buttonsDefault' )[ 0 ].style.display = "none";
            popup.getElementsByClassName( 'buttonsPrompt' )[ 0 ].style.display = "block";
            var yes = popup.getElementsByClassName( 'yesPrompt' )[ 0 ];
            yes.innerHTML = DE.LangSystem.get( "yes" ) || "Yes";
            yes.addEventListener( 'pointerup'
            , function( e )
            {
              e.stopPropagation();
              e.preventDefault();
              if ( callbacks.yes )
                callbacks.yes.call( contexts.yes );
              _self.remove( popup.id );
              return false;
            } );
            var no = popup.getElementsByClassName( 'noPrompt' )[ 0 ];
            no.innerHTML = DE.LangSystem.get( "no" ) || "No";
            no.addEventListener( 'pointerup'
            , function( e )
            {
              e.stopPropagation();
              e.preventDefault();
              if ( callbacks.no )
                callbacks.no.call( contexts.no );
              _self.remove( popup.id );
              return false;
            } );
            break;
          
          // generate a button list
          case "custom":
            popup.getElementsByClassName( 'buttonsDefault' )[ 0 ].style.display = "none";
            var buttons = popup.getElementsByClassName( 'buttonsCustom' )[ 0 ];
            buttons.style.display = "block";
            while( buttons.firstChild )
              buttons.removeChild( buttons.firstChild );
            for ( var i in callbacks )
            {
              b = document.createElement( "button" );
              b.className = i;
              b.i = i;
              b.innerHTML = DE.LangSystem.get( i ) || i;
              b.addEventListener( 'pointerup'
              , function( e )
              {
                e.stopPropagation();
                e.preventDefault();
                var target = e.target;
                while( target.tagName.toLowerCase() != "button" )
                  target = target.parentElement;
                callbacks[ target.i ].call( contexts, e );
                if ( closes.indexOf( target.i ) != -1 )
                  _self.remove( popup.id );
                return false;
              } );
              buttons.appendChild( b );
            }
            break;
          
          default: // default is information with button ok
            if ( !contexts )
              contexts = window;
            popup.getElementsByClassName( 'okBtn' )[ 0 ].addEventListener( 'pointerup'
            , function( e )
            {
              e.stopPropagation();
              e.preventDefault();
              callbacks.call( contexts );
              _self.remove( popup.id );
              return false;
            } );
            break;
        }
        
      this.el.appendChild( popup );
      
      this.popups[ popup.id ] = popup;
      ++this.nPopups;
      
      this.trigger( "create", popup );
      return popup;
    }
    
    this.remove = function( id )
    {
      this.el.removeChild( this.popups[ id ] );
      this.trigger( "kill" );
      if ( --this.nPopups == 0 )
      {
        this.trigger( "zeroPopups" );
      }
    }
  };
  
  DE.Event.addEventCapabilities( Popups );
  
  return Popups;
} );