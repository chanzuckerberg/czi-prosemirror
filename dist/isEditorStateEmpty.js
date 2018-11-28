'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEditorStateEmpty;

var _prosemirrorState = require('prosemirror-state');

function isEditorStateEmpty(editorState) {
  if (editorState.doc.nodeSize < 10) {
    var text = editorState.doc.textContent;
    return !text || text === ' ';
  } else {
    return false;
  }
}