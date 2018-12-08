'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformAndPreserveTextSelection;

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _prosemirrorModel = require('prosemirror-model');

var _MarkNames = require('./MarkNames');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Perform the transform without losing the perceived text selection.
// The way it works is that this will annotate teh current selection with
// temporary marks and restores the selection with those marks after performing
// the transform.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_SelectionMemo', {
  value: require('prop-types').shape({
    schema: require('prop-types').any.isRequired,
    tr: require('prop-types').any.isRequired
  })
});
function transformAndPreserveTextSelection(tr, schema, fn) {
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  var markType = schema.marks[_MarkNames.MARK_TEXT_SELECTION];
  if (!markType || !selection || !doc) {
    return tr;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection)) {
    return tr;
  }

  var from = selection.from,
      to = selection.to;

  // Mark current selection so that we could resume the selection later
  // after changing the whole list.

  var selectionExpanded = void 0;
  if (from === to) {
    if (from === 0) {
      return tr;
    }
    // Selection is collapsed, create a temnporary selection that the marks can
    // be applied to.
    selectionExpanded = _prosemirrorState.TextSelection.create(doc, from - 1, to);
    tr = tr.setSelection(selectionExpanded);
  }

  // This is an unique ID (by reference).
  var id = {};
  var findMark = function findMark(mark) {
    return mark.attrs.id === id;
  };
  var findMarkRange = function findMarkRange() {
    var markFrom = 0;
    var markTo = 0;
    tr.doc.descendants(function (node, pos) {
      if (node.marks && node.marks.find(findMark)) {
        markFrom = markFrom === 0 ? pos : markFrom;
        markTo = pos + node.nodeSize;
      }
      return true;
    });
    return {
      from: markFrom,
      to: markTo
    };
  };

  tr = (0, _applyMark2.default)(tr, schema, markType, { id: id });
  tr = fn({ tr: tr, schema: schema });

  var markRange = findMarkRange();
  var selectionRange = {
    from: selectionExpanded ? markRange.from + 1 : markRange.from,
    to: markRange.to
  };

  tr = tr.removeMark(markRange.from, markRange.to, markType);
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, selectionRange.from, selectionRange.to));

  return tr;
}