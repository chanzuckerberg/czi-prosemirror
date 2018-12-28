// @flow

import applyDevTools from 'prosemirror-dev-tools';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import createEmptyEditorState from '../src/createEmptyEditorState';
import RichTextEditor from '../src/ui/RichTextEditor';
import uuid from '../src/ui/uuid';
import DemoAppRuntime from './DemoAppRuntime';
import DemoCollabConnector from './DemoCollabConnector';
import DemoSimpleConnector from './DemoSimpleConnector';
import createDemoTemplateEditorState from './createDemoTemplateEditorState';

import './demo-app.css';

// If load from localhost, assumes collab-edit is enabled.
const COLLAB_EDITING = /^https?:\/\/localhost:\d+/.test(window.location.href) || 1;

class DemoApp extends React.PureComponent<any, any, any> {
  _runtime: any;
  _connector: any;
  _clientID: string;

  constructor(props: any, context: any) {
    super(props, context);

    this._runtime = new DemoAppRuntime();
    this._clientID = uuid();

    const docID = 1;

    const editorState = COLLAB_EDITING ?
      createEmptyEditorState() :
      createDemoTemplateEditorState();

    const setState = this.setState.bind(this);
    this._connector = COLLAB_EDITING ?
      new DemoCollabConnector(editorState, setState, {docID}) :
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
        onReady={this._onReady}
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
    window.debugProseMirror();
  };
}

export default DemoApp;
