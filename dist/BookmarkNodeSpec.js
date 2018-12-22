'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ATTRIBUTE_BOOKMARK_ID = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_NodeSpec = require('./Types').babelPluginFlowReactPropTypes_proptype_NodeSpec || require('prop-types').any;

var ATTRIBUTE_BOOKMARK_ID = exports.ATTRIBUTE_BOOKMARK_ID = 'data-bookmark-id';

function getAttrs(dom) {
  var id = dom.getAttribute(ATTRIBUTE_BOOKMARK_ID);
  return {
    id: id
  };
}

var BookmarkNodeSpec = {
  inline: true,
  attrs: {
    id: { default: null }
  },
  group: 'inline',
  draggable: true,
  parseDOM: [{ tag: 'a[' + ATTRIBUTE_BOOKMARK_ID + ']', getAttrs: getAttrs }],
  toDOM: function toDOM(node) {
    var _ref;

    var id = node.attrs.id;

    var attrs = id ? (_ref = {}, (0, _defineProperty3.default)(_ref, ATTRIBUTE_BOOKMARK_ID, id), (0, _defineProperty3.default)(_ref, 'id', id), _ref) : {};
    return ['a', attrs];
  }
};

exports.default = BookmarkNodeSpec;