'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitListItem;

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

var _prosemirrorTransform = require('prosemirror-transform');

// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
function splitListItem(tr, schema) {
  var nodeType = schema.nodes[_NodeNames.LIST_ITEM];
  if (!nodeType) {
    return tr;
  }

  var _tr = tr,
      selection = _tr.selection;

  if (!selection) {
    return tr;
  }

  var $from = selection.$from,
      $to = selection.$to,
      node = selection.node;

  if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
    return tr;
  };

  var grandParent = $from.node(-1);
  if (grandParent.type !== nodeType) {
    return tr;
  }

  if ($from.parent.content.size == 0) {
    // In an empty block. If this is a nested list, the wrapping
    // list item should be split. Otherwise, bail out and let next
    // command handle lifting.
    if ($from.depth == 2 || $from.node(-3).type !== nodeType || $from.index(-2) != $from.node(-2).childCount - 1) {
      return tr;
    }

    var wrap = _prosemirrorModel.Fragment.empty;
    var keepItem = $from.index(-1) > 0;
    // Build a fragment containing empty versions of the structure
    // from the outer list item to the parent node of the cursor
    for (var d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
      wrap = _prosemirrorModel.Fragment.from($from.node(d).copy(wrap));
    }

    // Add a second list item with an empty default start node
    wrap = wrap.append(_prosemirrorModel.Fragment.from(nodeType.createAndFill()));
    tr = tr.replace($from.before(keepItem ? null : -1), $from.after(-3), new _prosemirrorModel.Slice(wrap, keepItem ? 3 : 2, 2));

    var pos = $from.pos + (keepItem ? 3 : 2);
    tr = tr.setSelection(selection.constructor.near(tr.doc.resolve(pos)));
    return tr;
  }

  var nextType = $to.pos == $from.end() ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType : null;

  tr = tr.delete($from.pos, $to.pos);
  var types = nextType && [null, { type: nextType }];
  if (!(0, _prosemirrorTransform.canSplit)(tr.doc, $from.pos, 2, types)) {
    return tr;
  }

  return tr.split($from.pos, 2, types);
}