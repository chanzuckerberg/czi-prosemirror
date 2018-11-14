// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const EMPTY_OBJECT = {};

function getAttrs(dom: HTMLElement) {
  const {textAlign} = dom.style;
  let align = dom.getAttribute('align') || textAlign || '';
  align = /(left|right|center|justify)/.test(align) ? align : null;
  return align ? {align} : EMPTY_OBJECT;
}

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const ParagraphNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    id: {default: null},
  },
  content: "inline*",
  group: "block",
  parseDOM: [{tag: 'p', getAttrs}],
  toDOM(node) {
    let {attrs} = node;
    if (attrs.align) {
      attrs = {style: `text-align: ${node.attrs.align}`};
    } else {
      attrs = EMPTY_OBJECT;
    }
    return ['p', attrs, 0];
  },
};

export default ParagraphNodeSpec;
