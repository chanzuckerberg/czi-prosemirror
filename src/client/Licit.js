// @flow

import applyDevTools from 'prosemirror-dev-tools';
import { EditorState, TextSelection } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import React from 'react';

import convertFromJSON from '../convertFromJSON';
import RichTextEditor from '../ui/RichTextEditor';
import uuid from '../uuid';
import LicitRuntime from './LicitRuntime';
import CollabConnector from './CollabConnector';
import SimpleConnector from './SimpleConnector';

import './licit.css';

/**
 * LICIT properties:
 *  docID {number} [1] Collaborative Doument ID
 *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools
 *  collaborative {boolean} [false] To enable/disable Collborative editing mode.
 *  width {string} [100%] Width of the editor.
 *  height {height} [100%] Height of the editor.
 *  readOnly {boolean} [false] To enable/disable editing mode.
 *  onChange {@callback} [null] Fires after each significant change. 
 *      @param state {EditorState} 
 *      @param transaction {Transform}
 *  data {JSON} [null] Document data to be loaded into the editor.
 */
class Licit extends React.PureComponent<any, any, any> {
  _runtime: any;
  _connector: any;
  _clientID: string;
  _debug: boolean;
  _width: string;
  _height: string;
  _onChangeCB: any;
  _readOnly: boolean;

  constructor(props: any, context: any) {
    super(props, context);

    this._runtime = new LicitRuntime();
    this._clientID = uuid();

    // [FS] IRAD-981 2020-06-10
    // Component's configurations.
    const docID = props.docID || 1; // This is used only if collaborative.
    const COLLAB_EDITING = props.collaborative || false;
    this._debug = props.debug || false;
    this._width = props.width || '100%';
    this._height = props.height || '100%';
    this._onChangeCB = props.onChange || null;
    this._readOnly = props.readOnly || false;

    const editorState = convertFromJSON(props.data);

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
    // [FS] IRAD-978 2020-06-05
    // Using 100vw & 100vh (100% viewport) is not ideal for a component which is expected to be a part of a page, 
    // so changing it to 100%  width & height which will occupy the area relative to its parent.	
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={false}
        height={this._height}
        onChange={this._onChange}
        onReady={this._onReady}
        readOnly={this._readOnly}
        runtime={this._runtime}
        width={this._width}
      />
    );
  }

  _onChange = (data: {state: EditorState, transaction: Transform}): void => {
    const {transaction} = data;
    this._connector.onEdit(transaction);
    if(this._onChangeCB) {
      this._onChangeCB(data.state, data.transaction);
    }
  };

  _onReady = (editorView: EditorView): void => {
    // [FS][06-APR-2020][IRAD-922]
    // Showing focus in the editor.
    const { state, dispatch } = editorView;
    const tr = state.tr;
    dispatch(tr.setSelection(TextSelection.create(tr.doc, 0)));
    editorView.focus();
    if(this._debug) {
      window.debugProseMirror = () => {
          applyDevTools(editorView);
      };
      window.debugProseMirror();
    }
  };
}

export default Licit;
