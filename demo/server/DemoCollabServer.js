// @node-only

const DemoCollabController = require('./DemoCollabController');
const url = require('url');


class DemoCollabServer {
  constructor() {
    this.controller = new DemoCollabController();
    this.handleRequest = this.handleRequest.bind(this);
  }

  handleRequest(request, response) {
    const parsed = url.parse(request.url, true);
    const path = parsed.pathname || '';
    const method = request.method.toUpperCase();
    request.path = path;
    log({method, path});

    if (method === 'OPTIONS') {
      // For X-Domain Preflught Request
      // https://gist.github.com/nilcolor/816580
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': ';POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Credential': false,
        'Access-Control-Max-Age': 86400, // 24hrs
        'Access-Control-Allow-Headers':
          'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
      };
      response.writeHead(200, headers);
      response.end();
    } else if (method === 'POST') {
      let body = '';
      request.on('data', function(chunk) {
        body += chunk.toString();
      });
      request.on('end', function() {
        // assume data is posted as `application/json`.
        request.params = JSON.parse(body);
        log(body);
        log(request.params);
        handleServerRequest(this, request, response);
        body = null;
      }.bind(this));
    } else {
      request.params = normalizeParams(parsed.query);
      handleServerRequest(this, request, response);
    }
  }
}

function handleServerRequest(server, request, response) {
  try {
    if (!(server instanceof DemoCollabServer)) {
      throw new Error('invalid server ' + String(server));
    }
    if (!(server.controller instanceof DemoCollabController)) {
      throw new Error('invalid controller ' + String(server.controller));
    }
    if (!request.params) {
      throw new Error('invalid params ' + String(request.params));
    }

    const path = request.path;
    const params = request.params;
    let action;

    let re = /^\/docs\/\d+\/events/;
    if (re.test(path)) {
      const docId = parseInt(path.replace('/docs/', ''), 10) || -1;
      action = 'events';
      params.docId = docId;
    }
    re = /^\/docs\/\d+/;
    if (!action && re.test(path)) {
      const docId = parseInt(path.replace('/docs/', ''), 10) || -1;
      action = 'doc';
      params.docId = docId;
    }

    re = /^\/docs/;
    if (!action && re.test(path)) {
      action = 'all';
      params.docId = null;
    }

    action = request.method.toLowerCase() + '_' + String(action);
    log(action);
    const responseData = getResponseData(
      server.controller,
      action,
      params,
      request,
      response,
    );
    if (!responseData) {
      throw new Error('responseData not found for ' + action);
    }

    response.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    });
    response.end(JSON.stringify(responseData, null, 2));
  } catch (error) {
    console.log(error);
    const params  = request.params || null;
    response.writeHead(500, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    });
    const message = (error.message || 'Unknown Error') +
      '\n\nparams\n\n' + JSON.stringify(params, null, 2);
    response.end(message);
  }
}

function getResponseData(controller, action, params, request, response) {
  const method = String(action);
  const fn = controller[method];
  if (typeof fn === 'function') {
    const result = fn.call(controller, params, request, response);
    return Object.assign(result, {__action__: action});
  }
  throw new Error('method ' + method + ' is unsupported');
}

function normalizeParams(params) {
  const re = /\d+/;
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (typeof value === 'string' && re.test(value)) {
      params[key] = parseInt(value, 10);
    }
  });
  return params;
}

function log() {
  const args = Array.prototype.slice.call(arguments).map(arg => {
    return JSON.stringify(arg);
  });
  console.log('==========================================================\n');
  console.log(args.join(', '));
  console.log('----------------------------------------------------------\n');
}

module.exports = DemoCollabServer;
