// @flow

import convertToCSSPTValue from './convertToCSSPTValue';
import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from './Types';

export const TAG_NAME = 'czi-editor-body';

export const LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait',
};

const ATTRIBUTE_LAYOUT = 'data-layout';

const BodyNodeSpec = {
  attrs: {
    layout: {default: null},
    padding: {default: null},
    width: {default: null},
  },
  content: 'block+',
  defining: true,
  draggable: false,
  group: 'body',
  isolating: true,
  parseDOM: [{tag: TAG_NAME, getAttrs}],
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

  console.log('getAttrs', el);

  attrs.layout = el.getAttribute(ATTRIBUTE_LAYOUT) || LAYOUT.US_LETTER_PORTRAIT;
  return attrs;
}

let lastNode;

function toDOM(node: Node): Array<any> {
  const attrs: Object = {
    'class': 'czi-editor-body',
  };

  let {width, padding, layout} = node.attrs;
  if (lastNode) {
    // TODO: Find a better way to handle this.
    // This is a workaround when user select the whole page (ctrl + A) and cut
    // the whole page content, the whole body node will lose its attributes
    // thus we'd have to restore the attributesfrom the previous body node.
    // The downside with this approach is that it may copy the attributes from
    // a different document.
    width = width || lastNode.attrs.width;
    padding = padding = lastNode.attrs.padding;
    layout = layout || lastNode.attrs.layout;
    // This is hacky, hope this will not throw error.
    Object.assign(node.attrs, {width, padding, layout});
  }

  let style = '';
  if (width) {
    // Use custom width (e.g. imported from google doc).
    style += `width: ${width}pt;`;
    if (padding) {
      style += `padding-left: ${padding}pt;`;
      style += `padding-right: ${padding}pt;`;
    }
    attrs.style = style;
  } else {
    attrs[ATTRIBUTE_LAYOUT] = layout || LAYOUT.US_LETTER_PORTRAIT;
  }

  lastNode = node;

  return ['div', attrs, 0];
}



export default BodyNodeSpec;
