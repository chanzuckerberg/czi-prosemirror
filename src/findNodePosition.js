// @flow

import {Node} from 'prosemirror-model';

export default function findNodePosition(doc: Node, target: Node): number {
  // TODO: improve the performance of this. We should not need to iterate all
  // nodes in doc to find the position. there must be a faster way to do this.
  let result = -1;
  doc.descendants((node, pos) => {
    if (target === node) {
      result = pos;
      return false;
    }
  });
  return result;
}
