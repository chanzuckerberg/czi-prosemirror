const {createServer} = require('http');
const DocServer = require('./DocServer');

const PORT = 3002;
// IP = `ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2`.
const IP = '10.1.10.223'; // 127.0.0.1
const server = new DocServer();
createServer(server.handleRequest).listen(PORT, IP);

console.log('DocServer server is runnring on http://' + IP + ':' + PORT);
