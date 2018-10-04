// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import getAncestorNodesBetween from './getAncestorNodesBetween';
import {Node, ResolvedPos, NodeType} from 'prosemirror-model';
/**
 * Step through block-nodes between $from and $to and returns false if a node is
 * found that isn't of the specified type
 */
export default function isRangeOfType(
  doc: Node,
  $from: ResolvedPos,
  $to: ResolvedPos,
  nodeType: NodeType,
): boolean {
  return getAncestorNodesBetween(
    doc,
    $from,
    $to
  ).filter(node => node.type !== nodeType).length === 0;
}
