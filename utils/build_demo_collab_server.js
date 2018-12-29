const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const env = require('./env');
const path = require('path');

const config = {
  entry: {
    run_demo_collab_server: path.join(__dirname, '../demo', 'server', 'runDemoCollabServer.js'),
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '../servers'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react', ['es2015', {'modules': false}]],
          plugins: ['transform-class-properties'],
        },
      },
    ],
  },
  plugins: [
    new FlowWebpackPlugin(),
    // clean the web folder
    new CleanWebpackPlugin(['servers']),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }),
    new WriteFilePlugin(),
  ],
};

webpack(
  config,
  function (err) {
    if (err) {
      throw err;
    }
  }
);
