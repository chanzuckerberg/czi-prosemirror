// @flow

import './czi-editor.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import 'prosemirror-view/style/prosemirror.css';
import CustomEditorView from './CustomEditorView';
import ImageNodeView from './ImageNodeView';
import React from 'react';
import applyDevTools from 'prosemirror-dev-tools';
import createEmptyEditorState from '../createEmptyEditorState';
import cx from 'classnames';
import uuid from './uuid';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import type {EditorRuntime} from './CustomEditorView';

const EDITOR_EMPTY_STATE = createEmptyEditorState();

class Editor extends React.PureComponent<any, any, any> {

  _id = uuid();

  _editorView = null;

  props: {
    disabled?: ?boolean,
    editorState?: ?EditorState,
    embedded?: ?boolean,
    onChange?: ?(state: EditorState) => void,
    onReady?: ?(view: EditorView) => void,
    placeholder?: ?(string | React.Element<any>),
    readOnly?: ?boolean,
    runtime?: ?EditorRuntime,
  };

  componentDidMount(): void {
    const {
      embedded, onReady, editorState, readOnly,
      runtime, placeholder, disabled,
    } = this.props;
    const editorNode = document.getElementById(this._id);
    const templateNode = document.getElementById(this._id + 'template');

    if (editorNode) {
      // Reference: http://prosemirror.net/examples/basic/
      const view = this._editorView = new CustomEditorView(editorNode, {
        state: editorState || EDITOR_EMPTY_STATE,
        dispatchTransaction: this._dispatchTransaction,
        editable: this._isEditable,
        nodeViews: {
          image(node, view, getPos) {
            return new ImageNodeView(
              node,
              view,
              getPos,
            );
          },
        },
      });

      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly;
      view.disabled = !!disabled;
      view.updateState(editorState || EDITOR_EMPTY_STATE);

      onReady && onReady(this._editorView);
    }
  }

  componentDidUpdate(): void {
    const view = this._editorView;
    if (view)  {
      const {
        runtime, editorState, placeholder, readOnly, disabled,
      } = this.props;
      const state = editorState || EDITOR_EMPTY_STATE;
      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly;
      view.disabled = !!disabled;
      view.updateState(state);
    }
  }

  componentWillUnmount(): void {
    this._editorView && this._editorView.destroy();
    this._editorView = null;
  }

  render(): React.Element<any> {
    const {embedded, readOnly} = this.props;
    const className = cx('prosemirror-editor-wrapper', {embedded, readOnly});
    return <div className={className} id={this._id} />;
  }

  focus(): void {
    this._editorView && this._editorView.focus();
  }

  _dispatchTransaction = (transaction: Transform): void => {
    const {onChange, editorState, readOnly} = this.props;
    if (readOnly === true) {
      return;
    }
    const nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
    onChange && onChange(nextState);
  };

  _isEditable = (): boolean => {
    const {disabled, readOnly} = this.props;
    return !!this._editorView && !readOnly && !disabled;
  };
}

export default Editor;
