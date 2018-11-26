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

  while (ii <= to) {
    var _node = doc.nodeAt(ii);
    if (!_node || !_node.marks) {
      return null;
    }
    var _mark = _node.marks.find(finder);
    if (!_mark) {
      return null;
    }
    if (firstMark && _mark !== firstMark) {
      return null;
    }
    fromNode = fromNode || _node;
    firstMark = firstMark || _mark;
    toNode = _node;
    ii++;
  }

  var fromPos = from;
  var toPos = to;

  var jj = 0;
  ii = from - 1;
  while (ii > jj) {
    var _node2 = doc.nodeAt(ii);
    var _mark2 = _node2 && _node2.marks.find(finder);
    if (!_mark2 || _mark2 !== firstMark) {
      break;
    }
    fromPos = ii;
    fromNode = _node2;
    ii--;
  }

  ii = to + 1;
  jj = doc.nodeSize - 2;
  while (ii < jj) {
    var _node3 = doc.nodeAt(ii);
    var _mark3 = _node3 && _node3.marks.find(finder);
    if (!_mark3 || _mark3 !== firstMark) {
      break;
    }
    toPos = ii;
    toNode = _node3;
    ii++;
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