// @flow

import url from 'url';

import LicitCollabController from './LicitCollabController';

class LicitCollabServer {
  controller: LicitCollabController;

  constructor() {
    this.controller = new LicitCollabController();
  }

  handleRequest = (request: any, response: any): void => {
    const parsed: Object = url.parse(request.url, true);
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
        request.params = JSON.parse(String(body));
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
};

function handleServerRequest(server, request, response) {
  try {
    if (!(server instanceof LicitCollabServer)) {
      throw new Error('invalid server ' + String(server));
    }
    if (!(server.controller instanceof LicitCollabController)) {
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

    if (responseData instanceof Promise) {
      responseData.
        then((data) => {
          response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
          });
          response.end(JSON.stringify(data, null, 2));
        }).
        catch(error => {
          response.writeHead(error.status || 500, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
          });
          response.end(JSON.stringify(error.message || 'Error', null, 2));
        });
      return;
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

function getResponseData(
  controller: LicitCollabController,
  action: string,
  params: Object,
  request: any,
  response: any
): ?Object {
  const method = String(action);
  // $FlowFixMe
  const fn = controller[method];
  if (typeof fn === 'function') {
    const result = fn.call(controller, params, request, response);
    return Object.assign(result, {__action__: action});
  }
  throw new Error('method ' + method + ' is unsupported');
}

function normalizeParams(params: Object) {
  const re = /\d+/;
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (typeof value === 'string' && re.test(value)) {
      params[key] = parseInt(value, 10);
    }
  });
  return params;
}

function log(...args: any): void {
  console.log('==========================================================\n');
  console.log(args.map(a => JSON.stringify(a)).join(', '));
  console.log('----------------------------------------------------------\n');
}

export default LicitCollabServer;
