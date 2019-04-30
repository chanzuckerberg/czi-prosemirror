// @flow

import {Schema} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

import * as MarkNames from './MarkNames';
import {setTextAlign} from './TextAlignCommand';

const {
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_UNDERLINE,
} = MarkNames;

const FORMAT_MARK_NAMES = [
  MARK_EM,
  MARK_FONT_SIZE,
  MARK_FONT_TYPE,
  MARK_STRIKE,
  MARK_STRONG,
  MARK_TEXT_COLOR,
  MARK_TEXT_HIGHLIGHT,
  MARK_UNDERLINE,
];

export default function clearMarks(tr: Transform, schema: Schema): Transform {
  const {doc, selection} = tr;
  if (!selection || !doc) {
    return tr;
  }
  const {from, to, empty} = selection;
  if (empty) {
    return tr;
  }

  const markTypesToRemove = new Set(
    FORMAT_MARK_NAMES.map(n => schema.marks[n]).filter(Boolean)
  );

  if (!markTypesToRemove.size) {
    return tr;
  }

  const tasks = [];
  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks && node.marks.length) {
      node.marks.some(mark => {
        if (markTypesToRemove.has(mark.type)) {
          tasks.push({node, pos, mark});
        }
      });
      return true;
    }
    return true;
  });
  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(job => {
    const {node, mark, pos} = job;
    tr = tr.removeMark(pos, pos + node.nodeSize, mark.type);
  });

  // It should also clear text alignment.
  tr = setTextAlign(tr, schema, null);
  return tr;
}
