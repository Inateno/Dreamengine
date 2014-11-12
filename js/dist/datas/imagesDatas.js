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
      , { "w": 1280, "h": 720, "path": "", "notRatio": true }
      , { "w": 640, "h": 360, "path": "", "notRatio": true }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , folderName: "img"
    
    // usage name, real name (can contain subpath), extension, parameters
    , imagesList: [
    // [ "example", "example", "png", { "load": true, "totalFrame": 4, "totalLine": 2, "eachAnim": 50, "isAnimated":true, "isReversed": false } ]
      [ "ship", "ayera/ship", "png", { "load": true, "totalFrame": 10, "totalLine": 1, "eachAnim": 100, "isAnimated":false, "isReversed": false } ]
      ,[ "reactor", "ayera/reactor", "png", { "load": true, "totalFrame": 4, "totalLine": 1, "eachAnim": 40, "isAnimated":true, "isReversed": false } ]
    ]
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "ImagesDatas loaded" );
  }
  return datas;
} );