// @flow

import {Node} from 'prosemirror-model';

import isBulletListNode from './isBulletListNode';
import isOrderedListNode from './isOrderedListNode';

export default function isListNode(node: Node): boolean {
  if (node instanceof Node) {
    return isBulletListNode(node) || isOrderedListNode(node);
  }
  return false;
}
