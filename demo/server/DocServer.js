
const invariant = require('invariant');
const querystring = require('querystring');
const url = require('url');

class DocServer {

  constructor() {
    this.stepsCollection  = new Collection();
    this.docsCollection = new Collection();

    this.requestCount = 0;
    this.startTime = Date.now();
    this.handleRequest = this.handleRequest.bind(this);
    this.handleGet = this.handleGet.bind(this);
    this.handlePost = this.handlePost.bind(this);
    this.log = this.log.bind(this);
  }

  handleRequest(request, response) {
    this.requestCount++;

    const parsed = url.parse(request.url, true);
    const path = parsed.pathname || '';
    const method = request.method;

    const payload = {
      path: path,
      method: method,
      server: {
        requestCount: this.requestCount,
        requestTime: Date.now(),
        startTime: this.startTime,
      },
    };

    this.log('start');

    if (method.toUpperCase() === 'POST') {
      let body = '';
      request.on('data', function(chunk) {
        body += chunk.toString();
      });
      request.on('end', function() {
        const query = JSON.parse(querystring.parse(body).params);
        payload.params =  toParams(query.params);
        this.log(JSON.stringify(payload));
        this.handlePost(request, response,  payload);
        this.log('end');
        body = null;
      }.bind(this));
    } else {
      payload.params = toParams(parsed.query);
      this.log(JSON.stringify(payload));
      this.handleGet(request, response,  payload);
      this.log(method + ' end');
    }
  }

  respond(response, payload) {
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const jsonString = JSON.stringify(payload, null, 2);
    this.log(jsonString);
    response.end(jsonString);
  }

  handleGet(request, response,  payload) {
    const params = payload.params;
    const docId = params.docId;
    const version = params.version;
    invariant(typeof docId === 'number', 'invalid docId ' + docId);
    invariant(typeof version === 'number', 'invalid version ' + version);

    let docModel = this.docsCollection.findBy((model) => {
      return model.id === docId;
    });

    if (!docModel) {
      this.log('create doc model for ' + docId);
      docModel = new DocModel({});
      docModel.update({id: docId, version: version});
      this.docsCollection.insert(docModel);
    } else {
      this.log('found doc model for ' + docId);
    }

    invariant(!!docModel, 'docModel not found');
    payload.doc = docModel.toJSON();
    this.respond(response, payload);
  }

  handlePost(request, response,  payload) {
    const params = payload.params;
    const steps = params.steps;
    const rtb = params.rich_text_blob;
    const version = params.version;
    const docId = params.docId;
    const clientId = params.clientID;

    invariant(typeof clientId === 'number', 'invalid clientId ' + clientId);
    invariant(typeof docId === 'number', 'invalid docId ' + docId);
    invariant(typeof version === 'number', 'invalid version ' + version);
    invariant(rtb !== null, 'invalid rich_text_blob');
    invariant(typeof rtb === 'object', 'invalid rich_text_blob');
    invariant(Array.isArray(steps), 'invalid steps');

    const docModel = this.docsCollection.findBy((model) => {
      return model.id === docId;
    });
    invariant(!!docModel, 'docModel not found ' + docId);
    invariant(version <=  docModel.version, 'unmatched version ' + version);

    if (version === docModel.version) {
      this.log('update doc ' + docId);
      docModel.update({rich_text_blob: rtb, version: docModel.version + 1});
      payload.doc = docModel.toJSON();
      steps.forEach(step => {
        const stepModel = new StepModel({
          json: step.json,
          doc_id: docId,
          version: version,
          client_id: clientId,
        });
        stepModel.update({id: step.key});
        this.stepsCollection.insert(stepModel);
      });
    } else {
      throw new Error(['should not reach here', version, docModel.version]);
      this.log('doc is old' + docId);
      payload.doc = {
        id: docId,
        version: version,
      };
      const allSteps = this.stepsCollection.
        where((s) => s.version > version && s.version <= docModel.version).
        map(s => s.toJSON()).
        sort(sortSteps);

      if (allSteps.length === steps.length) {
        // User
      }
    }


    this.respond(response, payload);
  }

  log(msg) {
    console.log('==========================================================\n');
    console.log(msg);
    console.log('==========================================================\n');
  }
};

class Collection {
  constructor() {
    this.models = [];
  }

  findBy(predict) {
    let found = null;
    this.models.some((model) => {
      if (predict(model)) {
        found = model;
      }
    });
    return found;
  }

  where(predict) {
    return this.models.reduce((results, model) => {
      if (predict(model)) {
        results.push(model);
      }
    }, []);
  }

  insert(model) {
    const id = model.id;
    const predict = (m) => m.id === id;
    invariant(this.findBy(predict) === null, 'duplicated model ' + id);
    this.models.push(model);
  }
}

class Model {
  constructor() {
    Model._id =  Model._id || 1;
    this.created_at = Date.now();
    this.updated_at = Date.now();
    this.update = this.update.bind(this);
    this.id =  Model._id;
    Model._id++;
  }

  update(payload) {
    Object.assign(this, payload);
    this.updated_at = Date.now();
  }
}

class DocModel extends Model {
  constructor(payload) {
    super();
    this.rich_text_blob = payload.rich_text_blob;
    this.version = payload.version;
    DocModel.index++;
  }
  toJSON() {
    return {
      id: this.id,
      version: this.version,
      rich_text_blob: this.rich_text_blob,
    };
  }
}

class StepModel extends Model {
  constructor(payload) {
    super();
    StepModel.order = StepModel.order || 1;
    this.order = StepModel.order;
    this.client_id = payload.client_id;
    this.doc_id = payload.doc_id;
    this.json = payload.json;
    this.version = payload.version;
    StepModel.order++;
  }
  toJSON() {
    return {
      client_id: this.client_id,
      id: this.id,
      json: this.json,
      order: this.order,
      version: this.version,
    };
  }
}


function sortSteps(a, b) {
  if (a.order > b.order) {
    return 1;
  }
  if (a.order < b.order) {
    return  -1;
  }
  return 0;
}

function toParams(params) {
  Object.keys(params).forEach(key => {
    if (key === 'docId' || key === 'version') {
      params[key] = parseInt(params[key], 10);
    }
  });
  return params;
}

// class StepsModel {
//   constructor(payload) {
//     StepsModel.index++;
//     this.id = 'StepsModel_' + String(StepsModel.index);
//     this.steps = payload.steps;
//     this.version = payload.version;
//   }
//   toJSON() {
//     return {
//       id: this.id,
//       version: this.version,
//       steps: this.steps,
//     };
//   }
// }
// StepsModel.index = 0;

module.exports = DocServer;