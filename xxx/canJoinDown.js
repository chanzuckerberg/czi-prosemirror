// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import {Node, NodeType} from 'prosemirror-model';
import {Selection} from 'prosemirror-state';
import findAncestorPosition from './findAncestorPosition';

/**
 * Determines if content inside a selection can be joined with the next block.
 * We need this check since the built-in method for "joinDown" will join a
 * ordered_list with bullet_list.
 */
export default function canJoinDown(
  selection: Selection,
  doc: Node,
  nodeType: NodeType,
): boolean {
  const pos = findAncestorPosition(doc, selection.$to).depth;
  const res = doc.resolve(selection.$to.after(pos));
  return res.nodeAfter && res.nodeAfter.type === nodeType;
}
