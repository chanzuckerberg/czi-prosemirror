// @flow

import {EditorView} from 'prosemirror-view';
import React from 'react';

import type {EditorRuntime, DirectEditorProps} from '../Types';

// https://github.com/ProseMirror/prosemirror-view/blob/master/src/index.js
class CustomEditorView extends EditorView {
  disabled: boolean;
  placeholder: ?(string | React.Element<any>);
  readOnly: boolean;
  runtime: ?EditorRuntime;
  constructor(
    place: HTMLElement,
    props: DirectEditorProps,
  ) {
    super(place, props);
    this.runtime = null;
    this.readOnly = true;
    this.disabled = true;
    this.placeholder = null;
  }
}

export default CustomEditorView;
