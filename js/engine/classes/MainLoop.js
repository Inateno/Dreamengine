/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@MainLoop
**/
define( [ 'PIXI', 'DE.Time', 'DE.CONFIG', 'DE.States', 'DE.Inputs', 'DE.GamePad', 'DE.ImageManager'
        , 'DE.SystemDetection', 'DE.Screen', 'DE.Event', 'DE.AudioManager', 'DE.GameObject', 'DE.SpriteRenderer' ],
function( PIXI, Time, CONFIG, States, Inputs, GamePad, ImageManager
        , SystemDetection, Screen, Event, AudioManager, GameObject, SpriteRenderer )
{
  var MainLoop = new function()
  {
    this.DEName     = "MainLoop";
    this.launched   = false;
    
    this.renders    = new Array();
    this.scenes     = new Array();
    
    this.maxRenders = 1;
    this.loader     = null;
    
    this.additionalModules = {};
    
    this.createLoader = function()
    {
      this.loader = new GameObject( {
        renderers: [
          new PIXI.Text( "Loading..", { font: "35px Snippet", fill: "white", align: "left" } )
          ,new SpriteRenderer( { spriteName: "loader" } )
          // loader
        ]
      } );
      this.loader.renderer.y += 150;
      PIXI.loader.on( 'progress', function()
      {
        console.log( "progress load" );
        MainLoop.loader.renderer.text = ( PIXI.loader.progress / PIXI.loader._numToLoad * 100 ).toString().slice( 0, 5 ) + "%";
      } );
      PIXI.loader.on( 'complete', function()
      {
        console.log( "complete load" );
        MainLoop.loader.renderer.text = "...";
      } );
    };
    
    /****
     * loop@void
     */
    this.loop = function()
    {
      if ( !MainLoop.launched )
        return;
      requestAnimationFrame( MainLoop.loop );
      
      if ( ! MainLoop.loader )
        MainLoop.createLoader();
      
      if ( !Time.update() )
        return;
      if ( States.get( "isLoading" ) )
      {
        if ( !MainLoop.loader )
          return;
        
        MainLoop.loader.update( Time.currentTime );
        for ( var i = 0, j; j = MainLoop.renders[ i ]; i++ )
        {
          MainLoop.loader.x = j.pixiRenderer.width * 0.5;
          MainLoop.loader.y = j.pixiRenderer.height * 0.5;
          j.directRender( MainLoop.loader );
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
        for ( var i = 0, j; j = MainLoop.renders[ i ]; ++i )
        {
          j.render();
          j.update(); // call waiting input here
        }
        
        AudioManager.applyFades();
        
        while( Time.missedFrame >= 0 )
        {
          GamePad.update( Time.currentTime );
          MainLoop.customLoop( Time.currentTime );
          
          for ( var r in MainLoop.additionalModules )
            MainLoop.additionalModules[ r ].update( Time.currentTime );
          
          for ( i = 0, j; j = MainLoop.scenes[ i ]; ++i )
          {
            if ( j.enable )
              j.update();
          }
          
          for ( i = 0, j; j = MainLoop.renders[ i ]; ++i )
            j.updateGuis();
          
          Time.deltaTime = 1;
          Time.timeSinceLastFrameScaled = 0;
          Time.timeSinceLastFrame = 0;
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