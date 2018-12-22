"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareNumber;
function compareNumber(a, b) {
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}