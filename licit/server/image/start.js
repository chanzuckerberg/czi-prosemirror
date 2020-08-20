// @flow

const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const mv = require('mv');
const uuidv4 = require('uuid').v4;

var app = express();

const PORT = process.env.PORT || 3004;

//allow OPTIONS on all resources
app.options('*', cors())
app.use(cors());

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
	    res.writeHead(500, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	    res.json({'error': err});
	  } else {
	    const host = req.headers['host'];
	    const proto = req.connection.encrypted ? 'https' : 'http';
	    const imgSrc = proto + '://' + host + '/assets/' + filename;
	    res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
	    res.write(JSON.stringify({
		  id: fileid,
		  width: 0,
		  height: 0,
		  src: imgSrc,
	    }));
	  }
	  res.end();
    });
  });
});

app.listen(PORT, () =>
  console.log('Image Server running on port ' + PORT + '!...'),
);
