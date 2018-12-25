const {createServer} = require('http');
const DocServer = require('./DocServer');

const PORT = 3002;
const server = new DocServer();
createServer(server.handleRequest).listen(PORT, '127.0.0.1');

console.log('DocServer server is runnring on http://127.0.0.1:' + PORT);