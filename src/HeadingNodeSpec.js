// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

const EMPTY_OBJECT = {};

const TAG_NAME_TO_LEVEL = {
  'H1': 1,
  'H2': 2,
  'H3': 3,
  'H4': 4,
  'H5': 5,
  'H6': 6,
};

function getAttrs(dom: HTMLElement) {
  const {textAlign} = dom.style;
  let align = dom.getAttribute('align') || textAlign || '';
  align = /(left|right|center|justify)/.test(align) ? align : null;

  const level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1;
  return {align, level};
}

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const HeadingNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    level: {default: 1},
  },
  content: "inline*",
  defining: true,
  group: "block",
  parseDOM: [
    {tag: 'h1', getAttrs},
    {tag: 'h2', getAttrs},
    {tag: 'h3', getAttrs},
    {tag: 'h4', getAttrs},
    {tag: 'h5', getAttrs},
    {tag: 'h6', getAttrs},
  ],
  toDOM(node) {
    let {attrs} = node;
    if (attrs.align) {
      attrs = {style: `text-align: ${node.attrs.align}`};
    } else {
      attrs = EMPTY_OBJECT;
    }
    const tag = 'h' + (node.attrs.level || 1);
    return [tag, attrs, 0];
  },
};

export default HeadingNodeSpec;
