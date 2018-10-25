// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17

import joinDown from './joinDown';
import joinUp from './joinUp';
import {Fragment, Schema, NodeType, ResolvedPos, Slice} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform, Step, StepResult} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

export default function indentListItemLess(
  tr: Transform,
  schema: Schema,
): Transform {
  const {bullet_list, ordered_list, list_item} = schema.nodes;
  if (
    !bullet_list ||
    !ordered_list ||
    !list_item
  ) {
    return tr;
  }

  if (!tr.selection) {
    return tr;
  }

  const result =
    findParentNodeOfType(bullet_list)(tr.selection) ||
    findParentNodeOfType(ordered_list)(tr.selection);

  if (!result) {
    return tr;
  }
  const listNode = result.node;
  const nextLevel = listNode.attrs.level - 1;
  if (nextLevel <= 0) {
    return tr;
  }
  const initialSelection = tr.selection;
  const listFromPos = result.pos;
  const listToPos = result.pos + result.node.nodeSize;
  if (tr.selection.to < listFromPos || tr.selection.to > listToPos) {
    // Selection exceeds the bounday of the list node.
    return tr;
  }

  tr = tr.setNodeMarkup(listFromPos, null, {
    ...listNode.attrs,
    order: 1,
    level: nextLevel,
  });

  const $fromPos = tr.doc.resolve(listFromPos);
  const $toPos = tr.doc.resolve(listToPos);
  let selectionOffset = 0;
  if (
    $toPos.nodeAfter &&
    $toPos.nodeAfter.type === listNode.type &&
    $toPos.nodeAfter.attrs.level === nextLevel
  ) {
    tr = joinDown(tr);
  }

  if (
    $fromPos.nodeBefore &&
    $fromPos.nodeBefore.type === listNode.type &&
    $fromPos.nodeBefore.attrs.level === nextLevel
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
