'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformAndPreserveTextSelection;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _MarkNames = require('./MarkNames');

var _NodeNames = require('./NodeNames');

var _applyMark = require('./applyMark');

var _applyMark2 = _interopRequireDefault(_applyMark);

var _uuid = require('./ui/uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Text used to create temporary selection.
// This assumes that no user could enter such string manually.
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_SelectionMemo', {
  value: require('prop-types').shape({
    schema: require('prop-types').any.isRequired,
    tr: require('prop-types').any.isRequired
  })
});
var PLACEHOLDER_TEXT = '[\u200B\u2800PLACEHOLDER_TEXT_' + (0, _uuid2.default)() + '\u2800\u200B]';

// Perform the transform without losing the perceived text selection.
// The way it works is that this will annotate teh current selection with
// temporary marks and restores the selection with those marks after performing
// the transform.
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

  var fromOffset = 0;
  var toOffset = 0;
  var placeholderTextNode = void 0;

  if (from === to) {
    if (from === 0) {
      return tr;
    }
    // Selection is collapsed, create a temporary selection that the marks can
    // be applied to.
    var currentNode = tr.doc.nodeAt(from);
    var prevNode = tr.doc.nodeAt(from - 1);
    var nextNode = tr.doc.nodeAt(from + 1);

    if (!currentNode && prevNode && prevNode.type.name === _NodeNames.PARAGRAPH && !prevNode.firstChild) {
      // The selection is at a paragraph node which has no content.
      // Create a temporary text and move selection into that text.
      placeholderTextNode = schema.text(PLACEHOLDER_TEXT);
      tr = tr.insert(from, _prosemirrorModel.Fragment.from(placeholderTextNode));
      toOffset = 1;
    } else if (!currentNode && prevNode && prevNode.type.name === _NodeNames.TEXT) {
      // The selection is at the end of the text node. Select the last
      // character instead.
      fromOffset = -1;
    } else if (prevNode && currentNode && currentNode.type === prevNode.type) {
      // Ensure that the mark is applied to the same type of node.
      fromOffset = -1;
    } else if (nextNode && currentNode && currentNode.type === nextNode.type) {
      toOffset = 1;
    } else if (nextNode) {
      // Could not find the same type of node, assume the next node is safe to use.
      toOffset = 1;
    } else if (prevNode) {
      // Could not find the same type of node, assume the next node is safe to use.
      fromOffset = -1;
    } else {
      // Selection can't be safely preserved.
      return tr;
    }
    tr = tr.setSelection(_prosemirrorState.TextSelection.create(doc, from + fromOffset, to + toOffset));
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

  // TODO: This has side-effect. It will cause `tr.docChanged` to be `true`.
  // No matter whether `fn({tr, schema})` did change the doc or not.
  tr = (0, _applyMark2.default)(tr, schema, markType, { id: id });
  tr = fn({ tr: tr, schema: schema });

  var markRange = findMarkRange();
  var selectionRange = {
    from: Math.max(0, markRange.from - fromOffset),
    to: Math.max(0, markRange.to - toOffset)
  };

  selectionRange.to = Math.max(0, selectionRange.from, selectionRange.to);

  tr = tr.removeMark(markRange.from, markRange.to, markType);

  if (placeholderTextNode) {
    tr.doc.descendants(function (node, pos) {
      if (node.type.name === _NodeNames.TEXT && node.text === PLACEHOLDER_TEXT) {
        tr = tr.delete(pos, pos + PLACEHOLDER_TEXT.length);
        placeholderTextNode = null;
        return false;
      }
      return true;
    });
  }

  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, selectionRange.from, selectionRange.to));

  return tr;
}