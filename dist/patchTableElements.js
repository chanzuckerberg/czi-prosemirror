'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchTableElements;

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function patchTableElements(doc) {
  (0, _from2.default)(doc.querySelectorAll('td')).forEach(patchTableCell);
  (0, _from2.default)(doc.querySelectorAll('tr[style^=height]')).forEach(patchTableRow);
}

// The height of each line: ~= 21px


var LINE_HEIGHT_PT_VALUE = 15.81149997;

// Workaround to patch HTML from Google Doc that Table Cells will apply
// its background colr to all its inner <span />.
function patchTableCell(tdElement) {
  var style = tdElement.style;

  if (!style) {
    return;
  }
  var backgroundColor = style.backgroundColor;

  if (!backgroundColor) {
    return;
  }
  var selector = 'span[style^=background-color]';
  var spans = (0, _from2.default)(tdElement.querySelectorAll(selector));
  spans.some(function (spanElement) {
    var spanStyle = spanElement.style;
    if (spanStyle && spanStyle.backgroundColor === backgroundColor) {
      spanStyle.backgroundColor = '';
    }
  });
}

// Workaround to support "height" in table row by inject empty <p /> to
// create space for the height.
function patchTableRow(trElement) {
  var doc = trElement.ownerDocument;
  if (!doc) {
    return;
  }
  var height = trElement.style.height;
  if (!height) {
    return;
  }
  var firstCell = trElement.querySelector('td, th');
  if (!firstCell) {
    return;
  }
  var ptValue = (0, _convertToCSSPTValue2.default)(height);
  if (!ptValue) {
    return;
  }

  var pEls = firstCell.querySelectorAll('p');
  var heightNeeded = ptValue - LINE_HEIGHT_PT_VALUE * pEls.length;
  if (heightNeeded < 0) {
    return;
  }
  var pElsNeeded = Math.round(heightNeeded / LINE_HEIGHT_PT_VALUE);
  if (pElsNeeded <= 0) {
    return;
  }
  var frag = doc.createDocumentFragment();
  var line = doc.createElement('p');
  while (pElsNeeded > 0) {
    pElsNeeded--;
    frag.appendChild(line.cloneNode(false));
  }
  firstCell.appendChild(frag);
}