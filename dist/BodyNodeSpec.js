'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var BodyNodeSpec = {
  attrs: {
    padding: { default: null },
    width: { default: null }
  },
  content: 'block+',
  defining: true,
  draggable: false,
  group: 'body',
  isolating: true,
  parseDOM: [{ tag: 'czi-editor-body', getAttrs: getAttrs }],
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
  return attrs;
}

function toDOM(node) {
  var attrs = {
    'class': 'czi-editor-body'
  };
  var _node$attrs = node.attrs,
      width = _node$attrs.width,
      padding = _node$attrs.padding;


  var style = '';
  if (width) {
    style += 'width: ' + width + 'pt;';
    attrs['data-width'] = width;
  }

  if (padding) {
    style += 'padding-left: ' + padding + 'pt;';
    style += 'padding-right: ' + padding + 'pt;';
    attrs['data-padding'] = padding;
  }

  if (style) {
    attrs.style = style;
  }

  return ['div', attrs, 0];
}

exports.default = BodyNodeSpec;