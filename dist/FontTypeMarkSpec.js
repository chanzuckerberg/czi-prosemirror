'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FONT_TYPE_NAMES = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _webfontloader = require('webfontloader');

var _webfontloader2 = _interopRequireDefault(_webfontloader);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var FONT_TYPE_NAMES = exports.FONT_TYPE_NAMES = [
// SERIF
'Arial', 'Arial Black', 'Georgia', 'Tahoma', 'Times New Roman', 'Times', 'Verdana',
// MONOSPACE
'Courier New', 'Lucida Console', 'Monaco', 'monospace'];

var RESOLVED_FONT_NAMES = new _set2.default(FONT_TYPE_NAMES);

var FontTypeMarkSpec = {
  attrs: {
    name: ''
  },
  inline: true,
  group: 'inline',
  parseDOM: [{
    style: 'font-family',
    getAttrs: function getAttrs(name) {
      return {
        name: name ? name.replace(/[\"\']/g, '') : ''
      };
    }
  }],

  toDOM: function toDOM(node) {
    var name = node.attrs.name;

    var attrs = {};
    if (name) {
      if (!RESOLVED_FONT_NAMES.has(name)) {
        // TODO: Cache custom fonts and preload them earlier.
        RESOLVED_FONT_NAMES.add(name);
        // https://github.com/typekit/webfontloader
        _webfontloader2.default.load({ google: { families: [name] } });
      }
      attrs.style = 'font-family: ' + name;
    }
    return ['span', attrs, 0];
  }
};

exports.default = FontTypeMarkSpec;