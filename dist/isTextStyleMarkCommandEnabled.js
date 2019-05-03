'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.default = isTextStyleMarkCommandEnabled;

var _isNodeSelectionForNodeType = require('./isNodeSelectionForNodeType');

var _isNodeSelectionForNodeType2 = _interopRequireDefault(_isNodeSelectionForNodeType);

var _prosemirrorState = require('prosemirror-state');

var _NodeNames = require('./NodeNames');

var _MarkNames = require('./MarkNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ValidMathTextMarkNames = new _set2.default([_MarkNames.MARK_FONT_SIZE, _MarkNames.MARK_TEXT_COLOR]);

// Whether the command for apply specific text style mark is enabled.


function isTextStyleMarkCommandEnabled(state, markName) {
  var selection = state.selection,
      schema = state.schema,
      tr = state.tr;

  var markType = schema.marks[markName];
  if (!markType) {
    return false;
  }
  var mathNodeType = schema.nodes[_NodeNames.MATH];
  if (mathNodeType && ValidMathTextMarkNames.has(markName) && (0, _isNodeSelectionForNodeType2.default)(selection, mathNodeType)) {
    // A math node is selected.
    return true;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    // Could be a NodeSelection or CellSelection.
    return false;
  }

  var _state$selection = state.selection,
      from = _state$selection.from,
      to = _state$selection.to;


  if (to === from + 1) {
    var node = tr.doc.nodeAt(from);
    if (node.isAtom && !node.isText && node.isLeaf) {
      // An atomic node (e.g. Image) is selected.
      return false;
    }
  }

  return true;
}