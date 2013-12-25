/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@MainLoop
**/
define( [ 'DE.Time', 'DE.CONFIG', 'DE.States', "DE.Inputs", "DE.GamePad"
        , "DE.SystemDetection", "DE.Screen", 'DE.Event' ],
function( Time, CONFIG, States, Inputs, GamePad
        , SystemDetection, Screen, Event )
{
  var MainLoop = new function()
  {
    this.DEName     = "MainLoop";
    this.launched   = false;
    
    this.renders    = new Array();
    this.scenes     = new Array();
    
    this.maxRenders = 1;
    this.loader     = null;
    
    /****
     * loop@void
     */
    this.loop = function()
    {
      if ( !MainLoop.launched )
        return;
      requestAnimationFrame( MainLoop.loop );
      
      if ( !Time.update() )
        return;
      if ( States.get( "isLoading" ) )
      {
        if ( !MainLoop.loader )
          return;
        for ( var i = 0, j; j = MainLoop.renders[ i ]; i++ )
        {
          j.ctx.translate( j.sizes.width * 0.5, j.sizes.height * 0.5 );
          MainLoop.loader.render( j.ctx, 1, 1 );
          j.ctx.translate( -j.sizes.width * 0.5, -j.sizes.height * 0.5 );
        }
        return;
      }
      else if ( SystemDetection.isOverridingMainLoop )
      {
        if ( !SystemDetection.render )
          return;
        
        SystemDetection.render.render();
        SystemDetection.scene.update( Time.currentTime );
      }
      else if ( States.get( 'isReady' ) )
      {
        for ( var i = 0, j; j = MainLoop.renders[ i ]; i++ )
        {
          j.render();
          //j.update(); // call waiting input here
        }
        
        while( Time.missedFrame >= 0 )
        {
          GamePad.update( Time.currentTime );
          MainLoop.customLoop( Time.currentTime );
         
          for ( var i = 0, j; j = MainLoop.scenes[ i ]; i++ )
          {
            if ( !j.freeze && !j.sleep )
            {
              j.update();
            }
          }
          --Time.missedFrame;
        }
      }
    };
    
    /****
     * addRender@void( render@Render )
      add a Render and simulate a changedSizeIndex
     */
    this.addRender = function( render )
    {
      render.id = this.maxRenders++;
      this.renders.push( render );
      
      if ( render.fullScreenMode == "ratioStretch" )
        render.screenChangedSizeIndex( Screen.ratioToConception, Screen.screenSizes[ Screen.currentSizeIndex ] );
    }
    
    /****
     * screenChangedSizeIndex@void
      update all Renders
     */
    this.screenChangedSizeIndex = function( ratio, sizes )
    {
      for ( var i = 0, r; r = this.renders[ i ]; ++i )
        r.screenChangedSizeIndex( ratio, sizes );
    }
    
    /****
     * addScene@void( scene@Scene )
     */
    this.addScene = function( scene )
    {
      this.scenes.push( scene );
    }
    
    /****
     * @customLoop
      need to override in customs files by passing it to the DreamEngine.init (see the doc)
     */
    this.customLoop = function( time ){}
  };
  
  CONFIG.debug.log( "MainLoop loaded", 3 );
  return MainLoop;
} );