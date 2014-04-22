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
define( [ 'stash', 'DE.CONFIG', 'DE.about' ],
function( stash, CONFIG, about )
{
  var SaveSystem = new function()
  {
    this.DEName = "SaveSystem";
    
    this.saveModel = {};
    this.namespace = "DreamGame";
    
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
      
      this.namespace = about.gameName;
      
      this.version = about.version;
      if ( ignoreVersion )
      {
        this.version = stash.get( this.namespace );
      }
      
      this.saveModel = saveModel;
      for ( var i in this.saveModel )
      {
        this.saveModel[ i ] = stash.get( this.namespace + this.version + i ) || this.saveModel[ i ];
        // clean the localStorage to prevent zombie storage because upgraded version
        stash.cut( this.namespace + this.version + i );
      }
      
      // setup the last version of the game, and rewrite datas
      this.version = about.version;
      stash.set( this.namespace, this.version );
      for ( var i in this.saveModel )
      {
        stash.set( this.namespace + this.version + i, this.saveModel[ i ] );
      }
    }
    
    /****
     * get@Value( key@String )
      datas aren't get on the localStorage directly
     */
    this.get = function( key )
    {
      if ( !( key in this.saveModel ) )
      {
        this.saveModel[ key ] = stash.get( this.namespace + this.version + key ) || this.saveModel[ key ];
      }
      return this.saveModel[ key ];
    }
    
    /****
     * save@void( key@String, value@Value )
      call this one to save given data
     */
    this.save = function( key, value )
    {
      if ( !( key in this.saveModel ) )
      {
        CONFIG.debug.log( "%c[WARN] You save a key doesn't exist in your saveModel ! add it to your saveModel but engine wont be able to get it later", 0, "color:orange" );
      }
      if ( !value )
        value = this.get( key );
      stash.set( this.namespace + this.version + key, value );
      this.saveModel[ key ] = value;
    }
    
    /****
     * saveAll@void
      called when kill the page (user leave page ?)
      TODO - bind it on the window onbeforeunload
     */
    this.saveAll = function()
    {
      for ( var i in this.saveModel )
      {
        stash.set( this.gameName + this.version + i, this.saveModel[ i ] );
      }
    }
  }
  
  CONFIG.debug.log( "SaveSystem loaded", 3 );
  return SaveSystem;
} );