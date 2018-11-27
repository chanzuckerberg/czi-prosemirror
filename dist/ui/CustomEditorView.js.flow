// @flow

import {EditorView} from 'prosemirror-view';
import React from 'react';

import type {DirectEditorProps} from '../Types';

export type EditorRuntime = {};

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends EditorView {
  placeholder: ?(string | React.Element<any>);
  runtime: ?EditorRuntime;

  constructor(
    place: HTMLElement,
    props: DirectEditorProps,
  ) {
    super(place, props);
    this.runtime = null;
    this.placeholder = null;
  }
}

export default CustomEditorView;
