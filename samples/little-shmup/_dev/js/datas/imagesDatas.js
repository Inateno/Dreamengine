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
      { "w": 1000, "h": 1080, "path": "" }
      ,{ "w": 666, "h": 720, "path": "", "notRatio": true }
      ,{ "w": 333, "h": 360, "path": "", "notRatio": true }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , folderName: "img"
    
    // usage name, real name (can contain subpath), extension, parameters
    , imagesList: [
      [ "ship", "ship", "png", { "load": true, "totalFrame": 10, "eachAnim": 40
        , "isAnimated": false, "isLoop": false } ]
      ,[ "p-fire", "p-fire", "png", { "load": true, "totalFrame": 10, "eachAnim": 40
          , "isAnimated": true, "isLoop": false } ]
      ,[ "enemies", "enemies", "png", { "load": true, "totalFrame": 4, "isAnimated": false, "isLoop": false } ]
      ,[ "reactor", "reactor", "png", { "load": true, "totalFrame": 4, "eachAnim": 40
          , "isAnimated": true, "isLoop": true } ]
      ,[ "e-fire", "e-fire", "png", { "load": true, "totalFrame": 4, "eachAnim": 80
          , "isAnimated": true, "isLoop": true } ]
      ,[ "heart", "heart", "png", { "load": true, "totalFrame": 1, "isAnimated": false } ]
      ,[ "btn", "btn", "png", { "load": true, "totalFrame": 3, "isAnimated": false } ]
    ]
  };
  CONFIG.debug.log( "imagesDatas loaded", 3 );
  return datas;
} );