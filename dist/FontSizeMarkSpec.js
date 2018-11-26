'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorModel = require('prosemirror-model');

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var FontSizeMarkSpec = {
  attrs: {
    pt: { default: null }
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'font-size',
    getAttrs: getAttrs
  }],
  toDOM: function toDOM(node) {
    var pt = node.attrs.pt;

    var style = pt ? 'font-size: ' + pt + 'pt' : '';
    return ['span', { style: style }, 0];
  }
};

function getAttrs(fontSize) {
  var attrs = {};
  if (!fontSize) {
    return attrs;
  }

  var ptValue = (0, _convertToCSSPTValue2.default)(fontSize);
  if (!ptValue) {
    return attrs;
  }
  return {
    pt: ptValue
  };
}

exports.default = FontSizeMarkSpec;