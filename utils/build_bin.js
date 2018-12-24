const webpack = require('webpack');
const config = require('../webpack.config');

webpack(
  config,
  function (err) { if (err) throw err; }
);
