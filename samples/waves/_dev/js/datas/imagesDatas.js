/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* imagesList
this is the imagesList will be available in the project.
Please declare in the same way than this example.
To load image as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/
define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var datas = {
    // avalaible images sizes (engine will load optimisest images depends on user resolution)
    screenSizes: [
      { "w": 1920, "h": 1080, "path": "" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , baseUrl: "img"
    
    // usage name, real name (can contain subpath), extension, parameters
    , pools: {
      main: [
        [ "bg", "bg.jpg", { "load": true, "totalFrame": 80, "totalLine": 40, "isAnimated": false } ]
      ]
    }
  };
  CONFIG.debug.log( "imagesDatas loaded", 3 );
  return datas;
} );