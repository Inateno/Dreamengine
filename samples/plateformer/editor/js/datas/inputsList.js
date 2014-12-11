/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* @inputsList
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
  var inputsList = {
    "left":{"keycodes":[ "K.q", "K.left" ] }
    ,"right":{"keycodes":[ "K.d", "K.right" ] }
    ,"up":{"keycodes":[ "K.z", "K.up" ] }
    ,"down":{"keycodes":[ "K.s", "K.down" ] }
    ,"fire":{"keycodes":[ "K.space" ], "interval": 10 }
    ,"wheelTop":{"keycodes":[], "interval": 100 }
    ,"wheelDown":{"keycodes":[], "interval": 100 }
  };
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "inputsList loaded" );
  }
  return inputsList;
} );