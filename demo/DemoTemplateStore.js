// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import React from 'react';
import ReactDOM from 'react-dom';

import convertFromDOMElement from '../src/convertFromDOMElement';
import DemoAppHTMLTemplate from './DemoAppHTMLTemplate';

type SetStateCall = (
  state: {editorState: EditorState},
  callback: Function,
) => void;

// Reference: http://prosemirror.net/examples/basic/
const defaultEditorState = (function() {
  const templateNode = document.createElement('div');
  ReactDOM.render(<DemoAppHTMLTemplate />, templateNode);
  return convertFromDOMElement(templateNode);
})();

class DemoTemplateStore {

  _setState: SetStateCall;
  editorState: EditorState;

  constructor(setState: SetStateCall) {
    this.editorState = defaultEditorState;
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

export default DemoTemplateStore;