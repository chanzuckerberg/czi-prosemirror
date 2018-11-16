// @flow

import React from 'react';
import UICommand from './UICommand';
import cx from 'classnames';
import findActiveMark from '../findActiveMark';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_FONT_TYPE} from '../MarkNames';
import {Transform} from 'prosemirror-transform';

// This should map to `--czi-editor-font-size` at `czi-editor.css`.
export const FONT_TYPE_NAME_DEFAULT = 'Arial';

export default function findActiveFontType(state: EditorState): string {
  const {schema, doc, selection} = state;
  const markType = state.schema.marks[MARK_FONT_TYPE];
  if (!markType) {
    return FONT_TYPE_NAME_DEFAULT;
  }
  const {from, to} = selection;
  const mark = markType ? findActiveMark(doc, from, to, markType) : null;
  return (mark && mark.attrs.name) || FONT_TYPE_NAME_DEFAULT;
}
