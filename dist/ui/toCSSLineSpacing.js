'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOUBLE_LINE_SPACING = exports.SINGLE_LINE_SPACING = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.default = toCSSLineSpacing;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SINGLE_LINE_SPACING = exports.SINGLE_LINE_SPACING = '125%';
var DOUBLE_LINE_SPACING = exports.DOUBLE_LINE_SPACING = '200%';

// In Google Doc, "single line height" is exported as style
// "line-height: 1.15" which is too narrow to read.
// This defines the deprecate line spacing values that should me migrated.
var DEPRECATED_SINGLE_LINE_SPACING_VALUES = new _set2.default(['115%', '100%']);

var NUMBER_VALUE_PATTERN = /^\d+(.\d+)?$/;

// Normalize the css line-height vlaue to percentage-based value if applicable.
// e.g. This converts "1.5" to "150%".
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

  if (DEPRECATED_SINGLE_LINE_SPACING_VALUES.has(strValue)) {
    return SINGLE_LINE_SPACING;
  }

  // e.g. line-height: 15px;
  return strValue;
}