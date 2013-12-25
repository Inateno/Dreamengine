/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Screen
 this part is a little bit complicated (but really easy in fact)
 it choose depend on the screen sizes * dpi the nearest resolution
 (avalaible in config)
 
 so if you make a game with FHD graphics (and so FHD position, physics, sizes)
 but you want to launch it on mobiles (little screen) it should be very slow caused by
 FHD or HD graphics, so you create a new size config in you imagesDatas,
 make a new folder with all images resized
 (if you don't, the imageManager will did it for you but it's not optimal)
 Example: with Pongarena, we started at 1FPS on FirefoxOS mobile preview and finished at 60 only by creating
 a new size config
 
 You don't have to change anything to make it work.
 You can set a different path by setting the path (it's a prefix) or if you set "notRatio" true, 
 ImageManager will change images quality
 
 !!Warning!! If you want use custom sizes for images, be sure to use scale (scaleX, scaleY) because I have not finished the case when you set manual size on image so it'll not ratioed on draw
**/
define( [ 'DE.CONFIG', 'DE.SaveSystem', 'DE.Event' ],
function( CONFIG, SaveSystem, Event )
{
  var Screen = new function()
  {
    this.DEName = "Screen";
    
    this.screenSizes = {};
    this.conceptionSizeIndex = 0;
    this.ratioToConception = 1;
    // current config sizes index
    this.currentSizeIndex = 0;
    
    // current screen size
    this.screenSize = { "w": 0, "h": 0 };
    this.screenSizeRatio = { "w": 0, "h": 0 };
    this.dpi = 1;
    
    this.init = function( imgDatas )
    {
      if ( !imgDatas )
      {
        console.log( "%cFATAL ERROR %cyou need to pass the file containing all images datas when call DreamEngine.init", "color:red;background:black", "color: red" );
      }
      // screen sizes avalaible (in the imagesDatas config file)
      this.screenSizes = imgDatas.screenSizes || [ { "w": 1920, "h": 1080, "path": "" } ];
      
      /* game conception size index
        (if you make the game with HD graphics and sizes, the ratio will be based on this) */
      this.conceptionSizeIndex = imgDatas.conceptionSizeIndex || 0;
    }
    
    this.udpateScreenSizes = function( index )
    {
      this.dpi = 1;
      var devicePixelRatio = devicePixelRatio || 1;
      if ( devicePixelRatio )
        this.dpi = devicePixelRatio;
      
      var savedQuality = SaveSystem.get( "settings" ).quality || undefined;
      var sizes = this.screenSizes;
      this.currentSizeIndex = 0;
      this.screenSize.w = ( window.innerWidth || document.documentElement.clientWidth );
      this.screenSize.h = ( window.innerHeight || document.documentElement.clientHeight );
      this.screenSizeRatio.w = ( window.innerWidth || document.documentElement.clientWidth ) / this.dpi >> 0;
      this.screenSizeRatio.h = ( window.innerHeight || document.documentElement.clientHeight ) / this.dpi >> 0;
      
      if ( sizes[ index ] || ( !isNaN( savedQuality ) && sizes[ savedQuality ] ) )
      {
        if ( sizes[ index ] )
        {
          this.currentSizeIndex = index;
          SaveSystem.get( "settings" ).quality = index;
          SaveSystem.save( "settings", SaveSystem.get( "settings" ) );
        }
        else
          this.currentSizeIndex = savedQuality || index;
      }
      else
      {
        var nearest = 0;
        for ( var i = 0; i < sizes.length; ++i )
        {
          this.currentSizeIndex = i;
          // if current sizes is highter possible sizes value, we get it
          if ( sizes[ i ].w <= this.screenSize.w && sizes[ i ].h <= this.screenSize.h )
          {
            // get the delta on this size and previous
            if ( i > 0 )
            {
              var dw = Math.abs( sizes[ i ].w - this.screenSize.w );
              var dh = Math.abs( sizes[ i ].h - this.screenSize.h );
              
              var pdw = Math.abs( sizes[ i - 1 ].w - this.screenSize.w );
              var pdh = Math.abs( sizes[ i - 1 ].h - this.screenSize.h );
              
              // get previous if the delta is lower
              if ( pdw < dw && pdh < dh )
                this.currentSizeIndex = i - 1;
            }
            break;
          }
        }
        SaveSystem.get( "settings" ).quality = index;
        SaveSystem.save( "settings", SaveSystem.get( "settings" ) );
      }
      
      CONFIG.debug.log( "Choosen screen size index is " + this.currentSizeIndex + " - screenSize: "
                    + JSON.stringify( this.screenSize ) + " - choosedSize: "
                    + JSON.stringify( sizes[ this.currentSizeIndex ] ) + " - dpi: " + this.dpi, 2 );
      
      this.ratioToConception = sizes[ this.currentSizeIndex ].w / sizes[ this.conceptionSizeIndex ].w;
      CONFIG.debug.log( "Physical ratio is :: " + this.ratioToConception, 2 );
      
      Event.emit( "udpateScreenSizes", this.ratioToConception, sizes[ this.currentSizeIndex ] );
    }
  }
  
  CONFIG.debug.log( "Screens loaded", 3 );
  return Screen;
} );