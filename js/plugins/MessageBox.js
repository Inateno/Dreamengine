define( [ 'DREAM_ENGINE' ],
function( DE )
{
  var MessageBox = new function()
  {
    this.DEName       = "MessageBox";
    this.mboxs        = {};
    this.nMboxs       = 0;
    this.selector     = "messageBoxContainer";
    this.el           = null;
    this.templateName = "messageBoxTemplate";
    this.template     = null;
    this.inited       = false;
    this.textView     = null;
    this.closeBtn     = null;
    this.wordsArray   = [];
    this.currentWord  = 0;
    this.currentLetter = 0;
    this.isActive     = false;
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
        throw new Error( "FATAL ERROR: Can't init MessageBox without an element AND a template -- "
                        + "selector:: " + this.selector + " -- templateName:: " + this.templateName );
        return;
      }
      this.inited = true;
      document.body.removeChild( document.getElementById( this.templateName ) );
      DE.MainLoop.additionalModules[ "MessageBoxUpdate" ] = this;
      
      DE.Inputs.on( "keyDown", "skipMessage", function()
      {
        if ( !_self.currentId )
          return;
        if ( !_self.isActive && _self.closeBtn )
          _self.mboxs[ _self.currentId ].manualClose();
        else
          _self.preventDynamicText();
      } );
      
      if ( params.useBuffer )
      {
        this.buffer = new DE.PIXI.autoDetectRenderer( 1, 1, {
          transparent       : true
          ,clearBeforeRender: true
          ,autoResize       : true
        } );
        this.bufferContainer = new DE.PIXI.Container();
      }
    };
    
    this.renderBuffer = function( renderers, x, y, sizes )
    {
      this.bufferContainer.position.set( x || 0, y || 0 );
      var oldParents = [];
      for ( var i = 0; i < renderers.length; ++i )
      {
        oldParents.push( renderers[ i ].parent );
        MessageBox.bufferContainer.addChild( renderers[ i ] );
      }
      
      this.buffer.render( this.bufferContainer );
      if ( sizes )
      {
        this.buffer.view.style.width  = sizes.w + 'px';
        this.buffer.view.style.height = sizes.h + 'px';
      }
      
      for ( i = 0; i < renderers.length; ++i )
      {
        oldParents[ i ].addChild( renderers[ i ] );
      }
    };

    /****
     * create a message box in the window, fill to window with js detection
     text is the content
     callback when close is called
      -> if there is a close className, it will close the messageBox on click
      -> you can configure an "closeMessageBox" inputs in the list to closes the messagesBox
     */
    this.create = function( text, callback, context, params )
    {
      if ( !this.inited )
        return;
      
      var id = Date.now() + "-" + ( Math.random() * 100 >> 0 );
      var mbox = document.createElement( 'div' );
        mbox.innerHTML = this.template;
      
      this.textView = mbox.getElementsByClassName( 'content' )[ 0 ];
      // Split the string into words and init counters
      this.wordsArray = text.split( " " );
      this.fullText = text;
      this.currentWord = 0;
      this.currentLetter = 0;
        //mbox.getElementsByClassName( 'content' )[ 0 ].innerHTML = text;
      var closeBtn = mbox.getElementsByClassName( 'close' )[ 0 ] || null;
        mbox.id = 'messageBox' + id;
        mbox.className = 'messageBox';
      this.currentId = mbox.id;
      
      if ( closeBtn )
      {
        closeBtn.addEventListener( "pointerup",
          function( e )
          {
            e.stopPropagation();
            e.preventDefault();
            mbox.manualClose();
            return false;
          }, false );
        mbox.manualClose = function()
        {
          if ( params.sound )
            DE.AudioManager.fx.play( params.sound );
          _self.remove( mbox.id );
          if ( callback )
            callback.call( context || window );
        };
        closeBtn.style.display = "none";
        this.closeBtn = closeBtn;
      }
      if ( params.buffer )
      {
        this.buffer.resolution = params.buffer.resolution || 1;
        this.buffer.resize( params.buffer.width, params.buffer.height );
        mbox.getElementsByClassName( "picture" )[ 0 ].appendChild( this.buffer.view );
      }
      if ( params.name )
      {
        mbox.getElementsByClassName( "name" )[ 0 ].innerHTML = params.name;
      }
      mbox.addEventListener( "pointerup", function( e )
      {
        e.stopPropagation();
        e.preventDefault();
        _self.preventDynamicText();
        return false;
      }, false );
      
      if ( params.lifeTime )
      {
        setTimeout( function()
        {
          _self.mboxs[ _self.currentId ].manualClose();
        }, params.lifeTime );
      }
      this.el.appendChild( mbox );
      
      this.mboxs[ mbox.id ] = mbox;
      ++this.nMboxs;
      
      this.trigger( "create", mbox );
      this.isActive = true;
      this.prevented = false;
      
      return mbox;
    }

    this.remove = function( id )
    {
      if ( !id )
        return;
      this.textView = null;
      this.isActive = false;
      this.el.removeChild( this.mboxs[ id ] );
      this.currentId = null;
      this.trigger( "kill" );
      if ( --this.nMboxs == 0 )
        this.trigger( "zeroMessagesBox" );
    }

    this.update = function( time )
    {
      if ( !this.isActive || !this.textView )
        return;

      // First, we check if we have finished the word
      if ( !this.wordsArray[ this.currentWord ][ this.currentLetter ] )
      {
        this.currentWord++; // increments the current word
        this.currentLetter = 0;
        
        // If this was the last word, we end here
        if ( !this.wordsArray[ this.currentWord ] )
          return this.endDynamicText();
        
        this.textView.innerHTML += " ";
      }
      
      if ( this.wordsArray[ this.currentWord ][ this.currentLetter ] == "/"
        && this.wordsArray[ this.currentWord ][ this.currentLetter + 1 ] == "n" )
      {
        this.textView.innerHTML += "<br />";
        this.currentLetter++;
      }
      else
        this.textView.innerHTML += this.wordsArray[ this.currentWord ][ this.currentLetter ];
      
      this.currentLetter++;
    };
    
    this.preventDynamicText = function()
    {
      if ( !this.textView )
        return;
      this.isActive = false;
      this.textView.innerHTML = this.fullText;
      if ( this.closeBtn )
        this.closeBtn.style.display = "block";
      
      // set time out prevent current down input propagation to an other event handler (like ChoiceBox)
      setTimeout( function()
      {
        _self.trigger( "end-dynamic-text" );
      }, 100 );
    };

    this.endDynamicText = function()
    {
      this.isActive = false;
      // Show the button
      
      if ( this.closeBtn )
        this.closeBtn.style.display = "block";
      this.trigger( "end-dynamic-text" );
    };
  };

  DE.Event.addEventCapabilities( MessageBox );
  //window.MessageBox = MessageBox;
  return MessageBox;
} );
