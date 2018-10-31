// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import getAncestorNodesBetween from './getAncestorNodesBetween';
import isListNode from '../src/isListNode';
import {Node, ResolvedPos, NodeType} from 'prosemirror-model';
/**
 * Step through block-nodes between $from and $to and return true if a node is a
 * bullet_list or ordered_list
 */
export default function isRangeWithList(
  doc: Node,
  $from: ResolvedPos,
  $to: ResolvedPos,
): boolean {
  return getAncestorNodesBetween(doc, $from, $to).some(isListNode);
}
