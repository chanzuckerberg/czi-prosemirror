'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isBulletListNode;

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

function isBulletListNode(node) {
  return node.type.name === _NodeNames.BULLET_LIST;
}