// @flow

import {Transform, liftTarget} from 'prosemirror-transform';
import {Selection} from 'prosemirror-state';
import nullthrows from 'nullthrows';

// Lift the selected block, or the closest ancestor block of the
// selection that can be lifted, out of its parent node.
export default function lift(
  tr: Transform,
): Transform {
  const {selection} = tr;
  if (!selection) {
    return tr;
  }
  const $from = selection.$from;
  const $to = selection.$to;
  const range = $from.blockRange($to);
  if (range) {
    const target = liftTarget(range);
    if (target !== null) {
      tr = tr.lift(range, target);
    }
  }
  return tr;
}
