// @flow

import {EditorState} from 'prosemirror-state';

import {MARK_FONT_TYPE} from '../MarkNames';
import findActiveMark from '../findActiveMark';

// This should map to `--czi-content-font-size` at `czi-editor.css`.
export const FONT_TYPE_NAME_DEFAULT = 'Arial';

export default function findActiveFontType(state: EditorState): string {
  const {schema, doc, selection} = state;
  const markType = schema.marks[MARK_FONT_TYPE];
  if (!markType) {
    return FONT_TYPE_NAME_DEFAULT;
  }
  const {from, to} = selection;
  const mark = markType ? findActiveMark(doc, from, to, markType) : null;
  return (mark && mark.attrs.name) || FONT_TYPE_NAME_DEFAULT;
}
