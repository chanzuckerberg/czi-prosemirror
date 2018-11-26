'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinDown;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

// Join the selected block, or the closest ancestor of the selection
// that can be joined, with the sibling after it.

// https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js

function joinDown(tr) {
  var sel = tr.selection;
  var point = void 0;
  if (sel instanceof _prosemirrorState.NodeSelection) {
    if (sel.node.isTextblock || !(0, _prosemirrorTransform.canJoin)(tr.doc, sel.to)) {
      return tr;
    }
    point = sel.to;
  } else {
    point = (0, _prosemirrorTransform.joinPoint)(tr.doc, sel.to, 1);
    if (point === null || point === undefined) {
      return tr;
    }
  }
  tr = tr.join(point);
  return tr;
}