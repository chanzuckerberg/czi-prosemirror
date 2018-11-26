'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var STRONG_DOM = ['strong', 0];

var CSS_BOLD_PATTERN = /^(bold(er)?|[5-9]\d{2,})$/;

var StrongMarkSpec = {
  parseDOM: [{ tag: 'strong' },
  // This works around a Google Docs misbehavior where
  // pasted content will be inexplicably wrapped in `<b>`
  // tags with a font-weight normal.
  { tag: 'b', getAttrs: function getAttrs(node) {
      return node.style.fontWeight != 'normal' && null;
    } }, { style: 'font-weight', getAttrs: function getAttrs(value) {
      return CSS_BOLD_PATTERN.test(value) && null;
    } }],
  toDOM: function toDOM() {
    return STRONG_DOM;
  }
};

exports.default = StrongMarkSpec;