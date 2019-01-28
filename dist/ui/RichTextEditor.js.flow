// @flow

import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';
import React from 'react';

import createEmptyEditorState from '../createEmptyEditorState';
import Editor from './Editor';
import EditorFrameset from './EditorFrameset';
import EditorToolbar from './EditorToolbar';
import uuid from './uuid';

import type {EditorFramesetProps} from './EditorFrameset';
import type {EditorProps} from './Editor';

type Props = EditorFramesetProps & EditorProps;

type State = {
  editorView: ?EditorView,
};

const EMPTY_EDITOR_STATE = createEmptyEditorState();
const EMPTY_EDITOR_RUNTIME = {};

class RichTextEditor extends React.PureComponent<any, any, any> {

  props: Props;

  state: State;

  _id: string;

  constructor(props: any, context: any) {
    super(props, context);
    this._id = uuid();
    this.state = {
      contentHeight: NaN,
      contentOverflowHidden: false,
      editorView: null,
    };
  }

  render(): React.Element<any> {
    const {
      className,
      disabled,
      embedded,
      header,
      height,
      onChange,
      placeholder,
      readOnly,
      width,
    } = this.props;

    let {
      editorState,
      runtime,
    } = this.props;

    editorState = editorState || EMPTY_EDITOR_STATE;
    runtime = runtime || EMPTY_EDITOR_RUNTIME;

    const {editorView} = this.state;

    const toolbar = (!!readOnly === true) ? null :
      <EditorToolbar
        disabled={disabled}
        dispatchTransaction={this._dispatchTransaction}
        editorState={editorState || Editor.EDITOR_EMPTY_STATE}
        editorView={editorView}
        readOnly={readOnly}
      />;

    const body =
      <Editor
        disabled={disabled}
        dispatchTransaction={this._dispatchTransaction}
        editorState={editorState}
        embedded={embedded}
        id={this._id}
        onChange={onChange}
        onReady={this._onReady}
        placeholder={placeholder}
        readOnly={readOnly}
        runtime={runtime}
      />;

    return (
      <EditorFrameset
        body={body}
        className={className}
        header={header}
        height={height}
        toolbar={toolbar}
        width={width}
      />
    );
  }

  _dispatchTransaction = (tr: Transform): void => {
    const {onChange, editorState, readOnly} = this.props;
    if (readOnly === true) {
      return;
    }

    if (onChange) {
      const nextState = (editorState || Editor.EDITOR_EMPTY_STATE).apply(tr);
      onChange(nextState);
    }
  };

  _onReady = (editorView: EditorView): void => {
    if (editorView !== this.state.editorView) {
      this.setState({editorView});
      const {onReady} = this.props;
      onReady && onReady(editorView);
    }
  };
}

export default RichTextEditor;
