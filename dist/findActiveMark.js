'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findActiveMark;

var _prosemirrorModel = require('prosemirror-model');

function findActiveMark(doc, from, to, markType) {
  var ii = from;
  if (doc.nodeSize <= 2) {
    return null;
  }
  var finder = function finder(mark) {
    return mark.type === markType;
  };
  from = Math.max(2, from);
  to = Math.min(to, doc.nodeSize - 2);

  while (ii <= to) {
    var node = doc.nodeAt(ii);
    if (!node || !node.marks) {
      ii++;
      continue;
    }
    var mark = node.marks.find(finder);
    if (mark) {
      return mark;
    }
    ii++;
  }
}