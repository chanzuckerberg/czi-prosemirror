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
  var passed = true;

  var fromPos = from;
  var toPos = to;

  doc.nodesBetween(from, to, function (node, pos) {
    if (node.marks) {
      var _mark = node.marks.length ? node.marks.find(finder) : null;
      if (!_mark) {
        passed = false;
      } else if (firstMark && _mark !== firstMark) {
        passed = false;
      }

      if (firstMark === null && _mark) {
        firstMark = _mark;
        fromPos = pos;
        toPos = pos;
        fromNode = node;
        toNode = node;
      }

      if (firstMark && _mark) {
        toPos = pos;
        toNode = node;
      }
    }
    return passed;
  });

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