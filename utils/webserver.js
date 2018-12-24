const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack.config');
const env = require('./env');
const path = require('path');

const options = {};
const excludeEntriesToHotReload = (options.notHotReload || []);

for (const entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] =
      [
        'webpack-dev-server/client?http://localhost:' + env.PORT,
        'webpack/hot/dev-server'
      ].concat(config.entry[entryName]);
  }
}

config.plugins =[
  new webpack.HotModuleReplacementPlugin()].concat(config.plugins || [],
);

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  hot: true,
  contentBase: path.join(__dirname, '../build'),
  headers: { 'Access-Control-Allow-Origin': '*' },
});

server.listen(env.PORT);
