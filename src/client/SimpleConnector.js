// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {Schema} from 'prosemirror-model';
import ReactDOM from 'react-dom';

export type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function
) => void;

class SimpleConnector {
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
        data: transaction.doc.toJSON(),
      };
      this._setState(state, () => {
        this._editorState = editorState;
      });
    });
  };

  // FS IRAD-989 2020-18-06
  // updating properties should automatically render the changes
  getState = (): EditorState => {
    return this._editorState;
  };
  
  // FS IRAD-1040 2020-09-02
  // Send the modified schema to server
  updateSchema = (schema: Schema) => {    
  };
}

export default SimpleConnector;