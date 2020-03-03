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
      // {
      //   test: /\.css$/,
      //   exclude:/ui/
      // },
      // {
      //   test: /\.html$/,
      //   loader: "html-loader",
      //   exclude: /node_modules/
      // },
      // {
      //   test: /mathquill\.js$/,
      //   include: [/node-mathquill/],
      //   // Grab the MathQuill export
      //   // NOTE: window.jQuery needs to be provided through the providePlugin
      //   // unless https://github.com/webpack/imports-loader/pull/21 is merged
      //   use: ['exports-loader?MathQuill'],
      // },
    ],
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   // jQuery (for Mathquill)
    //   'window.jQuery': 'jquery',
    // }),
    new FlowWebpackPlugin(),
    // clean the web folder
    new CleanWebpackPlugin(['servers']),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }),
  //  new HtmlWebpackInlineSourcePlugin(),
    new WriteFilePlugin(),
  ],
  // to enable debug
  devtool: "source-map"
};

webpack(
  config,
  function (err) {
    if (err) {
      throw err;
    }
  }
);
