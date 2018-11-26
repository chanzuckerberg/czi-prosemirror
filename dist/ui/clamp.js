"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clamp;
function clamp(min, val, max) {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}