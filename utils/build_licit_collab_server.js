const webpack = require('webpack');
// [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FlowWebpackPlugin = require('flow-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const env = require('./env');
const path = require('path');

const config = {
  mode: 'production',//development
  entry: {// [FS] IRAD-901 2020-07-15 New collab server reusing base PM collab server  
    run_licit_collab_server: path.join(__dirname, '../licit', 'server/collab', 'start.js'),
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '../servers/collab'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', { 'targets': { 'esmodules': true } }], '@babel/preset-react', '@babel/preset-flow'],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-default-from',
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: true,
                regenerator: true,
              },
            ],
            'flow-react-proptypes',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-syntax-dynamic-import',
          ],
        },
      },
    ],
  },
  plugins: [
    // type checker
    ... (env.NODE_ENV === 'development') ? [new FlowWebpackPlugin()] : [],
    // [FS] 2020-07-13
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
  //devtool: 'source-map'
};

webpack(
  config,
  function (err) {
    if (err) {
      throw err;
    }
  }
);

// [FS] 2020-07-13
// To take care of formidable.
module.exports = config;