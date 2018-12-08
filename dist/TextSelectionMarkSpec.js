'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var TextSelectionMarkSpec = {
  attrs: {
    id: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    tag: 'czi-text-selection'
  }],

  toDOM: function toDOM(node) {
    return ['czi-text-selection', { 'class': 'czi-text-selection' }, 0];
  }
};

exports.default = TextSelectionMarkSpec;