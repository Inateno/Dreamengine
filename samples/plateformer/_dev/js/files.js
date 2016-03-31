/**
* THIS IS: a sample to show you how to work with require for your project and include DreamEngine (for require ofc)
*
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
- load all customs files
add your files here but DON'T call any parts of DreamEngine directly

-- problem with require.js ? give a look on api doc --> http://requirejs.org/docs/api.html#jsfiles

write here config for your files, your html have to call the DreamEngine file

   /\
  /  \    be sure to take DreamEngine-require version
 / !! \   engine call you file named "main"
/______\  check your main is in the same folder than DreamEngine-require lib

and have fun ^_^ hope you'll enjoy it !
**/
require.config( {
  paths: {
    'DREAM_ENGINE': 'DreamEngine-min-require'
    // DATAS
    , 'DE.imagesDatas'  : 'datas/imagesDatas'
    , 'DE.inputsList'   : 'datas/inputsList'
    , 'DE.audiosList'   : 'datas/audiosList'
    , 'DE.dictionary'   : 'datas/dictionary'
    , 'DE.dictionary'   : 'datas/dictionary'
    
    , 'DE.TouchControl' : 'plugins/TouchControl'
    
    ,'gameLoop'         : 'custom/gameLoop'
    ,'Game'             : 'custom/Game'
    ,'levelGenerator'   : 'custom/levelGenerator'
    ,'Character'        : 'custom/Character'
    ,'data'             : 'custom/data'
    ,'shared'           : 'custom/shared'
    
    ,'main'             : 'main'
  }
  , "urlArgs": "r=" + Date.now() // will be destroy when grunted
} );

// this will not be compiled by grunt, just for dev
require( [ 'DREAM_ENGINE' ] );