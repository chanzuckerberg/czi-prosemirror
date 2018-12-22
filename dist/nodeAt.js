'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodeAt;

var _prosemirrorModel = require('prosemirror-model');

function nodeAt(doc, pos) {
  if (pos < 0 || pos > doc.content.size) {
    // Exit here or error will be thrown:
    // e.g. RangeError: Position outside of fragment.
    return null;
  }
  return doc.nodeAt(pos);
}