// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import ReactDOM from 'react-dom';

import createEmptyEditorState from '../src/createEmptyEditorState';

type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;

class DemoCollabStore {
  _setState: SetStateCall;
  editorState: EditorState;

  constructor(setState: SetStateCall) {
    this.editorState = createEmptyEditorState();
    this._setState = setState;
  }

  dispatchTransaction = (transaction: Transform): void => {
    ReactDOM.unstable_batchedUpdates(() => {
      const editorState = this.editorState.apply(transaction);
      const state = {
        editorState,
      };
      this._setState(state, () => {
        this.editorState = editorState;
      });
    });
  };
}

export default DemoCollabStore;