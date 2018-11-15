// @flow

import {LIST_ITEM} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ATTRIBUTE_INDENT = 'data-indent';

const DEFAULT_DOM = [
  'ol',
  {start: 1, [ATTRIBUTE_INDENT]: 0},
  0,
];

const OrderedListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: null},
    indent: {default: 0},
    order: {default: 1},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ol',
    getAttrs(dom: HTMLElement) {
      const order = dom.hasAttribute('start') ?
        parseInt(dom.getAttribute('start'), 10) :
        0;
      const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
        parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
        0;
      return {
        indent,
        order,
      };
    },
  }],
  toDOM(node: Node) {
    const {order, indent} = node.attrs;
    return order === 1 && indent === 0 ?
      DEFAULT_DOM :
      [
        'ol',
        {
          start: order,
          [ATTRIBUTE_INDENT]: indent,
        },
        0,
      ];
  },
};

export default OrderedListNodeSpec;
