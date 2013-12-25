/**
* Author
 @Shocoben / http://schobbent.com / http://dreamirl.com

* ContributorsList
 @Shocoben
 @Inateno

***
* singleton@Gamepad
 bring Gamepad API with Chrome and Windows8
 TODO - comment it (big taff here)
**/
define( [ 'DE.CONFIG', 'DE.Event', 'DE.Notifications', 'DE.LangSystem' ]
,function( CONFIG, Event, Notifications, LangSystem )
{
	var addEvent = Event.addEventCapabilities;
	var detectBrowser = function(browser)
	{
		var detectFirefox = function()
		{
			if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent))
			{
				var ffversion=new Number(RegExp.$1) // capture x.x portion and store as a number
				return ffversion
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
		}

		var functs = {
			"firefox" : detectFirefox,
			"chrome" : detectChrome
		};
		
		return functs[browser]();
	}
	
	var gamepadAvalaible = {};
	var gamePads = new function()
	{
		this.DEName = "GamePad";
		
		var _btnsListeners = {};
		var _axesListeners = {};
		var _gamePads = {};
		this.gamePadsInfos = {};
		var lastTimeStamps = {};

		var _updateChange = function(){};
		var _updateRate = function(){};
		
		this.init = function()
		{
			// Update chrome
			if ( detectBrowser( "chrome" ) )
			{
				if ( CONFIG.notifications.gamepadEnable )
					Notifications.create( LangSystem.get( "gamepadAvalaible" ) || CONFIG.notifications.gamepadAvalaible );
				_updateChange = function(cTime)
				{
					var gamePads = navigator.webkitGetGamepads && navigator.webkitGetGamepads();
					for(var i = 0; i < gamePads.length; i++)
					{
						if ( gamePads[ i ] )
						{
							if ( !lastTimeStamps[i] || lastTimeStamps[i] != gamePads[ i ].timestamp )
							{
								lastTimeStamps[i] = gamePads[i].timestamp;
								this.handleGamePad( gamePads[i], cTime );
							}
						}
						else
						{
							this.disconnectGamePad(i);
						}
					}
				}
				
				_updateRate = function(cTime)
				{
					var gamePads = navigator.webkitGetGamepads && navigator.webkitGetGamepads();
					for(var i = 0; i < gamePads.length; i++)
					{
						var gamepad = gamePads[i];
						if (gamepad)
						{
							this.handleGamePad(gamepad, cTime);
							continue;
						}
						else
						{
							this.disconnectGamePad(i);
						}
					}
				}
				
				this.updateByChange();
			}

			// Update firefox
			else if (detectBrowser("firefox"))
			{
				// if ( CONFIG.notifications.gamepadEnable )
					// Notifications.create( LangSystem.get( "gamepadAvalaible" ) || CONFIG.notifications.gamepadAvalaible );
				/* no gamepad api working right now
				_updateChange = function()
				{
					for(var i =0; i < _gamePads.length; i++)
					{
						if (_gamePads[i])
						{
							
						}
					}
				}*/
			}
		}
		
		var bindWindowController = function(gamepadState)
		{
			
			//create array with the good index from https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html
			var axes = ["leftThumbX", "leftThumbY", "rightThumbX", "rightThumbY"];
			var buttons = ["a", "b", "y", "x", "left_shoulder", "right_shoulder", "LeftTrigger", "RightTrigger", "back", "start", "left_thumb", "right_thumb", "dpad_up", "dpad_down", "dpad_left", "dpad_right"];
			
			//bind now
			var nGamepad = {};
			nGamepad.index = gamepadState.controllerId;
			nGamepad.timestamp = gamepadState.packetNumber;
			nGamepad.buttons = [];
			nGamepad.axes = [];
			
			//buttons
			for (var i = 0; i < buttons.length; ++i)
			{
				var name = buttons[i];
				// Window8 Gamepad rightTrigger values are between 0 and 255. Chrome and firexox sticks are between 0 and 1
				if (name == "LeftTrigger" || name == "RightTrigger") 
				{
					nGamepad.buttons[i] = gamepadState[name] / 255;
					continue;
				}
				
				//gamePadState buttons are booleans. Chrome and firefox are float beetwen 0 and 1
				if (gamepadState[name])
				{
					nGamepad.buttons[i] = 1;
					continue;
				}
				nGamepad.buttons[i] = 0;
			}
			
			
			for (var i = 0; i < axes.length; ++i)
			{
				var name = axes[i];
			    // Window8lib Gamepad thumbstick values are between -32768 and 32767.
				nGamepad.axes[i] = gamepadState[name] / 32767;
				if (name == "leftThumbY" || name == "rightThumbY")
				    nGamepad.axes[i] *= -1;
			}
			
			return nGamepad;
		}
		
		this.windowsControllers = [];
		this.adaptToWindowsLib = function(windowsGamepadLib, nbrPads_)
		{
			var nbrPads = nbrPads_ || 4;
			if (!windowsGamepadLib)
			{
				console.error("gamepad::adaptToWindowsLib - windowsGamepadLib is null");
			}
			
			//initalize the windows controllers
			for (var i = 0; i < nbrPads; ++i)
			{
			    this.windowsControllers[i] = new windowsGamepadLib.Controller(i);
			}
			
			_updateChange = function(cTime)
			{
				var gamePads = this.windowsControllers;
				for(var i = 0; i < gamePads.length; i++)
				{
					var gamepad = gamePads[i];
					if (gamepad)
					{
						gamepad = gamepad.getState();
						if (gamepad.connected)
						{
							if (!lastTimeStamps[i] || lastTimeStamps[i] != gamepad.packetNumber)
							{
								lastTimeStamps[i] = gamepad.packetNumber;
								var bindedGamePad = bindWindowController(gamepad);
								this.handleGamePad(bindedGamePad, cTime);
							}
							continue;
						}
						else
						{
							this.disconnectGamePad(i);
						}
					}
				}
			}
			
			_updateRate = function(cTime)
			{
				var gamePads = this.windowsControllers;
				for(var i = 0; i < gamePads.length; i++)
				{
					var gamepad = gamePads[i];
					if (gamepad)
					{
						gamepad = gamepad.getState();
						if (gamepad.connected)
						{
							var bindedGamePad = bindWindowController(gamepad);
							this.handleGamePad(bindedGamePad, cTime);
							continue;
						}
						else
						{
							this.disconnectGamePad(i);
						}
					}
				}
			}
			this.update = _updateRate;
			this.handleDown = handleDownRate;

		}
		
		//Firefox handler
		function gamepadConnected(e) 
		{
		    _gamePads[ e.gamepad.index ] = e.gamepad;
		    _gamePads.length++;
		}

		window.addEventListener("MozGamepadConnected", gamepadConnected, false);

		//Utilities
		this.connectToGameLoop = function( gameLoop )
		{
			gameLoop.addNonStop( "gamePad", this );
		}

		this.handleGamePad = function( gamepad, cTime )
		{
			var index = gamepad.index;
			this.gamePadsInfos[ index ] = gamepad;
			if ( _btnsListeners[ index ] )
			{
				this.handleListeners( index, gamepad.buttons, _btnsListeners, cTime );
			}
			
			if ( _axesListeners[ index ] )
			{
				this.handleListeners( index, gamepad.axes, _axesListeners, cTime );
			}
			if ( !gamepadAvalaible[ index ] )
			{
				CONFIG.debug.log( "Gamepad connected " + index, 2 );
				if ( CONFIG.notifications.gamepadChange )
				{
					this.isGamepadConnected = true;
					Notifications.create( LangSystem.get( "onGamepadConnect" )
					                     || ( "Gamepad " + (index+1) + " connected" ) );
				}
				Event.emit( "connectGamepad", index );
				gamepadAvalaible[ index ] = true;
			}
		}

		this.disconnectGamePad = function(index)
		{
			lastTimeStamps[index] = null;
			_gamePads[index] = null;
			this.gamePadsInfos[index] = null;
			if ( gamepadAvalaible[ index ] )
			{
				CONFIG.debug.log( "Disconnect gamepad " + index, 2 );
				if ( CONFIG.notifications.gamepadChange )
				{
					this.isGamepadConnected = false;
					for ( var i in gamepadAvalaible )
					{
						if ( gamepadAvalaible[ i ] )
						{
							this.isGamepadConnected = true;
							break;
						}
					}
					Notifications.create( LangSystem.get( "onGamepadDisconnect" )
					                     || "Gamepad " + (index+1) + " disconnected" );
				}
				Event.emit( "disconnectGamepad", index );
				gamepadAvalaible[ index ] = false;
			}
		}

		var _sensibility = 0.5;

		var overSensibility = function(force)
		{
			if ((force < -_sensibility && force < 0) || (force > _sensibility && force > 0))
			{
				return true;
			}
			return false;
		}

		var handleDownChange = function(i, eventBus, listener, elemForce)
		{
			if (overSensibility(elemForce) && !listener.active)
			{
				eventBus.emit("down"+i, elemForce, i);
				listener.active = true;
			}
		}

		var _firstRate = 500;
		var _rate = 150;

		var handleDownRate = function(i, eventBus, listener, elemForce, cTime)
		{
			
			if (overSensibility(elemForce))
			{
				if (!listener.active)
				{
					eventBus.emit("down"+i, elemForce, i);
					listener.active = true;
					listener.timesTamp = cTime;
					listener.diffTime = _firstRate;
					return true;
				}

				if (listener.noRate)
				{
					return true;
				}
				
				if (listener.timesTamp + listener.diffTime < cTime)
				{
					eventBus.emit("down"+i, elemForce, i);
					listener.timesTamp = cTime;
					listener.diffTime = _rate;
					return true;
				}
			}
			return false;
		}
		
		
		
		var normalHandleListeners = function(index, gamePadInterface, arrayListeners, cTime)
		{
			for(var i in arrayListeners[index].listeners)
			{
				var elemForce = gamePadInterface[i];
				var eventBus = arrayListeners[index];
				var listener = arrayListeners[index].listeners[i];


				if ((elemForce < 0.3 && elemForce > 0) || (elemForce > -0.3 && elemForce < 0))
				{
					elemForce = 0;
				}
				if (elemForce != listener.force)
				{
						eventBus.emit("move"+i, elemForce, i);
				}
				listener.force = elemForce;

				if (this.handleDown(i, eventBus, listener, elemForce, cTime))
				{
					continue;
				}

				if (!overSensibility(elemForce) && listener.active)
				{
					eventBus.emit("up"+i, elemForce, i);
					listener.active = false;
					listener.count = 0;
				}
			}
		}
		
		this.handleListeners = normalHandleListeners;

		this.handleGamePadAxes = function(gamepad)
		{
			for(var i in _axesListeners[gamepad.index].listeners)
			{
				if (gamepad.axes[i] > 0 && !_axesListeners[gamepad.index].listeners[i])
				{
					_btnsListeners[gamepad.index].emit("down"+i);
					_btnsListeners[gamepad.index].listeners[i] = true;
					continue;
				}
			}
		}


		var _checkListeners = function(o, padIndex, numero)
		{
			if(!o[padIndex])
			{
				o[padIndex] = {};
				o[padIndex].listeners = {};
				addEvent(o[padIndex]);
			}
			if (typeof o[padIndex].listeners[numero]  == "undefined")
			{
				o[padIndex].listeners[numero] = {"active" : true, "force" : 0};
			}
		}

		var addListener = function(o, padIndex, numero, action, callBack, noRate)
		{
			_checkListeners(o, padIndex, numero);
			o[padIndex].on(action+numero, callBack);
			o[padIndex].listeners[numero].noRate = noRate;
		}

		var delListener = function(o, padIndex, numero, action)
		{
			if (o[padIndex])
			{
				o[padIndex].del(action+numero);
			}
		}

		var delAllOfNumero = function(o, padIndex, numero)
		{
			if (!o[padIndex])
			{
				return;
			}
			delListener(o, padIndex, numero, "down");
			delListener(o, padIndex, numero, "up");
			delListener(o, padIndex, numero, "move");
			delete o[padIndex].listeners[numero];
		}

		var delAllListenersOfIndex = function(o, padIndex)
		{
			if (!o[padIndex])
			{
				return;
			}

			for(var i in o[padIndex].listeners)
			{
				delAllOfNumero(o, padIndex, i);
			}

		}

		var delAllListeners = function(o)
		{
			if (!o)
			{
				return;
			}
			for (var i in o)
			{
				delAllListenersOfIndex(o, i);
			}
		}

		//On Btns
		this.onBtnDown = function(padIndex, numero, callBack, noRate)
		{
			addListener(_btnsListeners, padIndex, numero, "down", callBack, noRate);
		}

		this.onBtnMove = function(padIndex, numero, callBack, noRate)
		{
			addListener(_btnsListeners, padIndex, numero, "move", callBack, noRate);
		}

		this.onBtnUp = function(padIndex, numero, callBack, noRate)
		{
			addListener(_btnsListeners, padIndex, numero, "up", callBack, noRate);
		}

		//del Btns
		this.delBtnDown = function(padIndex, numero)
		{
			delListener(_btnsListeners, padIndex, numero, "down");
		}

		this.delBtnMove = function(padIndex, numero)
		{
			delListener(_btnsListeners, padIndex, numero, "move");
		}

		this.delBtnUp = function(padIndex, numero)
		{
			delListener(_btnsListeners, padIndex, numero, "up");
		}

		this.delBtn = function(padIndex, numero)
		{
			delAllOfNumero(_btnsListeners, padIndex, numero);
		}

		this.delBtnsPad = function(padIndex)
		{
			delAllListenersOfIndex(_btnsListeners, padIndex);
		}

		this.delBtnsListeners = function()
		{
			delAllListeners(_btnsListeners);
		}

		//On Axes
		this.onAxeStart = function(padIndex, numero, callBack, noRate)
		{
			addListener(_axesListeners, padIndex, numero, "down", callBack, noRate);
		}

		this.onAxeMove = function(padIndex, numero, callBack, noRate)
		{
			addListener(_axesListeners, padIndex, numero, "move", callBack, noRate);
		}

		this.onAxeStop = function(padIndex, numero, callBack, noRate)
		{
			addListener(_axesListeners, padIndex, numero, "up", callBack, noRate);
		}


		//del Btns
		this.delAxeStart = function(padIndex, numero)
		{
			delListener(_axesListeners, padIndex, numero, "down");
		}

		this.delAxeMove = function(padIndex, numero)
		{
			delListener(_axesListeners, padIndex, numero, "move");
		}

		this.delAxeStop = function(padIndex, numero)
		{
			delListener(_axesListeners, padIndex, numero, "up");
		}


		this.delAxe = function(padIndex, numero)
		{
			delAllOfNumero(_axesListeners, padIndex, numero);
		}

		this.delAxesPad = function(padIndex)
		{
			delAllListenersOfIndex(_axesListeners, padIndex);
		}

		this.delAxesListeners = function()
		{
			delAllListeners(_axesListeners);
		}

		this.delListeners = function()
		{
			delAllListeners(_axesListeners);
			delAllListeners(_btnsListeners);
		}
		
		this.plugBtnToInput = function(InputManager, inputName, padIndex, numero)
		{
			this.onBtnDown(padIndex, numero, function()
			{
					InputManager.usedInputs[ inputName ].isDown = true;
				  for ( var ev in InputManager.queue[ 'keyDown' ][ inputName ] )
          {
            InputManager.queue[ 'keyDown' ][ inputName ][ ev ]();
          }
			}, false);
			
			this.onBtnUp(padIndex, numero, function()
			{
					InputManager.usedInputs[ inputName ].isDown = false;
				  for ( var ev in InputManager.queue[ 'keyUp' ][ inputName ] )
          {
            InputManager.queue[ 'keyUp' ][ inputName ][ ev ]();
          }
			}, false);
			
			this.onBtnMove(padIndex, numero, function()
			{
				  for ( var ev in InputManager.queue[ 'btnMoved' ][ inputName ] )
          {
            InputManager.queue[ 'btnMoved' ][ inputName ][ ev ]();
          }
			}, false);
		}
		
		this.plugAxeToInput = function(InputManager, inputName, padIndex, numero)
		{
			this.onAxeStart(padIndex, numero, function()
			{
				  for ( var ev in InputManager.queue[ 'axeStart' ][ inputName ] )
          {
            InputManager.queue[ 'axeStart' ][ inputName ][ ev ]();
          }
			}, false);
			
			this.onAxeStop(padIndex, numero, function()
			{
				  for ( var ev in InputManager.queue[ 'axeStop' ][ inputName ] )
          {
            InputManager.queue[ 'axeStop' ][ inputName ][ ev ]();
          }
			}, false);
						
			this.onAxeMove(padIndex, numero, function()
			{
				  for ( var ev in InputManager.queue[ 'axeMoved' ][ inputName ] )
          {
            InputManager.queue[ 'axeMoved' ][ inputName ][ ev ]();
          }
			}, false);
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
	
  CONFIG.debug.log( "gamepad loaded", 3 );
	return gamePads;
});