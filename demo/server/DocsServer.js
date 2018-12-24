
const {parse} = require('url');

const DOCS_URL_PATTER = /\/docs\/(\d+)\/([a-zA-Z_-]+)/;

class DocsServer {
  constructor() {
    this.handleRequest = this.handleRequest.bind(this);
    this.requestCount = 0;
    this.startTime = Date.now();
  }

  handleRequest(request, response) {
    this.requestCount++;

    const parsed = parse(request.url, true);
    const path = parsed.pathname || '';
    const method = request.method;
    const params = parsed.query;
    let docID = null;
    let docAcion = null;

    const matched = path.match(DOCS_URL_PATTER);
    if (matched) {
      docID = parseInt(matched[1]);
      docAcion = matched[2];
    }

    const payload = {
      path: path,
      method: method,
      params: params,
      docID: docID,
      docAcion: docAcion,
      server: {
        requestCount: this.requestCount,
        requestTime: Date.now(),
        startTime: this.startTime,
      },
    };
    this.respond(response, payload);
  }

  respond(response, payload) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(payload, null, 2));
  }
};

module.exports = DocsServer;