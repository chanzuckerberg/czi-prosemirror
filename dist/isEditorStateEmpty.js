'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isEditorStateEmpty;

var _prosemirrorState = require('prosemirror-state');

var ZERO_WIDTH_SPACE_CHAR = '\u200B';

function isEditorStateEmpty(editorState) {
  var doc = editorState.doc;
  var nodeSize = doc.nodeSize;

  if (nodeSize < 2) {
    var text = doc.textContent;
    return !text || text === ' ';
  } else if (nodeSize < 10) {
    var isEmpty = true;
    doc.nodesBetween(0, doc.nodeSize - 2, function (node, ii) {
      if (isEmpty) {
        var nodeType = node.type;
        if (nodeType.isAtom) {
          // e.g. Image, Video...etc.
          isEmpty = false;
        } else if (nodeType.isText) {
          var _text = doc.textContent;
          isEmpty = !_text || _text === ' ' || _text === ZERO_WIDTH_SPACE_CHAR;
        }
      }
      return isEmpty;
    });
    return isEmpty;
  } else {
    return false;
  }
}