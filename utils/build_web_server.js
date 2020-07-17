const WebpackDevServer = require('webpack-dev-server'),
    webpack = require('webpack'),
    config = require('../webpack.config'),
    env = require('./env'),
    path = require('path'),
    formidable = require('formidable'),
    mv = require('mv'),
    // [FS] IRAD-1005 2020-07-07
    // Upgrade outdated packages.
    uuidv4 = require('uuid').v4,
    express = require('express');

const options = (config.chromeExtensionBoilerplate || {});
const excludeEntriesToHotReload = (options.notHotReload || []);

for (const entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] =
      [
        ('webpack-dev-server/client?http://localhost:' + env.PORT),
        'webpack/hot/dev-server'
      ].concat(config.entry[entryName]);
  }
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

delete config.chromeExtensionBoilerplate;

const compiler = webpack(config);

const server =
  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, '../bin'),
    headers: { 'Access-Control-Allow-Origin': '*' },     
  });

server.listen(env.PORT);
