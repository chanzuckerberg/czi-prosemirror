'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findNodesWithSameMark;

var _prosemirrorModel = require('prosemirror-model');

// If nodes within the same range have the same mark, returns
// the first node.
function findNodesWithSameMark(doc, from, to, markType) {
  var ii = from;
  var finder = function finder(mark) {
    return mark.type === markType;
  };
  var firstMark = null;
  var fromNode = null;
  var toNode = null;

  var fromPos = from;
  var toPos = to;

  if (from === to) {
    var _node = doc.nodeAt(from);
    var _mark = _node && _node.marks.length ? _node.marks.find(finder) : null;
    if (_mark) {
      firstMark = _mark;
      fromPos = from;
      toPos = from;
      fromNode = _node;
      toNode = _node;
    }
  } else {
    doc.nodesBetween(from, to, function (node, pos) {
      if (node.marks) {
        var _mark2 = node.marks.length ? node.marks.find(finder) : null;
        if (firstMark === null && _mark2) {
          firstMark = _mark2;
          fromPos = pos;
          toPos = pos;
          fromNode = node;
          toNode = node;
        }
        if (firstMark && _mark2) {
          toPos = pos;
          toNode = node;
        }
      }
      return true;
    });
  }

  if (!firstMark) {
    return null;
  }

  return {
    mark: firstMark,
    from: {
      node: fromNode,
      pos: fromPos
    },
    to: {
      node: toNode,
      pos: toPos
    }
  };
}