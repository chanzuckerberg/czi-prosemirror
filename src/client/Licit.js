// @flow

import { EditorState, TextSelection } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import React from 'react';

import createEmptyEditorState from '../createEmptyEditorState';
import RichTextEditor from '../ui/RichTextEditor';
import uuid from '../uuid';
import LicitRuntime from './LicitRuntime';
import CollabConnector from './CollabConnector';
import SimpleConnector from './SimpleConnector';

import './licit.css';

// If load from localhost, assumes collab-edit is enabled.
const COLLAB_EDITING = /^https?:\/\/localhost:\d+/.test(window.location.href) || 1;

class Licit extends React.PureComponent<any, any, any> {
  _runtime: any;
  _connector: any;
  _clientID: string;

  constructor(props: any, context: any) {
    super(props, context);

    this._runtime = new LicitRuntime();
    this._clientID = uuid();

    const docID = props.docID;

    const editorState = createEmptyEditorState();

    const setState = this.setState.bind(this);
    this._connector = COLLAB_EDITING ?
      new CollabConnector(editorState, setState, {docID}) :
      new SimpleConnector(editorState, setState);

    this.state = {
      editorState,
    };
  }

  render(): React.Element<any> {
    const {editorState} = this.state;
    const readOnly = /read/ig.test(window.location.search);
    // [FS] IRAD-978 2020-06-05
    // Using 100vw & 100vh (100% viewport) is not ideal for a component which is expected to be a part of a page, 
    // so changing it to 100%  width & height which will occupy the area relative to its parent.	
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={false}
        height="100%"
        onChange={this._onChange}
        onReady={this._onReady}
        readOnly={readOnly}
        runtime={this._runtime}
        width="100%"
      />
    );
  }

  _onChange = (data: {state: EditorState, transaction: Transform}): void => {
    const {transaction} = data;
    this._connector.onEdit(transaction);
  };

  _onReady = (editorView: EditorView): void => {
    // [FS][06-APR-2020][IRAD-922]
    // Showing focus in the editor.
    const { state, dispatch } = editorView;
    const tr = state.tr;
    dispatch(tr.setSelection(TextSelection.create(tr.doc, 0)));
    editorView.focus();
  };
}

export default Licit;
