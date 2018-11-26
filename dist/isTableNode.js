'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTableNode;

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

function isTableNode(node) {
  var name = node instanceof _prosemirrorModel.Node ? node.type.name : null;
  return name === _NodeNames.TABLE || name === _NodeNames.TABLE_ROW || name === _NodeNames.TABLE_HEADER || name === _NodeNames.TABLE_CELL;
}