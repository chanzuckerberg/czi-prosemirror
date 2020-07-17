const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const env = require('./env');
const path = require('path');

const config = {
  mode: 'development',//production
  entry: { 
    run_image_server: path.join(__dirname, '../licit', 'server/image', 'start.js'),
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '../servers/image'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { 'targets': { 'esmodules': true } }], '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    ],
  },
  plugins: [
    // type checker 
    ... (env.NODE_ENV === 'development') ? [new FlowWebpackPlugin()] : [],
    // To take care of formidable.
    new webpack.DefinePlugin({ "global.GENTLY": false }),
    // clean the web folder
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }),
    new WriteFilePlugin(),
  ],
  // to enable debug
  devtool: 'source-map'
};

webpack(
  config,
  function (err) {
    if (err) {
      throw err;
    }
  }
);

// To take care of formidable.
module.exports = config;