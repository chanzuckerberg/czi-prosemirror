// @flow

import applyDevTools from 'prosemirror-dev-tools';
import { EditorState, TextSelection } from 'prosemirror-state';
import { Transform } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';

import convertFromJSON from '../convertFromJSON';
import RichTextEditor from '../ui/RichTextEditor';
import uuid from '../uuid';
import LicitRuntime from './LicitRuntime';
import SimpleConnector from './SimpleConnector';
import CollabConnector from './CollabConnector';
import { EMPTY_DOC_JSON } from '../createEmptyEditorState';
import type { EditorRuntime } from '../Types'

import './licit.css';

/**
 * LICIT properties:
 *  docID {number} [0] Collaborative Doument ID
 *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools, available only in development.
 *  width {string} [100%] Width of the editor.
 *  height {height} [100%] Height of the editor.
 *  readOnly {boolean} [false] To enable/disable editing mode.
 *  onChange {@callback} [null] Fires after each significant change.
 *      @param data {JSON} Modified document data.
 *  onReady {@callback} [null] Fires when the editor is fully ready.
 *      @param ref {LICIT} Rerefence of the editor.
 *  data {JSON} [null] Document data to be loaded into the editor.
 *  disabled {boolean} [false] Disable the editor.
 *  embedded {boolean} [false] Disable/Enable inline behaviour.
 */
class Licit extends React.Component<any, any> {
  _runtime: EditorRuntime;
  _connector: any;
  _clientID: string;
  _editorView: EditorView; // This will be handy in updating document's content.
  _skipSCU: boolean; // Flag to decide whether to skip shouldComponentUpdate

  constructor(props: any, context: any) {
    super(props, context);

    this._clientID = uuid();
    this._editorView = null;
    this._skipSCU = true;

    const noop = function () { };

    // [FS] IRAD-981 2020-06-10
    // Component's configurations.
    const docID = props.docID || 0; // 0 < means collaborative.
    const collaborative = 0 < docID;
    const debug = props.debug || false;
    const width = props.width || '100%';
    const height = props.height || '100%';
    const onChangeCB = (typeof props.onChange === 'function') ? props.onChange : noop;
    const onReadyCB = (typeof props.onReady === 'function') ? props.onReady : noop;
    const readOnly = props.readOnly || false;
    const data = props.data || null;
    const disabled = props.disabled || false;
    const embedded = props.embedded || false;// [FS] IRAD-996 2020-06-30
    // [FS] 2020-07-03
    // Handle Image Upload from Angular App
    const runtime = props.runtime ? props.runtime : new LicitRuntime();
    const editorState = convertFromJSON(data);

    const setState = this.setState.bind(this);
    this._connector = collaborative
      ? new CollabConnector(editorState, setState, { docID })
      : new SimpleConnector(editorState, setState);

    // FS IRAD-989 2020-18-06
    // updating properties should automatically render the changes
    this.state = {
      docID,
      data,
      editorState,
      width,
      height,
      readOnly,
      onChangeCB,
      onReadyCB,
      debug,
      disabled,
      embedded,
      runtime
    };
  }

  setContent = (content: any = {}): void => {
    const { doc, tr, schema } = this._connector.getState();
    const document = content
      ? schema.nodeFromJSON(content)
      : schema.nodeFromJSON(EMPTY_DOC_JSON);

    const selection = TextSelection.create(doc, 0, doc.content.size);
    const transaction = tr
      .setSelection(selection)
      .replaceSelectionWith(document, false);

    this._skipSCU = true;
    this._editorView.dispatch(transaction);
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    // Only interested if properties are set from outside.
    if (!this._skipSCU) {
      this._skipSCU = false;
      let dataChanged = false;

      // Compare data, if found difference, update editorState
      if (this.state.data !== nextState.data) {
        dataChanged = true;
      } else if (null === nextState.data) {
        if (
          this.state.editorState.doc.textContent &&
          0 < this.state.editorState.doc.textContent.trim().length
        ) {
          dataChanged = true;
        }
      }

      if (dataChanged) {
        // data changed, so update document content
        this.setContent(nextState.data);
      }

      if (this.state.docID !== nextState.docID) {
        // Collaborative mode changed
        const collabEditing = (nextState.docID != 0);
        const editorState = this._connector.getState();
        const setState = this.setState.bind(this);
        const docID = nextState.docID || 1;
        // create new connector
        this._connector = collabEditing
          ? new CollabConnector(editorState, setState, { docID })
          : new SimpleConnector(editorState, setState);
      }
    }

    return true;
  }

  render(): React.Element<any> {
    const { editorState, width, height, readOnly, disabled, embedded, runtime } = this.state;
    // [FS] IRAD-978 2020-06-05
    // Using 100vw & 100vh (100% viewport) is not ideal for a component which is expected to be a part of a page,
    // so changing it to 100%  width & height which will occupy the area relative to its parent.
    return (
      <RichTextEditor
        editorState={editorState}
        embedded={embedded}
        height={height}
        onChange={this._onChange}
        onReady={this._onReady}
        readOnly={readOnly}
        runtime={runtime}
        width={width}
        disabled={disabled}
      />
    );
  }

  _onChange = (data: { state: EditorState, transaction: Transform }): void => {
    const { transaction } = data;
    this._connector.onEdit(transaction);
    if (transaction.docChanged) {
      const docJson = transaction.doc.toJSON();
      this.state.onChangeCB(docJson);
    }
  };

  _onReady = (editorView: EditorView): void => {
    // [FS][06-APR-2020][IRAD-922]
    // Showing focus in the editor.
    const { state, dispatch } = editorView;
    this._editorView = editorView;
    const tr = state.tr;
    const doc = state.doc;
    dispatch(tr.setSelection(TextSelection.create(doc, 0, doc.content.size)));
    editorView.focus();

    if (this.state.onReadyCB) {
      this.state.onReadyCB(this);
    }

    if (this.state.debug) {
      window.debugProseMirror = () => {
        applyDevTools(editorView);
      };
      window.debugProseMirror();
    }
  };

  /**
  * LICIT properties:
  *  docID {number} [0] Collaborative Doument ID
  *  debug {boolean} [false] To enable/disable ProseMirror Debug Tools, available only in development.
  *  width {string} [100%] Width of the editor.
  *  height {height} [100%] Height of the editor.
  *  readOnly {boolean} [false] To enable/disable editing mode.
  *  onChange {@callback} [null] Fires after each significant change.
  *      @param data {JSON} Modified document data.
  *  onReady {@callback} [null] Fires when the editor is fully ready.
  *      @param ref {LICIT} Rerefence of the editor.
  *  data {JSON} [null] Document data to be loaded into the editor.
  *  disabled {boolean} [false] Disable the editor.
  *  embedded {boolean} [false] Disable/Enable inline behaviour.
  */
  setProps = (props: any): void => {
    if (this.state.readOnly) {
      // It should be possible to load content into the editor in readonly as well.
      // It should not be necessary to make the component writable any time during the process
      let propsCopy = {};
      this._skipSCU = true;
      Object.assign(propsCopy, props);
      // make writable without content change
      propsCopy.readOnly = false;
      delete propsCopy.data;
      this.setState(propsCopy);
    }
    // Need to go through shouldComponentUpdate lifecycle here, when updated from outside,
    // so that content is modified gracefully using transaction so that undo/redo works too.
    this._skipSCU = false;
    this.setState(props);
  };
}

export default Licit;
