'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertToJSON;

var _prosemirrorState = require('prosemirror-state');

function convertToJSON(editorState) {
  return editorState.doc.toJSON();
}