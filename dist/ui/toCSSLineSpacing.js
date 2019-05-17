'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toCSSLineSpacing;


// Line spacing names and their values.
var LINE_SPACING_100 = exports.LINE_SPACING_100 = '125%';
var LINE_SPACING_115 = exports.LINE_SPACING_115 = '138%';
var LINE_SPACING_150 = exports.LINE_SPACING_150 = '165%';
var LINE_SPACING_200 = exports.LINE_SPACING_200 = '232%';

var SINGLE_LINE_SPACING = exports.SINGLE_LINE_SPACING = LINE_SPACING_100;
var DOUBLE_LINE_SPACING = exports.DOUBLE_LINE_SPACING = LINE_SPACING_200;

var NUMBER_VALUE_PATTERN = /^\d+(.\d+)?$/;

// Normalize the css line-height vlaue to percentage-based value if applicable.
// Also, it calibrates the incorrect line spacing value exported from Google
// Doc.
function toCSSLineSpacing(source) {
  if (!source) {
    return '';
  }

  var strValue = String(source);

  // e.g. line-height: 1.5;
  if (NUMBER_VALUE_PATTERN.test(strValue)) {
    var numValue = parseFloat(strValue);
    strValue = String(Math.round(numValue * 100)) + '%';
  }

  // Google Doc exports line spacing with wrong values. For instance:
  // - Single => 100%
  // - 1.15 => 115%
  // - Double => 200%
  // But the actual CSS value measured in Google Doc is like this:
  // - Single => 125%
  // - 1.15 => 138%
  // - Double => 232%
  // The following `if` block will calibrate the value if applicable.

  if (strValue === '115%') {
    return LINE_SPACING_115;
  }

  if (strValue === '150%') {
    return LINE_SPACING_150;
  }

  if (strValue === '200%') {
    return LINE_SPACING_200;
  }

  // e.g. line-height: 15px;
  return strValue;
}