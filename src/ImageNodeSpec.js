// @flow

import {IMAGE} from './NodeNames';
import {Node} from 'prosemirror-model';

import type {NodeSpec} from 'prosemirror';


// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
const ImageNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: {default: ''},
    title: {default: ''},
    width: {default: null},
    height: {default: null},
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{tag: "img[src]", getAttrs(dom) {
    return {
      alt: dom.getAttribute('alt') || null,
      height: parseInt(dom.getAttribute('height', 10)) || null,
      src: dom.getAttribute('src') || null,
      title: dom.getAttribute('title')|| null,
      width: parseInt(dom.getAttribute('width', 10)) || null,
    }
  }}],
  toDOM(node) {
    return ["img", node.attrs];
  },
};

export default ImageNodeSpec;
