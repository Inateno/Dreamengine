/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Inputs
 detect keyboard Inputs, and set touch/mouse binding when Render are created
 
 !! there is no all KEYBOARD keys, but you can easily add some, and share it if you want, I will add them
**/
define( [ 'DE.CONFIG', 'DE.Event', 'DE.GamePad', 'DE.LangSystem', 'DE.Time', 'handjs' ],
function( CONFIG, Event, gamePad, LangSystem, Time )
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
    
    // to support multi-touch, use 12 mouses pos possible
    this.mouse = [
      { 'x': 0,'y':0,'isDown': false,'index' : 0 }
    ];
    
    this.dbInputs = {
      "MOUSE":{
        "leftClick":1000000001
        ,"rightClick":1000000002
        ,"wheelTop":1000000003
        ,"wheelDown":1000000004
      }
      ,"KEYBOARD":{
        "up":38
        ,"down":40
        ,"left":37
        ,"right":39
        ,"space":32
        ,"shift":16
        ,"caps":20
        ,"tab":9
        ,"escape": 27
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
        ,"RBS" : 7
        ,"RTS" : 5
        ,"LBS" : 6
        ,"LTS" : 4
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
      , 'mouseDown': {}
      , 'mouseUp': {}
      , 'btnMoved': {}
      , 'axeMoved' : {}
      , 'axeStart' : {}
      , 'axeStop' : {}
    };
    
    /****
     * on@void( type@String, input@String, callback@Function )
      bind a callback on an event
     */
    this.on = function( type, input, callback )
    {
      if ( !this.queue[ type ][ input ] )
      {
        console.log( '%cWARN:: Try to bind on a non existant input ::: ' + type + ' - ' + input, "color:red" );
        return 
      }
      this.queue[ type ][ input ].push( callback );
    }
    
    /****
     * init@void( customInputs@Objects )
      need object customInputs
     */
    this.init = function( customInputs )
    {
      var newInputs = {};
      
      for ( var i in customInputs )
      {
        newInputs[ i ] = {};
        
        newInputs[ i ].inputs = new Array();
        for ( var n = 0, I; I = customInputs[ i ].keycodes[ n ]; n++ )
        {
          var type = ( I[ 0 ] == "K" || I[ 0 ] == "k" ) ? "KEYBOARD" : "MOUSE";
          var data = I.split(".");
          var gamePadID = 0;
          var name;
          if ( data[ 0 ][ 0 ] == "G" )
          {
            if ( data[ 0 ][ 1 ] )
            {
              gamePadID = parseInt( data[ 0 ][ 1 ] );
            }
            if ( data[ 1 ] =="A" )
              type = "GAMEPADAXES"
            else
              type = "GAMEPADBUTTONS";
            name = data[ 2 ];
          }
          else
          {
            name = I.slice( 2, I.length );
          }
          if ( typeof this.dbInputs[ type ][ name ] == "undefined" )
          {
            console.log( "%cAn input couldn't be found in the database, did you respect the caseSensitive ?:" + type + "." + name + "\n Ignoring it and continue...", "color:red");
            continue;
          }
          
          if (type == "GAMEPADBUTTONS")
          {
            gamePad.plugBtnToInput(this, i, gamePadID, this.dbInputs[ type ][ name ] );
          }
          else if (type == "GAMEPADAXES")
          {
            gamePad.plugAxeToInput(this, i, gamePadID, this.dbInputs[ type ][ name ] );
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
        this.queue[ 'mouseDown' ][ i ] = new Array();
        this.queue[ 'mouseUp' ][ i ]   = new Array();
        this.queue[ 'btnMoved'][ i ]   = new Array();
        this.queue[ 'axeMoved'][ i ]   = new Array();
        this.queue[ 'axeStart'][ i ]   = new Array();
        this.queue[ 'axeStop'][ i ]    = new Array();
       }
      this.usedInputs = newInputs;
      this.toggleListeners();
    }
    
    /****
     * get@Key( name@String )
      return the queried key or false
     */
    this.get = function( name )
    {
      if ( this.usedInputs[ name ] )
      {
        return this.usedInputs[ name ];
      }
      return false;
    }
    
    /****
     * trigger@void( eventType@String, keyName@String )
      trigger manually an event
     */
    this.trigger = function( eventType, keyName, val )
    {
      if ( Inputs.keyLocked && eventType.search( "mouse" ) == -1 )
        return;
      for ( var ev in Inputs.queue[ eventType ][ keyName ] )
      {
        Inputs.queue[ eventType ][ keyName ][ ev ]( val );
      }
    }
    
    /****
     * key@Bool( name@String )
      return the key state
     */
    this.key = function( name )
    {
      if ( Inputs.keyLocked )
        return;
      if ( this.usedInputs[ name ] && this.usedInputs[ name ].isDown
        && ( !this.usedInputs[ name ].interval || Date.now() - this.usedInputs[ name ].lastCall >= this.usedInputs[ name ].interval / Time.scaleDelta )
      )
      {
        if ( !Inputs.usedInputs[ name ].stayOn )
        {
          Inputs.usedInputs[ name ].lastCall = Date.now();
        }
        Inputs.usedInputs[ name ].numberCall++;
        return true;
      }
      return false;
    }
    
    /****
     * toggleListeners@void
      toggle listeners on keyboard
      TODO - rework on this part (I made a first try, usefull for DOM Inputs)
     */
    this.toggleListeners = function( canvas, bind )
    {
      var target = canvas || window;
      if ( this.isListening && !bind )
      {
        if ( target.removeEventListener )
        {
          target.removeEventListener( "keydown", Inputs.keyDown, false );
          target.removeEventListener( "keyup", Inputs.keyUp, false );
          target.removeEventListener( "keypress", Inputs.keyPress, false );
        }
        else if ( target.detachEvent )
        {
          target.detachEvent( "onkeydown", Inputs.keyDown );
          target.detachEvent( "onkeyup", Inputs.keyUp );
          target.detachEvent( "onkeypress", Inputs.keyPress );
        }
      }
      else
      {
        if ( target.addEventListener )
        {
          target.addEventListener( "keydown", Inputs.keyDown, false );
          target.addEventListener( "keyup", Inputs.keyUp, false );
          target.addEventListener( "keypress", Inputs.keyPress, false );
        }
        else if ( target.attachEvent )
        {
          target.attachEvent( "onkeydown", Inputs.keyDown );
          target.attachEvent( "onkeyup", Inputs.keyUp );
          target.attachEvent( "onkeypress", Inputs.keyPress );
        }
      }
    }
    
    /****
     * findInput@String( code@String, type@String )
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
          
          if ( input == code && tp == type )
          {
            inputs.push( i );
          }
        }
      }
      return inputs.length > 0 ? inputs : false;
    }
    
    /****
     * keyDown@Bool( event@KeyboardEvent )
      TODO - define if we have to put preventDefault and return false at the end
      (I don't remeber why I comment but it was something with DOM Inputs)
     */
    this.keyDown = function( event )
    {
      var e = event || window.event;
      var code = e.which || e.keyCode;
      if ( Inputs.ignoreKeys.indexOf( code ) != -1 )
      {
        if ( Inputs.debugKeys.indexOf( code ) != -1 )
        {
          if ( CONFIG.DEBUG )
            return;
          e.preventDefault();
        }
        return;
      }
      if ( code == Inputs.dbInputs.KEYBOARD.shift )
        Inputs.isShiftDown = true;
      else if ( Inputs.isShiftDown && code == Inputs.dbInputs.KEYBOARD.tab )
        Event.trigger( "toggle-nebula" );
      if ( Inputs.keyLocked )
      {
        if ( code == Inputs.dbInputs.KEYBOARD.escape )
          Event.trigger( "close-nebula" );
        return false;
      }
      /*
       * TODO - need add an "on" keydown event handler here
       */
      var inputsDown = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsDown !== false )
      {
        for ( var i = 0, input; input = inputsDown[ i ]; ++i )
        {
          if ( !Inputs.usedInputs[ input ].isDown && Date.now() - Inputs.usedInputs[ input ].lastCall >= Inputs.usedInputs[ input ].interval )
          {
            // it's a long press key type ?
            if ( Inputs.usedInputs[ input ].isLongPress && !Inputs.usedInputs[ input ].stayOn )
            {
              Inputs.usedInputs[ input ].lastCall = Date.now();
            }
            
            /* specific on keydown event handler here */
            if ( !Inputs.usedInputs[ input ].isDown )
              Inputs.trigger( 'keyDown', input, 1 );
            Inputs.usedInputs[ input ].isDown = true;
          }
          Inputs.usedInputs[ input ].numberPress++;
        }
      }
      e.preventDefault();
      // return false;
    }
    /***
     * keyUp@Bool( event@KeyboardEvent )
      TODO - define if we have to put preventDefault and return false at the end
      (I don't remeber why I comment but it was something with DOM Inputs)
     */
    this.keyUp = function( event )
    {
      var e = event || window.event;
      var code = e.which || e.keyCode;
      if ( code == Inputs.dbInputs.KEYBOARD.shift )
        Inputs.isShiftDown = false;
      if ( Inputs.keyLocked )
        return false;
      /*
       * TODO - need add a "on" keyup event handler here (no precise case)
       */
      var inputsUp = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsUp !== false )
      {
        for ( var i = 0, input; input = inputsUp[ i ]; ++i )
        {
          if ( Inputs.usedInputs[ input ].isDown )
            Inputs.trigger( 'keyUp', input );
          
          if ( Inputs.usedInputs[ input ].stayOn )
          {
            Inputs.usedInputs[ input ].lastCall = Date.now();
          }
          
          Inputs.usedInputs[ input ].isDown = false;
        }
      }
      // e.preventDefault();
      // return false;
    }
    
    /****
     * keyPress@Bool
      TODO - define if remove or not
      useless method for games I think
     */
    this.keyPress = function( event )
    {
      var e = event || window.event;
      var key = e.which || e.keyCode;
      var code = e.keyCode;

      var inputsPress = Inputs.findInputs( code, "KEYBOARD" );
      if ( inputsPress !== false )
      {
        // for ( var i = 0, input; input = inputsPress[ i ]; ++i )
        // {
          // if ( Inputs.usedInputs[ input ].isDown )
          // {
          // }
          // Inputs.usedInputs[ isUp ].isDown = false;
        // }
      }
      
      // e.preventDefault();
      // return false;
    }
    
    /****
     * mouseDown@Bool( event@MouseEvent )
      mouseDown event
     */
    this.mouseDown = function( event )
    {
      var isRightClick = false, isMiddleClick = false;
      if ( "which" in event )  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      {
        isRightClick = event.which == 3;
        isMiddleClick= event.which == 2;
      }
      else if ( "button" in event )  // IE, Opera
        isRightClick = event.button == 2;
      
      var mouse = getMouse( event );
      mouse.isRightClick = isRightClick;
      mouse.isMiddleClick = isMiddleClick;
      
      if ( _renders[ event.target.id ] )
        _renders[ event.target.id ].oOnMouseDown( mouse );
      
      // catch general events 'on', 'mouseDown' if there is
      var inputsDown = Inputs.findInputs( 1000000001, "MOUSE" );
      if ( inputsDown !== false )
      {
        for ( var i = 0, input; input = inputsDown[ i ]; ++i )
        {
          if ( !Inputs.usedInputs[ input ].isDown )
            Inputs.trigger( 'mouseDown', input, mouse );
          Inputs.usedInputs[ input ].isDown = true;
        }
      }
      
      // event.preventDefault(); // kill the mouseUp u_u
      return false;
    }
    
    /****
     * rightClick@void( event@MouseEvent )
      Just preventing, used in mouseDown with "wich"
     */
    this.rightClick = function( event )
    {
      event.preventDefault();
      event.stopPropagation();
    }
    
    /****
     * mouseUp@Bool( event@MouseEvent )
      mouseUp event
     */
    this.mouseUp = function( event )
    {
      var isRightClick = false, isMiddleClick = false;
      if ( "which" in event )  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      {
        isRightClick = event.which == 3;
        isMiddleClick= event.which == 2;
      }
      else if ( "button" in event )  // IE, Opera
        isRightClick = event.button == 2;
      
      var mouse = getMouse( event );
      mouse.isRightClick = isRightClick;
      mouse.isMiddleClick = isMiddleClick;
      
      if ( _renders[ event.target.id ] )
        _renders[ event.target.id ].oOnMouseUp( mouse );
      
      // catch general events 'on', 'mouseUp' if there is
      var inputsUp = Inputs.findInputs( 1000000001, "MOUSE" );
      if ( inputsUp !== false )
      {
        for ( var i = 0, input; input = inputsUp[ i ]; ++i )
        {
          if ( Inputs.usedInputs[ input ].isDown )
            Inputs.trigger( 'mouseUp', input );
          Inputs.usedInputs[ input ].isDown = false;
        }
      }
      
      event.preventDefault();
      return false;
    }
    
    /****
     * mouseMove@Bool( event@MouseEvent )
      only call the onMouseMove on the render
      (can't bind a Inputs.on( "MouseMove" ) because it's a really heavy event)
     */
    this.mouseMove = function( event )
    {
      if ( _renders[ event.target.id ] )
        _renders[ event.target.id ].oOnMouseMove( getMouse( event ) );
      
      event.preventDefault();
      return false;
    }
    
    /****
     * private getMouse@Mouse
      create or return the mouse object depend on pointerId
     */
    function getMouse( event )
    {
      event.pointerId = event.pointerId || 0;
      if ( !Inputs.mouse[ event.pointerId ] )
        Inputs.mouse[ event.pointerId ] = { isDown: false, x: 0, y: 0, index: event.pointerId };
      
      Inputs.mouse[ event.pointerId ].isDown = true;
      Inputs.mouse[ event.pointerId ].x = event.clientX;
      Inputs.mouse[ event.pointerId ].y = event.clientY;
      
      return Inputs.mouse[ event.pointerId ];
    }
    
    /****
     * mouseClick@void( event@MouseEvent )
      TODO - not binded on canvas, before be sure this not trigger up / down events
      otherwhise it seems a little useless no ?
     */
    this.mouseClick = function( event )
    {
      /*
      * need add an "on" mouseclick event handler here
      */
    }
    
    /* MOUSE DOUBLE CLICK not used */
    this.mouseDbClick = function(){}
    
    /****
     * addEvent@void( eventName@String )
      TODO - write it
     */
    this.addEvent = function( eventName )
    {
    }
    
    /****
     * addActionInput@void( inputName@String, id@String, action@function )
      bind a callback on given input name (instead of using a gameLoop)
      TODO - not finished, not sure, don't use it
     */
    this.addActionInput = function( type, inputName, id )
    {
      if ( !this.checkInputExist( inputName ) )
        return;
      
      if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 && this.usedInputs[ inputName ].actions[ id ] )
      {
        CONFIG.debug.log( "Replace the action " + id + " on input " + inputName, 3 );
      }
      // this.usedInputs[ inputName ].actions[ id ] = action;
    }
    
    /****
     * removeActionInput@void( inputName@String, id@String )
      remove an action, on input name
      TODO - not finished, not sure, don't use it
     */
    this.removeActionInput = function( inputName, id )
    {
      if ( !this.checkInputExist( inputName ) )
        return;
      
      if ( !this.usedInputs[ inputName ].actions[ id ] )
      {
        throw new Error( "Try to remove a not founded action by id:: " + id );
        return;
      }
      CONFIG.debug.log( "Remove the action " + id + " on input " + inputName, 3 );
      delete this.usedInputs[ inputName ].actions[ id ];
    }
    
    /****
     * checkInputExist@Bool( inputName@String )
      check existence of given input by name
     */
    this.checkInputExist = function( inputName )
    {
      if ( !this.usedInputs[ inputName ] )
      {
        CONFIG.debug.log( "Try to access an input not defined:: " + inputName, 1 );
        return false;
      }
      return true;
    }
    
    /****
     * addRender@void( render@Render )
      add render to bind events on
     */
    this.addRender = function( render )
    {
      _renders[ render.id ] = render;
      
      var canvas = render.canvas;
      // handjs used here :)
      canvas.addEventListener( "pointerdown", Inputs.mouseDown, false );
      canvas.addEventListener( "pointerup", Inputs.mouseUp, false );
      canvas.addEventListener( "pointerout", Inputs.mouseMove, false );
      canvas.addEventListener( "pointermove", Inputs.mouseMove, false );
      canvas.addEventListener( "contextmenu", Inputs.rightClick, false );
      canvas.addEventListener( "DOMMouseScroll", Inputs.mouseWheel, false ); // seems not working
      canvas.addEventListener( "mousewheel", Inputs.mouseWheel, false ); // same here
      // canvas.addEventListener( "mouseclick", Inputs.mouseClick, false );
      // canvas.addEventListener( "mousedbclick", Inputs.mouseDbClick, false );
      
      // canvas.onmousewheel = Inputs.mouseWheel; // that work, sure // double binding with addEvent, just in case it doesn't work with a browser
      // Lol IE
      if ( window.attachEvent )
        canvas.attachEvent( "onmousewheel", Inputs.mouseWheel );
    }
    
    /****
     * removeRender@void( renderId@Id )
      remove the given render and remove events
     */
    this.removeRender = function( renderId )
    {
      if ( !_renders[ renderId ].canvas )
      {
        CONFIG.debug.log( "[INPUTS] Try to remove a renders but not found :: " + renderId, 1 );
        return;
      }
      
      _renders[ renderId ].canvas.removeEventListener( "pointerdown", Inputs.mouseDown, false );
      _renders[ renderId ].canvas.removeEventListener( "pointerup", Inputs.mouseUp, false );
      _renders[ renderId ].canvas.removeEventListener( "pointerout", Inputs.mouseUp, false );
      _renders[ renderId ].canvas.removeEventListener( "pointermove", Inputs.mouseMove, false );
      _renders[ renderId ].canvas.removeEventListener( "contextmenu", Inputs.rightClick, false );
      _renders[ renderId ].canvas.removeEventListener( "DOMMouseScroll", Inputs.mouseWheel, false );
      // _renders[ renderId ].canvas.removeEventListener( "mouseclick", Inputs.mouseClick, false );
      // _renders[ renderId ].canvas.removeEventListener( "mousedbclick", Inputs.mouseDbClick, false );
      
      delete( _renders[ renderId ] );
    }
    
    /****
     * mouseWheel@void( e@MouseEvent )
      trigger mouseWheel with good direction
     */
    this.mouseWheel = function( e )
    {
      var dir = e.wheelDelta > 0 ? 1 : -1;
      /* FIREFOX */
      if ( e.detail )
        dir = e.detail < 0 ? 1 : -1;
      
      if ( dir == 1 )
        Inputs.trigger( 'axeMoved', 'wheelTop' );
      else
        Inputs.trigger( 'axeMoved', 'wheelDown' );
    }
  };
  
  window.onbeforeunload = function( e )
  {
    if ( !window.leavePage )
      return _langs[ LangSystem.currentLang ][ "leave-page" ];
  };
  window.onunload = function( e )
  {
    Event.trigger( "unload-game" );
  }
  
  CONFIG.debug.log( "Inputs loaded", 3 );
  return Inputs;
} );