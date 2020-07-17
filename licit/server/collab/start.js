// @flow

import {createServer} from 'http';
import handleCollabRequest from './server';

const PORT = process.env.PORT || 3002;

// The collaborative editing document server.
createServer((req, resp) => {
  handleCollabRequest(req, resp)
}).listen(PORT);

console.log('Licit Collab server listening on ' + PORT);
