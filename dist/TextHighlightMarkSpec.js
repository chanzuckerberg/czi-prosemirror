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

var TextHighlightMarkSpec = {
  attrs: {
    highlightColor: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'background-color',
    getAttrs: function getAttrs(backgroundColor) {
      return {
        highlightColor: (0, _toHexColor2.default)(backgroundColor)
      };
    }
  }],

  toDOM: function toDOM(node) {
    var highlightColor = node.attrs.highlightColor;

    var style = '';
    if (highlightColor) {
      style += 'background-color: ' + highlightColor + ';';
    }
    return ['span', { style: style }, 0];
  }
};

exports.default = TextHighlightMarkSpec;