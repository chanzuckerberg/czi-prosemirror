const {createServer} = require('http');
const DocsServer = require('./DocsServer');

const PORT = 3002;
const server = new DocsServer();
createServer(server.handleRequest).listen(PORT, '127.0.0.1');

console.log('DocsServer server is runnring on http://127.0.0.1:' + PORT);