// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import {Node, ResolvedPos} from 'prosemirror-model';

const NESTABLE_BLOCKS = [
  'blockquote',
  'bullet_list',
  'ordered_list',
];

/**
 * Traverse the document until an "ancestor" is found. Any nestable block can
 * be an ancestor.
 */
export default function findAncestorPosition(
  doc: Node,
  $pos: ResolvedPos,
): ResolvedPos {

  if ($pos.depth === 1) {
    return $pos;
  }

  let node = $pos.node($pos.depth);
  while ($pos.depth  >= 1) {
    $pos = doc.resolve($pos.before($pos.depth));
    node = $pos.node($pos.depth);
    if (node && NESTABLE_BLOCKS.indexOf(node.type.name) !== -1) {
      break;
    }
  }

  return $pos;
}
