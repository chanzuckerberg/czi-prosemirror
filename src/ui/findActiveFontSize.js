// @flow

import findActiveMark from '../findActiveMark';
import {EditorState} from 'prosemirror-state';
import {HEADING} from '../NodeNames';
import {MARK_FONT_SIZE} from '../MarkNames';
import {findParentNodeOfType} from 'prosemirror-utils';

// This should map to `--czi-editor-font-size` at `czi-editor.css`.
const FONT_PT_SIZE_DEFAULT = 11;

// This should map to `czi-heading.css`.
const MAP_HEADING_LEVEL_TO_FONT_PT_SIZE = {
  '1': 20,
  '2': 18,
  '3': 16,
  '4': 14,
  '5': 11,
  '6': 11,
};

export default function findActiveFontSize(state: EditorState): string {
  const {schema, doc, selection} = state;
  const markType = state.schema.marks[MARK_FONT_SIZE];
  const heading = state.schema.nodes[HEADING];
  const defaultSize = String(FONT_PT_SIZE_DEFAULT);
  if (!markType) {
    return defaultSize;
  }
  const {from, to} = selection;
  const mark = markType ? findActiveMark(doc, from, to, markType) : null;
  if (mark) {
    return String(mark.attrs.pt);
  }
  if (!heading) {
    return defaultSize;
  }
  const result = findParentNodeOfType(heading)(state.selection);
  if (!result) {
    return defaultSize;
  }
  const level = String(result.node.attrs.level);
  return MAP_HEADING_LEVEL_TO_FONT_PT_SIZE[level] || defaultSize;
}
