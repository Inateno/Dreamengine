/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* MainLoop
**/

define( [ 'DE.Time', 'DE.CONFIG', 'DE.States' ],
function( Time, CONFIG, States )
{
  var MainLoop = new function()
  {
    this.DEName = "MainLoop";
    this.launched = false;
    
    this.renders = new Array();
    this.scenes = new Array();
    
    this.maxRenders = 1;
    /***
    * @loop
    ***/
    this.loop = function()
    {
      if ( !MainLoop.launched )
      {
        return;
      }
      requestAnimationFrame( MainLoop.loop );
      
      if ( !Time.update() ){ return; }
      
      if ( States.get( 'isReady' ) )
      {
        for ( var i = 0, j; j = MainLoop.renders[ i ]; i++ )
        {
          j.render();
          //j.update(); // call waiting input here
        }
        MainLoop.customLoop( Time.currentTime );
        
        for ( var i = 0, j; j = MainLoop.scenes[ i ]; i++ )
        {
          if ( !j.freeze && !j.sleep )
          {
            j.update();
          }
        }
      }
      else
      {
        // display loading
      }
    };
    
    /***
    * @addRender
    ***/
    this.addRender = function( render )
    {
      render.id = this.maxRenders++;
      this.renders.push( render );
    };
    
    /***
    * @addScene
    ***/
    this.addScene = function( scene )
    {
      this.scenes.push( scene );
    }
    
    /***
    * @customLoop
    need to override in customs files
    ***/
    this.customLoop = function( time ){}
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "MainLoop loaded" );
  }
  return MainLoop;
} );