// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import {Node, ResolvedPos, NodeType} from 'prosemirror-model';
import findAncestorPosition from './findAncestorPosition';

/**
 * Returns all top-level ancestor-nodes between $from and $to
 */
export default function getAncestorNodesBetween(
  doc: Node,
  $from: ResolvedPos,
  $to: ResolvedPos,
): Array<Node> {
  const nodes = [];
  const maxDepth = findAncestorPosition(doc, $from).depth;
  let current = doc.resolve($from.start(maxDepth));

  while (current.pos <= $to.start($to.depth)) {
    const depth = Math.min(current.depth, maxDepth);
    const node = current.node(depth);

    if (node) {
      nodes.push(node);
    }

    let next: ResolvedPos = doc.resolve(current.after(depth));
    if (next.start(depth) >= doc.nodeSize - 2) {
      break;
    }

    if (next.depth !== current.depth) {
      next = doc.resolve(next.pos + 2);
    }

    if (next.depth) {
      current = doc.resolve(next.start(next.depth));
    } else {
      current = doc.resolve(next.end(next.depth));
    }
  }

  return nodes;
}
