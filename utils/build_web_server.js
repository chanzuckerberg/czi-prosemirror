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
    // [FS-AFQ][03-MAR-2020][IRAD-884#2]
    // [FS] IRAD-1005 2020-07-07
    // Upgrade outdated packages. setup -> before    
    before: function(app, server) {
      // Handle asset GET url.
      app.use('/assets', express.static('../images/'));
      // Handle image upload.
      app.post('/saveimage', function(req, res) {
        const form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, blob) {
          const oldpath = blob.file.path;
          const fileid = uuidv4();
          const filename = fileid + '_' + req.query['fn'];
          const newpath = '../images/' + filename;
          mv(oldpath, newpath, function (err) {
            if (err) {
              res.json({'error': err});
            } else {
              res.json({
                id: fileid,
                width: 0,
                height: 0,
                src: '/assets/' + filename,
              });
            }
            res.end();
          });
        });
      });
    }
  });

server.listen(env.PORT);
