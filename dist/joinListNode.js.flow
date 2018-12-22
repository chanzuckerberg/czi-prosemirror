// @flow

import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import isListNode from './isListNode';
import joinDown from './joinDown';
import joinUp from './joinUp';

export default function joinListNode(
  tr: Transform,
  schema: Schema,
  listNodePos: number,
): Transform {
  if (!tr.doc || !tr.selection) {
    return tr;
  }
  const node = tr.doc.nodeAt(listNodePos);
  if (!isListNode(node)) {
    return tr;
  }
  const initialSelection = tr.selection;
  const listFromPos = listNodePos;
  const listToPos = listFromPos + node.nodeSize;
  const $fromPos = tr.doc.resolve(listFromPos);
  const $toPos = tr.doc.resolve(listToPos);

  let selectionOffset = 0;
  if (
    $toPos.nodeAfter &&
    $toPos.nodeAfter.type === node.type &&
    $toPos.nodeAfter.attrs.level === node.attrs.level
  ) {
    tr = joinDown(tr);
  }

  if (
    $fromPos.nodeBefore &&
    $fromPos.nodeBefore.type === node.type &&
    $fromPos.nodeBefore.attrs.level === node.attrs.level
  ) {
    selectionOffset -= 2;
    tr = joinUp(tr);
  }

  const selection = TextSelection.create(
    tr.doc,
    initialSelection.from + selectionOffset ,
    initialSelection.to + selectionOffset,
  );

  tr = tr.setSelection(selection);
  return tr;
}
