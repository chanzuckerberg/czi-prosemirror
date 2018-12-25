
const url = require('url');
const querystring = require('querystring');

const DOCS_URL_PATTER = /\/docs\/(\d+)\/([a-zA-Z_-]+)/;

class DocServer {

  constructor() {
    this.handleRequest = this.handleRequest.bind(this);
    this.requestCount = 0;
    this.startTime = Date.now();
    this.steps = [];
  }

  handleRequest(request, response) {
    this.requestCount++;

    const parsed = url.parse(request.url, true);
    const path = parsed.pathname || '';
    const method = request.method;
    let id = null;

    const matched = path.match(DOCS_URL_PATTER);
    if (matched) {
      id = parseInt(matched[1]);
    }

    const steps = [];

    const doc = {
      id,
      steps,
      version: 1,
    };

    const payload = {
      doc,
      path: path,
      method: method,
      params: parsed.query,
      server: {
        requestCount: this.requestCount,
        requestTime: Date.now(),
        startTime: this.startTime,
      },
    };

    console.log(method + '===================================================\n');

    if (method.toUpperCase() === 'POST') {
      const self = this;
      let body = '';
      request.on('data', function(chunk) {
        body += chunk.toString();
      });
      request.on('end', function() {
        payload.params = JSON.parse(querystring.parse(body).params);
        self.respond(response, payload);
      });
    } else {
      this.respond(response, payload);
    }
  }

  respond(response, payload) {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const jsonString = JSON.stringify(payload, null, 2);
    console.log(jsonString);
    console.log('\n===================================================\n');
    response.end(jsonString);
  }
};

module.exports = DocServer;