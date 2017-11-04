define( [], function()
{
  var config = {
    DEName: "config"
    , VERSION: '2.0'  
    , DEBUG: 0
    , DEBUG_LEVEL: 0
  };
  
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