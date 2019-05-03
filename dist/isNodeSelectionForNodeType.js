'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNodeSelectionForNodeType;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorModel = require('prosemirror-model');

// Whether the selection is a node for the node type provided.
function isNodeSelectionForNodeType(selection, nodeType) {
  if (selection instanceof _prosemirrorState.NodeSelection) {
    return selection.node.type === nodeType;
  }
  return false;
}