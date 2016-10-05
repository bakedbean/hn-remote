'use strict';

var webpack = require('webpack');
var path = require('path');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-dev-server/client?http://localhost:8080');
    sources.push('webpack/hot/only-dev-server');
    sources.push('react-hot-loader/patch');
  }

  return sources;
}

function getPlugins(plugins) {
  if (process.env.NODE_ENV !== 'production') {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(new webpack.optimize.OccurenceOrderPlugin()),
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      minimize: true,
      sourcemap: false,
      compress: {
        warnings: false
      }
    }));
    plugins.push(new webpack.optimize.AggressiveMergingPlugin());
    plugins.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }));
  }
  
  return plugins;
}

module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'eval',
  entry: getEntrySources([
    './src/index.js'
  ]),
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass']
    }]
  },
  resolve: {
    /*alias: {*/
      //'react$': path.join(__dirname, 'node_modules', 'react','dist',
        //(IS_PRODUCTION ? 'react.min.js' : 'react.js')),
      //'react-dom$': path.join(__dirname, 'node_modules', 'react-dom','dist',
        //(IS_PRODUCTION ? 'react-dom.min.js' : 'react-dom.js')),
      //'redux$': path.join(__dirname, 'node_modules', 'redux','dist',
        //(IS_PRODUCTION ? 'redux.min.js' : 'redux.js')),
      //'react-redux$': path.join(__dirname, 'node_modules', 'react-redux','dist',
        //(IS_PRODUCTION ? 'react-redux.min.js' : 'react-redux.js'))
    /*},*/
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: getPlugins([
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  ])
};
