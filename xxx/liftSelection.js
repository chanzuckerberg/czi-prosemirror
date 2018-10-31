// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/utils/index-future.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import findAncestorPosition from './findAncestorPosition';
import nullthrows from 'nullthrows';
import {ResolvedPos, Node} from 'prosemirror-model';
import {Selection, TextSelection, NodeSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {liftTarget} from 'prosemirror-transform';

/**
 * Takes a selection $from and $to and lift all text nodes from their parents
 * to document-level
 */
export default function liftSelection(
  tr: Transform,
  $from: ResolvedPos,
  $to: ResolvedPos,
) {
  if (!tr.doc) {
    return tr;
  }
  let startPos = $from.start($from.depth);
  let endPos = $to.end($to.depth);
  const target = Math.max(0, findAncestorPosition(tr.doc, $from).depth - 1);

  tr.doc.nodesBetween(startPos, endPos, (node, pos) => {
    if (
      node.isText ||                          // Text node
      (node.isTextblock && !node.textContent) // Empty paragraph
    ) {
      const res = tr.doc.resolve(tr.mapping.map(pos));
      const sel = new NodeSelection(res);
      const range = nullthrows(sel.$from.blockRange(sel.$to));
      const target = liftTarget(range);
      if (target || target === 0) {
        tr = tr.lift(range, target);
      }
    }
  });

  startPos = tr.mapping.map(startPos);
  endPos = tr.mapping.map(endPos);

  // We want to select the entire node
  endPos = tr.doc.resolve(endPos).end(tr.doc.resolve(endPos).depth);

  tr = tr.setSelection(
    new TextSelection(
      tr.doc.resolve(startPos),
      tr.doc.resolve(endPos),
    ),
  );

  return tr;
}
