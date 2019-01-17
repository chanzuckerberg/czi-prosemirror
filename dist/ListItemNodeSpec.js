'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var ATTRIBUTE_LIST_STYLE_TYPE = exports.ATTRIBUTE_LIST_STYLE_TYPE = 'data-list-style-type';
var ATTRIBUTE_LIST_STYLE_COLOR = exports.ATTRIBUTE_LIST_STYLE_COLOR = 'data-list-style-color';

var ALIGN_PATTERN = /(left|right|center|justify)/;

function getAttrs(dom) {
  var attrs = {};
  var textAlign = dom.style.textAlign;

  var align = dom.getAttribute('data-align') || textAlign || '';
  align = ALIGN_PATTERN.test(align) ? align : null;

  if (align) {
    attrs.align = align;
  }

  var color = dom.getAttribute(ATTRIBUTE_LIST_STYLE_COLOR);
  if (color) {
    attrs.color = color;
  }

  return attrs;
}

// https://bitbucket.org/atlassian/atlaskit/src/34facee3f461/packages/editor-core/src/schema/nodes/?at=master
var ListItemNodeSpec = {
  attrs: {
    align: { default: null },
    color: { default: null },
    id: { default: null },
    style: { default: null }
  },

  // NOTE that do not support nested lists `'paragraph block*'` because of
  // the complexity of dealing with indentation.
  content: 'paragraph',

  parseDOM: [{ tag: 'li', getAttrs: getAttrs }],

  toDOM: function toDOM(node) {
    var attrs = {};
    var _node$attrs = node.attrs,
        align = _node$attrs.align,
        color = _node$attrs.color;

    if (align) {
      attrs['data-align'] = align;
    }
    if (color) {
      attrs.style = '--czi-list-style-color: ' + color;
    }
    return ['li', attrs, 0];
  }
};

exports.default = ListItemNodeSpec;