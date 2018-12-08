'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

function getAttrs(dom) {
  var _dom$style = dom.style,
      cssFloat = _dom$style.cssFloat,
      display = _dom$style.display,
      marginTop = _dom$style.marginTop,
      marginLeft = _dom$style.marginLeft;
  var _dom$style2 = dom.style,
      width = _dom$style2.width,
      height = _dom$style2.height;

  var align = dom.getAttribute('data-align') || dom.getAttribute('align');
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

  var crop = null;
  var parentElement = dom.parentElement;

  if (parentElement instanceof HTMLElement) {
    var ps = parentElement.style;
    if (ps.display === 'inline-block' && ps.overflow === 'hidden' && ps.width && ps.height && marginLeft && marginTop) {
      crop = {
        width: parseInt(ps.width, 10) || 0,
        height: parseInt(ps.height, 10) || 0,
        left: parseInt(marginLeft, 10) || 0,
        top: parseInt(marginTop, 10) || 0
      };
    }
  }

  return {
    align: align,
    alt: dom.getAttribute('alt') || null,
    crop: crop,
    height: parseInt(height, 10) || null,
    src: dom.getAttribute('src') || null,
    title: dom.getAttribute('title') || null,
    width: parseInt(width, 10) || null
  };
}

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
var ImageNodeSpec = {
  inline: true,
  attrs: {
    align: { default: null },
    alt: { default: '' },
    crop: { default: null },
    height: { default: null },
    src: { default: null },
    title: { default: '' },
    width: { default: null }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{ tag: 'img[src]', getAttrs: getAttrs }],
  toDOM: function toDOM(node) {
    return ["img", node.attrs];
  }
};

exports.default = ImageNodeSpec;