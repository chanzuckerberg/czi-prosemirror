// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';

function parseDOMAttrs(dom: HTMLElement) {
  const {cssFloat, display} = dom.style;
  let align = dom.getAttribute('data-align') || dom.getAttribute('align');
  if (align) {
    align = /(left|right|center)/.test(align) ? align : null;
  } else if (cssFloat === 'left' && !display) {
    align = 'left';
  } else if (cssFloat === 'right' && !display) {
    align = 'right';
  } else if (!cssFloat && display === 'block') {
    align = 'block';
  }
  return {
    align,
    alt: dom.getAttribute('alt') || null,
    height: parseInt(dom.getAttribute('height'), 10) || null,
    src: dom.getAttribute('src') || null,
    title: dom.getAttribute('title')|| null,
    width: parseInt(dom.getAttribute('width'), 10) || null,
  }
}

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
const ImageNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    align: {default: null},
    src: {},
    alt: {default: ''},
    title: {default: ''},
    width: {default: null},
    height: {default: null},
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{tag: "img[src]", getAttrs(dom) {
    return parseDOMAttrs(dom);
  }}],
  toDOM(node) {
    return ["img", node.attrs];
  },
};

export default ImageNodeSpec;
