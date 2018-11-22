// @flow

import './czi-editor.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import 'prosemirror-view/style/prosemirror.css';
import ImageNodeView from './ImageNodeView';
import React from 'react';
import applyDevTools from 'prosemirror-dev-tools';
import createEmptyEditorState from '../createEmptyEditorState';
import uuid from './uuid';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

const EDITOR_EMPTY_STATE = createEmptyEditorState();

class Editor extends React.PureComponent<any, any, any> {

  _id = uuid();

  _editorView = null;

  props: {
    editorState?: ?EditorState,
    onChange?: ?(state: EditorState) => void,
    onReady?: ?(view: EditorView) => void,
    readOnly?: ?boolean,
  };

  componentDidMount(): void {
    const {onReady, editorState, readOnly} = this.props;
    const editorNode = document.getElementById(this._id);
    const templateNode = document.getElementById(this._id + 'template');

    if (editorNode) {
      // Reference: http://prosemirror.net/examples/basic/
      this._editorView = new EditorView(editorNode, {
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
      onReady && onReady(this._editorView);
    }
  }

  componentDidUpdate(): void {
    const view = this._editorView;
    if (view)  {
      const state = this.props.editorState || EDITOR_EMPTY_STATE;
      view.updateState(state);
    }
  }

  componentWillUnmount(): void {
    this._editorView && this._editorView.destroy();
    this._editorView = null;
  }

  render(): React.Element<any> {
    return <div id={this._id} className="prosemirror-editor-wrapper" />;
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
    return !!this._editorView && (!!this.props.readOnly !== true);
  };
}

export default Editor;
