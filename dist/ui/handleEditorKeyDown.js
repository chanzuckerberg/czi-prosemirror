'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.default = handleEditorKeyDown;

var _prosemirrorView = require('prosemirror-view');

var _KeyCodes = require('./KeyCodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AtomicNodeKeyCodes = new _set2.default([_KeyCodes.BACKSPACE, _KeyCodes.DELETE, _KeyCodes.DOWN_ARROW, _KeyCodes.LEFT_ARROW, _KeyCodes.RIGHT_ARROW, _KeyCodes.UP_ARROW]);

function handleEditorKeyDown(view, event) {
  var _view$state = view.state,
      selection = _view$state.selection,
      tr = _view$state.tr;
  var from = selection.from,
      to = selection.to;

  if (from === to - 1) {
    var node = tr.doc.nodeAt(from);
    if (node.isAtom && !node.isText && node.isLeaf) {
      // An atomic node (e.g. Image) is selected.
      // Only whitelisted keyCode should be allowed, which prevents user
      // from typing letter after the atomic node selected.
      return !AtomicNodeKeyCodes.has(event.keyCode);
    }
  }
  return false;
}