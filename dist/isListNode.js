'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isListNode;

var _prosemirrorModel = require('prosemirror-model');

var _isBulletListNode = require('./isBulletListNode');

var _isBulletListNode2 = _interopRequireDefault(_isBulletListNode);

var _isOrderedListNode = require('./isOrderedListNode');

var _isOrderedListNode2 = _interopRequireDefault(_isOrderedListNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isListNode(node) {
  if (node instanceof _prosemirrorModel.Node) {
    return (0, _isBulletListNode2.default)(node) || (0, _isOrderedListNode2.default)(node);
  }
  return false;
}