'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LAYOUT = exports.TAG_NAME = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var TAG_NAME = exports.TAG_NAME = 'czi-editor-body';

var LAYOUT = exports.LAYOUT = {
  DESKTOP_SCREEN_4_3: 'desktop_screen_4_3',
  DESKTOP_SCREEN_16_9: 'desktop_screen_16_9',
  US_LETTER_LANDSCAPE: 'us_letter_landscape',
  US_LETTER_PORTRAIT: 'us_letter_portrait'
};

var ATTRIBUTE_LAYOUT = 'data-layout';

var BodyNodeSpec = {
  attrs: {
    layout: { default: null },
    padding: { default: null },
    width: { default: null }
  },
  content: 'block+',
  defining: true,
  draggable: false,
  group: 'body',
  isolating: true,
  parseDOM: [{ tag: TAG_NAME, getAttrs: getAttrs }],
  selectable: false,
  toDOM: toDOM
};

function getAttrs(el) {
  var attrs = {};

  var _ref = el.style || {},
      width = _ref.width,
      maxWidth = _ref.maxWidth,
      padding = _ref.padding;

  var ww = (0, _convertToCSSPTValue2.default)(width) || (0, _convertToCSSPTValue2.default)(maxWidth);
  var pp = (0, _convertToCSSPTValue2.default)(padding);
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

var lastNode = void 0;

function toDOM(node) {
  var attrs = {
    'class': 'czi-editor-body'
  };

  var _node$attrs = node.attrs,
      width = _node$attrs.width,
      padding = _node$attrs.padding,
      layout = _node$attrs.layout;

  if (lastNode) {
    // TODO: Find a better way to handle this.
    // This is a workaround when user select the whole page (ctrl + A) and cut
    // the whole page content, the whole body node will lose its attributes
    // thus we'd have to restore the attributesfrom the previous body node.
    // The downside with this approach is that it may copy the attributes from
    // a different document.
    width = width || lastNode.attrs.width;
    padding = padding || lastNode.attrs.padding;
    layout = layout || lastNode.attrs.layout;

    if (layout) {
      // If layout is set, do not use custom width & padding.
      width = null;
      padding = null;
    }

    // This is hacky, hope this will not throw error.
    (0, _assign2.default)(node.attrs, { width: width, padding: padding, layout: layout });
  }

  var style = '';
  if (width) {
    // Use custom width (e.g. imported from google doc).
    style += 'width: ' + width + 'pt;';
    if (padding) {
      style += 'padding-left: ' + padding + 'pt;';
      style += 'padding-right: ' + padding + 'pt;';
    }
    attrs.style = style;
  } else {
    attrs[ATTRIBUTE_LAYOUT] = layout || LAYOUT.US_LETTER_PORTRAIT;
  }

  lastNode = node;

  return ['div', attrs, 0];
}

exports.default = BodyNodeSpec;