'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FONT_TYPE_NAMES = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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
      var WebFontLoader = void 0;
      if (typeof window !== 'undefined') {
        // WebFontLoader is for web only, its module can't be required
        // at server-side environment. Thus we'd get it from the global window
        // instead.
        // `window.__proseMirrorWebFontLoader` is defined at `Editor.js`.
        // See https://github.com/typekit/webfontloader/issues/383
        WebFontLoader = window.__proseMirrorWebFontLoader;
      }
      if (WebFontLoader && !RESOLVED_FONT_NAMES.has(name)) {
        // TODO: Cache custom fonts and preload them earlier.
        RESOLVED_FONT_NAMES.add(name);
        // https://github.com/typekit/webfontloader
        WebFontLoader.load({ google: { families: [name] } });
      }
      attrs.style = 'font-family: ' + name;
    }
    return ['span', attrs, 0];
  }
};

exports.default = FontTypeMarkSpec;