'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEditorStateEmpty;

var _prosemirrorState = require('prosemirror-state');

function isEditorStateEmpty(editorState) {
  return editorState.doc.nodeSize <= 6;
}