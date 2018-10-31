// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import {Node, NodeType} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import findAncestorPosition from './findAncestorPosition';

/**
 * Determines if content inside a selection can be joined with the previous
 * block.
 * We need this check since the built-in method for "joinUp" will join a
 * orderedList with bulletList.
 */
export default function canJoinUp(
  selection: Selection,
  doc: Node,
  nodeType: NodeType,
): boolean {
  const pos = findAncestorPosition(doc, selection.$to).depth;
  const res = doc.resolve(selection.$to.before(pos));
  return res.nodeBefore && res.nodeBefore.type === nodeType;
}
