/* custom grunt file made by Rogliano Antoine
 used to grunt the engine, not a game project (look in sample) */
module.exports = function(grunt)
{
  'use strict';
  
  var requireUglify = {
    toplevel    : true
    , ascii_only: true
    , beautify  : false
    , max_line_length: 1000
  };
  
  var requireClosure = {
    CompilerOptions   : {}
    ,CompilationLevel : 'SIMPLE_OPTIMIZATIONS'
    ,loggingLevel     : 'WARNING'
  };
  
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON('package.json') // TODO - not used yet, improve header making with grunt
    
    // test js - not did yet
    , jshint: {
      options: {
        jshintrc: 'src/.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['_dev/js/**/*.js']
      }
    }
    
    , requirejs: { // requirejs compil
      // standalone: {
      //   options: {
      //     findNestedDependencies : true
      //     , mainConfigFile       : 'js/files-engine.js'
      //     , baseUrl              : 'js/'
      //     , name                 : 'standalonev'
      //     , out                  : 'js/dist/DreamEngine-min.js'
      //     , optimize             : 'uglify'
      //     , uglify               : requireUglify
      //     , closure              : requireClosure
      //     , inlineText           : true
      //     , useStrict            : false
      //   }
      // }
      // ,
      requireVersion: {
        options: {
          findNestedDependencies : true
          , mainConfigFile       : 'js/files-engine.js'
          , baseUrl              : 'js/'
          , name                 : 'requirev'
          , out                  : 'js/dist/DreamEngine-min-require.js'
          , optimize             : 'uglify'
          , uglify               : null//requireUglify
          , closure              : null//requireClosure
          , inlineText           : true
          , useStrict            : false
        }
      }
    }
    
    , jsdoc : {
      dist : {
        src: [ 'README.md', 'js/engine/**/*.js' ],
        options: {
          destination: 'doc',
          template :  "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
          configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    }
    
    // to push the banner at the top
    , concat: {
      requireVersion: {
        src: [
          'HEADER.txt',
          'js/dist/DreamEngine-min-require.js'
        ],
        dest: 'js/dist/DreamEngine-min-require.js'
      }
      , standalone: {
        src: [
          'HEADER.txt',
          'js/dist/DreamEngine-min.js'
        ],
        dest: 'js/dist/DreamEngine-min.js'
      }
    }
    
    // when make the require version, I use an empty file to let grunt do job without errors.
    // but we have to remove this "fake" module to let yours
    , "string-replace": {
      requireVersion: {
        files: {
          "js/dist/DreamEngine-min-require.js": "js/dist/DreamEngine-min-require.js"
        }
        , options: {
          replacements: [{
            pattern: 'define("main",[],function(){}),',
            replacement: ""
          }, {
            pattern: 'define("main",[],function(',
            replacement: ""
          }, {
            pattern: '){}),',
            replacement: ""
          }, {
            pattern: ',define("requirev",function(){});',
            replacement: ";"
          }, {
            pattern: ',define("standalonev",[],function(){});',
            replacement: ";"
          }]
        }
      }
    }
  } );
  
  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-jsdoc');
  
  // Default task is the require version
  grunt.registerTask( 'default', [ 'requirejs:requireVersion', 'string-replace:requireVersion'
                     , 'concat:requireVersion', 'jsdoc' ] );
  grunt.registerTask( 'require', [ 'requirejs:requireVersion', 'string-replace:requireVersion'
                     , 'concat:requireVersion' ] );
  grunt.registerTask( 'standalone', [ 'requirejs:standalone', 'concat:standalone', 'jsdoc' ] );
  grunt.registerTask( 'doc', [ 'jsdoc' ] );
};