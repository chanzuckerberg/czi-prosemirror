// @flow
// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js

import {NodeSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {canJoin} from 'prosemirror-transform';
import {joinPoint} from 'prosemirror-transform';

// Join the selected block or, if there is a text selection, the
// closest ancestor block of the selection that can be joined, with
// the sibling above it.
export default function joinUp(tr: Transform): Transform {
  const sel = tr.selection;
  const nodeSel = sel instanceof NodeSelection;
  let point;
  if (nodeSel) {
    if (sel.node.isTextblock || !canJoin(tr.doc, sel.from)) {
      return tr;
    }
    point = sel.from;
  } else {
    point = joinPoint(tr.doc, sel.from, -1);
    if (point === null || point === undefined) {
      return tr;
    }
  }

  tr = tr.join(point);
  if (nodeSel) {
    tr = tr.setSelection(
      NodeSelection.create(
        tr.doc,
        point - tr.doc.resolve(point).nodeBefore.nodeSize,
      ),
    );
  }

  return tr;
}
