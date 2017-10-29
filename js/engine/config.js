define( [], function()
{
  var config = {
    DEName: "config"
    , VERSION: '2.0'  
    , DEBUG: 0
    , DEBUG_LEVEL: 0
  };
  
  config.notifications = {
    enable: true // notifications enable by default
    ,gamepadEnable    : true
    ,gamepadAvalaible : "Gamepad avalaible !"
    ,gamepadChange    : true
    ,achievementUnlockDuration: 8000
  };
  
  return config;
} );