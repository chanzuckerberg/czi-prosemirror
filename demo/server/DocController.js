// @node-only
const assetion = require('./assertion');
const createModelClass = require('./createModelClass');

// PM Deps
const EditorSchema = require('../../dist/EditorSchema');
const {Step} = require('prosemirror-transform');

const waitingsFocDoc = {};

const EMPTY_DOC_JSON = {
  'type': 'doc',
  'content': [{
    'type': 'paragraph',
    'content': [{
      'type': 'text',
      'text': ' ',
    }, ],
  }, ],
};

class Waiting {
  constructor(docId, response, finish) {

    this.response = response;
    this.docId = docId;
    this.finish = finish;
    response.setTimeout(1000 * 60 * 5, () => {
      this.abort();
      this.send({});
    });

    const waitings = waitingsFocDoc[docId] || [];
    waitings.push(this);
    waitingsFocDoc[docId] = waitings;

    console.log('docId waitings = ' + waitings.length);
  }

  abort() {
    const docId = this.docId;
    const waitings = waitingsFocDoc[docId];
    const index =  waitings ? waitings.indexOf(this) : -1;
    if (index > -1) {
      waitings.splice(index, 1);
    }
  }

  send(data) {
    if (this.done) {
      return;
    }
    this.done = true;
    const response = this.response;
    response.writeHead(200, {
      'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
    });
    response.end(JSON.stringify(data, null, 2));
  }
}

const DocModel = createModelClass({
  id: 0,
  doc: EMPTY_DOC_JSON,
  version: 0,
});

const DocStepModel = createModelClass({
  client_id: '',
  doc_id: '',
  from: 0,
  id: 0,
  slice: {},
  stepType: '',
  to: 0,
});

const DocRevisionModel = createModelClass({
  confirmed: false,
  doc_id: '',
  version: 0,
});

class DocController {
  get_all(params) {
    return DocModel.where(() => true).map(m => m.toJSON());
  }

  get_doc(params) {
    const docId = params.docId;
    assetion.number(docId, 'params.docId');

    const model = ensureDocModel(docId);
    return model.toJSON();
  }

  get_events(params, request, response) {
    const docId = params.docId;
    const version = nonNegInteger(params.version || 0);
    const docModel = ensureDocModel(docId);
    const eventsData = getEvents(docModel, version);
    if (!eventsData) {
      const error = new Error('History no longer available');
      error.status = 410;
      throw error;
    }

    // If the server version is greater than the given version,
    // return the data immediately.
    if (eventsData.steps.length) {
      return outputEvents(docModel, eventsData);
    }

    const revModel = DocRevisionModel.findOrCreate(x => {
      return x.doc_id = docId && x.version === version;
    }, () => {
      return {doc_id: docId, version: version, confirmed: false};
    });

    return revModel.toJSON();
  }

  post_events(params) {
    const docId = params.docId;
    const steps = params.steps;
    const clientID = params.clientID;
    const version = params.version;
    assetion.present(steps, 'docId');
    assetion.array(steps, 'steps');
    assetion.present(clientID, 'clientID');
    assetion.number(nonNegInteger(version), 'version');

    const docModel = DocModel.find(docId);
    const result = addEvents(docModel, version, steps, clientID);
    if (!result) {
      const error = new Error(
        'Version not current. docModel.version = ' + docModel.version + ', ' +
        'params.version = ' + params.version
      );
      error.status = 409;
      throw error;
    }
    return result;
  }
}

// Mutations

function addEvents(docModel, version, stepsJSON, clientID) {
  checkVersion(docModel, version);
  if (docModel.version !== version) {
    return null;
  }

  // PM Process Start
  const changed = applyProseMirrorSteps(
    clientID,
    docModel.id,
    docModel.doc,
    stepsJSON,
  );
  // PM Process Ends.

  changed.stepsJSON.forEach(step => {
    DocStepModel.create(step);
  });

  docModel.update({
    doc: changed.docJSON,
    version: docModel.version + stepsJSON.length,
  });

  // Node's waiting.
  sendUpdates(docModel.id, version);

  return {
    version: docModel.version,
  };
}

function sendUpdates(docId, version) {
  // TODO: It should notify all the clients who are polling that the new steps.
  // Maybe this could be done via pusher?
  // let ii = 0;
  // while (waitingsFocDoc[docId] && waitingsFocDoc[docId].length) {
  //   waitingsFocDoc[docId].pop().finish();
  //   ii++;
  // }
  // console.log('flushed ' + ii + ' waiting for ' + docId);
  const revModels = DocRevisionModel.where((x) => {
    return x.doc_id === docId && x.version === version;
  });
  revModels.forEach(x => {
    x.update({confirmed: true});
  });
}

function applyProseMirrorSteps(
  clientID,
  docID,
  docJSON,
  stepsJSON,
) {
  // console.log(EditorSchema);
  // console.log(Object.keys(EditorSchema));
  // console.log(EditorSchema.nodeFromJSON);
  const schema = EditorSchema.default;
  let docNode = schema.nodeFromJSON(docJSON);

  const steps = stepsJSON.map(step => {
    const result = Step.fromJSON(schema, step);
    result.clientID = clientID;
    return result;
  });

  steps.forEach(step => {
    const result = step.apply(docNode);
    docNode = result.doc;
  });

  const newDocJSON = docNode.toJSON();

  const newStepsJSON = steps.map(step => {
    const result = step.toJSON();
    result.clientID = clientID;
    result.docID = docID;
    result.client_id = clientID;
    result.doc_id = docID;
    return result;
  });

  return {
    docJSON: newDocJSON,
    stepsJSON: newStepsJSON,
  };
}


function getEvents(docModel, version) {
  checkVersion(docModel, version);
  const docId = docModel.id;
  const stepModels = DocStepModel.where(x => x.doc_id === docId);
  const startIndex = stepModels.length - (docModel.version - version);
  if (startIndex < 0) {
    return null;
  }
  return {
    steps: stepModels.slice(startIndex),
  };
}

function checkVersion(docModel, version) {
  if (version < 0 || version > docModel.version) {
    const err = new Error(
      'Invalid version. docModel.version = ' + docModel.version + ', ' +
      'version = ' + version
    );
    err.status = 400;
    throw err;
  }
}

function outputEvents(docModel, eventsData) {
  return {
    version: docModel.version,
    steps: eventsData.steps.map(s => s.toJSON()),
    clientIDs: eventsData.steps.map(s => s.client_id),
  };
}

function ensureDocModel(docId) {
  assetion.number(docId, 'ensureDocModel.docId');
  let model = DocModel.findBy(x => x.id === docId);
  if (!model) {
    model = DocModel.create({
      id: docId,
      doc: EMPTY_DOC_JSON,
      version: 0,
    });
  }
  return model;
}

function nonNegInteger(str) {
  const num = Number(str);
  if (!isNaN(num) && Math.floor(num) == num && num >= 0) {
    return num;
  }
  const err = new Error('Not a non-negative integer: ' + str);
  err.status = 400;
  throw err;
}


module.exports = DocController;
