// @flow

import {LIST_ITEM} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ATTRIBUTE_INDENT = 'data-indent';
const DEFAULT_DOM = [
  'ul',
  {indent: 0},
  0,
];

const BulletListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: null},
    indent: {default: 0},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ul',
    getAttrs(dom: HTMLElement) {
      const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
        parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
        0;
      return {
        indent,
      };
    },
  }],
  toDOM(node: Node) {
    const {indent} = node.attrs;
    return indent === 0 ?
      DEFAULT_DOM :
      [
        'ul',
        {
          [ATTRIBUTE_INDENT]: indent,
        },
        0,
      ];
  },
};

export default BulletListNodeSpec;
