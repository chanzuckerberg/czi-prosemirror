const {createServer} = require('http');
const DemoCollabServer = require('./DemoCollabServer');

const PORT = process.env.PORT || '3002';
const IP = process.env.IP || '127.0.0.1';
const server = new DemoCollabServer();
createServer(server.handleRequest).listen(PORT, IP);

console.log('DemoCollabServer server is runnring on http://' + IP + ':' + PORT);
