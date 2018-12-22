'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var _ListItemNodeSpec = require('./ListItemNodeSpec');

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var OrderedListNodeSpec = {
  attrs: {
    id: { default: 1 },
    indent: { default: _ParagraphNodeSpec.MIN_INDENT_LEVEL },
    listStyleType: { default: null },
    start: { default: 1 }
  },
  group: 'block',
  content: _NodeNames.LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ol',
    getAttrs: function getAttrs(dom) {
      var listStyleType = dom.getAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE) || null;

      var start = dom.hasAttribute('start') ? parseInt(dom.getAttribute('start'), 10) : 1;

      var indent = dom.hasAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT), 10) : _ParagraphNodeSpec.MIN_INDENT_LEVEL;

      return {
        indent: indent,
        listStyleType: listStyleType,
        start: start
      };
    }
  }],
  toDOM: function toDOM(node) {
    var _node$attrs = node.attrs,
        start = _node$attrs.start,
        indent = _node$attrs.indent,
        listStyleType = _node$attrs.listStyleType;

    var attrs = {};

    if (start > 1) {
      attrs.start = start;
    }

    if (indent !== _ParagraphNodeSpec.MIN_INDENT_LEVEL) {
      attrs[_ParagraphNodeSpec.ATTRIBUTE_INDENT] = indent;
    }

    if (listStyleType) {
      attrs[_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    return ['ol', attrs, 0];
  }
};

exports.default = OrderedListNodeSpec;