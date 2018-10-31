// @flow

import {Transform, liftTarget} from 'prosemirror-transform';
import {Schema} from 'prosemirror-model';

export default function liftListItem(
  tr: Transform,
  schema: Schema,
): Transform {
  const {selection} = tr;
  if (!selection) {
    return tr;
  }

  let { $from, $to } = selection;
  let { listItem, paragraph } = schema.nodes;
  let range = $from.blockRange($to, (node) => {
    if (node && node.firstChild) {
      return node.type === listItem&& node.firstChild.type === paragraph;
    }
    return false;
  });

  if (!range) {
    return tr;
  }

  const target = range && liftTarget(range);

  if (target === undefined || target === null) {
    return tr;
  }

  return tr.lift(range, target);
}
