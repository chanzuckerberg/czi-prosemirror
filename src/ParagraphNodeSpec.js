// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const ALIGN_PATTERN = /(left|right|center|justify)/;
const ATTRIBUTE_INDENT = 'data-indent';

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const ParagraphNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    id: {default: null},
    indent: {default: null},
  },
  content: "inline*",
  group: "block",
  parseDOM: [{tag: 'p', getAttrs}],
  toDOM(node) {
    const {align, indent} = node.attrs;
    const attrs = {};

    if (align) {
      attrs.style = `text-align: ${align}`;
    }

    if (indent) {
      attrs[ATTRIBUTE_INDENT] = String(indent);
    }

    return ['p', attrs, 0];
  },
};

function getAttrs(dom: HTMLElement) {
  const {textAlign} = dom.style;
  let align = dom.getAttribute('align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
    parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
    0;

  return {align, indent};
}

export default ParagraphNodeSpec;
