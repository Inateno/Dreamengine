/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno
*/

/**
 * An Inputs lib to detect keyboard and gamepad events, easily bindable and multiple bind
 * !! there is no all KEYBOARD keys, but you can easily add some, and share it if you want, I will add them !!
 * @namespace Inputs
 */
define( [
  'DE.config'
  , 'DE.Events'
  , 'DE.gamepad'
  , 'DE.Localization'
  , 'DE.Time'
],
function(
  config
  , Events
  , gamepad
  , Localization
  , Time
)
{
  var _langs = {
    "en": {
      "leave-page": "By leaving the page you'll lost any progression unsaved."
    }
    , "fr": {
      "leave-page": "En quittant la page vous allez perdre toute progression non sauvegardé."
    }
  };
  var Inputs = new function()
  {
    this.DEName = "Inputs";
    
    this.isListening = false;
    this.usedInputs = {};
    
    // @private renders, stock renders to bind inputs and call them
    var _renders = {};
    this.keyLocked = false;
    
    this.dbInputs = {
      "KEYBOARD":{
        "up":38
        ,"down":40
        ,"left":37
        ,"right":39
        ,"space":32
        ,"shift":16
        ,"caps":20
        ,"tab":9
        ,"ctrl":17
        ,"0": 48,"1": 49,"2": 50,"3": 51,"4": 52,"5": 53,"6": 54,"7": 55,"8": 56,"9": 57,"°": 219,"=": 187,"²": 222
        ,"d":68,"q":81,"z":90,"s":83,"a":65,"e":69,"r":82,"t":84,"y":89,"u":85,"i":73,"o":79,"p":80,"f":70
        ,"g":71,"h":72,"j":74,"k":75,"l":76,"m":77,"w":87,"x":88,"c":67,"v":86,"b":66,"n":78
        ,"enter":13,"return":8
        ,"PAD+":107, "PAD-":109, "PAD*":106, "PAD/":111, "PAD0":96, "PAD1":97, "PAD2":98, "PAD3":99, "PAD4":100
        ,"PAD5":101, "PAD6":102, "PAD7":103, "PAD8":104, "PAD9":105
        ,"F5":116,"F11":122,"F12":123
      }
      ,"GAMEPADBUTTONS":{
        "A" : 0
        ,"B" : 1
        ,"Y": 3
        ,"X" : 2
        ,"D-Up" : 12
        ,"D-Right" : 15
        ,"D-Left" : 14
        ,"D-Bot" : 13
        ,"select": 8
        ,"start" : 9
        ,"RTS" : 7
        ,"RBS" : 5
        ,"LTS" : 6
        ,"LBS" : 4
        ,"power" : 16
      }
      ,"GAMEPADAXES":
      {
        'LHorizontal' : 0
        ,'LVertical' : 1
        ,'RHorizontal' : 2
        ,'RVertical' : 3
      }
    };
    this.debugKeys = [ 123 ];
    this.ignoreKeys = [ 116, 122, 123 ];
    
    this.queue = {
      'keyDown': {}
      , 'keyUp': {}
      , 'btnMoved': {}
      , 'axeMoved' : {}
      , 'axeStart' : {}
      , 'axeStop' : {}
    };
    
    /**
     * initialize Inputs listeners with your custom Inputs list
     * called by the main engine file
     * @private
     * @memberOf Inputs
     */
    this.init = function( customInputs )
    {
      var newInputs = {};
      
      for ( var i in customInputs )
      {
        newInputs[ i ] = {};
        
        newInputs[ i ].inputs = new Array();
        for ( var n = 0, I; I = customInputs[ i ].keycodes[ n ]; ++n )
        {
          var type = ( I[ 0 ] == "K" || I[ 0 ] == "k" ) ? "KEYBOARD" : "MOUSE";
          var data = I.split( "." );
          var gamepadID = 0;
          var name;
          if ( data[ 0 ][ 0 ] == "G" ) {
            if ( data[ 0 ][ 1 ] ) {
              gamepadID = parseInt( data[ 0 ][ 1 ] );
            }
            if ( data[ 1 ] =="A" ) {
              type = "GAMEPADAXES"
            }
            else {
              type = "GAMEPADBUTTONS";
            }
            name = data[ 2 ];
          }
          else {
            name = I.slice( 2, I.length );
          }
          
          if ( typeof this.dbInputs[ type ][ name ] == "undefined" ) {
            console.log( "%cWARN: Inputs: An input couldn't be found in the database, did you respect the caseSensitive ?:" + type + "." + name + "\n Ignoring it and continue...", "color:red");
            continue;
          }
          
          if ( type == "GAMEPADBUTTONS" ) {
            gamepad.plugBtnToInput( this, i, gamepadID, this.dbInputs[ type ][ name ] );
          }
          else if ( type == "GAMEPADAXES" ) {
            gamepad.plugAxeToInput( this, i, gamepadID, this.dbInputs[ type ][ name ] );
          }
          
          newInputs[ i ].inputs.push( { "code": this.dbInputs[ type ][ name ], "type": type } );
        }
        
        newInputs[ i ].interval    = customInputs[ i ].interval || 0;
        newInputs[ i ].lastCall    = Date.now();
        newInputs[ i ].actions     = {};
        newInputs[ i ].isDown      = false;
        newInputs[ i ].isLongPress = customInputs[ i ].isLongPress || false;
        newInputs[ i ].stayOn      = customInputs[ i ].stayOn || false;

        newInputs[ i ].numberCall  = 0;
        newInputs[ i ].numberPress = 0;

        if ( newInputs[ i ].stayOn )
        {
          newInputs[ i ].lastCall = Date.now() + newInputs[ i ].interval;
        }
        
        this.queue[ 'keyDown' ][ i ]   = new Array();
        this.queue[ 'keyUp' ][ i ]     = new Array();
        // this.queue[ 'mouseDown' ][ i ] = new Array();
        // this.queue[ 'mouseUp' ][ i ]   = new Array();
        this.queue[ 'btnMoved'][ i ]   = new Array();
        this.queue[ 'axeMoved'][ i ]   = new Array();
        this.queue[ 'axeStart'][ i ]   = new Array();
        this.queue[ 'axeStop'][ i ]    = new Array();
       }
       
      this.queue[ 'axeMoved' ][ 'wheelTop' ]  = new Array();
      this.queue[ 'axeMoved' ][ 'wheelDown' ] = new Array();
      
      this.usedInputs = newInputs;
      this.toggleListeners();
    }
    
    /**
     * return the input data
     * @public
     * @memberOf Inputs
     */
    this.get = function( name )
    {
      if ( this.usedInputs[ name ] ) {
        return this.usedInputs[ name ];
      }
      return false;
    }
    
    /**
     * bind a callback on an event
     * @public
     * @memberOf Inputs
     */
    this.on = function( type, input, callback )
    {
      if ( !this.queue[ type ][ input ] ) {
        console.log( '%cWARN: Inputs: Try to bind on a non existent input ::: ' + type + ' - ' + input, "color:red" );
        return;
      }
      
      this.queue[ type ][ input ].push( callback );
      return this.queue[ type ][ input ].length;
    }
    
    /**
     * stop listening an event
     * @public
     * @memberOf Inputs
     */
    this.stopListening = function( type, input, index )
    {
      if ( index !== undefined ) {
        this.queue[ type ][ input ][ index ] = null;
        return;
      }
      
      for ( var i = 0; i < this.queue[ type ][ input ].length; ++i )
      {
        delete this.queue[ type ][ input ][ i ];
      }
      this.queue[ type ][ input ] = [];
      
      return this;
    }
    
    /**
     * Trigger manually an event
     * @public
     * @memberOf Inputs
     */
    this.trigger = function( eventType, keyName, val )
    {
      if ( Inputs.keyLocked && eventType.search( "mouse" ) == -1 ) {
        return;
      }
      
      for ( var ev = 0; ev < Inputs.queue[ eventType ][ keyName ].length; ++ev )
      {
        if ( Inputs.queue[ eventType ][ keyName ][ ev ] ) {
          Inputs.queue[ eventType ][ keyName ][ ev ]( val );
        }
      }
    }
    
    /**
     * Return the key state
     * @public
     * @memberOf Inputs
     */
    this.key = function( name )
    {
      if ( Inputs.keyLocked )
        return false;
      if ( this.usedInputs[ name ] && this.usedInputs[ name ].isDown
        && ( !this.usedInputs[ name ].interval || Date.now() - this.usedInputs[ name ].lastCall >= this.usedInputs[ name ].interval / Time.scaleDelta )
      ) {
        
        if ( !Inputs.usedInputs[ name ].stayOn ) {
          Inputs.usedInputs[ name ].lastCall = Date.now();
        }
        ++Inputs.usedInputs[ name ].numberCall;
        return true;
      }
      
      return false;
    }
    
    /**
     * Toggle keyboard listeners
     * @public
     * @memberOf Inputs
     */
    this.toggleListeners = function( canvas, bind )
    {
      var target = canvas || window;
      if ( this.isListening && !bind ) {
        if ( target.removeEventListener ) {
          target.removeEventListener( "keydown", Inputs.keyDown, false );
          target.removeEventListener( "keyup", Inputs.keyUp, false );
          target.removeEventListener( "keypress", Inputs.keyPress, false );
        }
        else if ( target.detachEvent ) {
          target.detachEvent( "onkeydown", Inputs.keyDown );
          target.detachEvent( "onkeyup", Inputs.keyUp );
          target.detachEvent( "onkeypress", Inputs.keyPress );
        }
      }
      else {
        if ( target.addEventListener ) {
          target.addEventListener( "keydown", Inputs.keyDown, false );
          target.addEventListener( "keyup", Inputs.keyUp, false );
          target.addEventListener( "keypress", Inputs.keyPress, false );
        }
        else if ( target.attachEvent ) {
          target.attachEvent( "onkeydown", Inputs.keyDown );
          target.attachEvent( "onkeyup", Inputs.keyUp );
          target.attachEvent( "onkeypress", Inputs.keyPress );
        }
      }
    }
    
    /**
     * Search all inputName using the given code/type and return all values in an array
     * @public
     * @memberOf Inputs
     * @param {String} code - key name: up, shift, space, A, etc...
     * @param {String} type - KEYBOARD / GAMEPADBUTTONS / GAMEPADAXES
     */
    this.findInputs = function( code, type )
    {
      var inputs = [];
      // parse all gamesInputs
      for ( var i in Inputs.usedInputs )
      {
        // parse each inputs
        for ( var t in Inputs.usedInputs[ i ].inputs )
        {
          var input = Inputs.usedInputs[ i ].inputs[ t ].code
            , tp = Inputs.usedInputs[ i ].inputs[ t ].type;
          
          if ( input == code && tp == type ) {
            inputs.push( i );
          }
        }
      }
      return inputs.length > 0 ? inputs : false;
    }
    
    /**
     * When a keyDown event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    this.keyDown = function( event )
    {
      var e = event || window.event;
      var code = e.which || e.keyCode;
      
      // we can ignore a list a specified keys (if you are using these for your top-application for example, like F1, F2)
      if ( Inputs.ignoreKeys.indexOf( code ) != -1 ) {
        if ( Inputs.debugKeys.indexOf( code ) != -1 ) {
          if ( config.DEBUG ) {
            return;
          }
          e.preventDefault();
        }
        return;
      }
      
      // intern Nebula overlay logic, not blocking anything
      if ( code == Inputs.dbInputs.KEYBOARD.shift ) {
        Inputs.isShiftDown = true;
      }
      else if ( Inputs.isShiftDown && code == Inputs.dbInputs.KEYBOARD.tab ) {
        Events.emit( "toggle-nebula" );
      }
      
      // if keyLocked is true, Inputs stop checking every events
      // PS: you need this to be able to fill a form or whatever because it does a preventDefault which break standard DOM interaction
      if ( Inputs.keyLocked ) {
        
        // intern Nebula overlay logic, not blocking anything
        if ( code == Inputs.dbInputs.KEYBOARD.escape ) {
          Events.emit( "close-nebula" );
        }
        
        return false;
      }
      
      var inputsDown = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsDown !== false )
      {
        for ( var i = 0, input; input = inputsDown[ i ]; ++i )
        {
          if ( !Inputs.usedInputs[ input ].isDown && Date.now() - Inputs.usedInputs[ input ].lastCall >= Inputs.usedInputs[ input ].interval ) {
            
            if ( Inputs.usedInputs[ input ].isLongPress && !Inputs.usedInputs[ input ].stayOn ) {
              Inputs.usedInputs[ input ].lastCall = Date.now();
            }
            
            /* specific on keydown event handler here */
            if ( !Inputs.usedInputs[ input ].isDown ) {
              // 1 because it's a keyDown event
              Inputs.trigger( 'keyDown', input, 1 );
              Events.emit( 'keyDown', input );
            }
            
            Inputs.usedInputs[ input ].isDown = true;
          }
          
          // just data, can be useful for stats / achievements / whatever
          ++Inputs.usedInputs[ input ].numberPress;
        }
      }
      e.preventDefault();
    }
    
    /**
     * When a keyUp event occurs, it parse it and trigger every match with our custom inputs
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    this.keyUp = function( event )
    {
      var e = event || window.event;
      var code = e.which || e.keyCode;
      
      if ( code == Inputs.dbInputs.KEYBOARD.shift ) {
        Inputs.isShiftDown = false;
      }
      
      if ( Inputs.keyLocked ) {
        return false;
      }

      var inputsUp = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsUp !== false )
      {
        for ( var i = 0, input; input = inputsUp[ i ]; ++i )
        {
          if ( Inputs.usedInputs[ input ].isDown ) {
            Inputs.trigger( 'keyUp', input );
          }
          
          if ( Inputs.usedInputs[ input ].stayOn ) {
            Inputs.usedInputs[ input ].lastCall = Date.now();
          }
          
          Inputs.usedInputs[ input ].isDown = false;
        }
      }
    }
    
    /**
     * When a keyPress event occurs, it parse it and trigger every match with our custom inputs
     * !! Because I never needed this, it's empty. I found this useless for games, but in case the method is here and ready to be used
     * @public
     * @memberOf Inputs
     * @param {DOMEvent} event
     */
    this.keyPress = function( event )
    {
      var e = event || window.event;
      var key = e.which || e.keyCode;
      var code = e.keyCode;

      var inputsPress = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsPress !== false ) {
        // for ( var i = 0, input; input = inputsPress[ i ]; ++i )
        // {
          // if ( Inputs.usedInputs[ input ].isDown )
          // {
          // }
          // Inputs.usedInputs[ isUp ].isDown = false;
        // }
      }
      
      // needed ?
      // e.preventDefault();
      // return false;
    }
  };
  
  window.onbeforeunload = function( e )
  {
    if ( !window.leavePage )
      return _langs[ Localization.currentLang ][ "leave-page" ];
  };
  window.onunload = function( e )
  {
    Events.emit( "unload-game" );
  }
  
  return Inputs;
} );