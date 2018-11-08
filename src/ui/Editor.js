// @flow

import React from 'react';

import ImageView from './ImageView';
import CustomView from './CustomView';
import applyDevTools from 'prosemirror-dev-tools';
import uuid from 'uuid/v1';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import {
  EDITOR_EMPTY_STATE,
  PLUGINS,
  SCHEMA,
} from '../configs';

import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-gapcursor/style/gapcursor.css';
import 'prosemirror-view/style/prosemirror.css';

// import 'prosemirror-menu/style/menu.css';
// import 'prosemirror-example-setup/style/style.css';

import './czi-prose-mirror.css';

class Editor extends React.PureComponent<any, any, any> {

  _id = uuid();

  _editorView = null;

  props: {
    editorState?: ?EditorState,
    onReady?: ?(view: EditorView) => void,
    onChange?: ?(state: EditorState) => void,
  };

  componentDidMount(): void {
    const {onReady, editorState} = this.props;
    const editorNode = document.getElementById(this._id);
    const templateNode = document.getElementById(this._id + 'template');

    if (editorNode) {
      // Reference: http://prosemirror.net/examples/basic/
      this._editorView = new EditorView(editorNode, {
        state: editorState || EDITOR_EMPTY_STATE,
        dispatchTransaction: this._dispatchTransaction,
        editable: () =>  true,
        nodeViews: {
          image(node, view, getPos) {
            return new CustomView(node, view, getPos, ImageView);
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

  render(): React.Element<any> {
    return <div id={this._id} className="prosemirror-editor-wrapper" />;
  }

  _dispatchTransaction = (transaction: Transform): void => {
    const {onChange, editorState} = this.props;
    const nextState = (editorState || EDITOR_EMPTY_STATE).apply(transaction);
    onChange && onChange(nextState);
  };
}

export default Editor;
