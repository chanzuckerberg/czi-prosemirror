// @node-only
const assetion = require('./assertion');
const DemoDocModel = require('./DemoDocModel');
const DemoDocChangeModel = require('./DemoDocChangeModel');
const DemoDocRevisionModel = require('./DemoDocRevisionModel');

// PM Deps
const EditorSchema = require('../../dist/EditorSchema');
const {Step} = require('prosemirror-transform');

const EMPTY_DOC_JSON = {
  'type': 'doc',
  'content': [
    {
      'type': 'paragraph',
      'content': [
        {
          'type': 'text',
          'text': ' ',
        },
      ],
    },
  ],
};

class DemoCollabController {
  get_all(params) {
    return DemoDocModel.where(() => true).map(m => m.toJSON());
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
    if (eventsData.changes.length) {
      return outputEvents(docModel, eventsData);
    }

    const revModel = DemoDocRevisionModel.findOrCreate(x => {
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

    const docModel = DemoDocModel.find(docId);
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
    docModel.doc_json,
    stepsJSON,
  );
  // PM Process Ends.

  changed.stepsJSON.forEach(step => {
    DemoDocChangeModel.create({
      client_id: clientID,
      doc_id: docModel.id,
      step_json: step,
    });
  });

  docModel.update({
    doc_json: changed.docJSON,
    version: docModel.version + stepsJSON.length,
  });

  confirmVersion(docModel.id, version);

  return {
    version: docModel.version,
  };
}

function confirmVersion(docId, version) {
  const revModels = DemoDocRevisionModel.where((x) => {
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
    return step.toJSON();
  });

  return {
    docJSON: newDocJSON,
    stepsJSON: newStepsJSON,
  };
}


function getEvents(docModel, version) {
  checkVersion(docModel, version);
  const docId = docModel.id;
  const changeModels = DemoDocChangeModel.where(x => x.doc_id === docId);
  const startIndex = changeModels.length - (docModel.version - version);
  if (startIndex < 0) {
    return null;
  }
  return {
    changes: changeModels.slice(startIndex),
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
    steps: eventsData.changes.map(x => {
      const json = x.toJSON();
      const step = json.step_json;
      step.clientID = json.client_id;
      return step;
    }),
    clientIDs: eventsData.changes.map(s => s.client_id),
  };
}

function ensureDocModel(docId) {
  assetion.number(docId, 'ensuredocModel.docId');
  let model = DemoDocModel.findBy(x => x.id === docId);
  if (!model) {
    model = DemoDocModel.create({
      id: docId,
      doc_json: EMPTY_DOC_JSON,
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


module.exports = DemoCollabController;
