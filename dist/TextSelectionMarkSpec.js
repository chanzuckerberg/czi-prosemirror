'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toHexColor = require('./ui/toHexColor');

var _toHexColor2 = _interopRequireDefault(_toHexColor);

var _MarkNames = require('./MarkNames');

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('prosemirror').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

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