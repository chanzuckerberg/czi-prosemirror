// @flow

import convertToCSSPTValue from './convertToCSSPTValue';
import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from './Types';

const BodyNodeSpec = {
  attrs: {
    padding: {default: null},
    width: {default: null},
  },
  content: 'block+',
  defining: true,
  draggable: false,
  group: 'body',
  isolating: true,
  parseDOM: [{tag: 'czi-editor-body', getAttrs}],
  selectable: false,
  toDOM,
};

function getAttrs(el: HTMLElement): Object {
  const attrs = {};
  const {width, maxWidth, padding} = (el.style || {});
  const ww = convertToCSSPTValue(width) || convertToCSSPTValue(maxWidth);
  const pp = convertToCSSPTValue(padding);
  if (ww) {
    attrs.width = ww;
  }
  if (pp) {
    attrs.padding = pp;
  }
  return attrs;
}

function toDOM(node: Node): Array<any> {
  const attrs: Object = {
    'class': 'czi-editor-body',
  };
  const {width, padding} = node.attrs;

  let style = '';
  if (width) {
    style += `width: ${width}pt;`;
    attrs['data-width'] = width;
  }

  if (padding) {
    style += `padding-left: ${padding}pt;`;
    style += `padding-right: ${padding}pt;`;
    attrs['data-padding'] = padding;
  }

  if (style) {
    attrs.style = style;
  }

  return ['div', attrs, 0];
}



export default BodyNodeSpec;
