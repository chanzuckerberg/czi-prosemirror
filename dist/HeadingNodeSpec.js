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

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var TAG_NAME_TO_LEVEL = {
  'H1': 1,
  'H2': 2,
  'H3': 3,
  'H4': 4,
  'H5': 5,
  'H6': 6
};

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js
// :: NodeSpec A plain paragraph textblock. Represented in the DOM
// as a `<p>` element.
var HeadingNodeSpec = (0, _extends3.default)({}, _ParagraphNodeSpec2.default, {
  attrs: (0, _extends3.default)({}, _ParagraphNodeSpec2.default.attrs, {
    level: { default: 1 }
  }),
  defining: true,
  parseDOM: [{ tag: 'h1', getAttrs: getAttrs }, { tag: 'h2', getAttrs: getAttrs }, { tag: 'h3', getAttrs: getAttrs }, { tag: 'h4', getAttrs: getAttrs }, { tag: 'h5', getAttrs: getAttrs }, { tag: 'h6', getAttrs: getAttrs }],
  toDOM: toDOM
});

function toDOM(node) {
  var dom = (0, _ParagraphNodeSpec.toParagraphDOM)(node);
  var level = node.attrs.level || 1;
  dom[0] = 'h' + level;
  return dom;
}

function getAttrs(dom) {
  var attrs = (0, _ParagraphNodeSpec.getParagraphNodeAttrs)(dom);
  var level = TAG_NAME_TO_LEVEL[dom.nodeName.toUpperCase()] || 1;
  attrs.level = level;
  return attrs;
}

exports.default = HeadingNodeSpec;