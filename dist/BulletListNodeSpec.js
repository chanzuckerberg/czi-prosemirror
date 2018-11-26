'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ListItemNodeSpec = require('./ListItemNodeSpec');

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var BulletListNodeSpec = {
  attrs: {
    id: { default: null },
    indent: { default: 0 },
    listStyleType: { default: null }
  },
  group: 'block',
  content: _NodeNames.LIST_ITEM + '+',
  parseDOM: [{
    tag: 'ul',
    getAttrs: function getAttrs(dom) {
      var listStyleType = dom.getAttribute(_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE) || null;

      var indent = dom.hasAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT) ? parseInt(dom.getAttribute(_ParagraphNodeSpec.ATTRIBUTE_INDENT), 10) : _ParagraphNodeSpec.MIN_INDENT_LEVEL;

      return {
        indent: indent,
        listStyleType: listStyleType
      };
    }
  }],
  toDOM: function toDOM(node) {
    var _node$attrs = node.attrs,
        indent = _node$attrs.indent,
        listStyleType = _node$attrs.listStyleType;

    var attrs = {};
    if (indent) {
      attrs[_ParagraphNodeSpec.ATTRIBUTE_INDENT] = indent;
    }
    if (listStyleType) {
      attrs[_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }
    return ['ul', attrs, 0];
  }
};

exports.default = BulletListNodeSpec;