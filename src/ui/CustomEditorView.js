// @flow

import {EditorView} from 'prosemirror-view';

import type {DirectEditorProps} from '../Types';

export type EditorRuntime = {
};

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends EditorView {
  constructor(
    place: HTMLElement,
    props: DirectEditorProps,
    runtime?: ?EditorRuntime,
  ) {
    super(place, props);
    this.runtime = runtime;
  }
}

export default CustomEditorView;
