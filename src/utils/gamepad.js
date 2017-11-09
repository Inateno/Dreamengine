/**
* Author
 @Shocoben / https://github.com/schobbent

* ContributorsList
 @Shocoben
 @Inateno
*/

/**
 * bring Gamepad API with Chrome and Windows8
 * TODO - comment and document it (big work here)
 * @namespace Inputs
 */
define( [
  'DE.config'
  , 'DE.Events'
  , 'DE.Notifications'
  , 'DE.Localization'
],
function(
  config
  , Events
  , Notifications
  , Localization
)
{
  // var addEvent = Event.addEventCapabilities;
  var detectBrowser = function( browser )
  {
    var detectFirefox = function()
    {
      if ( /Firefox[\/\s](\d+\.\d+)/.test( navigator.userAgent ) ) {
        var ffversion = new Number( RegExp.$1 ) // capture x.x portion and store as a number
        return ffversion;
      }
      return false;
    }

    var detectChrome = function()
  	{
			var nav = navigator.userAgent.toLowerCase();
			// doesn't want mobile browser
			return ( nav.indexOf( 'chrome' ) > -1
	          && nav.indexOf( 'android' ) == -1
            && nav.indexOf( 'iphone' ) == -1
            && nav.indexOf( 'ipad' ) == -1
            && nav.indexOf( 'ipod' ) == -1 );
    };

    var functs = {
      "firefox": detectFirefox
      ,"chrome": detectChrome
    };
    
    return functs[ browser ]();
  }
  
  var gamepadAvalaible = {};
  var gamepads = new function()
  {
    this.DEName = "gamepad";
    
    var _btnsListeners = {};
    var _axesListeners = {};
    var _gamepads = {};
    this.gamepadsInfos = {};
    var lastTimeStamps = {};

    var _updateChange = function(){};
    var _updateRate = function(){};
    
    this.init = function()
    {
      // Update chrome
      if ( detectBrowser( "chrome" ) || navigator.getGamepads ) {
        if ( config.notifications.gamepadEnable ) {
          Notifications.create( Localization.get( "gamepadAvalaible" ) || config.notifications.gamepadAvalaible );
        }
        
        _updateChange = function( cTime )
        {
          // [] fallback if there is not gamepads API
          var gamepads = ( navigator.getGamepads && navigator.getGamepads() )
            || ( navigator.webkitGetGamepads && navigator.webkitGetGamepads() ) || [];
          
          for ( var i = 0; i < gamepads.length; ++i )
          {
            if ( gamepads[ i ] ) {
              if ( !lastTimeStamps[ i ] || lastTimeStamps[ i ] != gamepads[ i ].timestamp ) {
                lastTimeStamps[ i ] = gamepads[ i ].timestamp;
                this.handleGamepad( gamepads[ i ], cTime );
              }
            }
            else {
              this.disconnectGamepad( i );
            }
          }
        }
        
        _updateRate = function( cTime )
        {
          var gamepads = ( navigator.getGamepads && navigator.getGamepads() )
            || ( navigator.webkitGetGamepads && navigator.webkitGetGamepads() ) || [];
          
          for ( var i = 0; i < gamepads.length; ++i )
          {
            var gamepad = gamepads[ i ];
            if ( gamepad ) {
              this.handleGamepad( gamepad, cTime );
              continue;
            }
            else {
              this.disconnectGamepad( i );
            }
          }
        }
        
        this.updateByChange();
      }

      // Update firefox - seems not working (tried Nightly)
      else if ( detectBrowser( "firefox" ) ) {
        // if ( config.notifications.gamepadEnable )
          // Notifications.create( Localization.get( "gamepadAvalaible" ) || config.notifications.gamepadAvalaible );
        /* no gamepad api working right now on Firefox
        _updateChange = function()
        {
          for ( var i =0; i < _gamepads.length; ++i )
          {
            if ( _gamepads[ i ] )
            {
              
            }
          }
        }*/
      }
    }
    
    var bindWindowController = function( gamepadState )
    {
      
      //create array with the good index from https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
      var axes = [ "leftThumbX", "leftThumbY", "rightThumbX", "rightThumbY" ];
      var buttons = [ "a", "b", "y", "x", "left_shoulder", "right_shoulder"
                    , "LeftTrigger", "RightTrigger", "back", "start", "left_thumb", "right_thumb"
                    , "dpad_up", "dpad_down", "dpad_left", "dpad_right" ];
      
      //bind now
      var nGamepad       = {};
      nGamepad.index     = gamepadState.controllerId;
      nGamepad.timestamp = gamepadState.packetNumber;
      nGamepad.buttons   = [];
      nGamepad.axes      = [];
      
      //buttons
      for ( var i = 0; i < buttons.length; ++i )
      {
        var name = buttons[ i ];
        // Window8 Gamepad rightTrigger values are between 0 and 255. Chrome and firexox sticks are between 0 and 1
        if ( name == "LeftTrigger" || name == "RightTrigger" ) {
          nGamepad.buttons[ i ] = gamepadState[ name ] / 255;
          continue;
        }
        
        //gamepadState buttons are booleans. Chrome and firefox are float beetwen 0 and 1
        if ( gamepadState[ name ] ) {
          nGamepad.buttons[ i ] = 1;
          continue;
        }
        nGamepad.buttons[ i ] = 0;
      }
      
      for ( var i = 0; i < axes.length; ++i )
      {
        var name = axes[ i ];
          // Window8lib Gamepad thumbstick values are between -32768 and 32767.
        nGamepad.axes[ i ] = gamepadState[name] / 32767;
        if ( name == "leftThumbY" || name == "rightThumbY" ) {
          nGamepad.axes[ i ] *= -1;
        }
      }
      return nGamepad;
    }
    
    this.windowsControllers = [];
    // to work with Window native API
    this.adaptToWindowsLib = function( windowsGamepadLib, nbrPads_ )
    {
      var nbrPads = nbrPads_ || 4;
      if ( !windowsGamepadLib ) {
        console.error( "gamepad::adaptToWindowsLib - windowsGamepadLib is null" );
      }
      
      //initalize the windows controllers
      for ( var i = 0; i < nbrPads; ++i )
      {
        this.windowsControllers[ i ] = new windowsGamepadLib.Controller( i );
      }
      
      _updateChange = function( cTime )
      {
        var gamepads = this.windowsControllers;
        for ( var i = 0; i < gamepads.length; ++i )
        {
          var gamepad = gamepads[ i ];
          if ( gamepad ) {
            gamepad = gamepad.getState();
            if ( gamepad.connected ) {
              if ( !lastTimeStamps[ i ] || lastTimeStamps[ i ] != gamepad.packetNumber ) {
                lastTimeStamps[ i ] = gamepad.packetNumber;
                var bindedGamepad = bindWindowController( gamepad );
                this.handleGamepad( bindedGamepad, cTime );
              }
              continue;
            }
            else {
              this.disconnectGamepad( i );
            }
          }
        }
      }
      
      _updateRate = function( cTime )
      {
        var gamepads = this.windowsControllers;
        for ( var i = 0; i < gamepads.length; ++i )
        {
          var gamepad = gamepads[ i ];
          if ( gamepad ) {
            gamepad = gamepad.getState();
            if ( gamepad.connected ) {
              var bindedGamepad = bindWindowController( gamepad );
              this.handleGamepad( bindedGamepad, cTime );
              continue;
            }
            else {
              this.disconnectGamepad( i );
            }
          }
        }
      }
      this.update     = _updateRate;
      this.handleDown = handleDownRate;
    }
    
    //Firefox handler
    function gamepadConnected( e )
    {
      Notifications.create( Localization.get( "onGamepadConnect" )
                               || ( "Gamepad " + ( e.gamepad.index + 1 ) + " connected" ) );
      _gamepads[ e.gamepad.index ] = e.gamepad;
      if ( !_gamepads.length ) {
        _gamepads.length = 0;
      }
      _gamepads.length++;
    }
    
    window.addEventListener( "MozGamepadConnected", gamepadConnected, false );
    window.addEventListener( "gamepadconnected", gamepadConnected, false );
    // window.addEventListener( "gamepaddisconnected", gamepadDisconnected, false ); // TODO
    
    //Utilities
    this.connectToGameLoop = function( gameLoop )
    {
      gameLoop.addNonStop( "gamepad", this );
    }
    
    this.handleGamepad = function( gamepad, cTime )
    {
      var index = gamepad.index;
      this.gamepadsInfos[ index ] = gamepad;
      if ( _btnsListeners[ index ] ) {
        this.handleListeners( index, gamepad.buttons, _btnsListeners, cTime );
      }
      
      if ( _axesListeners[ index ] ) {
        this.handleListeners( index, gamepad.axes, _axesListeners, cTime );
      }
      if ( !gamepadAvalaible[ index ] ) {
        console.log( "Gamepad connected " + index, 2 );
        if ( config.notifications.gamepadChange ) {
          this.isGamepadConnected = true;
          Notifications.create( Localization.get( "onGamepadConnect" )
                               || ( "Gamepad " + ( index + 1 ) + " connected" ) );
        }
        Events.emit( "connectGamepad", index );
        gamepadAvalaible[ index ] = true;
      }
    }
    
    this.disconnectGamepad = function( index )
    {
      lastTimeStamps[ index ]     = null;
      _gamepads[ index ]          = null;
      this.gamepadsInfos[ index ] = null;
      if ( gamepadAvalaible[ index ] ) {
        console.log( "Disconnect gamepad " + index, 2 );
        if ( config.notifications.gamepadChange ) {
          this.isGamepadConnected = false;
          for ( var i in gamepadAvalaible )
          {
            if ( gamepadAvalaible[ i ] ) {
              this.isGamepadConnected = true;
              break;
            }
          }
          Notifications.create( Localization.get( "onGamepadDisconnect" )
                               || "Gamepad " + ( index + 1 ) + " disconnected" );
        }
        Events.emit( "disconnectGamepad", index );
        gamepadAvalaible[ index ] = false;
        --_gamepads.length;
      }
    }
    
    this.getGamepadsLength = function()
    {
      var n = 0;
      for ( var i in gamepadAvalaible )
      {
        if ( gamepadAvalaible[ i ] ) {
          ++n;
        }
      }
      return n;
    }; 
    
    var _sensibility = 0.5;
    var overSensibility = function( force )
    {
      if ( ( force < -_sensibility && force < 0 ) || ( force > _sensibility && force > 0 ) ) {
        return true;
      }
      return false;
    }
    
    var handleDownChange = function( i, eventBus, listener, elemForce )
    {
      if ( overSensibility( elemForce ) && !listener.active ) {
        eventBus.emit( "down" + i, elemForce, i );
        listener.active = true;
      }
    }
    
    var _firstRate = 500;
    var _rate = 150;
    
    var handleDownRate = function( i, eventBus, listener, elemForce, cTime )
    {
      if ( overSensibility( elemForce ) ) {
        if ( !listener.active ) {
          eventBus.emit( "down"+i, elemForce, i );
          listener.active    = true;
          listener.timesTamp = cTime;
          listener.diffTime  = _firstRate;
          return true;
        }

        if ( listener.noRate ) {
          return true;
        }
        
        if ( listener.timesTamp + listener.diffTime < cTime ) {
          eventBus.emit( "down" + i, elemForce, i );
          listener.timesTamp = cTime;
          listener.diffTime  = _rate;
          return true;
        }
      }
      return false;
    }
    
    var normalHandleListeners = function( index, gamepadInterface, arrayListeners, cTime )
    {
      for ( var i in arrayListeners[ index ].listeners )
      {
        var elemForce = elemForce = gamepadInterface[ i ].value !== undefined ? gamepadInterface[ i ].value : gamepadInterface[ i ];
        var eventBus = arrayListeners[ index ];
        var listener = arrayListeners[ index ].listeners[ i ];
        
        if ( ( elemForce < 0.3 && elemForce > 0 ) || ( elemForce > -0.3 && elemForce < 0 ) ) {
          elemForce = 0;
        }
        if ( elemForce != listener.force ) {
          eventBus.emit( "move"+i, elemForce, i );
        }
        listener.force = elemForce;
        
        if ( this.handleDown( i, eventBus, listener, elemForce, cTime ) ) {
          continue;
        }
        
        if ( !overSensibility( elemForce ) && listener.active ) {
          eventBus.emit( "up" + i, elemForce, i );
          listener.active = false;
          listener.count  = 0;
        }
      }
    }
    
    this.handleListeners = normalHandleListeners;
    
    this.handleGamepadAxes = function( gamepad )
    {
      for ( var i in _axesListeners[ gamepad.index ].listeners )
      {
        if ( gamepad.axes[ i ] > 0 && !_axesListeners[ gamepad.index ].listeners[ i ] ) {
          _btnsListeners[ gamepad.index ].trigger( "down" + i );
          _btnsListeners[ gamepad.index ].listeners[ i ] = true;
          continue;
        }
      }
    }
    
    var _checkListeners = function( o, padIndex, num )
    {
      if ( !o[ padIndex ] ) {
        o[ padIndex ] = new Events.Emitter();
        o[ padIndex ].listeners = {};
        // addEvent( o[ padIndex ] );
      }
      
      if ( typeof o[ padIndex ].listeners[ num ]  == "undefined" ) {
        o[ padIndex ].listeners[ num ] = { "active" : true, "force" : 0 };
      }
    }
    
    var addListener = function( o, padIndex, num, action, callBack, noRate )
    {
      _checkListeners( o, padIndex, num );
      o[ padIndex ].on( action + num, callBack );
      o[ padIndex ].listeners[ num ].noRate = noRate;
    }
    
    var delListener = function( o, padIndex, num, action )
    {
      if ( o[ padIndex ] ) {
        o[ padIndex ].del( action + num );
      }
    }
    
    var delAllOfnum = function( o, padIndex, num )
    {
      if ( !o[ padIndex ] ) {
        return;
      }
      
      delListener( o, padIndex, num, "down" );
      delListener( o, padIndex, num, "up" );
      delListener( o, padIndex, num, "move" );
      delete o[ padIndex ].listeners[ num ];
    }
    
    var delAllListenersOfIndex = function( o, padIndex )
    {
      if ( !o[ padIndex ] ) {
        return;
      }

      for ( var i in o[ padIndex ].listeners )
      {
        delAllOfnum( o, padIndex, i );
      }
    }
    
    var delAllListeners = function( o )
    {
      if ( !o ) {
        return;
      }
      
      for ( var i in o )
      {
        delAllListenersOfIndex( o, i );
      }
    }
    
    //On Btns
    this.onBtnDown = function( padIndex, num, callBack, noRate )
    {
      addListener( _btnsListeners, padIndex, num, "down", callBack, noRate );
    }
    
    this.onBtnMove = function( padIndex, num, callBack, noRate )
    {
      addListener( _btnsListeners, padIndex, num, "move", callBack, noRate );
    }
    
    this.onBtnUp = function( padIndex, num, callBack, noRate )
    {
      addListener( _btnsListeners, padIndex, num, "up", callBack, noRate );
    }
    
    //del Btns
    this.delBtnDown = function( padIndex, num )
    {
      delListener( _btnsListeners, padIndex, num, "down" );
    }
    
    this.delBtnMove = function( padIndex, num )
    {
      delListener( _btnsListeners, padIndex, num, "move" );
    }
    
    this.delBtnUp = function( padIndex, num )
    {
      delListener( _btnsListeners, padIndex, num, "up" );
    }
    
    this.delBtn = function( padIndex, num )
    {
      delAllOfnum( _btnsListeners, padIndex, num );
    }
    
    this.delBtnsPad = function( padIndex )
    {
      delAllListenersOfIndex( _btnsListeners, padIndex );
    }
    
    this.delBtnsListeners = function()
    {
      delAllListeners( _btnsListeners );
    }
    
    //On Axes
    this.onAxeStart = function( padIndex, num, callBack, noRate )
    {
      addListener( _axesListeners, padIndex, num, "down", callBack, noRate );
    }
    
    this.onAxeMove = function( padIndex, num, callBack, noRate )
    {
      addListener( _axesListeners, padIndex, num, "move", callBack, noRate );
    }
    
    this.onAxeStop = function( padIndex, num, callBack, noRate )
    {
      addListener( _axesListeners, padIndex, num, "up", callBack, noRate );
    }
    
    //del Btns
    this.delAxeStart = function( padIndex, num )
    {
      delListener( _axesListeners, padIndex, num, "down" );
    }
    
    this.delAxeMove = function( padIndex, num )
    {
      delListener( _axesListeners, padIndex, num, "move" );
    }
    
    this.delAxeStop = function( padIndex, num )
    {
      delListener( _axesListeners, padIndex, num, "up" );
    }
    
    this.delAxe = function( padIndex, num )
    {
      delAllOfnum( _axesListeners, padIndex, num );
    }
    
    this.delAxesPad = function( padIndex )
    {
      delAllListenersOfIndex( _axesListeners, padIndex );
    }
    
    this.delAxesListeners = function()
    {
      delAllListeners( _axesListeners );
    }
    
    this.delListeners = function()
    {
      delAllListeners( _axesListeners );
      delAllListeners( _btnsListeners );
    }
    
    this.plugBtnToInput = function( Inputs, inputName, padIndex, num )
    {
      this.onBtnDown( padIndex, num, function( force )
      {
        Inputs.usedInputs[ inputName ].isDown = true;
        Inputs.trigger( 'keyDown', inputName, force );
      }, false );
      
      this.onBtnUp( padIndex, num, function( force )
      {
        Inputs.usedInputs[ inputName ].isDown = false;
        Inputs.trigger( 'keyUp', inputName, force );
      }, false );
      
      this.onBtnMove( padIndex, num, function( force )
      {
        Inputs.trigger( 'btnMoved', inputName, force );
      }, false );
    }
    
    this.plugAxeToInput = function( Inputs, inputName, padIndex, num )
    {
      this.onAxeStart( padIndex, num, function( force )
      {
        Inputs.trigger( 'axeStart', inputName, force );
      }, false );
      
      this.onAxeStop( padIndex, num, function( force )
      {
        Inputs.trigger( 'axeStop', inputName, force );
      }, false );
            
      this.onAxeMove( padIndex, num, function( force )
      {
        Inputs.trigger( 'axeMoved', inputName, force );
      }, false );
    }
    
    //Updates changes
    this.updateByRate = function() //Update every rate, which allow you to use on...Down to move something
    {
      this.update = _updateRate;
      this.handleDown = handleDownRate;
    }
    
    this.updateByChange = function() //Update at every change
    {
      this.update = _updateChange;
      this.handleDown = handleDownChange;
    }
    this.update = function(){}
  }
  
  return gamepads;
} );