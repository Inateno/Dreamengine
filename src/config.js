/**
 * config contain various stuff for the engine
 * @namespace config
 */
define( [
  "DE.Events"
]
, function(
  Events
)
{
  var config = {
    DEName        : "config"
    , VERSION     : '2.0'
    , _DEBUG      : 0
    , _DEBUG_LEVEL: 0
  };
  
  Object.defineProperties( config, {
    /**
     * getter/setter for DEBUG_LEVEL, emit an event "change-debug" 
     * @memberOf config
     * @public
     */
    DEBUG: {
      get: function()
      {
        return config._DEBUG;
      }
      , set: function( bool )
      {
        Events.emit( "change-debug", bool, config._DEBUG_LEVEL );
        config._DEBUG = bool;
      }
    }
    
    /**
     * getter/setter for DEBUG_LEVEL, emit an event "change-debug" 
     * @memberOf config
     * @public
     */
    , DEBUG_LEVEL: {
      get: function()
      {
        return config._DEBUG_LEVEL;
      }
      , set: function( bool )
      {
        Events.emit( "change-debug", config._DEBUG, bool );
        config._DEBUG_LEVEL = bool;
      }
    }
  } );
  
  // zMaxDepth is the global scaling used for z. 10 by default so if you put an object to z = 10 his scale will be 0
  config.zMaxDepth = 10;
  
  config.notifications = {
    enable: true // notifications enable by default
    ,gamepadEnable    : true
    ,gamepadAvalaible : "Gamepad avalaible !"
    ,gamepadChange    : true
    ,achievementUnlockDuration: 8000
  };
  
  return config;
} );