// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js
// https://discuss.prosemirror.net/t/changing-doc-attrs/784/17

import deleteNode from './deleteNode';
import findNodePosition from './findNodePosition';
import nullthrows from 'nullthrows';
import setNodeAttrs from './setNodeAttrs';
import {Fragment, Schema, NodeType, ResolvedPos, Slice} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform, Step, StepResult} from 'prosemirror-transform';
import isListNode from './isListNode';

const MAX_INDENT_LEVEL = 8;

function findListNode(doc: Node, pos: number): ?Node {
  const $pos = doc.resolve(pos);
  const {path} = $pos;
  let ii = path.length - 1;
  while (ii > -1) {
    const mm = path[ii];
    if (mm instanceof Node && isListNode(mm)) {
      return mm;
    }
    ii--;
  }
  return null;
}

function findListItemNode(doc: Node, pos: number): ?Node {
  const $pos = doc.resolve(pos);
  const {path} = $pos;
  let ii = path.length - 1;
  while (ii > -1) {
    const mm = path[ii];
    if (mm instanceof Node && mm.type && mm.type.name === 'list_item') {
      return mm;
    }
    ii--;
  }
  return null;
}


function sliceListNode(
  doc: Node,
  listNode: Node,
  listItemNodes: Array<Node>,
): ?Fragment {
  if (listItemNodes.length == 0) {
    return null;
  }
  const firstNode = listItemNodes[0];
  const lastNode = listItemNodes[listItemNodes.length - 1];
  const from = findNodePosition(doc, firstNode);
  const to = findNodePosition(doc, lastNode) + lastNode.content.size;
  const slice = doc.slice(from, to);
  return Fragment.from(listNode.copy(slice.content));
}

export default function indentListItemMore(
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

  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  console.log(selection.from);

  return tr;
}

export function xxxindentListItemMore(
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

  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  const fromListNode = findListNode(tr.doc, selection.from);
  const toListNode = findListNode(tr.doc, selection.to);
  if (!fromListNode || fromListNode !== toListNode) {
    return tr;
  }


  const itemStart = findListItemNode(tr.doc, selection.from);
  const itemEnd = findListItemNode(tr.doc, selection.to);
  if (!itemStart || !itemEnd) {
    return tr;
  }

  const listNode = fromListNode;
  const listPos = findNodePosition(tr.doc, listNode);
  const itemStartPos = findNodePosition(tr.doc, itemStart);
  const itemEndPos = findNodePosition(tr.doc, itemEnd);
  const listItemNodesBefore = [];
  const listItemNodesSelected = [];
  const listItemNodesAfter = [];
  let listItemPos = listPos + 1;
  for (let ii = 0, jj = listNode.childCount; ii < jj; ii ++) {
    const listItemNode = listNode.child(ii);
    if (listItemPos < itemStartPos - 1) {
      listItemNodesBefore.push(listItemNode);
    } else if (listItemPos > itemEndPos) {
      listItemNodesAfter.push(listItemNode);
    } else {
      listItemNodesSelected.push(listItemNode);
    }
    listItemPos +=  listItemNode.content.size + 2;
  }

  const fragmentBefore = sliceListNode(tr.doc, listNode, listItemNodesBefore);
  const fragmentSelected = sliceListNode(tr.doc, listNode, listItemNodesSelected);
  const fragmentAfter = sliceListNode(tr.doc, listNode, listItemNodesAfter);

  let selectionPos = listPos;
  if (fragmentAfter) {
    tr = tr.insert(listPos, fragmentAfter);
  }

  const identifier = {};

  if (fragmentSelected) {
    tr = tr.insert(listPos, fragmentSelected);
    const listNodeSelected = nullthrows(fragmentSelected.content[0]);
    tr = setNodeAttrs(tr, listNodeSelected, {
      order: 1,
      level: Math.min(listNodeSelected.attrs.level + 1,  MAX_INDENT_LEVEL),
      identifier,
    });
  }

  if (fragmentBefore) {
    tr = tr.insert(listPos, fragmentBefore);
  }

  tr = deleteNode(tr, listNode);

  const jj = Math.min(listPos + listNode.content.size, tr.doc.content.size - 1);
  let ii =  Math.max(listPos - 3, 0);
  let targetPos = -1;
  while (ii < jj) {
    const nn = tr.doc.nodeAt(ii);
    if (isListNode(nn) && nn.attrs.identifier === identifier) {
      targetPos = ii;
      tr = setNodeAttrs(tr, nn, {identifier: null});
      break;
    }
    ii++;
  }

  const listSelection = selection.from < selection.to ?
    TextSelection.create(
      tr.doc,
      targetPos + 3,
      targetPos + nullthrows(tr.doc.nodeAt(targetPos)).content.size - 1,
    ) :
    TextSelection.create(
      tr.doc,
      targetPos + 3,
    );

  tr = tr.setSelection(listSelection);
  return tr;

}
