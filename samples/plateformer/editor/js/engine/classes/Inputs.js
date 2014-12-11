/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
Inputs
**/
define( [ 'DE.CONFIG', 'DE.inputsList' ],
function( CONFIG, customInputs )
{
  var Inputs = new function()
  {
    this.DEName = "Inputs";
    
    this.isListening = false;
    
    // push names here
    // .i = case sensitive
    // default is not case sensitive
    this.usedInputs = {};
    
    // @private renders, stock renders to bind inputs and call them
    var _renders = {};
    this.kbLostFocus = false;
    this.mouse = {
      'x': 0
      ,'y':0
      ,'isDown':false
    };
    this.dbInputs = {
      "MOUSE":{
        "leftClick":1
        ,"rightClick":2
        ,"wheelTop":3
        ,"wheelDown":4
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
        ,"d":68,"q":81,"z":90,"s":83,"a":65,"e":69,"r":82,"t":84,"y":89,"u":85,"i":73,"o":79,"p":80,"f":70
        ,"g":71,"h":72,"j":74,"k":75,"l":76,"m":77,"w":87,"x":88,"c":67,"v":86,"b":66,"n":78
        ,"enter":13,"return":8
      }
    };
    
    this.queue = {
      'keyDown': {}
      , 'keyUp': {}
      , 'mouseDown': {}
      , 'mouseUp': {}
    };
    
    this.on = function( type, input, callback )
    {
      if ( !this.queue[ type ][ input ] )
      {
        console.log( 'WARN:: Try to bind on a non existant input ::: ' + type + ' - ' + input );
        return 
      }
      this.queue[ type ][ input ].push( callback );
    }
    
    /***
    * @init
    * need object customInputs
    ***/
    this.init = function()
    {
      var newInputs = {};
      
      for ( var i in customInputs )
      {
        newInputs[ i ] = {};
        
        newInputs[ i ].inputs = new Array();
        for ( var n = 0, I; I = customInputs[ i ].keycodes[ n ]; n++ )
        {
          var type = ( I[ 0 ] == "K" || I[ 0 ] == "k" ) ? "KEYBOARD" : "MOUSE";
          var name = I.slice( 2, I.length );
          if ( !this.dbInputs[ type ][ name ] )
          {
            console.log( "An input couldn't be found in the database, didyou respect the caseSensitive ?:" + type + "." + name + "\n Ignoring it and continue...");
            continue;
          }
          newInputs[ i ].inputs.push( this.dbInputs[ type ][ name ] );
        }
        newInputs[ i ].interval = customInputs[ i ].interval || 0;
        newInputs[ i ].lastCall  = Date.now();
        newInputs[ i ].actions  = {};
        newInputs[ i ].isDown  = false;
        newInputs[ i ].isLongPress  = customInputs[ i ].isLongPress || false;
        newInputs[ i ].stayOn  = customInputs[ i ].stayOn || false;

        newInputs[ i ].numberCall  = 0;
        newInputs[ i ].numberPress  = 0;

        if ( newInputs[ i ].stayOn )
        {
          newInputs[ i ].lastCall = Date.now() + newInputs[ i ].interval;
        }
        
        this.queue[ 'keyDown' ][ i ] = new Array();
        this.queue[ 'keyUp' ][ i ] = new Array();
        this.queue[ 'mouseDown' ][ i ] = new Array();
        this.queue[ 'mouseUp' ][ i ] = new Array();
      }
      this.usedInputs = newInputs;
      this.toggleListeners();
    }
    
    /***
    * @public @get
    return the queried key or false
    ***/
    this.get = function( name )
    {
      if ( this.usedInputs[ name ] )
      {
        return this.usedInputs[ name ];
      }
      return false;
    }

    /***
    * @public @key
    return the key state
    ***/
    this.key = function( name )
    {
      if ( this.usedInputs[ name ] && this.usedInputs[ name ].isDown
        && ( !this.usedInputs[ name ].interval || Date.now() - this.usedInputs[ name ].lastCall >= this.usedInputs[ name ].interval )
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
    
    /***
    * @toggleListeners
    ***/
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
    
    /***
    * @private @findInput
    ***/
    this.findInput = function( code )
    {
      // parse all gamesInputs
      for ( var i in Inputs.usedInputs )
      {
        // parse each inputs
        for ( var t in Inputs.usedInputs[ i ].inputs )
        {
          var input = Inputs.usedInputs[ i ].inputs[ t ];
          
          if ( input == code )
          {
            return i;
          }
        }
      }
      return false;
    }
    
    /***
    * @keyDown
    ***/
    this.keyDown = function( event )
    {
      if ( Inputs.kbLostFocus )
        return false;
      var e = event || window.event;
      var key = e.which || e.keyCode;
      var code = e.keyCode;
      /*
      * need add an "on" keydown event handler here
      */
      var isDown = Inputs.findInput( code );
      if ( isDown !== false )
      {
        if ( !Inputs.usedInputs[ isDown ].isDown && Date.now() - Inputs.usedInputs[ isDown ].lastCall >= Inputs.usedInputs[ isDown ].interval )
        {
          // it's a long press key type ?
          if ( Inputs.usedInputs[ isDown ].isLongPress && !Inputs.usedInputs[ isDown ].stayOn )
          {
            Inputs.usedInputs[ isDown ].lastCall = Date.now();
          }
          
          /* specific on keydown event handler here */
          if ( !Inputs.usedInputs[ isDown ].isDown )
          {
            for ( var ev in Inputs.queue[ 'keyDown' ][ isDown ] )
            {
              Inputs.queue[ 'keyDown' ][ isDown ][ ev ]();
            }
          }
          Inputs.usedInputs[ isDown ].isDown = true;
        }
        Inputs.usedInputs[ isDown ].numberPress++;
        // e.preventDefault();
      }
      // return false;
    }
    /***
    * @keyUp
    ***/
    this.keyUp = function( event )
    {
      if ( Inputs.kbLostFocus )
        return false;
      var e = event || window.event;
      var key = e.which || e.keyCode;
      var code = e.keyCode;
      /*
      * need add an "on" keyup event handler here (no precise case)
      */
      var isUp = Inputs.findInput( code );
      if ( isUp !== false )
      {
        if ( Inputs.usedInputs[ isUp ].isDown )
        {
          /* "on" keyup event handler here */
          for ( var ev in Inputs.queue[ 'keyUp' ][ isUp ] )
          {
            Inputs.queue[ 'keyUp' ][ isUp ][ ev ]();
          }
        }

        if ( Inputs.usedInputs[ isUp ].stayOn )
        {
          Inputs.usedInputs[ isUp ].lastCall = Date.now();
        }

        Inputs.usedInputs[ isUp ].isDown = false;
      }
      // e.preventDefault();
      // return false;
    }
    
    /***
    * @keyPress
    useless method ?
    ***/
    this.keyPress = function( event )
    {
      var e = event || window.event;
      var key = e.which || e.keyCode;
      var code = e.keyCode;

      var isUp = Inputs.findInput( code );
      if ( isUp !== false )
      {
        if ( Inputs.usedInputs[ isUp ].isDown )
        {
          /*
          * need add an "on" keyup event handler here
          */
        }
        // Inputs.usedInputs[ isUp ].isDown = false;
      }
      
      // e.preventDefault();
      // return false;
    }
    
    /***
    * @EVENT @public @mouseDown
    */
    this.mouseDown = function( event )
    {
      if ( _renders[ event.target.id ] )
      {
        Inputs.mouse.isDown = true;
        Inputs.mouse.x = event.clientX;
        Inputs.mouse.y = event.clientY;
        _renders[ event.target.id ].oOnMouseDown( Inputs.mouse );
      }
      
      // catch general events 'on', 'mouseDown' if there is
      var isDown = Inputs.findInput( 1 );
      if ( isDown !== false )
      {
        if ( !Inputs.usedInputs[ isDown ].isDown )
        {
          /* "on" event handler here */
          for ( var ev in Inputs.queue[ 'mouseDown' ][ isDown ] )
          {
            Inputs.queue[ 'mouseDown' ][ isDown ][ ev ]();
          }
        }
        
        Inputs.usedInputs[ isDown ].isDown = true;
      }
      // event.preventDefault();
      return false;
    }
    
    /***
    * @EVENT @public @mouseUp
    */
    this.touchMouseUp = function( event )
    {
      var clientX = event.touches[0].clientX
        , clientY = event.touches[0].clientY;
      event.clientX = clientX;
      event.clientY = clientY;
      Inputs.mouseUp( event );
      event.preventDefault();
      event.stopPropagation();
    }
    this.mouseUp = function( event )
    {
      if ( _renders[ event.target.id ] )
      {
        Inputs.mouse.isDown = false;
        Inputs.mouse.x = event.clientX;
        Inputs.mouse.y = event.clientY;
        _renders[ event.target.id ].oOnMouseUp( Inputs.mouse );
      }
      
      // catch general events 'on', 'mouseUp' if there is
      var isDown = Inputs.findInput( 1 );
      if ( isDown !== false )
      {
        if ( Inputs.usedInputs[ isDown ].isDown )
        {
          /* "on" event handler here */
          for ( var ev in Inputs.queue[ 'mouseUp' ][ isDown ] )
          {
            Inputs.queue[ 'mouseUp' ][ isDown ][ ev ]();
          }
        }
        Inputs.usedInputs[ isDown ].isDown = false;
      }
      
      event.preventDefault();
      return false;
    }
    
    /***
    * @EVENT @public @mouseMove
    */
    this.touchMouseMove = function( event )
    {
      var clientX = event.touches[0].clientX
        , clientY = event.touches[0].clientY;
      event.clientX = clientX;
      event.clientY = clientY;
      Inputs.mouseMove( event );
      event.preventDefault();
      event.stopPropagation();
    }
    this.mouseMove = function( event )
    {
      if ( _renders[ event.target.id ] )
      {
        Inputs.mouse.isDown = true;
        Inputs.mouse.x = event.clientX;
        Inputs.mouse.y = event.clientY;
        _renders[ event.target.id ].oOnMouseMove( Inputs.mouse );
      }
      
      Inputs.mouse.x = event.clientX;
      Inputs.mouse.y = event.clientY;
    }
    
    /***
    *
    */
    this.mouseClick = function( event )
    {
      /*
      * need add an "on" mouseclick event handler here
      */
    }
    
    /* MOUSE DOUBLE CLICK */
    this.mouseDbClick = function(){}
    // prefer using the getMouseButton something like that
    this.rightClick = function( event )
    {
      event.preventDefault();
      event.stopPropagation();
    }

    /***
    * @addEvent
    ***/
    this.addEvent = function( event )
    {
    }
    
    /***
    * @public @addActionInput
    * @param
      @string inputName
      @int id
      @function callback
    - bind a callback on given input name
    */
    this.addActionInput = function( inputName, id, action )
    {
      if ( !this.checkInputExist( inputName ) ){ return; };
      
      if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 && this.usedInputs[ inputName ].actions[ id ] )
      {
        console.log( "Replace the action " + id + " on input " + inputName );
      }
      this.usedInputs[ inputName ].actions[ id ] = action;
    }
    /***
    * @public @removeActionInput
    * @param
      @string inputName
      @int id
    - remove a give action, on input name
    */
    this.removeActionInput = function( inputName, id )
    {
      if ( !this.checkInputExist( inputName ) ){ return };
      
      if ( !this.usedInputs[ inputName ].actions[ id ] )
      {
        throw new Error( "Try to remove a not founded action by id:: " + id );
        return;
      }
      if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
      {
        console.log( "Remove the action " + id + " on input " + inputName );
      }
      delete this.usedInputs[ inputName ].actions[ id ];
    }
    
    /***
    * @public @checkInputExist
    * @param
      @string inputName
    - check existence of given input by name
    */
    this.checkInputExist = function( inputName )
    {
      if ( !this.usedInputs[ inputName ] )
      {
        console.log( "Try to access an input not defined:: " + inputName );
        return false;
      }
      return true;
    }
    
    /***
    * @public @addRender
      @Render render
    - add render to bind events on
    */
    this.addRender = function( render )
    {
      _renders[ render.id ] = render;
      
      var canvas = render.canvas;
      if ( window.addEventListener )
      {
        canvas.addEventListener( "mousedown", Inputs.mouseDown, false );
        canvas.addEventListener( "mouseup", Inputs.mouseUp, false );
        canvas.addEventListener( "mouseclick", Inputs.mouseClick, false );
        canvas.addEventListener( "mousedbclick", Inputs.mouseDbClick, false );
        canvas.addEventListener( "mousemove", Inputs.mouseMove, false );
        canvas.addEventListener( "contextmenu", Inputs.rightClick, false );
        canvas.addEventListener( "DOMMouseScroll", Inputs.mouseWheel, false );
        canvas.addEventListener( "touchmove", Inputs.touchMouseMove );
        canvas.addEventListener( "touchend", Inputs.touchUp );
      }
      else if ( window.attachEvent )
      {
        canvas.attachEvent( "onmousedown", Inputs.mouseDown );
        canvas.attachEvent( "onmouseup", Inputs.mouseUp );
        canvas.attachEvent( "onmouseclick", Inputs.mouseClick );
        canvas.attachEvent( "onmousedbclick", Inputs.mouseDbClick );
        canvas.attachEvent( "onmousemove", Inputs.mouseMove );
        canvas.attachEvent( "oncontextmenu", Inputs.rightClick );
        canvas.attachEvent( "onmousewheel", Inputs.mouseWheel );
        canvas.detachEvent( "ontouchmove", Inputs.touchMouseMove );
        canvas.detachEvent( "ontouchend", Inputs.touchUp );
      }
    }
    
    /***
    * @public @removeRender
    * @param
      @int renderId
    - remove the given render and remove events
    */
    this.removeRender = function( renderId )
    {
      if ( !_renders[ renderId ].canvas )
      {
        console.log( "[INPUTS] Try to remove a renders but not found :: " + renderId );
        return;
      }
      
      if ( window.addEventListener )
      {
        _renders[ renderId ].canvas.removeEventListener( "mousedown", Inputs.mouseDown, false );
        _renders[ renderId ].canvas.removeEventListener( "mouseup", Inputs.mouseUp, false );
        _renders[ renderId ].canvas.removeEventListener( "mouseclick", Inputs.mouseClick, false );
        _renders[ renderId ].canvas.removeEventListener( "mousedbclick", Inputs.mouseDbClick, false );
        _renders[ renderId ].canvas.removeEventListener( "mousemove", Inputs.mouseMove, false );
        _renders[ renderId ].canvas.removeEventListener( "contextmenu", Inputs.rightClick, false );
        _renders[ renderId ].canvas.removeEventListener( "DOMMouseScroll", Inputs.mouseWheel, false );
        _renders[ renderId ].canvas.detachEvent( "touchmove", Inputs.touchMouseMove );
        _renders[ renderId ].canvas.detachEvent( "touchend", Inputs.touchUp );
      }
      else if ( window.attachEvent )
      {
        _renders[ renderId ].canvas.detachEvent( "onmousedown", Inputs.mouseDown );
        _renders[ renderId ].canvas.detachEvent( "onmouseup", Inputs.mouseUp );
        _renders[ renderId ].canvas.detachEvent( "onmouseclick", Inputs.mouseClick );
        _renders[ renderId ].canvas.detachEvent( "onmousedbclick", Inputs.mouseDbClick );
        _renders[ renderId ].canvas.detachEvent( "onmousemove", Inputs.mouseMove );
        _renders[ renderId ].canvas.detachEvent( "oncontextmenu", Inputs.rightClick );
        _renders[ renderId ].canvas.detachEvent( "onmousewheel", Inputs.mouseWheel );
        _renders[ renderId ].canvas.detachEvent( "ontouchmove", Inputs.touchMouseMove );
        _renders[ renderId ].canvas.detachEvent( "ontouchend", Inputs.touchUp );
      }
      delete( _renders[ renderId ] );
    }
  };
  
  return Inputs;
} );