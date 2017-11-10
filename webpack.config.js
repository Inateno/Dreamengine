var webpack = require( 'webpack' );
var resolve = require( './webpack.resolve' );

// only for WINDOWS build, otherwise good luck with characters
var BomPlugin = require( 'webpack-utf8-bom' );

// to create multiple process of webpack, reduce build time
var createVariants = require( 'parallel-webpack' ).createVariants;

function makeConfig( options )
{
  
  var suffix = "";
  if ( options.target !== "var" ) {
    suffix = "." + options.target;
  }
  
  var plugins = [
    new BomPlugin( true ),
    new webpack.optimize.OccurrenceOrderPlugin()
  ];
  
  if ( options.minified ) {
    plugins.push( new webpack.optimize.UglifyJsPlugin( {
      sourceMap: false,
      compress: {
        warnings: false
      }
    } ) );
    
    suffix += ".min";
  }
  
  return {
    context: __dirname + '/src', // `__dirname` is root of project and `src` is source
    entry: {
      full: './index.js',
      // engine: './index.js', // other build entry point if require
    },
    output: {
      path         : __dirname + '/dist',
      publicPath   : "/assets/",
      filename     : 'Dreamengine' + suffix + '.js',
      library      : "DREAM_ENGINE",
      libraryTarget: options.target || "var",
    },
    
    plugins: plugins,
    resolve: resolve
  };
}

var minified = [];
if ( process.env.DEV_BUILD ) {
  minified.push( false );
}
if ( process.env.FINAL_BUILD ) {
  minified.push( true );
}

module.exports = createVariants( {
  target: [ 'var', 'commonjs2', 'umd', 'amd' ],
  minified: minified
}, makeConfig );