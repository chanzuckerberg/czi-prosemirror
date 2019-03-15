'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isElementFullyVisible;

var _rects = require('./rects');

function isElementFullyVisible(el) {
  var _fromHTMlElement = (0, _rects.fromHTMlElement)(el),
      x = _fromHTMlElement.x,
      y = _fromHTMlElement.y,
      w = _fromHTMlElement.w,
      h = _fromHTMlElement.h;
  // Only checks the top-left point.


  var nwEl = w && h ? el.ownerDocument.elementFromPoint(x + 1, y + 1) : null;

  if (!nwEl) {
    return false;
  }

  if (nwEl === el) {
    return true;
  }

  if (el.contains(nwEl)) {
    return true;
  }

  return false;
}