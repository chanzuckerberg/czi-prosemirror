// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import findAncestorPosition from './findAncestorPosition';
import hasCommonAncestor from './hasCommonAncestor';
import {Node, ResolvedPos} from 'prosemirror-model';

/**
 * Finds all "selection-groups" within a range. A selection group is based on
 * ancestors.
 *
 * Example:
 * Given the following document and selection ({<} = start of selection and
 * {>} = end)
 *  doc
 *    blockquote
 *      ul
 *        li
 *        li{<}
 *        li
 *     p
 *     p{>}
 *
 * The output will be two selection-groups. One within the ul and one with the
 * two paragraphs.
 */
export default function getGroupsInRange(
  doc: Node,
  $from: ResolvedPos,
  $to: ResolvedPos,
  isNodeValid: (node: Node) => boolean,
): Array<{$from: ResolvedPos, $to: ResolvedPos}> {
  const groups = [];
  const commonAncestor = hasCommonAncestor(doc, $from, $to);
  const fromAncestor = findAncestorPosition(doc, $from);

  if (
    commonAncestor ||
    (fromAncestor.depth === 1 && isNodeValid($from.node(1)))
  ) {
    groups.push({ $from, $to });
  } else {
    let current = $from;
    while (current.pos < $to.pos) {
      let ancestorPos = findAncestorPosition(doc, current);
      while (ancestorPos.depth > 1) {
        ancestorPos = findAncestorPosition(doc, ancestorPos);
      }
      const endPos = doc.resolve(Math.min(
        // should not be smaller then start position in case of an empty paragpraph for example.
        Math.max(
          ancestorPos.start(ancestorPos.depth),
          ancestorPos.end(ancestorPos.depth) - 1,
        ),
        $to.pos,
      ));

      groups.push({
        $from: current,
        $to: endPos
      });

      current = doc.resolve(Math.min(endPos.after(1) + 1, doc.nodeSize - 2));
    }
  }
  return groups;
}
