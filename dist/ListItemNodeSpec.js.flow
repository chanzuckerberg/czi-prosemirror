// @flow

import {Node} from 'prosemirror-model';

import type {NodeSpec} from './Types';

export const ATTRIBUTE_LIST_STYLE_TYPE = 'data-list-style-type';

const ALIGN_PATTERN = /(left|right|center|justify)/;

function getAttrs(dom: HTMLElement) {
  const attrs = {};
  const {textAlign} = dom.style;
  let align = dom.getAttribute('data-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  if (align) {
    attrs.align = align;
  }
  return attrs;
}

const ListItemNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
  },

  // NOTE:
  // This spec does not support nested lists (e.g. `'paragraph block*'`)
  // as content because of the complexity of dealing with indentation
  // (context: https://github.com/ProseMirror/prosemirror/issues/92).
  content: 'paragraph',

  parseDOM: [{tag: 'li', getAttrs}],

  // NOTE:
  // This method only defines the minimum HTML attributes needed when the node
  // is serialized to HTML string. Usually this is called when user copies
  // the node to clipboard.
  // The actual DOM rendering logic is defined at `src/ui/ListItemNodeView.js`.
  toDOM(node: Node): Array<any> {
    const attrs = {};
    const {align} = node.attrs;
    if (align) {
      attrs['data-align'] = align;
    }
    return ['li', attrs, 0];
  },
};

export default ListItemNodeSpec;
