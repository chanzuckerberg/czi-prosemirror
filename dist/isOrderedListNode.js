'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isOrderedListNode;

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

function isOrderedListNode(node) {
  return node.type.name === _NodeNames.ORDERED_LIST;
}