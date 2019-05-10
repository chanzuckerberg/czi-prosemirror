'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParagraphNodeAttrs = exports.toParagraphDOM = exports.EMPTY_CSS_VALUE = exports.ATTRIBUTE_INDENT = exports.MAX_INDENT_LEVEL = exports.MIN_INDENT_LEVEL = exports.INDENT_MARGIN_PT_SIZE = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.convertMarginLeftToIndentValue = convertMarginLeftToIndentValue;

var _clamp = require('./ui/clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

var _toCSSLineSpacing = require('./ui/toCSSLineSpacing');

var _toCSSLineSpacing2 = _interopRequireDefault(_toCSSLineSpacing);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This assumes that every 36pt maps to one indent level.
var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var INDENT_MARGIN_PT_SIZE = exports.INDENT_MARGIN_PT_SIZE = 36;
var MIN_INDENT_LEVEL = exports.MIN_INDENT_LEVEL = 0;
var MAX_INDENT_LEVEL = exports.MAX_INDENT_LEVEL = 7;
var ATTRIBUTE_INDENT = exports.ATTRIBUTE_INDENT = 'data-indent';

var EMPTY_CSS_VALUE = exports.EMPTY_CSS_VALUE = new _set2.default(['', '0%', '0pt', '0px']);

var ALIGN_PATTERN = /(left|right|center|justify)/;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
var ParagraphNodeSpec = {
  attrs: {
    align: { default: null },
    color: { default: null },
    id: { default: null },
    indent: { default: null },
    lineSpacing: { default: null },
    // TODO: Add UI to let user edit / clear padding.
    paddingBottom: { default: null },
    // TODO: Add UI to let user edit / clear padding.
    paddingTop: { default: null }
  },
  content: 'inline*',
  group: 'block',
  parseDOM: [{ tag: 'p', getAttrs: getAttrs }],
  toDOM: toDOM
};

function getAttrs(dom) {
  var _dom$style = dom.style,
      lineHeight = _dom$style.lineHeight,
      textAlign = _dom$style.textAlign,
      marginLeft = _dom$style.marginLeft,
      paddingTop = _dom$style.paddingTop,
      paddingBottom = _dom$style.paddingBottom;


  var align = dom.getAttribute('align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  var indent = parseInt(dom.getAttribute(ATTRIBUTE_INDENT), 10);

  if (!indent && marginLeft) {
    indent = convertMarginLeftToIndentValue(marginLeft);
  }

  indent = indent || MIN_INDENT_LEVEL;

  var lineSpacing = lineHeight ? (0, _toCSSLineSpacing2.default)(lineHeight) : null;

  var id = dom.getAttribute('id') || '';
  return { align: align, indent: indent, lineSpacing: lineSpacing, paddingTop: paddingTop, paddingBottom: paddingBottom, id: id };
}

function toDOM(node) {
  var _node$attrs = node.attrs,
      align = _node$attrs.align,
      indent = _node$attrs.indent,
      lineSpacing = _node$attrs.lineSpacing,
      paddingTop = _node$attrs.paddingTop,
      paddingBottom = _node$attrs.paddingBottom,
      id = _node$attrs.id;

  var attrs = {};

  var style = '';
  if (align && align !== 'left') {
    style += 'text-align: ' + align + ';';
  }

  if (lineSpacing) {
    style += 'line-height: ' + (0, _toCSSLineSpacing2.default)(lineSpacing) + ';';
  }

  if (paddingTop && !EMPTY_CSS_VALUE.has(paddingTop)) {
    style += 'padding-top: ' + paddingTop + ';';
  }

  if (paddingBottom && !EMPTY_CSS_VALUE.has(paddingBottom)) {
    style += 'padding-bottom: ' + paddingBottom + ';';
  }

  style && (attrs.style = style);

  if (indent) {
    attrs[ATTRIBUTE_INDENT] = String(indent);
  }

  if (id) {
    attrs.id = id;
  }

  return ['p', attrs, 0];
}

var toParagraphDOM = exports.toParagraphDOM = toDOM;
var getParagraphNodeAttrs = exports.getParagraphNodeAttrs = getAttrs;

function convertMarginLeftToIndentValue(marginLeft) {
  var ptValue = (0, _convertToCSSPTValue2.default)(marginLeft);
  return (0, _clamp2.default)(MIN_INDENT_LEVEL, Math.floor(ptValue / INDENT_MARGIN_PT_SIZE), MAX_INDENT_LEVEL);
}

exports.default = ParagraphNodeSpec;