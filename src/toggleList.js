// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/commands/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default

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

export default function toggleList(
  tr: Transform,
  schema: Schema,
  nodeType: NodeType,
): Transform {
  const {
    bullet_list,
    heading,
    list_item,
    ordered_list,
    paragraph,
  } = schema.nodes;
  if (
    !bullet_list ||
    !ordered_list ||
    !list_item ||
    !heading ||
    !paragraph
  ) {
    return tr;
  }

  if (!tr.selection) {
    return tr;
  }

  const initialSelection = tr.selection;
  // const range = tr.selection.$from.blockRange(
  //   tr.selection.$to,
  //   node => {
  //     console.log(node.type && node.type.name);
  //     return node.isBlock;
  //   },
  // );
  // console.log(range.$from.pos, range.$to.pos);
  let fromNode;
  let fromNodePos;
  let toNode;
  let toNodePos;
  let hasInvalidNode;
  const validNodeTypes = new Set([list_item, heading, paragraph]);
  tr.doc.nodesBetween(tr.selection.from, tr.selection.to, (
    node,
    pos,
    parentNode,
    index,
  ) => {
    if (isListNode(node)) {
      return true;
    }
    fromNode = fromNode || node;
    fromNodePos = fromNodePos === undefined ? pos : fromNodePos;
    toNode = node;
    toNodePos = pos;
    hasInvalidNode = hasInvalidNode || !validNodeTypes.has(node.type);
    console.log(node.type && node.type.name, pos);
    return false;
  });

  fromNode = fromNode || {type: {name: null}};
  toNode = toNode || fromNode;

  console.log({
    hasInvalidNode,
    fromNode: fromNode.type.name,
    fromNodePos,
    toNode: toNode.type.name,
    toNodePos,
  });

  if (hasInvalidNode) {
    return tr;
  }

  return tr;
}
