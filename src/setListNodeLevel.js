// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17

import joinListNode from './joinListNode';
import {Fragment, Schema, NodeType, ResolvedPos, Slice} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform, Step, StepResult} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

export const MAX_INDENT_LEVEL = 8;

export default function setListNodeLevel(
  tr: Transform,
  schema: Schema,
  delta: number,
): Transform {
  const {bullet_list, ordered_list, list_item} = schema.nodes;
  if (
    !bullet_list ||
    !ordered_list ||
    !list_item ||
    delta === 0
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

  const initialSelection = tr.selection;
  const listFromPos = result.pos;
  const listToPos = result.pos + result.node.nodeSize;
  if (tr.selection.to < listFromPos || tr.selection.to > listToPos) {
    // Selection exceeds the bounday of the list node.
    return tr;
  }

  const listNode = tr.doc.nodeAt(listFromPos);
  const nextLevel = delta > 0 ?
    listNode.attrs.level + 1 :
    listNode.attrs.level - 1;

  if (nextLevel > MAX_INDENT_LEVEL || nextLevel < 1) {
    return tr;
  }

  let sliceFromPos = null;
  let sliceToPos = null;
  let itemPos = listFromPos + 1;

  while (itemPos < listToPos - 1) {
    const itemNode = tr.doc.nodeAt(itemPos);
    const itemFromPos = itemPos;
    const itemToPos = itemPos + itemNode.nodeSize;
    if (tr.selection.from >= itemFromPos && tr.selection.from <= itemToPos) {
      sliceFromPos = itemFromPos;
    }
    if (tr.selection.to >= itemFromPos && tr.selection.to <= itemToPos) {
      sliceToPos = itemToPos;
    }
    // console.log(itemFromPos, itemToPos, itemNode.type.name, itemNode);
    itemPos = itemToPos;
  }

  if (sliceFromPos === null || sliceToPos === null) {
    return tr;
  }

  const sliceSelected = tr.doc.slice(sliceFromPos, sliceToPos);
  const sliceBefore = (sliceFromPos > (listFromPos + 1)) ?
    tr.doc.slice(listFromPos + 1, sliceFromPos) :
    null;

  const sliceAfter = (sliceToPos < (listToPos - 1)) ?
    tr.doc.slice(sliceToPos, listToPos - 1) :
    null;

  if (sliceAfter) {
    const frag = Fragment.from(listNode.copy(sliceAfter.content));
    tr = tr.insert(listToPos, frag);
  }

  if (sliceSelected) {
    const frag = Fragment.from(listNode.copy(sliceSelected.content));
    tr = tr.insert(listToPos, frag);
    tr = tr.setNodeMarkup(listToPos, null, {
      ...listNode.attrs,
      order: 1,
      level: nextLevel,
    });
  }

  if (sliceBefore) {
    const frag = Fragment.from(listNode.copy(sliceBefore.content));
    tr = tr.insert(listToPos, frag);
  }

  tr = tr.delete(listFromPos, listToPos);

  const offset = sliceBefore ? 2 : 0;
  const selection = TextSelection.create(
    tr.doc,
    initialSelection.from + offset,
    initialSelection.to + offset,
  );
  tr = tr.setSelection(selection);
  tr = joinListNode(tr, schema, listFromPos);
  return tr;
}
