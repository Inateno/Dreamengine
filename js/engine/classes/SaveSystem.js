/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* authors : Antoine Rogliano @Inateno
* singleton@SaveSystem

 singleton to make save easy, you can override save method to make yours
 by default save method take your params and set them in the saveTypeDefault object (passed when init)
 then save this object in the localStorage
 the SaveSystem save under the GameName and GameVersion
 pass your saveModel when prepare the engine (through the main Engine Initialisation)

* if you want to ignore backup olds version when saving, add saveIgnoreVersion = true on Engine Initialisation
**/
define( [ 'stash', 'DE.CONFIG', 'DE.about', 'DE.Event' ],
function( stash, CONFIG, about, Event )
{
  var SaveSystem = new function()
  {
    this.DEName = "SaveSystem";
    
    this.saveModel = {};
    this.namespace = "DreamGame";
    
    this.useLocalStorage = true;
    
    /****
     * init@void
      init the save, you can ignoreVersion to get the previous one and update it
      but be sure it's compatible
     */
    this.init = function( saveModel, ignoreVersion )
    {
      saveModel = saveModel || {};
      if ( !saveModel.settings )
        saveModel.settings = {};
      
      this.namespace = about.namespace;
      
      this.version = about.version;
      if ( ignoreVersion )
        this.version = stash.get( this.namespace );
      
      this.saveModel = saveModel;
      
      // load save from storage
      for ( var i in this.saveModel )
        this.saveModel[ i ] = stash.get( this.namespace + this.version + i ) || this.saveModel[ i ];
      
      this.loadSave( this.saveModel, true );
    };
    
    this.updateSave = function()
    {
      if ( !this.useLocalStorage )
        return;
      // clean the localStorage to prevent zombie storage because upgraded version
      for ( var i in this.saveModel )
        stash.cut( this.namespace + this.version + i );
      
      // setup the last version of the game, and rewrite datas
      this.version = about.version;
      stash.set( this.namespace, this.version );
      for ( var i in this.saveModel )
        stash.set( this.namespace + this.version + i, this.saveModel[ i ] );
    };
    
    this.loadSave = function( attrs, useLocalStorage )
    {
      this.useLocalStorage = useLocalStorage;
      
      for ( var i in attrs )
      {
        if ( !this.saveModel[ i ] && this.saveModel[ i ] !== false && this.saveModel[ i ] !== 0 )
        {
          Event.trigger( "savesystem-attr-not-found", i );
          console.log( "Seems your game version is to old, we send a report", i );
        }
        this.saveModel[ i ] = attrs[ i ];
      }
      this.updateSave();
      Event.trigger( "savesystem-loaded", this.saveModel );
    };
    
    /****
     * get@Value( key@String )
      datas aren't get on the localStorage directly
     */
    this.get = function( key )
    {
      if ( !( key in this.saveModel ) )
        this.saveModel[ key ] = stash.get( this.namespace + this.version + key )
          || this.saveModel[ key ];
      return this.saveModel[ key ];
    };
    
    /****
     * save@void( key@String, value@Value )
      call this one to save given data
     */
    this.save = function( key, value )
    {
      var path = key.split( "." );
      var nkey = path[ 0 ];
      if ( !( nkey in this.saveModel ) )
      {
        CONFIG.debug.log( "%c[WARN] You save a key " + nkey + " doesn't exist in your saveModel ! add it to your saveModel but engine wont be able to get it later", 0, "color:orange" );
      }
      if ( path.length == 2 )
      {
        if ( value === undefined )
          value = this.get( nkey )[ 1 ];
        this.saveModel[ nkey ][ path[ 1 ] ] = value;
        if ( this.useLocalStorage )
          stash.set( this.namespace + this.version + nkey, this.saveModel[ nkey ] );
      }
      else if ( path.length == 1 )
      {
        if ( value === undefined )
          value = this.get( nkey );
        this.saveModel[ nkey ] = value;
        if ( this.useLocalStorage )
          stash.set( this.namespace + this.version + nkey, value );
      }
      Event.trigger( "savesystem-save", this.saveModel );
    };
    
    /****
     * saveAll@void
      called when kill the page (user leave page ?)
      TODO - bind it on the window onbeforeunload
     */
    this.saveAll = function()
    {
      if ( !this.useLocalStorage )
        return;
      for ( var i in this.saveModel )
      {
        stash.set( this.namespace + this.version + i, this.saveModel[ i ] );
      }
    };
    
    this.saveAchievements = function( userAchievements )
    {
      if ( !this.useLocalStorage )
        return;
      stash.set( this.namespace + "achievements", userAchievements );
    };
    
    this.loadAchievements = function()
    {
      return stash.get( this.namespace + "achievements" ) || {};
    };
  }
  
  CONFIG.debug.log( "SaveSystem loaded", 3 );
  return SaveSystem;
} );