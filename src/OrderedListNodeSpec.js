// @flow

import {LIST_ITEM} from './NodeNames';
import {MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ATTRIBUTE_INDENT = 'data-indent';

const DEFAULT_DOM = [
  'ol',
  {start: 1, [ATTRIBUTE_INDENT]: MIN_INDENT_LEVEL},
  0,
];

const OrderedListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: 1},
    indent: {default: MIN_INDENT_LEVEL},
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
        MIN_INDENT_LEVEL;
      return {
        indent,
        order,
      };
    },
  }],
  toDOM(node: Node) {
    const {order, indent} = node.attrs;
    return order === 1 && indent === MIN_INDENT_LEVEL ?
      DEFAULT_DOM :
      [
        'ol',
        {
          start: order,
          [ATTRIBUTE_INDENT]: indent || MIN_INDENT_LEVEL,
        },
        0,
      ];
  },
};

export default OrderedListNodeSpec;
