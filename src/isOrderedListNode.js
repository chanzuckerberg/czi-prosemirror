// @flow

import {Node} from 'prosemirror-model';
import OrderedListNodeSpec from './OrderedListNodeSpec';

export default function isOrderedListNode(node: Node): boolean {
  return node.type.name === OrderedListNodeSpec.name;
}
