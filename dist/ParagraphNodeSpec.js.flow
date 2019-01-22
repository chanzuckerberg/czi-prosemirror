// @flow

import {Node} from 'prosemirror-model';

import convertToCSSPTValue from './convertToCSSPTValue';
import clamp from './ui/clamp';

import type {NodeSpec} from './Types';

// This assumes that every 36pt maps to one indent level.
export const INDENT_MARGIN_PT_SIZE = 36;
export const MIN_INDENT_LEVEL = 0;
export const MAX_INDENT_LEVEL = 7;
export const ATTRIBUTE_INDENT = 'data-indent';
export const LINE_SPACING_VALUES = [
  '100%',
  '115%',
  '150%', // Default value.
  '200%',
];

export const EMPTY_CSS_VALUE = new Set([
  '',
  '0%',
  '0pt',
  '0px',
]);

const ALIGN_PATTERN = /(left|right|center|justify)/;


// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
const ParagraphNodeSpec: NodeSpec = {
  attrs: {
    align: {default: null},
    color: {default: null},
    id: {default: null},
    indent: {default: null},
    lineSpacing: {default: null},
    // TODO: Add UI to let user edit / clear padding.
    paddingBottom: {default: null},
    // TODO: Add UI to let user edit / clear padding.
    paddingTop: {default: null},
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{tag: 'p', getAttrs}],
  toDOM,
};

function getAttrs(dom: HTMLElement): Object {
  const {
    lineHeight,
    textAlign,
    marginLeft,
    paddingTop,
    paddingBottom,
  } = dom.style;

  let align = dom.getAttribute('align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  let indent = parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10);

  if (!indent && marginLeft) {
    indent = convertMarginLeftToIndentValue(marginLeft);
  }

  indent = indent || MIN_INDENT_LEVEL;

  const lineSpacing = lineHeight ?
    lineHeight :
    null;

  return {align, indent, lineSpacing, paddingTop, paddingBottom};
}

function toDOM(node: Node): Array<any> {
  const {
    align, indent, lineSpacing, paddingTop, paddingBottom
  } = node.attrs;
  const attrs = {};

  let style = '';
  if (align && align !== 'left') {
    style += `text-align: ${align};`;
  }

  if (lineSpacing) {
    style += `line-height: ${lineSpacing};`;
  }

  if (paddingTop && !EMPTY_CSS_VALUE.has(paddingTop)) {
    style += `padding-top: ${paddingTop};`;
  }

  if (paddingBottom && !EMPTY_CSS_VALUE.has(paddingBottom)) {
    style += `padding-bottom: ${paddingBottom};`;
  }

  style && (attrs.style = style);

  if (indent) {
    attrs[ATTRIBUTE_INDENT] = String(indent);
  }

  return ['p', attrs, 0];
}


export const toParagraphDOM = toDOM;
export const getParagraphNodeAttrs = getAttrs;

export function convertMarginLeftToIndentValue(marginLeft: string): number {
  const ptValue = convertToCSSPTValue(marginLeft);
  return clamp(
    MIN_INDENT_LEVEL,
    Math.floor(ptValue / INDENT_MARGIN_PT_SIZE),
    MAX_INDENT_LEVEL,
  );
}

export default ParagraphNodeSpec;
