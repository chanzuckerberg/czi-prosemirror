// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js

import canJoinDown from './canJoinDown';
import canJoinUp from './canJoinUp';
import findAncestorPosition from './findAncestorPosition';
import getAdjustedSelection from './getAdjustedSelection';
import getGroupsInRange from './getGroupsInRange';
import isListNode from './isListNode';
import isRangeOfType from './isRangeOfType';
import isRangeWithList from './isRangeWithList';
import joinDown from './joinDown';
import joinUp from './joinUp';
import lift from './lift';
import liftSelection from './liftSelection';
import nullthrows from 'nullthrows';
import wrapInList from './wrapInList';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import liftListItem from './liftListItem';
import {findParentNodeOfType} from 'prosemirror-utils';

function findNodePos(
  doc: Node,
  target: Node,
): number {
  let result = -1;
  doc.descendants((node, pos) => {
    if (target === node) {
      result = pos;
      return false;
    }
  })
  return result;
}

// Create a command to sink the list item around the selection down
// into an inner list.
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
  const listPos = findNodePos(tr.doc, listNode);
  console.log(    `
    from ${listNode.type.name} : ${listPos} - ${listPos + listNode.content.size},
    select ${$from.pos} - ${$to.pos}
    `
  );
  // const listItemNode = result.node;
  // const listNodePos = findNodePos(tr.doc, listItemNode);
  // const listNode = tr.doc.resolve(listNodePos).nodeBefore;
  // console.log(listNodePos, listItemNode, listNode);


  // const {$from, $to} = selection;
  // console.log($from, $to);




  return tr;

}
