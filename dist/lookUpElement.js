"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = lookUpElement;
function lookUpElement(el, predict) {
  while (el && el.nodeName) {
    if (predict(el)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}