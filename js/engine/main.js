define( [
  'PIXI'
  , 'extendPIXI'
  , 'DE.config'
  , 'DE.about'
  , 'DE.Events'
  , 'DE.Time'
  , 'DE.MainLoop'
  
  // utils
  , 'DE.Save'
  // , 'DE.Inputs'
  // , 'DE.gamepad'
  , 'DE.Audio'
  , 'DE.Localization'
  , 'DE.Notifications'
  , 'DE.Achievements'
  
  // core classes
  , 'DE.Render'
  , 'DE.Scene'
  , 'DE.Vector2'
  , 'DE.SpriteRenderer'
  , 'DE.RectRenderer'
  , 'DE.GameObject'
  , 'DE.GameObject.update'
  , 'DE.GameObject.automatisms'
],
function(
  PIXI
  , extendPIXI
  // , NebulaOffline
)
{
  var DE = DREAM_ENGINE = {};
  DE.PIXI = PIXI;
  
  // build engine from arguments, ignoring arguments without a "DEName" readable attribute
  var args = Array.prototype.slice.call( arguments );
  for ( var i = 0, arg; arg = args[ i ]; ++i )
  {
    var name = arg.DEName;
    if ( !name && arg.prototype ) {
      name = arg.prototype.DEName;
    }
    if ( !name ) {
      continue;
    }
    DREAM_ENGINE[ name ] = arg;
    delete DREAM_ENGINE[ name ].DEName;
  }
  
  DE.VERSION = DE.config.VERSION;
  DE.CONFIG = DE.config;
  
  // enhance PIXI
  extendPIXI( DE, PIXI );
  
  /*
   * init engine with custom inputs, images data, audio data, locales
   * launch the first loader and some utils then call start on loaded
   * call this method when all your stuff is ready
   */
  DE.init = function( params )
  {
    // configuration trough a global script tag is possible
    window.ENGINE_SETTING = window.ENGINE_SETTING || {};
      
    // set the about informations
    DE.about.set( params.about );
    
    // init the Save with your custom scheme
    DE.Save.init( params.saveModel, params.saveIgnoreVersion );
    
    // init localization
    DE.Localization.init( params.dictionary || {} );
    
    // init SystemDetection (if you develop special features for a special OS release)
    DE.SystemDetection.initSystem( params.system, params.paramsSystem || {} );
    
    // set achievements with your custom list
    DE.Achievements.init( params.achievements || [] );
    
    if ( !params.ignoreNotification ) {
      DE.Notifications.init( params );
    }
    
    if ( !params.preventGamepad ) {
      DE.gamepad.init();
    }
  };
  
  DE.start = function()
  {
    DE.MainLoop.launched = true;
    DE.MainLoop.loop();
  };
  
  // pause / unpause the game
  DE.pause = function()
  {
    this.paused = true;
    this.MainLoop.launched = false;
    this.Inputs.listening = false;
  };
  DE.unPause = function()
  {
    this.paused = false;
    this.Inputs.listening  = true;
    this.MainLoop.launched = true;
    this.Time.lastCalcul   = Date.now();
    this.Time.currentTime  = Date.now();
    this.MainLoop.loop();
  };
  
  // quick event access
  DE.on = function() { this.Events.on.apply( this.Events, arguments ); };
  DE.trigger = function() { this.Events.emit.apply( this.Events, arguments ); };
  
  return DE;
} );