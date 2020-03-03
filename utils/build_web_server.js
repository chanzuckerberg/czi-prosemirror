var WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    config = require("../webpack.config"),
    env = require("./env"),
    path = require("path"),
    formidable = require('formidable'),
    mv = require('mv'),
    uuidv4 = require('uuid/v4'),
    express = require('express');

var options = (config.chromeExtensionBoilerplate || {});
var excludeEntriesToHotReload = (options.notHotReload || []);

for (var entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] =
      [
        ("webpack-dev-server/client?http://localhost:" + env.PORT),
        "webpack/hot/dev-server"
      ].concat(config.entry[entryName]);
  }
}

config.plugins =
  [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || []);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server =
  new WebpackDevServer(compiler, {
    hot: true,
    contentBase: path.join(__dirname, "../build"),
    headers: { "Access-Control-Allow-Origin": "*" },
    // [FS-AFQ][03-MAR-2020][IRAD-884#2]    
    setup: function(app, server) {
      // Handle asset GET url.
      app.use('/assets', express.static('../images/'));
      // Handle image upload.
      app.post('/saveimage', function(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, blob) {
          var oldpath = blob.file.path;          
          var fileid = uuidv4();
          var filename = fileid + "_" + req.query['fn'];
          var newpath = '../images/' + filename;
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
