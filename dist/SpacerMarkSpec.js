'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPACER_SIZE_TAB = exports.DOM_ATTRIBUTE_SIZE = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_MarkSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_MarkSpec || require('prop-types').any;

var DOM_ATTRIBUTE_SIZE = exports.DOM_ATTRIBUTE_SIZE = 'data-spacer-size';
var SPACER_SIZE_TAB = exports.SPACER_SIZE_TAB = 'tab';

var SpacerMarkSpec = {
  attrs: {
    size: { default: SPACER_SIZE_TAB }
  },
  defining: true,
  draggable: false,
  excludes: '_',
  group: 'inline',
  inclusive: false,
  inline: true,
  spanning: false,
  parseDOM: [{
    tag: 'span[' + DOM_ATTRIBUTE_SIZE + ']',
    getAttrs: function getAttrs(el) {
      return {
        size: el.getAttribute(DOM_ATTRIBUTE_SIZE) || SPACER_SIZE_TAB
      };
    }
  }],
  toDOM: function toDOM(node) {
    var size = node.attrs.size;

    return ['span', (0, _defineProperty3.default)({}, DOM_ATTRIBUTE_SIZE, size), 0];
  }
};

exports.default = SpacerMarkSpec;