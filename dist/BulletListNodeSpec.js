'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var _ListItemNodeSpec = require('./ListItemNodeSpec');

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var AUTO_LIST_STYLE_TYPES = ['disc', 'square', 'circle'];

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

    if (listStyleType) {
      attrs[_ListItemNodeSpec.ATTRIBUTE_LIST_STYLE_TYPE] = listStyleType;
    }

    if (indent !== _ParagraphNodeSpec.MIN_INDENT_LEVEL) {
      attrs[_ParagraphNodeSpec.ATTRIBUTE_INDENT] = indent;
    }

    var htmlListStyleType = listStyleType;

    if (!htmlListStyleType) {
      // If list style isn't explicitly specified, compute the list style type
      // based on the indent level.
      htmlListStyleType = AUTO_LIST_STYLE_TYPES[indent % AUTO_LIST_STYLE_TYPES.length];
    }

    attrs.type = htmlListStyleType;
    return ['ul', attrs, 0];
  }
};

exports.default = BulletListNodeSpec;