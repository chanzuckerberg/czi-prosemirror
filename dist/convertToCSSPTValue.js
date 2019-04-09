'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PT_TO_PX_RATIO = exports.PX_TO_PT_RATIO = undefined;
exports.default = convertToCSSPTValue;
exports.toClosestFontPtSize = toClosestFontPtSize;

var _FontSizeCommandMenuButton = require('./ui/FontSizeCommandMenuButton');

var SIZE_PATTERN = /([\d\.]+)(px|pt)/i;

var PX_TO_PT_RATIO = exports.PX_TO_PT_RATIO = 0.7518796992481203; // 1 / 1.33.
var PT_TO_PX_RATIO = exports.PT_TO_PX_RATIO = 1.33;

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

function toClosestFontPtSize(styleValue) {
  var originalPTValue = convertToCSSPTValue(styleValue);

  if (_FontSizeCommandMenuButton.FONT_PT_SIZES.includes(originalPTValue)) {
    return originalPTValue;
  }

  return _FontSizeCommandMenuButton.FONT_PT_SIZES.reduce(function (prev, curr) {
    return Math.abs(curr - originalPTValue) < Math.abs(prev - originalPTValue) ? curr : prev;
  }, Number.NEGATIVE_INFINITY);
}