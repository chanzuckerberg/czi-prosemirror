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
import {Schema, NodeType, ResolvedPos} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import liftListItem from './liftListItem';

// Create a command to sink the list item around the selection down
// into an inner list.
export default function sinkListItem(
  tr: Transform,
  schema: Schema,
): Transform {
  if (
    !schema.nodes.bullet_list ||
    !schema.nodes.ordered_list ||
    !schema.nodes.list_item
  ) {
    return tr;
  }

  const initialSelection = tr.selection;
  if (!initialSelection) {
    return tr;
  }

  const groups = getGroupsInRange(
    tr.doc,
    initialSelection.$from,
    initialSelection.$to,
    isListNode,
  );

  const {$from} = groups[0];
  const {$to} = groups[groups.length - 1];
  tr = tr.setSelection(new TextSelection($from, $to));

  const adjustedSelection = getAdjustedSelection(
    nullthrows(tr.doc),
    nullthrows(tr.selection),
  );

  return tr;

}
