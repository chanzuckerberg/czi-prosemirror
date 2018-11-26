'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = selectBodyContent;

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

function selectBodyContent(tr, schema) {
  var body = schema.nodes[_NodeNames.BODY];
  if (!body) {
    return tr;
  }
  var _tr = tr,
      doc = _tr.doc;

  if (!doc || doc.nodeSize < 2) {
    return tr;
  }
  var node = doc.nodeAt(0);
  if (!node || node.type !== body || node.nodeSize <= 4) {
    return tr;
  }

  tr = tr.setSelection(_prosemirrorState.TextSelection.create(doc, 2, node.nodeSize - 2));

  return tr;
}