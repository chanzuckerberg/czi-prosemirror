'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var _toCSSColor = require('./ui/toCSSColor');

var _toCSSColor2 = _interopRequireDefault(_toCSSColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var TextColorMarkSpec = {
  attrs: {
    color: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'color',
    getAttrs: function getAttrs(color) {
      return {
        color: (0, _toCSSColor2.default)(color)
      };
    }
  }],
  toDOM: function toDOM(node) {
    var color = node.attrs.color;

    var style = '';
    if (color) {
      style += 'color: ' + color + ';';
    }
    return ['span', { style: style }, 0];
  }
};

exports.default = TextColorMarkSpec;