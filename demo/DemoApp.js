// @flow

import applyDevTools from 'prosemirror-dev-tools';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import RichTextEditor from '../src/ui/RichTextEditor';
import DemoAppRuntime from './DemoAppRuntime';
import DemoCollabStore from './DemoCollabStore';
import DemoTemplateStore from './DemoTemplateStore';

import './demo-app.css';

// If load from localhost, assumes collab-edit is enabled.
const COLLAB_EDITING = /^https?:\/\/localhost:\d+/.test(window.location.href);

class DemoApp extends React.PureComponent<any, any, any> {
  _runtime: any;
  _store: any;

  constructor(props: any, context: any) {
    super(props, context);

    this._runtime = new DemoAppRuntime();

    const setState = this.setState.bind(this);

    this._store = COLLAB_EDITING ?
      new DemoCollabStore(setState) :
      new DemoTemplateStore(setState);

    this.state = {
      editorState: this._store.editorState,
      editorView: this._store.editorState,
    };
  }

  render(): React.Element<any> {
    const {editorState} = this.state;
    const readOnly = /read/ig.test(window.location.search);
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={false}
        height="100vh"
        onChange={this._onChange}
        placeholder={readOnly ? '' : 'Type Something...'}
        readOnly={readOnly}
        runtime={this._runtime}
        width="100vw"
      />
    );
  }

  _onChange = (data: {state: EditorState, transaction: Transform}): void => {
    const {transaction} = data;
    this._store.dispatchTransaction(transaction);
  };

  _onReady = (editorView: EditorView): void => {
    window.debugProseMirror = () => {
      applyDevTools(editorView);
    };
  };
}

export default DemoApp;
