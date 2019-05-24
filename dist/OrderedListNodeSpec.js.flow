// @flow

import {Node} from 'prosemirror-model';

import {ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';
import {LIST_ITEM} from './NodeNames';
import {ATTRIBUTE_INDENT, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';

import type {NodeSpec} from './Types';

const ATTRIBUTE_COUNTER_RESET = 'data-counter-reset';
const AUTO_LIST_STYLE_TYPES = ['decimal', 'lower-alpha', 'lower-roman'];

const OrderedListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: null},
    counterReset: {default: null},
    indent: {default: MIN_INDENT_LEVEL},
    listStyleType: {default: null},
    start: {default: 1},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [
    {
      tag: 'ol',
      getAttrs(dom: HTMLElement) {
        const listStyleType = dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE);
        const counterReset =
          dom.getAttribute(ATTRIBUTE_COUNTER_RESET) || undefined;

        const start = dom.hasAttribute('start')
          ? parseInt(dom.getAttribute('start'), 10)
          : 1;

        const indent = dom.hasAttribute(ATTRIBUTE_INDENT)
          ? parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10)
          : MIN_INDENT_LEVEL;

        return {
          counterReset,
          indent,
          listStyleType,
          start,
        };
      },
    },
  ],
  toDOM(node: Node) {
    const {start, indent, listStyleType, counterReset} = node.attrs;
    const attrs: Object = {
      [ATTRIBUTE_INDENT]: indent,
    };
    if (counterReset === 'none') {
      attrs[ATTRIBUTE_COUNTER_RESET] = counterReset;
    }

    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    if (start !== 1) {
      attrs.start = start;
    }

    let htmlListStyleType = listStyleType;

    if (!htmlListStyleType || htmlListStyleType === 'decimal') {
      htmlListStyleType =
        AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }

    const cssCounterName = `czi-counter-${indent}`;

    attrs.style =
      `--czi-counter-name: ${cssCounterName};` +
      `--czi-counter-reset: ${start - 1};` +
      `--czi-list-style-type: ${htmlListStyleType}`;

    attrs.type = htmlListStyleType;

    return ['ol', attrs, 0];
  },
};

export default OrderedListNodeSpec;
