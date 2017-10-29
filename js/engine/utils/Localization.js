/**
* @author Inateno / http://inateno.com / http://dreamirl.com
*/

/**
 * provide a dictionary system and make easy localisation of your game :)
 * is inited by the SystemDetection (because to get the lang should depend of the platform)
 * you can use getForce to get a value in a specific language
 * @namespace Localization
 */
define ( [ 'DE.config' ],
function( config )
{
  var Localization = new function()
  {
    this.DEName        = "Localization";
    this.currentLang   = "en";
    
    this.dictionary   = { "en": {} };
    this.avalaibleLang = new Array();
    
    /**
     * init
     * @memberOf Localization
     * @protected
     * @param {Object} dictionary - every locales put in an object
     */
    this.init = function( dictionary )
    {
      for ( var i in dictionary )
      {
        this.dictionary[ i ] = dictionary[ i ];
        this.avalaibleLang.push( i );
      }
    };
    
    /**
     * Add a dictionary to the Localization module, can complete or override existing data
     * @memberOf Localization
     * @protected
     * @param {Object} dictionary - every locales put in an object
     */
    this.addDictionary = function( dictionary )
    {
      for ( var i in dictionary )
      {
        if ( !this.dictionary[ i ] ) {
          this.dictionary[ i ] = {};
        }
        for ( var n in dictionary[ i ] )
        {
          this.dictionary[ i ][ n ] = dictionary[ i ][ n ];
        }
      }
    };
    
    /**
     * return the value for the key what in the current language, defaulted to English if not found
     * @memberOf Localization
     * @protected
     * @param {String} what - the key you want
     */
    this.get = function( what )
    {
      return this.dictionary[ this.currentLang ][ what ] ||
        ( this.dictionary[ "en" ] && this.dictionary[ "en" ][ what ] ) || null;
    };
    
    /**
     * return the value for the key what in the given language, or null
     * @memberOf Localization
     * @protected
     * @param {String} lang - target lang
     * @param {String} what - the key you want
     */
    this.forceGet = function( lang, what )
    {
      if ( this.avalaibleLang.indexOf( lang ) == -1 ) {
        return null;
      }
      return this.dictionary[ lang ][ what ] || null;
    };
    
    /**
     * Get the current lang active (or set the current lang if you pass an argument)
     * @memberOf Localization
     * @protected
     * @param {String} lang - New lang to set as active
     */
    this.getLang = function( lang )
    {
      this.currentLang = this.avalaibleLang[ 0 ];
      if ( !lang ) {
        lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || "en";
      }
      
      for ( var i in this.dictionary )
      {
        if ( lang.match( i ) )
        {
          this.currentLang = i;
          break;
        }
      }
      
      if ( !this.dictionary[ this.currentLang ] ) {
        this.dictionary[ this.currentLang ] = {};
      }
    };
  };
  
  return Localization;
} );