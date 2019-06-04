'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTE_LIST_STYLE_TYPE = undefined;

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var ATTRIBUTE_LIST_STYLE_TYPE = exports.ATTRIBUTE_LIST_STYLE_TYPE = 'data-list-style-type';

var ALIGN_PATTERN = /(left|right|center|justify)/;

function getAttrs(dom) {
  var attrs = {};
  var textAlign = dom.style.textAlign;

  var align = dom.getAttribute('data-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  if (align) {
    attrs.align = align;
  }
  return attrs;
}

var ListItemNodeSpec = {
  attrs: {
    align: { default: null }
  },

  // NOTE:
  // This spec does not support nested lists (e.g. `'paragraph block*'`)
  // as content because of the complexity of dealing with indentation
  // (context: https://github.com/ProseMirror/prosemirror/issues/92).
  content: 'paragraph',

  parseDOM: [{ tag: 'li', getAttrs: getAttrs }],

  // NOTE:
  // This method only defines the minimum HTML attributes needed when the node
  // is serialized to HTML string. Usually this is called when user copies
  // the node to clipboard.
  // The actual DOM rendering logic is defined at `src/ui/ListItemNodeView.js`.
  toDOM: function toDOM(node) {
    var attrs = {};
    var align = node.attrs.align;

    if (align) {
      attrs['data-align'] = align;
    }
    return ['li', attrs, 0];
  }
};

exports.default = ListItemNodeSpec;