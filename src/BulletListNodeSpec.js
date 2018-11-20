// @flow

import {ATTRIBUTE_LIST_STYLE_TYPE} from './ListItemNodeSpec';
import {LIST_ITEM} from './NodeNames';
import {ATTRIBUTE_INDENT, MAX_INDENT_LEVEL, MIN_INDENT_LEVEL} from './ParagraphNodeSpec';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const BulletListNodeSpec: NodeSpec = {
  attrs: {
    id: {default: null},
    indent: {default: 0},
    listStyleType: {default: null},
  },
  group: 'block',
  content: LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ul',
    getAttrs(dom: HTMLElement) {
      const listStyleType = dom.getAttribute(ATTRIBUTE_LIST_STYLE_TYPE) || null;

      const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
        parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
        MIN_INDENT_LEVEL;

      return {
        indent,
        listStyleType,
      };
    },
  }],
  toDOM(node: Node) {
    const {indent, listStyleType} = node.attrs;
    const attrs = {};
    if (indent) {
      attrs[ATTRIBUTE_INDENT] = indent;
    }
    if (listStyleType) {
      attrs[ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }
    return ['ul', attrs, 0];
  },
};

export default BulletListNodeSpec;
