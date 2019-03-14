// @flow

import cx from 'classnames';
import {DOMSerializer, Schema} from 'prosemirror-model';
import {EditorState, Transaction} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';
import webfontloader from 'webfontloader';

import 'prosemirror-gapcursor/style/gapcursor.css';
import 'prosemirror-view/style/prosemirror.css';

import {registerEditorView, releaseEditorView} from '../CZIProseMirror';
import {BOOKMARK, IMAGE, MATH} from '../NodeNames';
import WebFontLoader from '../WebFontLoader';
import createEmptyEditorState from '../createEmptyEditorState';
import normalizeHTML from '../normalizeHTML';
import BookmarkNodeView from './BookmarkNodeView';
import CustomEditorView from './CustomEditorView';
import CustomNodeView from './CustomNodeView';
import ImageNodeView from './ImageNodeView';
import MathNodeView from './MathNodeView';
import handleEditorDrop from './handleEditorDrop';
import handleEditorKeyDown from './handleEditorKeyDown';
import handleEditorPaste from './handleEditorPaste';
import uuid from './uuid';

import './czi-editor.css';

import type {EditorRuntime} from '../Types';

export type EditorProps = {
  autoFocus?: ?boolean,
  disabled?: ?boolean,
  dispatchTransaction?: ?(tr: Transform) => void,
  editorState?: ?EditorState,
  embedded?: ?boolean,
  onBlur?: ?() => void,
  onChange?: ?(state: EditorState) => void,
  onReady?: ?(view: EditorView) => void,
  // Mapping for custom node views.
  nodeViews?: ?{[nodeName: string]: CustomNodeView},
  placeholder?: ?(string | React.Element<any>),
  readOnly?: ?boolean,
  runtime?: ?EditorRuntime,
};

const AUTO_FOCUS_DELAY = 350;

// Default custom node views.
export const DEFAULT_NODE_VIEWS = Object.freeze({
  [IMAGE]: ImageNodeView,
  [MATH]: MathNodeView,
  [BOOKMARK]: BookmarkNodeView,
});

const EDITOR_EMPTY_STATE = Object.freeze(createEmptyEditorState());

// Monkey patch the `scrollIntoView` mathod of 'Transaction'.
// Why this is necessary?
// It appears that promse-mirror does call `scrollIntoView` extensively
// from many of the built-in transformations, thus cause unwanted page
// scrolls. To make the behavior more manageable, this patched method asks
// developer to explicitly use `scrollIntoView(true)` to enforce page scroll.
const scrollIntoView = Transaction.prototype.scrollIntoView;
const scrollIntoViewPatched = function(forced: boolean): Transaction {
  if (forced === true && scrollIntoView) {
    return scrollIntoView.call(this);
  } else {
    return this;
  }
};
Transaction.prototype.scrollIntoView = scrollIntoViewPatched;

// Sets the implementation so that `FontTypeMarkSpec` can load custom fonts.
WebFontLoader.setImplementation(webfontloader);

const handleDOMEvents = {
  drop: handleEditorDrop,
  keydown: handleEditorKeyDown,
  paste: handleEditorPaste,
};

function bindNodeView(NodeView: CustomNodeView): Function {
  return (node, view, getPos, decorations) => {
    return new NodeView(
      node,
      view,
      getPos,
      decorations,
    );
  };
}

function getSchema(editorState: ?EditorState): Schema {
  return editorState ? editorState.schema : EDITOR_EMPTY_STATE.schema;
}

class Editor extends React.PureComponent<any, any, any> {

  static EDITOR_EMPTY_STATE = EDITOR_EMPTY_STATE;

  _autoFocusTimer = 0;
  _id = uuid();
  _editorView = null;

  props: EditorProps;

  state = {
    isPrinting: false,
  };

  componentDidMount(): void {
    const {
      onReady, editorState, readOnly,
      runtime, placeholder, disabled,
      dispatchTransaction, nodeViews,
    } = this.props;

    const editorNode = document.getElementById(this._id);
    if (editorNode) {
      const effectiveNodeViews = Object.assign(
        {},
        DEFAULT_NODE_VIEWS,
        nodeViews,
      );
      const boundNodeViews = {};
      const schema = getSchema(editorState);
      const {nodes} = schema;

      Object.keys(effectiveNodeViews).forEach(nodeName => {
        const nodeView = effectiveNodeViews[nodeName];
        // Only valid and supported node views should be used.
        if (nodes[nodeName]) {
          boundNodeViews[nodeName] = bindNodeView(nodeView);
        }
      });

      // Reference: http://prosemirror.net/examples/basic/
      const view = this._editorView = new CustomEditorView(editorNode, {
        clipboardSerializer: DOMSerializer.fromSchema(schema),
        dispatchTransaction,
        editable: this._isEditable,
        nodeViews: boundNodeViews,
        state: editorState || EDITOR_EMPTY_STATE,
        transformPastedHTML: normalizeHTML,
        handleDOMEvents,
      });

      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly;
      view.disabled = !!disabled;
      view.updateState(editorState || EDITOR_EMPTY_STATE);

      // Expose the view to CZIProseMirror so developer could debug it.
      registerEditorView(this._id, view);

      onReady && onReady(view);

      this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
      this._autoFocusTimer = this.props.autoFocus ?
        setTimeout(this.focus, AUTO_FOCUS_DELAY) :
        0;
    }

    window.addEventListener('beforeprint', this._onPrintStart, false);
    window.addEventListener('afterprint', this._onPrintEnd, false);
  }

  componentDidUpdate(prevProps: EditorProps): void {
    const view = this._editorView;
    if (view)  {
      const prevSchema = getSchema(prevProps.editorState);
      const currSchema = getSchema(this.props.editorState);
      if (prevSchema !== currSchema) {
        // schema should never change.
        // TODO: re-create the editor view if schema changed.
        console.error('editor schema changed.');
      }

      const {
        runtime, editorState, placeholder, readOnly, disabled,
      } = this.props;
      const {isPrinting} = this.state;
      const state = editorState || EDITOR_EMPTY_STATE;
      view.runtime = runtime;
      view.placeholder = placeholder;
      view.readOnly = !!readOnly || isPrinting;
      view.disabled = !!disabled;
      view.updateState(state);

      this._autoFocusTimer && clearTimeout(this._autoFocusTimer);
      this._autoFocusTimer = (!prevProps.autoFocus && this.props.autoFocus) ?
        setTimeout(this.focus, AUTO_FOCUS_DELAY) :
        0;
    }
  }

  componentWillUnmount(): void {
    this._editorView && this._editorView.destroy();
    this._editorView = null;
    releaseEditorView(this._id);
    window.removeEventListener('beforeprint', this._onPrintStart, false);
    window.removeEventListener('afterprint', this._onPrintEnd, false);
  }

  render(): React.Element<any> {
    const {embedded, readOnly} = this.props;
    const className = cx('prosemirror-editor-wrapper', {embedded, readOnly});
    return (
      <div
        className={className}
        data-czi-prosemirror-editor-id={this._id}
        id={this._id}
        onBlur={this._onBlur}
      />
    );
  }

  _onBlur = (): void => {
    const {onBlur} = this.props;
    const view = this._editorView;
    if (view && !view.disabled && !view.readOnly && onBlur) {
      onBlur();
    }
  };

  focus = (): void => {
    const view = this._editorView;
    if (view && !view.disabled && !view.readOnly) {
      view.focus();
    }
  };

  _isEditable = (): boolean => {
    const {disabled, readOnly} = this.props;
    const {isPrinting} = this.state;
    return !isPrinting && !!this._editorView && !readOnly && !disabled;
  };

  _onPrintStart = (): void => {
    this.setState({isPrinting: true});

  };

  _onPrintEnd = (): void => {
    this.setState({isPrinting: false});
  };
}

export default Editor;
