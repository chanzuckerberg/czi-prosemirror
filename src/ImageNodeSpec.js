// @flow

import type {NodeSpec} from './Types';

function getAttrs(dom: HTMLElement) {
  const {cssFloat, display, marginTop, marginLeft} = dom.style;
  let {width, height} = dom.style;
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

  width = width || dom.getAttribute('width');
  height = height || dom.getAttribute('height');

  let crop = null;
  const {parentElement} = dom;
  if (parentElement instanceof HTMLElement) {
    const ps = parentElement.style;
    if (
      ps.display === 'inline-block' &&
      ps.overflow === 'hidden' &&
      ps.width &&
      ps.height &&
      marginLeft &&
      marginTop
    ) {
      crop = {
        width: parseInt(ps.width, 10) || 0,
        height: parseInt(ps.height, 10) || 0,
        left: parseInt(marginLeft, 10) || 0,
        top: parseInt(marginTop, 10) || 0,
      };
    }
  }

  return {
    align,
    alt: dom.getAttribute('alt') || null,
    crop,
    height: parseInt(height, 10) || null,
    src: dom.getAttribute('src') || null,
    title: dom.getAttribute('title')|| null,
    width: parseInt(width, 10) || null,
  };
}

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
const ImageNodeSpec: NodeSpec = {
  inline: true,
  attrs: {
    align: {default: null},
    alt: {default: ''},
    crop: {default: null},
    height: {default: null},
    src: {default: null},
    title: {default: ''},
    width: {default: null},
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{tag: 'img[src]', getAttrs}],
  toDOM(node) {
    return ['img', node.attrs];
  },
};

export default ImageNodeSpec;
