// @flow

import applyDevTools from 'prosemirror-dev-tools';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import RichTextEditor from '../src/ui/RichTextEditor';
import DemoAppRuntime from './DemoAppRuntime';
import DemoCollabConnector from './DemoCollabConnector';
import DemoSimpleConnector from './DemoSimpleConnector';
import createDemoColllabEditorState from './createDemoCollabEditorState';
import createDemoTemplateEditorState from './createDemoTemplateEditorState';

import './demo-app.css';

// If load from localhost, assumes collab-edit is enabled.
const COLLAB_EDITING = /^https?:\/\/localhost:\d+/.test(window.location.href);

class DemoApp extends React.PureComponent<any, any, any> {
  _runtime: any;
  _connector: any;

  constructor(props: any, context: any) {
    super(props, context);

    this._runtime = new DemoAppRuntime();

    const version = 0;
    const userId = (Math.random() * 1000000000) >> 0;
    const docId = 1;

    const editorState = COLLAB_EDITING ?
      createDemoColllabEditorState(version, userId) :
      createDemoTemplateEditorState();

    const setState = this.setState.bind(this);
    this._connector = COLLAB_EDITING ?
      new DemoCollabConnector(editorState, setState, {docId, userId, version}) :
      new DemoSimpleConnector(editorState, setState);

    this.state = {
      editorState,
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
    this._connector.onEdit(transaction);
  };

  _onReady = (editorView: EditorView): void => {
    window.debugProseMirror = () => {
      applyDevTools(editorView);
    };
  };
}

export default DemoApp;
