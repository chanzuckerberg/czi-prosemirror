// @flow

import findNodePosition from './findNodePosition';
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

export default function deleteNode(
  tr: Transform,
  target: Node,
): Transform {
  if (!tr.doc) {
    return tr;
  }
  const pos = findNodePosition(tr.doc, target);
  const from = pos - 1;
  const to = pos + target.content.size + 1;
  // TODO: This may throw error if the position is out of range.
  // It should check whether position is valid.
  try {
    return tr.delete(from, to);
  } catch (ex) {
    return tr;
  }
}
