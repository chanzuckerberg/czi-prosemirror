// @flow

import {Node} from 'prosemirror-model';
import OrderListNodeSpec from './BulletListNodeSpec';

export default function isOrderedListNode(node: Node): boolean {
  return node.type.name === OrderListNodeSpec .name;
}
