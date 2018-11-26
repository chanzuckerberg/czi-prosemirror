'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinUp;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

// Join the selected block or, if there is a text selection, the
// closest ancestor block of the selection that can be joined, with
// the sibling above it.

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js

function joinUp(tr) {
  var sel = tr.selection;
  var nodeSel = sel instanceof _prosemirrorState.NodeSelection;
  var point = void 0;
  if (nodeSel) {
    if (sel.node.isTextblock || !(0, _prosemirrorTransform.canJoin)(tr.doc, sel.from)) {
      return tr;
    }
    point = sel.from;
  } else {
    point = (0, _prosemirrorTransform.joinPoint)(tr.doc, sel.from, -1);
    if (point === null || point === undefined) {
      return tr;
    }
  }

  tr = tr.join(point);
  if (nodeSel) {
    tr = tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, point - tr.doc.resolve(point).nodeBefore.nodeSize));
  }

  return tr;
}