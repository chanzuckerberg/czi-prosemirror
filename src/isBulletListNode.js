// @flow

import {Node} from 'prosemirror-model';
import BulletListNodeSpec from './BulletListNodeSpec';

export default function isBulletListNode(node: Node): boolean {
  return node.type.name === BulletListNodeSpec.name;
}
