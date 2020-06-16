import { createServer } from 'http';

import LicitCollabServer from './LicitCollabServer';

const PORT = process.env.PORT || '3002';
// const IP = process.env.IP || '127.0.0.1';
const server = new LicitCollabServer();

// For heroku app only, don't use IP.
createServer(server.handleRequest).listen(PORT);
// createServer(server.handleRequest).listen(PORT, IP);
// console.log('DemoCollabServer server is runnring on http://' + IP + ':' + PORT);
