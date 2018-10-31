// @flow

import {Node, NodeType} from 'prosemirror-model';
import {Fragment, Schema, Slice} from 'prosemirror-model';
import {canSplit, Transform} from 'prosemirror-transform';

// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
export default function splitListItem(
  tr: Transform,
  schema: Schema,
): Transform {
  const nodeType = schema.nodes.listItem;
  if (!nodeType) {
    return tr;
  }

  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  let {$from, $to, node} = selection;
  if ((node && node.isBlock) || $from.depth < 2 || !$from.sameParent($to)) {
    return tr;
  };

  let grandParent = $from.node(-1)
  if (grandParent.type !== nodeType) {
    return tr;
  }

  if ($from.parent.content.size == 0) {
    // In an empty block. If this is a nested list, the wrapping
    // list item should be split. Otherwise, bail out and let next
    // command handle lifting.
    if (
      $from.depth == 2 || $from.node(-3).type !== nodeType ||
      $from.index(-2) != $from.node(-2).childCount - 1
    ) {
      return tr;
    }

    let wrap = Fragment.empty;
    let keepItem = $from.index(-1) > 0;
    // Build a fragment containing empty versions of the structure
    // from the outer list item to the parent node of the cursor
    for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
      wrap = Fragment.from($from.node(d).copy(wrap));
    }

    // Add a second list item with an empty default start node
    wrap = wrap.append(Fragment.from(nodeType.createAndFill()));
    tr = tr.replace(
      $from.before(keepItem ? null : -1),
      $from.after(-3),
      new Slice(wrap, keepItem ? 3 : 2, 2),
    )

    const pos = $from.pos + (keepItem ? 3 : 2);
    tr = tr.setSelection(selection.constructor.near(tr.doc.resolve(pos)));
    return tr;
  }

  let nextType = $to.pos == $from.end() ?
    grandParent.contentMatchAt($from.indexAfter(-1)).defaultType :
    null;

  tr = tr.delete($from.pos, $to.pos)
  let types = nextType && [null, {type: nextType}];
  if (!canSplit(tr.doc, $from.pos, 2, types)) {
    return tr;
  }

  return tr.split($from.pos, 2, types);
}
