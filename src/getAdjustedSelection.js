// @flow
// https://bitbucket.org/atlassian/atlaskit/src/98fad88c63576f0464984d21057ac146d4ca131a/packages/editor-core/src/plugins/lists/index.ts?at=ED-870-list-plugin&fileviewer=file-view-default

import {Selection, TextSelection} from 'prosemirror-state';
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

/**
 * Sometimes a selection in the editor can be slightly offset, for example:
 * it's possible for a selection to start or end at an empty node at the very
 * end of a line. This isn't obvious by looking at the editor and it's likely
 * not what the user intended - so we need to adjust the seletion a bit in
 * scenarios like that.
 */
export default function getAdjustedSelection(
  doc: Node,
  selection: Selection,
): Selection {
  let {$from, $to} = selection;

  const isSameLine = $from.pos === $to.pos;

  if (isSameLine) {
    $from = doc.resolve($from.start($from.depth));
    $to = doc.resolve($from.end($from.depth));
  }

  let startPos = $from.pos;
  let endPos = $to.pos;

  if (isSameLine && startPos === doc.nodeSize - 3) {
    // Line is empty, don't do anything
    return selection;
  }

  if ($from.nodeBefore) {
    if (!isSameLine) {
      // Selection started at the very beginning of a line and therefor points
      // to the previous line.
      startPos++;
      let node = doc.nodeAt(startPos);
      while (!node || (node && !node.isText)) {
        startPos++;
        node = doc.nodeAt(startPos);
      }
    } else if (!$from.nodeAfter) {
      // Selection started AND ended at the very end of a line.
      startPos--;
      let node = doc.nodeAt(startPos);
      while (!node || (node && !node.isText)) {
        startPos--;
        node = doc.nodeAt(startPos);
      }
    }
  }

  if ($to.parentOffset) {
    endPos--;
  } else if ($to.nodeAfter && !($from.nodeAfter && isSameLine)) {
    // Selection ended at the very end of a line and therefor points to the
    // next line.
    endPos--;
    let node = doc.nodeAt(endPos);
    while (node && !node.isText) {
      endPos--;
      node = doc.nodeAt(endPos);
    }
  }

  if (!($from.parent && $from.parent.isTextblock && !$from.parent.textContent)) {
    // Make sure we're not on an empty paragraph. Then we won't need this.
    let node = doc.nodeAt(startPos);
    while (!node || (node && !node.isText)) {
      startPos++;
      node = doc.nodeAt(startPos);
    }
  }

  if (!($to.parent && $to.parent.isTextblock && !$to.parent.textContent)) {
    // Make sure we're not on an empty paragraph. Then we won't need this.
    let node = doc.nodeAt(endPos);
    while (!node || (node && !node.isText)) {
      endPos--;
      node = doc.nodeAt(endPos);
    }
  }

  if (endPos === startPos) {
    return new TextSelection(doc.resolve(startPos));
  }

  return new TextSelection(doc.resolve(startPos), doc.resolve(endPos));
}
