/**
 * @ContributorsList
 * @Inateno / http://inateno.com / http://dreamirl.com
 *
 * this is the images file sample that will be loaded by the project in the ResourcesManager module
 * it can also load .json files (for sheets and particles)
 * Please declare in the same way than this example.
 * To load image as default just set "load" to true.
 *
 * Otherwise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function
 *
 * - [ name, url, { load:Bool, totalFrame:Int, totalLine:Int, interval:Int (ms), animated:Bool, isReversed:Bool } ]
 *
 * name, and url are required
 */
define( [],
function()
{
  var images = {
    // available images sizes (engine will load the best images pool depending on the user resolution)
    resolutions: [
      { "w": 1920, "h": 1080, "path": "" }
      // ,{ "w": 1280, "h": 720, "path": "", "notRatio": true }
      // , { "w": 640, "h": 360, "path": "", "notRatio": true }
      // , { "w": 480, "h": 270, "path": "sd/" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , baseUrl: "imgs/"
    
    // usage name, real name (can contain subpath), extension, parameters
    , pools: {
      // loaded when engine is inited
      default: [
      
        [ "map", "game/map.png" ]

        ,[ "upgradePanel", "game/upgradePanel.png" ]
        ,[ "btnUpgrade", "game/btnUpgrade.png" ]
        ,[ "btnPlay", "game/btnPlay.png" ]

        ,"game/player.json"
        ,[ "playerWheels", "game/playerWheels.png", { "totalFrame": 2, "interval": 50, "animated": true } ]
        ,"game/bullets.json"
        ,[ "canonExplosion", "game/canonExplosion.png", { "totalFrame": 4, "interval": 50, "animated": true, "loop" : false } ]
        ,[ "mineExplosion", "game/mineExplosion.png", { "totalFrame": 7, "interval": 50, "animated": true, "loop" : false } ]
        ,"game/tiles.json"

        ,[ "spider", "game/spider.png", { "totalFrame": 4, "interval": 100, "animated": true } ]
        
        ,[ "target", "game/target.png" ]
        
        ,[ "bg", "env/bg.jpg"]
        
      ]
      
      // a custom pool not loaded by default, you have to load it whenever you want (you can display a custom loader or just the default loader)
      ,aCustomPool: [
        // resources
      ]
    }
  };
  
  return images;
} );