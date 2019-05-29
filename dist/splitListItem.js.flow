// @flow

import {Fragment, Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform, canSplit} from 'prosemirror-transform';
import {LIST_ITEM, ORDERED_LIST, BULLET_LIST, PARAGRAPH} from './NodeNames';
import {findParentNodeOfType} from 'prosemirror-utils';

// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
export default function splitListItem(
  tr: Transform,
  schema: Schema
): Transform {
  const nodeType = schema.nodes[LIST_ITEM];
  if (!nodeType) {
    return tr;
  }

  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  const {$from, $to, node} = selection;
  if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
    return tr;
  }

  const grandParent = $from.node(-1);
  if (grandParent.type !== nodeType) {
    return tr;
  }

  if ($from.parent.content.size == 0) {
    // In an empty block. If this is a nested list, the wrapping
    // list item should be split. Otherwise, bail out and let next
    // command handle lifting.
    // if (
    //   $from.depth == 2 ||
    //   $from.node(-3).type !== nodeType ||
    //   $from.index(-2) != $from.node(-2).childCount - 1
    // ) {
    //   return tr;
    // }

    // let wrap = Fragment.empty;
    // const keepItem = $from.index(-1) > 0;
    // // Build a fragment containing empty versions of the structure
    // // from the outer list item to the parent node of the cursor
    // for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
    //   wrap = Fragment.from($from.node(d).copy(wrap));
    // }

    // // Add a second list item with an empty default start node
    // wrap = wrap.append(Fragment.from(nodeType.createAndFill()));
    // tr = tr.replace(
    //   $from.before(keepItem ? null : -1),
    //   $from.after(-3),
    //   new Slice(wrap, keepItem ? 3 : 2, 2)
    // );

    // const pos = $from.pos + (keepItem ? 3 : 2);
    // tr = tr.setSelection(selection.constructor.near(tr.doc.resolve(pos)));
    return insertParagraphAndSplitBlankListItem(tr, schema);
  }

  const nextType =
    $to.pos == $from.end()
      ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType
      : null;

  tr = tr.delete($from.pos, $to.pos);
  const types = nextType && [null, {type: nextType}];
  if (!canSplit(tr.doc, $from.pos, 2, types)) {
    return tr;
  }

  return tr.split($from.pos, 2, types);
}

function insertParagraphAndSplitBlankListItem(
  tr: Transform,
  schema: Schema
): Transform {
  const listItemType = schema.nodes[LIST_ITEM];
  const orderedListType = schema.nodes[ORDERED_LIST];
  const bulletListType = schema.nodes[BULLET_LIST];
  const paragraphType = schema.nodes[PARAGRAPH];
  if (!listItemType || !paragraphType) {
    // Schema does not support the nodes expected.
    return tr;
  }
  const listItemFound = findParentNodeOfType(listItemType)(tr.selection);
  if (!listItemFound || listItemFound.node.textContent !== '') {
    // Selection cursor is not inside an empty list item.
    return tr;
  }

  const listFound =
    (orderedListType && findParentNodeOfType(orderedListType)(tr.selection)) ||
    (bulletListType && findParentNodeOfType(bulletListType)(tr.selection));

  if (!listFound) {
    // Selection isn't inside an list.
    return tr;
  }

  const $listItemPos = tr.doc.resolve(listItemFound.pos);
  const listItemIndex = $listItemPos.index($listItemPos.depth);
  if (
    listFound.node.childCount < 3 ||
    listItemIndex < 1 ||
    listItemIndex >= listFound.node.childCount - 1
  ) {
    // - The list must have at least three list items
    // - The cursor must be after the first list item and before the last list
    //   item.
    // If both conditions don't match, bails out.
    return tr;
  }

  const sliceFrom = listItemFound.pos + listItemFound.node.nodeSize;
  const sliceTo = listFound.pos + listFound.node.nodeSize - 1;
  const slicedItems = tr.doc.slice(sliceFrom, sliceTo, false);

  const deleteFrom = listItemFound.pos;
  const deleteTo = listFound.pos + listFound.node.nodeSize;
  tr = tr.delete(deleteFrom, deleteTo);
  const sourceListNode = listFound.node;
  const listAttrs = {...sourceListNode.attrs};
  if (orderedListType === sourceListNode.type) {
    listAttrs.counterReset = 'none';
  }

  const insertFrom = deleteFrom + 1;
  const listNode = sourceListNode.type.create(listAttrs, slicedItems.content);
  tr = tr.insert(insertFrom, listNode);
  const paragraph = paragraphType.create({}, Fragment.empty);
  tr = tr.insert(insertFrom, paragraph);
  tr = tr.setSelection(TextSelection.create(tr.doc, insertFrom));
  return tr;
}
