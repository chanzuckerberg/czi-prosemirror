// @flow

import {LIST_ITEM} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ATTRIBUTE_LEVEL = 'data-level';
const DEFAULT_DOM = [
  'ol',
  {start: 1, [ATTRIBUTE_LEVEL]: 1},
  0,
];

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
const OrderedListNodeSpec: NodeSpec = {
  attrs: {
    order: {
      default: 1,
    },
    level: {
      default: 1,
    },
    identifier: {
      default: '',
    },
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ol',
    getAttrs(dom: HTMLElement) {
      const order = dom.hasAttribute('start') ?
        parseInt(dom.getAttribute('start'), 10) :
        1;
      const level = dom.hasAttribute(ATTRIBUTE_LEVEL) ?
        parseInt(dom.getAttribute(ATTRIBUTE_LEVEL), 10) :
        1;
      return {
        level,
        order,
      };
    },
  }],
  toDOM(node: Node) {
    const {order, level} = node.attrs;
    return order === 1 && level === 1 ?
      DEFAULT_DOM :
      [
        'ol',
        {
          start: order,
          [ATTRIBUTE_LEVEL]: level,
        },
        0,
      ];
  },
};

export default OrderedListNodeSpec;
