'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActiveFontSize;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorUtils = require('prosemirror-utils');

var _MarkNames = require('../MarkNames');

var _NodeNames = require('../NodeNames');

var _findActiveMark = require('../findActiveMark');

var _findActiveMark2 = _interopRequireDefault(_findActiveMark);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This should map to `--czi-content-font-size` at `czi-editor.css`.
var FONT_PT_SIZE_DEFAULT = 11;

// This should map to `czi-heading.css`.


var MAP_HEADING_LEVEL_TO_FONT_PT_SIZE = {
  '1': 20,
  '2': 18,
  '3': 16,
  '4': 14,
  '5': 11,
  '6': 11
};

function findActiveFontSize(state) {
  var schema = state.schema,
      doc = state.doc,
      selection = state.selection,
      tr = state.tr;

  var markType = schema.marks[_MarkNames.MARK_FONT_SIZE];
  var heading = schema.nodes[_NodeNames.HEADING];
  var defaultSize = String(FONT_PT_SIZE_DEFAULT);
  if (!markType) {
    return defaultSize;
  }

  var from = selection.from,
      to = selection.to,
      empty = selection.empty;

  if (empty) {
    var storedMarks = tr.storedMarks || state.storedMarks || selection.$cursor && selection.$cursor.marks && selection.$cursor.marks() || [];
    var sm = storedMarks.find(function (m) {
      return m.type === markType;
    });
    return sm ? String(sm.attrs.pt || defaultSize) : defaultSize;
  }

  var mark = markType ? (0, _findActiveMark2.default)(doc, from, to, markType) : null;
  if (mark) {
    return String(mark.attrs.pt);
  }
  if (!heading) {
    return defaultSize;
  }
  var result = (0, _prosemirrorUtils.findParentNodeOfType)(heading)(state.selection);
  if (!result) {
    return defaultSize;
  }
  var level = String(result.node.attrs.level);
  return MAP_HEADING_LEVEL_TO_FONT_PT_SIZE[level] || defaultSize;
}