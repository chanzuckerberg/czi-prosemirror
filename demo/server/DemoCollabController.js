// @flow

import rebaseDocWithSteps from '../../src/rebaseDocWithSteps';
import DemoDocChangeModel from './DemoDocChangeModel';
import DemoDocModel from './DemoDocModel';
import DemoDocRevisionModel from './DemoDocRevisionModel';
import * as assetion from './assertion';

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
  get_all(params: Object): Array<Object> {
    return DemoDocModel.where(() => true).map(m => m.toJSON());
  }

  get_doc(params: Object): Object  {
    const docId = params.docId;
    assetion.number(docId, 'params.docId');

    const model = ensureDocModel(docId);
    return model.toJSON();
  }

  get_events(params: Object, request: any, response: any): Object {
    const docId = params.docId;
    const version = nonNegInteger(params.version || 0);
    const docModel = ensureDocModel(docId);
    const eventsData = getEvents(docModel, version);
    if (!eventsData) {
      const error: Object = new Error('History no longer available');
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

  post_events(params: Object): Object {
    const docId = params.docId;
    const steps = params.steps;
    const clientID = params.clientID;
    const version = params.version;
    assetion.present(steps, 'docId');
    assetion.array(steps, 'steps');
    assetion.present(clientID, 'clientID');
    assetion.number(nonNegInteger(version), 'version');

    const docModel = DemoDocModel.find(docId);
    return new Promise((resolve, reject) => {
      addEvents(docModel, version, steps, clientID).then(resolve).catch(reject);
    });
  }
}

// Mutations

function addEvents(
  docModel: DemoDocModel,
  version: number,
  stepsJSON: Array<Object>,
  clientID: string): Promise<Object> {
  return new Promise((resolve, reject) => {
    checkVersion(docModel, version);

    if (docModel.version !== version) {
      const error: Object = new Error(
        'Version not current. docModel.version = ' + docModel.version + ', ' +
        'params.version = ' + version
      );
      error.status = 409;
      reject(error);
      return;
    }

    // PM Process Start
    rebaseDocWithSteps(
      clientID,
      docModel.doc_json,
      stepsJSON,
    ).then(changed => {
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

      resolve({
        version: docModel.version,
      });
    }).catch(reject);
  });
}

function confirmVersion(docId: number, version: number): void {
  const revModels = DemoDocRevisionModel.where((x) => {
    return x.doc_id === docId && x.version === version;
  });
  revModels.forEach(x => {
    x.update({confirmed: true});
  });
}

function getEvents(docModel: DemoDocModel, version: number): ?Object {
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

function checkVersion(docModel: DemoDocModel, version: number): void {
  if (version < 0 || version > docModel.version) {
    const err: Object = new Error(
      'Invalid version. docModel.version = ' + docModel.version + ', ' +
      'version = ' + version
    );
    // [FS] IRAD-901 2020-05-28
    // Set conflict (409) instead of Bad request (400) so that
    // re polling for changes and then try again, 
    // if the client's document conflicts with the server's version at the client side.
    err.status = 409;
    throw err;
  }
}

function outputEvents(docModel: DemoDocModel, eventsData: Object): Object {
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

function ensureDocModel(docId: number): DemoDocModel {
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

function nonNegInteger(val: any): number {
  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num) && Math.floor(num) === num && num >= 0) {
    return num;
  }
  const err: Object = new Error('Not a non-negative integer: ' + val);
  err.status = 400;
  throw err;
}

export default DemoCollabController;
