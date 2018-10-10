// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js


import deleteNode from './deleteNode';
import findNodePosition from './findNodePosition';
import nullthrows from 'nullthrows';
import {Fragment, Schema, NodeType, ResolvedPos, Slice} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {findParentNodeOfType} from 'prosemirror-utils';

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

export default function sinkListItem(
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

  const {$from, $to} = selection;
  const fromSelection = new TextSelection($from, $from);
  const fromResult =
    findParentNodeOfType(bullet_list)(fromSelection) ||
    findParentNodeOfType(ordered_list)(fromSelection);

  if (!fromResult || !fromResult.node) {
    return tr;
  }
  const toSelection = new TextSelection($to, $to);
  const toResult =
    findParentNodeOfType(bullet_list)(toSelection) ||
    findParentNodeOfType(ordered_list)(toSelection);
  if (!toResult || !toResult.node) {
    return tr;
  }
  if (fromResult.node !== toResult.node) {
    // Select across multiple lists.
    return tr;
  }
  const listNode = fromResult.node;
  const listPos = findNodePosition(tr.doc, listNode);
  const itemStart = findParentNodeOfType(list_item)(fromSelection);
  const itemEnd = findParentNodeOfType(list_item)(toSelection);

  // console.log('list', listNode);
  // console.log('itemStart', itemStart);
  // console.log('itemEnd', itemEnd);

  const listItemNodesBefore = [];
  const listItemNodesSelected = [];
  const listItemNodesAfter = [];
  let listItemPos = listPos + 1;
  for (let ii = 0, jj = listNode.childCount; ii < jj; ii ++) {
    const listItemNode = listNode.child(ii);
    if (listItemPos < itemStart.pos) {
      listItemNodesBefore.push(listItemNode);
    } else if (listItemPos > itemEnd.pos) {
      listItemNodesAfter.push(listItemNode);
    } else {
      listItemNodesSelected.push(listItemNode);
    }
    listItemPos +=  listItemNode.content.size + 2;
  }

  // const text = x => x.textContent;\
  // console.log('before', JSON.stringify(listItemNodesBefore.map(text).join(', ')));
  // console.log('selected', JSON.stringify(listItemNodesSelected.map(text).join(', ')));
  // console.log('after', JSON.stringify(listItemNodesAfter.map(text).join(', ')));

  const {doc} = tr;
  const listNodeBefore = sliceListNode(doc, listNode, listItemNodesBefore);
  const listNodeSelected = sliceListNode(doc, listNode, listItemNodesSelected);
  const listNodeAfter = sliceListNode(doc, listNode, listItemNodesAfter);


  if (listNodeAfter) {
    tr = tr.insert(listPos, listNodeAfter);
  }
  if (listNodeSelected) {
    tr = tr.insert(listPos, listNodeSelected);
  }
  if (listNodeBefore) {
    tr = tr.insert(listPos, listNodeBefore);
  }

  tr = deleteNode(tr, listNode);
  tr = tr.setSelection(fromSelection);

  // tr = tr.delete(listPos, listNode.content.size);
  // console.log(listNodeSelected);


  // while (ii < jj) {
  //   try {
  //     const item = listNode.child(kk);
  //     console.log(`ii : ${ii}`);
  //   } catch (ex) {
  //     console.log(`ii : ${ii}`,  null, kk);
  //   }
  //
  //   ii++;
  //   kk++;
  // }
  // const listItemNode = result.node;
  // const listNodePos = findNodePos(tr.doc, listItemNode);
  // const listNode = tr.doc.resolve(listNodePos).nodeBefore;
  // console.log(listNodePos, listItemNode, listNode);


  // const {$from, $to} = selection;
  // console.log($from, $to);




  return tr;

}
