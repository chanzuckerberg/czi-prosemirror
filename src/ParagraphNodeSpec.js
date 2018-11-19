// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

export const MIN_INDENT_LEVEL = 0;
export const MAX_INDENT_LEVEL = 7;
export const ATTRIBUTE_INDENT = 'data-indent';
export const LINE_SPACING_VALUES = [
  '100%',
  '115%',
  '150%',
  '200%',
];

const ALIGN_PATTERN = /(left|right|center|justify)/;
const LINE_HEIGHT_PATTERN = /(100\%|115\%|150\%|200\%)/;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const ParagraphNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    id: {default: null},
    indent: {default: null},
    lineSpacing: {default: null},
  },
  content: "inline*",
  group: "block",
  parseDOM: [{tag: 'p', getAttrs}],
  toDOM,
};

function getAttrs(dom: HTMLElement): Object {
  const {lineHeight, textAlign} = dom.style;

  let align = dom.getAttribute('align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  const indent = dom.hasAttribute(ATTRIBUTE_INDENT) ?
    parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10) :
    MIN_INDENT_LEVEL;

  const lineSpacing = LINE_HEIGHT_PATTERN.test(lineHeight) ?
    lineHeight :
    null;

  return {align, indent, lineSpacing};
}

function toDOM(node: Node): Array<any> {
  const {align, indent, lineSpacing} = node.attrs;
  const attrs = {};

  let style = '';
  if (align) {
    style += `text-align: ${align};`;
  }

  if (lineSpacing) {
    style += `line-height: ${lineSpacing};`;
  }

  style && (attrs.style = style);

  if (indent) {
    attrs[ATTRIBUTE_INDENT] = String(indent);
  }

  return ['p', attrs, 0];
}

export const toParagraphDOM = toDOM;
export const getParagraphNodeAttrs = getAttrs;

export default ParagraphNodeSpec;
