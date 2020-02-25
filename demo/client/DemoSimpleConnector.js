// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import ReactDOM from 'react-dom';

type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;

class DemoSimpleConnector {

  _setState: SetStateCall;
  _editorState: EditorState;

  constructor(editorState: EditorState, setState: SetStateCall) {
    this._editorState = editorState;
    this._setState = setState;
  }

  onEdit = (transaction: Transform): void => {
    ReactDOM.unstable_batchedUpdates(() => {
      const editorState = this._editorState.apply(transaction);
      const state = {
        editorState,
      };
      this._setState(state, () => {
        this._editorState = editorState;
      });
    });
  };
}

export default DemoSimpleConnector;