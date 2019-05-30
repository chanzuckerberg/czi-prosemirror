// @flow

import uuid from '../src/ui/uuid';
import {Fragment, Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform, canSplit} from 'prosemirror-transform';
import {LIST_ITEM, ORDERED_LIST, BULLET_LIST, PARAGRAPH} from './NodeNames';
import {findParentNodeOfType} from 'prosemirror-utils';

// Build a command that splits a list item by the current cursor's position.
// Some examples:
// - split before item's text:
//   - before:
//     1. <cursor>AA
//     2. BB
//     3. CC
//   - after:
//     1. <cursor>
//     2. AA
//     3. BB
//     4. CC
// - split between item's text:
//   - before:
//     1. AA
//     2. B<cursor>B
//     3. CC
//   - after:
//     1. AA
//     2. B
//     3. B
//     4. CC
// - split after item's text:
//   - before:
//     1. AA
//     2. BB<cursor>
//     3. CC
//   - after:
//     1. AA
//     2. BB
//     3. <cursor>
//     4. CC
// - split at item with empty content:
//   - before:
//     1. AA
//     2. <cursor>
//     3. CC
//   - after:
//     1. AA
//     <cursor>
//     2. BB
//     3. CC
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
    // In an empty list item.
    return splitEmptyListItem(tr, schema);
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

// This splits an item with empty content:
//   - before:
//     1. AA
//     2. <cursor>
//     3. CC
//   - after:
//     1. AA
//     <cursor>
//     2. BB
//     3. CC
function splitEmptyListItem(tr: Transform, schema: Schema): Transform {
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
    // Cursor is not inside an empty list item.
    return tr;
  }

  const listFound =
    (orderedListType && findParentNodeOfType(orderedListType)(tr.selection)) ||
    (bulletListType && findParentNodeOfType(bulletListType)(tr.selection));

  if (!listFound) {
    // Cursor isn't inside an list.
    return tr;
  }

  const $listItemPos = tr.doc.resolve(listItemFound.pos);
  const listItemIndex = $listItemPos.index($listItemPos.depth);
  const listFoundNode = listFound.node;
  if (
    listFoundNode.childCount < 3 ||
    listItemIndex < 1 ||
    listItemIndex >= listFoundNode.childCount - 1
  ) {
    // - The list must have at least three list items
    // - The cursor must be after the first list item and before the last list
    //   item.
    // If both conditions don't match, bails out, which will remove the empty
    // item.
    return tr;
  }

  // Find the name of the current list to split. If the name isn't available,
  // assigns a new name.
  let {name} = listFoundNode.attrs;
  if (!name) {
    name = uuid();
    tr = tr.setNodeMarkup(
      listFound.pos,
      listFoundNode.type,
      {
        ...listFoundNode.attrs,
        name,
      },
      listFoundNode.marks
    );
  }

  // We'll split the list into two lists.
  // the first liust contains the items before the cursor, and the second
  // list contains the items after the cursor and the second list will "follow"
  // the first list by sharing the same counter variable.
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
    listAttrs.following = name;
  }

  const insertFrom = deleteFrom + 1;
  const listNode = sourceListNode.type.create(listAttrs, slicedItems.content);
  tr = tr.insert(insertFrom, listNode);
  const paragraph = paragraphType.create({}, Fragment.empty);
  tr = tr.insert(insertFrom, paragraph);
  tr = tr.setSelection(TextSelection.create(tr.doc, insertFrom));
  return tr;
}
