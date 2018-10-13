// @flow

import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';
import findNodePosition from './findNodePosition';

export default function setNodeAttrs(
  tr: Transform,
  node: Node,
  attrs: Object,
): Transform {
  if (!tr.doc) {
    return tr;
  }
  const pos = findNodePosition(tr.doc, node);
  return tr.setNodeMarkup(pos, null, {
    ...node.attrs,
    ...attrs,
  });
}
