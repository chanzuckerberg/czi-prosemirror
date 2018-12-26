// @flow

import nullthrows from 'nullthrows';
import {receiveTransaction, sendableSteps} from 'prosemirror-collab';
import {EditorState} from 'prosemirror-state';
import {Step, Transform} from 'prosemirror-transform';
import ReactDOM from 'react-dom';

import convertToJSON from '../src/convertToJSON';
import uuid from '../src/ui/uuid';
import createDemoColllabEditorState from './createDemoCollabEditorState';
import requestDocServer from './requestDocServer';

type IdStrict = number;

type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;

class DemoCollabConnector {
  _docId: IdStrict;
  _userId: IdStrict;
  _editorState: EditorState;
  _setState: SetStateCall;
  _version: number;

  constructor(
    editorState: EditorState,
    setState: SetStateCall,
    config: {
      docId: IdStrict,
      userId: IdStrict,
      version: number,
    },
  ) {
    const {docId, userId, version} = config;
    this._editorState = editorState;
    this._setState = setState;
    this._docId = docId;
    this._userId = userId;
    this._version = version;
  }

  onEdit = (transaction: Transform): void => {
    ReactDOM.unstable_batchedUpdates(() => {
      const editorState = this._editorState.apply(transaction);
      const state = {
        editorState,
      };
      this._setState(state, () => {
        this._editorState = editorState;
        this._didEdit();
      });
    });
  };

  _didEdit = (): void => {
    const editorState = this._editorState;
    const editSteps = sendableSteps(editorState);
    console.log('editSteps', editSteps);
    if (!editSteps) {
      return;
    }

    const payload = {
      docId: this._docId,
      editorState: convertToJSON(editorState),
      steps: editSteps.steps.map(this._convertStepToJSON),
      userId: this._userId,
      version: this._version,
    };

    this._push(payload);
  };

  _convertStepToJSON = (step: Step): Object => {
    if (!step.hasOwnProperty('__key')) {
      step.__key = `${this._docId}_${step.jsonID}_${this._userId}_${uuid()}`;
    }
    const data = step.toJSON();
    return {
      key: step.__key,
      data,
    };
  }

  _convertJSONToStep = (json: Object): Step => {
    const schema = this._editorState.schema;
    const step = Step.fromJSON(schema, json.data);
    step.__key = nullthrows(json.key);
    return step;
  }

  _push = async (payload: Object): Promise<void> => {
    console.log('post', payload);
    const response = await requestDocServer('post', payload);
    const accepted = nullthrows(response.accepted);
    const version = nullthrows(response.version);
    const newSteps  = nullthrows(response.steps);
    const editorState = response.editorState;
    this._version = version;
    console.log({
      accepted,
      oldSteps: payload.steps,
      newSteps,
      version,
    });
    if (editorState) {
      const editorStateNext = createDemoColllabEditorState(
        version,
        this._userId,
        editorState,
      );
      this._setState({
        editorState: editorStateNext,
      }, () => {
        this._editorState = editorStateNext;
        this._version = version;
      });
    } else if (newSteps.length) {
      const steps = payload.steps.concat(newSteps);
      let tr;
      try {
        tr = receiveTransaction(
          this._editorState,
          steps.map(this._convertJSONToStep),
          steps.map(s => s.created_by),
        );
      } catch (ex) {
        console.error(ex);
        return;
      }
      const editorStateNext =  this._editorState.apply(nullthrows(tr));
      this._setState({
        editorState: editorStateNext,
      }, () => {
        this._editorState = editorStateNext;
        this._version = version;
      });
    } else {
      const tr = this._editorState.tr;
      this._setState({
        editorState: this._editorState.apply(tr),
      }, () => {
        this._version = version;
      });
    }
  };
}

export default DemoCollabConnector;