'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isInsideListItem;

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

function isInsideListItem(doc, pos) {
  if (doc.nodeSize < 2 || pos < 2) {
    return false;
  }
  var prevNode = doc.nodeAt(pos - 1);
  return prevNode && prevNode.type.name === _NodeNames.LIST_ITEM;
}