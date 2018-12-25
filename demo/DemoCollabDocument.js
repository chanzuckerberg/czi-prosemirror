// @flow

import nullthrows from 'nullthrows';
import {collab, receiveTransaction, sendableSteps} from 'prosemirror-collab';
import {history} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import ReactDOM from 'react-dom';

import EditorPlugins from '../src/EditorPlugins';
import EditorSchema from '../src/EditorSchema';
import {EMPTY_DOC_JSON} from '../src/createEmptyEditorState';
import requestDocServer from './requestDocServer';

type IdStrict = number;

type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;

type Action = {
  error?: ?Object,
  id?: ?IdStrict,
  requestDone?: ?boolean;
  richTextBlob?: ?Object,
  transaction?: ?Transform,
  type: string,
  version?: ?number,
};

type SendableSteps = {
  clientID: number,
  map: Function,
  steps: Array<any>,
};

type Sendable = {
  steps?: ?SendableSteps,
};

const POLL_DELAY = 50000000;
const MAX_DOC_CONTENT_SIZE = 40000;
const HTTP_STATUS_GONE = 410;
const HTTP_STATUS_DENIED = 500;

const ACTION_TYPE = {
  DENIED: 'DENIED',
  DETATCHED: 'DETATCHED',
  LOADED: 'LOADED',
  POLL: 'POLL',
  RECOVER: 'RECOVER',
  RESTART: 'RESTART',
  SEND: 'SEND',
  START: 'START',
  TRANSACTION: 'TRANSACTION',
};

function repeat<T>(val: T, n: number): Array<T> {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(val);
  }
  return result;
}

function toVersion(val: any): number {
  const num = Number(val);
  if (typeof num !== 'number' || isNaN(num) || num < 0) {
    throw new Error(`invalid version ${val}`);
  }
  return num;
}

function toSendable(editorState: EditorState): ?Sendable {
  const steps = sendableSteps(editorState);
  if (!steps) {
    return null;
  }
  return {steps};
};

class DocumentState {
  editorState: EditorState;
  status: string;
  constructor(editorState: EditorState, status: string) {
    this.editorState = editorState;
    this.status = status;
  }
}

class DemoCollabDocument {
  _backOff: number;
  _docId: IdStrict;
  _polling: boolean;
  _ready: boolean;
  _setState: SetStateCall;
  _version: number;
  _xhr: any;

  editorState: EditorState;
  state: DocumentState;

  constructor(setState: SetStateCall, docId: IdStrict) {
    const editorState = this._createEditorState();

    this._backOff = 0;
    this._docId = docId;
    this._polling = false;
    this._setState = setState;
    this.state = new DocumentState(editorState, 'start');

    const store = this;

    // $FlowFixMe
    Object.defineProperty(store, 'editorState', {
      get() {
        return store.state.editorState;
      },
      set() {
        throw new Error('editorState is readonly');
      },
      enumerable: true,
      configurable: false,
    });

    this._start();
  }

  dispatchTransaction = (transaction: Transform): void => {
    if (!this._ready) {
      // No not let user edit the document yet.
      return;
    }
    ReactDOM.unstable_batchedUpdates(() => {
      const editorState = this.editorState.apply(transaction);
      const state = {
        editorState,
      };
      this._setState(state, () => {
        this._dispatch({type: ACTION_TYPE.TRANSACTION, transaction});
      });
    });
  };


  _dispatch(action: Action): void {
    const {
      DETATCHED, POLL, LOADED, RESTART, START, TRANSACTION, SEND, RECOVER,
    } = ACTION_TYPE;
    const {editorState, status} = this.state;
    const {
      error,
      requestDone,
      richTextBlob,
      transaction,
      type,
      version,
    } = action;

    if (type === LOADED) {
      this._ready = true;
      const vn = toVersion(version);
      const editStateNext = this._createEditorState(richTextBlob, vn);
      this._version = vn;
      this.state = new DocumentState(editStateNext, POLL);
      this._poll();
      return;
    }

    if (type === RESTART) {
      this.state = new DocumentState(null, START);
      this._start();
      return;
    }

    if (type === POLL) {
      this.state = new DocumentState(editorState, type);
      setTimeout(this._poll, POLL_DELAY);
      return;
    }

    if (type === RECOVER) {
      const ex = nullthrows(error);
      const {status} = ex;
      if (typeof status === 'number' && status <= HTTP_STATUS_DENIED) {
        console.error(ex);
        // Do not let user edit again.
        this._ready = false;
        this.state = new DocumentState(editorState, ACTION_TYPE.DENIED);
      } else {
        this.state = new DocumentState(editorState, ACTION_TYPE.RECOVER);
        this._recover(ex);
      }
    }

    if (type === TRANSACTION) {
      const tr = nullthrows(transaction);
      const editStateNext = editorState.apply(tr);
      if (editStateNext.doc.content.size > MAX_DOC_CONTENT_SIZE) {
        if (action !== DETATCHED) {
          console.error('Document too big. Detached.');
        }
        this.state = new DocumentState(editStateNext, DETATCHED);
        return;
      }

      if ((status === POLL) || requestDone) {
        const sendable = toSendable(editStateNext);
        if (sendable) {
          this.state = new DocumentState(editStateNext, SEND);
          this._send(editStateNext, sendable);
          return;
        }
      }

      if (requestDone) {
        this.state = new DocumentState(editStateNext, POLL);
        this._poll();
        return;
      }

      this.state = new DocumentState(editStateNext, status);
    }
  }

  _createEditorState(richTextBlob: ?Object, version: ?number): EditorState {
    const plugins = EditorPlugins.slice(0);
    plugins.push(collab({version: version || 0}));
    if (richTextBlob) {
      plugins.push(history({preserveItems: true}));
    }
    return EditorState.create({
      doc: EditorSchema.nodeFromJSON(richTextBlob || EMPTY_DOC_JSON),
      schema: EditorSchema,
      plugins,
    });
  }

  _start = async (): Promise<void> => {
    let data;
    try {
      const payload = {
        id: this._docId,
        version: this._version,
      };
      data = await requestDocServer('get', payload);
    } catch (ex) {
      console.error(ex);
    }

    const version = nullthrows(data && data.doc && data.doc.version);
    const richTextBlob = nullthrows(data && data.doc).rich_text_blob;
    this._backOff = 0;
    this._dispatch({
      type: ACTION_TYPE.LOADED,
      richTextBlob,
      version,
    });

  };

  _recover = async (orror: Object): Promise<void> => {
    const backOff = this._backOff ?
      Math.min(this._backOff * 2, 6e4) :
      200;
    if (backOff > 1000 && this._backOff < 1000) {
      console.error(`backoff to far ${backOff} - ${this._backOff}`);
    }
    this._backOff = backOff;
    setTimeout(() => {
      if (this.state.status === ACTION_TYPE.RECOVER) {
        this._dispatch({type: ACTION_TYPE.POLL});
      }
    }, backOff);
  };

  _poll = async (): Promise<void> => {
    if (this._polling) {
      return;
    }
    this._polling = true;
    try {
      const data = await requestDocServer('get', {
        id: this._docId,
        version: this._version,
      });
      this._polling = false;
      this._dispatch({type: ACTION_TYPE.POLL, ...data});
    } catch (ex) {
      console.error(ex);
    }
  };

  _send = async (
    editorState: EditorState,
    sendable: Sendable,
  ): Promise<void> => {


    const {steps} = sendable;
    let clientID = 0;
    let stepsJSON = [];

    if (steps) {
      clientID = steps.clientID || 0;
      stepsJSON = steps.steps.map(s => s.toJSON());
    }

    const payload = {
      action: 'send',
      clientID,
      id: this._docId,
      steps: stepsJSON,
      version: this._version,
    };

    console.log('send>>>>>>>>>>>>>>>>>>>>>>>>>>', payload);

    try {
      await requestDocServer('post', payload);
      this._backOff = 0;
    } catch (error) {
      console.error('send error', error);
      this._backOff = 0;
      if (error.status == HTTP_STATUS_GONE) {
        this._dispatch({type: ACTION_TYPE.RESTART});
      } else {
        this._dispatch({type:ACTION_TYPE.RECOVER});
      }
      return;
    }

    const tr = steps ?
      receiveTransaction(
        editorState, steps.steps,
        repeat(steps.clientID, steps.steps.length),
      ) :
      this.state.editorState.tr;

    this._dispatch({
      type: ACTION_TYPE.TRANSACTION,
      transaction: tr,
      requestDone: true,
    });
  };
}

export default DemoCollabDocument;