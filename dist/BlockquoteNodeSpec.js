'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _ParagraphNodeSpec2 = _interopRequireDefault(_ParagraphNodeSpec);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var BlockquoteNodeSpec = (0, _extends3.default)({}, _ParagraphNodeSpec2.default, {
  defining: true,
  parseDOM: [{ tag: 'blockquote', getAttrs: getAttrs }],
  toDOM: toDOM
});

function toDOM(node) {
  var dom = (0, _ParagraphNodeSpec.toParagraphDOM)(node);
  dom[0] = 'blockquote';
  return dom;
}

function getAttrs(dom) {
  return (0, _ParagraphNodeSpec.getParagraphNodeAttrs)(dom);
}

exports.default = BlockquoteNodeSpec;