'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convertToCSSPTValue;
var SIZE_PATTERN = /([\d\.]+)(px|pt)/i;

var PX_TO_PT_RATIO = exports.PX_TO_PT_RATIO = 0.75292857;
var PT_TO_PX_RATIO = exports.PT_TO_PX_RATIO = 1 / PX_TO_PT_RATIO;

function convertToCSSPTValue(styleValue) {
  var matches = styleValue.match(SIZE_PATTERN);
  if (!matches) {
    return 0;
  }
  var value = parseFloat(matches[1]);
  var unit = matches[2];
  if (!value || !unit) {
    return 0;
  }
  if (unit === 'px') {
    value = PX_TO_PT_RATIO * value;
  }
  return value;
}