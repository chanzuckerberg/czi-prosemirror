'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

exports.default = patchTableElements;

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _convertToCSSPTValue = require('./convertToCSSPTValue');

var _convertToCSSPTValue2 = _interopRequireDefault(_convertToCSSPTValue);

var _toHexColor = require('./ui/toHexColor');

var _toHexColor2 = _interopRequireDefault(_toHexColor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This value is arbitrary. It assumes the page use the default size
// with default padding.
var DEFAULT_TABLE_WIDTH = 666;

// This value is originally defined at prosemirror-table.
var ATTRIBUTE_CELL_WIDTH = 'data-colwidth';

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
  var backgroundColor = style.backgroundColor,
      width = style.width;

  if (backgroundColor) {
    var tdBgColor = (0, _toHexColor2.default)(backgroundColor);
    var selector = 'span[style*=background-color]';
    var spans = (0, _from2.default)(tdElement.querySelectorAll(selector));
    spans.some(function (spanElement) {
      var spanStyle = spanElement.style;
      if (!spanStyle || !spanStyle.backgroundColor) {
        return;
      }
      var spanBgColor = (0, _toHexColor2.default)(spanStyle.backgroundColor);
      if (spanBgColor === tdBgColor) {
        // The span has the same bg color as the cell does, erase its bg color.
        spanStyle.backgroundColor = '';
      }
    });
  }

  if (width) {
    var ptValue = (0, _convertToCSSPTValue2.default)(width);
    if (!ptValue) {
      return;
    }
    var pxValue = ptValue * _convertToCSSPTValue.PT_TO_PX_RATIO;
    // Attribute "data-colwidth" is defined at 'prosemirror-tables';
    var rowEl = (0, _nullthrows2.default)(tdElement.parentElement);
    tdElement.setAttribute(ATTRIBUTE_CELL_WIDTH, String(Math.round(pxValue)));

    if (rowEl.lastElementChild === tdElement) {
      var cells = (0, _from2.default)(rowEl.children);
      var tableWidth = cells.reduce(function (sum, td) {
        var ww = parseInt(td.getAttribute(ATTRIBUTE_CELL_WIDTH), 10);
        sum += ww;
        return sum;
      }, 0);
      if (isNaN(tableWidth) || tableWidth <= DEFAULT_TABLE_WIDTH) {
        return;
      }
      var scale = DEFAULT_TABLE_WIDTH / tableWidth;
      cells.forEach(function (cell) {
        var ww = parseInt(cell.getAttribute(ATTRIBUTE_CELL_WIDTH), 10);
        cell.setAttribute(ATTRIBUTE_CELL_WIDTH, String(Math.round(ww * scale)));
      });
    }
  }
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