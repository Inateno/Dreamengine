/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@LangSystem
 provide a dictionary system and make easy localisation of your game :)
 is inited by the SystemDetection (because to get the lang should depend of the platform)
 you can use getForce to get a value in a specific language
**/
define ( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var LangSystem = new function()
  {
    this.DEName        = "LangSystem";
    this.currentLang   = "en";
    
    this.dictionary   = {};
    this.avalaibleLang = new Array();
    
    this.init = function( dictionary )
    {
      for ( var i in dictionary )
      {
        this.dictionary[ i ] = dictionary[ i ];
        this.avalaibleLang.push( i );
      }
    }
    
    /****
     * get@String( what@String )
      return the value for the key what in the current language
     */
    this.get = function( what )
    {
      return this.dictionary[ this.currentLang ][ what ] ||
        ( this.dictionary[ "en" ] && this.dictionary[ "en" ][ what ] ) || null;
    }
    
    /****
     * forceget@String( lang@String, what@String )
      return the value for the key what in the given language
     */
    this.forceGet = function( lang, what )
    {
      if ( this.avalaibleLang.indexOf( lang ) == -1 )
        return null;
      return this.dictionary[ lang ][ what ] || null;
    }
    
    /****
     * getLang@void( [lang@String] )
      detect the browser language or set a lang if specified
     */
    this.getLang = function( lang )
    {
      this.currentLang = this.avalaibleLang[ 0 ];
      if ( !lang )
        lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || "en";
      
      for ( var i in this.dictionary )
      {
        if ( lang.match( i ) )
        {
          this.currentLang = i;
          break;
        }
      }
    }
  };
  
  CONFIG.debug.log( "LangSystem loaded", 3 );
  return LangSystem;
} );