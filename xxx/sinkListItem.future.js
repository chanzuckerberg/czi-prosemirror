// @flow
// https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js

import {Schema, NodeType, Fragment, Slice} from 'prosemirror-model';
import {ReplaceAroundStep, Transform} from 'prosemirror-transform';

// Create a command to sink the list item around the selection down
// into an inner list.
export default function sinkListItem(
  tr: Transform,
  schema: Schema,
): Transform {
  const itemType = schema.nodes.list_item;
  if (!itemType) {
    return tr;
  }
  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  let {$from, $to} = selection;
  let range = $from.blockRange(
    $to,
    node => node.childCount && node.firstChild.type == itemType,
  );
  if (!range) {
    return tr;
  }

  let startIndex = range.startIndex
  if (startIndex == 0) {
    return tr;
  }
  let parent = range.parent;
  let nodeBefore = parent.child(startIndex - 1);
  if (nodeBefore.type !== itemType) {
    return tr;
  };

  let nestedBefore =
    nodeBefore.lastChild &&
    nodeBefore.lastChild.type == parent.type;

  let inner = Fragment.from(nestedBefore ? itemType.create() : null);
  let slice = new Slice(
    Fragment.from(itemType.create(null, Fragment.from(parent.copy(inner)))),
    nestedBefore ? 3 : 1,
    0,
  );
  let before = range.start;
  let after = range.end
  tr = tr.step(
    new ReplaceAroundStep(
      before - (nestedBefore ? 3 : 1),
      after,
      before,
      after,
      slice,
      1,
      true,
    ),
  );

  return tr;

}
