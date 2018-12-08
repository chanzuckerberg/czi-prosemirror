// @flow

import {ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';
import {LIST_ITEM} from './NodeNames';
import {ATTRIBUTE_INDENT, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from './Types';

const OrderedListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: 1},
    indent: {default: MIN_INDENT_LEVEL},
    listStyleType: {default: null},
    start: {default: 1},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ol',
    getAttrs(dom: HTMLElement) {
      const listStyleType = dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE) || null;

      const start = dom.hasAttribute('start') ?
        parseInt(dom.getAttribute('start'), 10) :
        1;

      const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
        parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
        MIN_INDENT_LEVEL;

      return {
        indent,
        listStyleType,
        start,
      };
    },
  }],
  toDOM(node: Node) {
    const {start, indent, listStyleType} = node.attrs;
    const attrs: Object = {};

    if (start > 1) {
      attrs.start = start;
    }

    if (indent !== MIN_INDENT_LEVEL) {
      attrs[ATTRIBUTE_INDENT] = indent;
    }

    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    return ['ol', attrs, 0];
  },
};

export default OrderedListNodeSpec;
