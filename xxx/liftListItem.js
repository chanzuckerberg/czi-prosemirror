// @flow

import liftOutOfList from './liftOutOfList';
import liftToOuterList from './liftToOuterList';
import {Schema} from 'prosemirror-model';
import {Transform, liftTarget} from 'prosemirror-transform';

export default function liftListItem(
  tr: Transform,
  schema: Schema,
): Transform {
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const itemType = schema.nodes.listItem;
  if (!itemType) {
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
  if ($from.node(range.depth - 1).type == itemType) {
    return liftToOuterList(tr, itemType, range);
  } else {
    // Outer list node
    return liftOutOfList(tr, range);
  }
}
