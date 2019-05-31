'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _TableNodeView = require('./ui/TableNodeView');

var _TableNodeView2 = _interopRequireDefault(_TableNodeView);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorUtils = require('prosemirror-utils');

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorTables = require('prosemirror-tables');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (C) 2015-2016 by Marijn Haverbeke <marijnh@gmail.com> and others
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// License about this file:
// This file is originally forked from
// https://github.com/ProseMirror/prosemirror-tables/blob/0e74c6a1761651ccf3701eb8529fa9187ad5c91d/src/columnresizing.js
// and most of the original codes had been modified to support the bevaviors
// that czi-prosemirror needs.
// The plugin provides the following behaviors:
// - Let user resize a column without changing the total width of the table.
// - Let user set the left margin of the table.
// - Let user set the right margin of the table.

var PLUGIN_KEY = new _prosemirrorState.PluginKey('tableColumnResizing');
var CELL_MIN_WIDTH = 25;
var HANDLE_WIDTH = 20;

var cancelDrag = null;

// The immutable plugin state that stores the information for resizing.

var ResizeState = function () {
  function ResizeState(cellPos, forMarginLeft, draggingInfo) {
    (0, _classCallCheck3.default)(this, ResizeState);

    this.cellPos = cellPos;
    this.draggingInfo = draggingInfo;
    this.forMarginLeft = forMarginLeft;
  }

  (0, _createClass3.default)(ResizeState, [{
    key: 'apply',
    value: function apply(tr) {
      var state = this;
      var action = tr.getMeta(PLUGIN_KEY);
      if (action && typeof action.setCellPos === 'number') {
        return new ResizeState(action.setCellPos, action.setForMarginLeft, null);
      }

      if (action && action.setDraggingInfo !== undefined) {
        return new ResizeState(state.cellPos, state.forMarginLeft, action.setDraggingInfo);
      }

      if (state.cellPos && state.cellPos > -1 && tr.docChanged) {
        var cellPos = tr.mapping.map(state.cellPos, -1);
        if (!(0, _prosemirrorTables.pointsAtCell)(tr.doc.resolve(cellPos))) {
          cellPos = null;
        }
        state = new ResizeState(cellPos, cellPos ? state.forMarginLeft : false, state.draggingInfo);
      }
      return state;
    }
  }]);
  return ResizeState;
}();

// Function that handles the mousemove event inside table cell.


function handleMouseMove(view, event) {
  var resizeState = PLUGIN_KEY.getState(view.state);
  if (resizeState.draggingInfo) {
    return;
  }

  var target = domCellAround(event.target);
  var forMarginLeft = false;
  var cell = -1;

  if (target instanceof HTMLElement) {
    var _target$getBoundingCl = target.getBoundingClientRect(),
        left = _target$getBoundingCl.left,
        right = _target$getBoundingCl.right;

    var offsetLeft = event.clientX - left;
    if (offsetLeft <= HANDLE_WIDTH) {
      if (target.cellIndex === 0) {
        forMarginLeft = true;
        cell = edgeCell(view, event, 'right');
      } else {
        cell = edgeCell(view, event, 'left');
      }
    } else if (right - event.clientX <= HANDLE_WIDTH) {
      cell = edgeCell(view, event, 'right');
    }
  }

  if (cell === resizeState.cellPos && forMarginLeft === resizeState.forMarginLeft) {
    return;
  }

  if (cell !== -1) {
    var $cell = view.state.doc.resolve(cell);
    if (!$cell) {
      return;
    }
  }
  updateResizeHandle(view, cell, forMarginLeft);
}

// Function that handles the mouseleave event from the table cell.
function handleMouseLeave(view) {
  var resizeState = PLUGIN_KEY.getState(view.state);
  var cellPos = resizeState.cellPos,
      draggingInfo = resizeState.draggingInfo;

  if (cellPos > -1 && !draggingInfo) {
    updateResizeHandle(view, -1, false);
  }
}

// Function that handles the mousedown event from the table cell.
function handleMouseDown(view, event) {
  // It's possible that the resize action that happened earlier was inturrupted
  // while its dependent mouse events were stopped or prevented by others.
  // We need to stop the previous resize action if it did not finish.
  cancelDrag && cancelDrag(event);

  var resizeState = PLUGIN_KEY.getState(view.state);
  if (resizeState.cellPos === -1 || resizeState.draggingInfo) {
    return false;
  }

  var dragStarted = false;
  var dragMoveHandler = null;

  var finish = function finish(event) {
    window.removeEventListener('mouseup', finish, true);
    window.removeEventListener('mousemove', move, true);
    dragStarted && handleDragEnd(view, event);
    cancelDrag = null;
  };

  var move = function move(event) {
    if (event.which) {
      if (!dragStarted) {
        handleDragStart(view, event);
        dragStarted = true;
      }
      // Move events should be batched to avoid over-handling the mouse
      // event.
      dragMoveHandler = dragMoveHandler || batchMouseHandler(handleDragMove);
      dragMoveHandler(view, event);
    } else {
      finish(event);
    }
  };

  cancelDrag = finish;
  window.addEventListener('mouseup', finish, true);
  window.addEventListener('mousemove', move, true);
  event.preventDefault();
  return true;
}

function handleDragStart(view, event) {
  var resizeState = PLUGIN_KEY.getState(view.state);
  if (resizeState.cellPos === -1 || resizeState.draggingInfo) {
    return;
  }

  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {
    setDraggingInfo: calculateDraggingInfo(view, event, resizeState)
  }));
}

// Function that handles the mouse event while resizing the table cell.
// This will temporarily updates the table's style until the resize ends.
function handleDragMove(view, event) {
  var resizeState = PLUGIN_KEY.getState(view.state);
  var draggingInfo = resizeState.draggingInfo,
      forMarginLeft = resizeState.forMarginLeft;

  if (!draggingInfo) {
    return;
  }
  var startX = draggingInfo.startX,
      columnWidths = draggingInfo.columnWidths,
      taregtColumnIndex = draggingInfo.taregtColumnIndex,
      columnElements = draggingInfo.columnElements,
      tableElement = draggingInfo.tableElement,
      tableMarginLeft = draggingInfo.tableMarginLeft,
      tableMarginRight = draggingInfo.tableMarginRight;


  var totalWidth = 0;
  var ml = tableMarginLeft;

  var dx = event.clientX - startX;
  var lastIndex = columnWidths.length - 1;
  var widths = columnWidths.map(function (cw, index) {
    var ww = void 0;
    if (forMarginLeft) {
      if (index === 0) {
        // Resize the first column.
        ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + tableMarginLeft);
        // Resize table's left margin.
        ml = Math.max(0, tableMarginLeft + cw - ww);
      } else {
        // The rest columns remain the same,
        ww = cw;
      }
    } else if (index === taregtColumnIndex && index === lastIndex) {
      // Resize the last column.
      ww = Math.min(cw + tableMarginRight, Math.max(CELL_MIN_WIDTH, cw + dx));
    } else if (index === taregtColumnIndex) {
      // Resize the column.
      ww = Math.min(Math.max(CELL_MIN_WIDTH, cw + dx), cw + (columnWidths[index + 1] || 0) - CELL_MIN_WIDTH);
    } else if (index === taregtColumnIndex + 1) {
      // Resize the column's previous column.
      ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + (columnWidths[index - 1] || 0) - CELL_MIN_WIDTH);
    } else {
      // This column does not resize.
      ww = cw;
    }

    totalWidth += ww;
    return ww;
  });

  var tableElementStyle = tableElement.style;
  tableElementStyle.marginLeft = ml + 'px';
  tableElementStyle.width = Math.round(totalWidth) + 'px';
  tableElementStyle.minWidth = '';
  columnElements.forEach(function (colEl, index) {
    colEl.style.width = Math.round(widths[index]) + 'px';
  });
}

// Function that handles the mouse event while stop resizing the table cell.
function handleDragEnd(view, event) {
  var resizeState = PLUGIN_KEY.getState(view.state);
  var cellPos = resizeState.cellPos,
      draggingInfo = resizeState.draggingInfo;

  if (!draggingInfo) {
    return;
  }
  var columnElements = draggingInfo.columnElements,
      tableElement = draggingInfo.tableElement;

  var widths = columnElements.map(function (colEl) {
    return parseFloat(colEl.style.width);
  });

  var $cell = view.state.doc.resolve(cellPos);
  var start = $cell.start(-1);
  var table = $cell.node(-1);
  var map = _prosemirrorTables.TableMap.get(table);
  var tr = view.state.tr;
  for (var row = 0; row < map.height; row++) {
    for (var col = 0; col < widths.length; col++) {
      var mapIndex = row * map.width + col;
      if (row && map.map[mapIndex] == map.map[mapIndex - map.width]) {
        // Rowspanning cell that has already been handled
        continue;
      }
      var pos = map.map[mapIndex];

      var _table$nodeAt = table.nodeAt(pos),
          attrs = _table$nodeAt.attrs;

      var colspan = attrs.colspan || 1;
      var colwidth = widths.slice(col, col + colspan);

      if (colspan > 1) {
        col += colspan - 1;
      }

      if (attrs.colwidth && compareNumbersList(attrs.colwidth, colwidth)) {
        continue;
      }

      tr = tr.setNodeMarkup(start + pos, null, (0, _prosemirrorTables.setAttr)(attrs, 'colwidth', colwidth));
    }
  }

  var marginLeft = parseFloat(tableElement.style.marginLeft) || null;
  if (table.attrs.marginLeft !== marginLeft) {
    var nodeType = table.type;
    var _attrs = (0, _extends3.default)({}, table.attrs, {
      marginLeft: marginLeft
    });
    var tableLookup = (0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($cell, view.state.schema.nodes[nodeType.name]);
    var tablePos = (0, _nullthrows2.default)(tableLookup && tableLookup.pos);
    tr = tr.setNodeMarkup(tablePos, nodeType, _attrs);
  }

  if (tr.docChanged) {
    // Let editor know the change.
    view.dispatch(tr);
  }
  // Hides the resize handle bars.
  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, { setDraggingInfo: null }));
}

// Helper that prepares the information needed before the resizing starts.
function calculateDraggingInfo(view, event, resizeState) {
  var cellPos = resizeState.cellPos,
      forMarginLeft = resizeState.forMarginLeft;

  var dom = view.domAtPos(cellPos);
  var tableEl = dom.node.closest('table');
  var tableWrapper = tableEl.closest('.tableWrapper');
  var colGroupEl = tableEl.querySelector('colgroup');
  var colEls = colGroupEl ? (0, _from2.default)(colGroupEl.querySelectorAll('col')) : [];
  var tableWrapperRect = tableWrapper.getBoundingClientRect();
  var tableRect = tableEl.getBoundingClientRect();
  var defaultColumnWidth = tableWrapperRect.width / colEls.length;
  var startX = event.clientX;
  var offsetLeft = startX - tableRect.left;

  var tableWidth = 0;
  var taregtColumnIndex = -1;

  var tableMarginLeftStyle = tableEl.style.marginLeft;
  var tableMarginLeft = tableMarginLeftStyle && /\d+px/.test(tableMarginLeftStyle) ? parseFloat(tableMarginLeftStyle) : 0;

  var tableMarginRight = tableWrapperRect.right - tableRect.right;

  // Calculate the inital width of each column.
  // Calculate the inital width of the table.
  // Find out the target column to resize.
  var columnWidths = (0, _from2.default)(colEls).map(function (colEl, ii) {
    var cssWidth = colEl.style.width;
    var colWidth = Math.max(CELL_MIN_WIDTH, cssWidth && parseFloat(cssWidth) || defaultColumnWidth);

    if (tableWidth + colWidth > tableWrapperRect.width) {
      // column is too wide, make it fit.
      colWidth -= tableWrapperRect.width - (tableWidth + colWidth);
    }

    // The edges of the column's right border.
    var edgeLeft = tableWidth + colWidth - HANDLE_WIDTH / 2;
    var edgeRight = tableWidth + colWidth + HANDLE_WIDTH / 2;
    if (offsetLeft >= edgeLeft && offsetLeft <= edgeRight) {
      // This is the column to resize.
      taregtColumnIndex = ii;
    }
    tableWidth += colWidth;
    return colWidth;
  });

  if (forMarginLeft) {
    // Both the first column and the table's left margin should resize.
    taregtColumnIndex = 0;
  }

  if (taregtColumnIndex < 0) {
    // Nothing to resize. This happens when the mouse isn't nearby any position
    // that is alllowed to resize a column.
    return null;
  }

  return {
    columnElements: colEls,
    taregtColumnIndex: taregtColumnIndex,
    columnWidths: columnWidths,
    startX: startX,
    tableElement: tableEl,
    tableMarginLeft: tableMarginLeft,
    tableMarginRight: tableMarginRight,
    tableWidth: tableWidth,
    tableWrapperWidth: tableWrapperRect.width
  };
}

// Helper that finds the closest cell element from a given event target.
function domCellAround(target) {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror') ? null : target.parentElement;
  }
  return target;
}

// Helper that resolves the prose-mirror node postion of a cell from a given
// event target.
function edgeCell(view, event, side) {
  var _view$posAtCoords = view.posAtCoords({ left: event.clientX, top: event.clientY }),
      pos = _view$posAtCoords.pos;

  var $cell = (0, _prosemirrorTables.cellAround)(view.state.doc.resolve(pos));
  if (!$cell) {
    return -1;
  }
  if (side == 'right') {
    return $cell.pos;
  }
  var map = _prosemirrorTables.TableMap.get($cell.node(-1));
  var start = $cell.start(-1);
  var index = map.map.indexOf($cell.pos - start);
  return index % map.width == 0 ? -1 : start + map.map[index - 1];
}

// Update the resize handler (UI) state.
function updateResizeHandle(view, cellPos, forMarginLeft) {
  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {
    setCellPos: cellPos,
    setForMarginLeft: forMarginLeft
  }));
}

// Get the decorations that renders the resize handle bars.
function handleDecorations(state, resizeState) {
  if (!resizeState.cellPos) {
    return _prosemirrorView.DecorationSet.create(state.doc, []);
  }
  var decorations = [];
  var $cell = state.doc.resolve(resizeState.cellPos);
  var table = $cell.node(-1);

  var map = _prosemirrorTables.TableMap.get(table);
  var start = $cell.start(-1);
  var col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;
  for (var row = 0; row < map.height; row++) {
    var index = col + row * map.width - 1;
    // For positions that are have either a different cell or the end
    // of the table to their right, and either the top of the table or
    // a different cell above them, add a decoration
    if ((col === map.width || map.map[index] !== map.map[index + 1]) && (row === 0 || map.map[index - 1] !== map.map[index - 1 - map.width])) {
      var cellPos = map.map[index];
      var pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
      var dom = document.createElement('div');
      var className = 'column-resize-handle';
      if (resizeState.forMarginLeft) {
        className += ' for-margin-left';
      }
      dom.className = className;
      decorations.push(_prosemirrorView.Decoration.widget(pos, dom));
    }
  }
  return _prosemirrorView.DecorationSet.create(state.doc, decorations);
}

// Creates a custom table view that renders the margin-left style.
function createTableView(node, view) {
  return new _TableNodeView2.default(node, CELL_MIN_WIDTH, view);
}

function batchMouseHandler(handler) {
  var target = null;
  var clientX = 0;
  var clientY = 0;
  var view = null;
  var onMouseEvent = function onMouseEvent() {
    if (view && target) {
      var pointerEvent = {
        target: target,
        clientX: clientX,
        clientY: clientY
      };
      handler(view, pointerEvent);
    }
  };
  return function (ev, me) {
    target = me.target;
    clientX = me.clientX;
    clientY = me.clientY;
    view = ev;
    requestAnimationFrame(onMouseEvent);
  };
}

function compareNumbersList(one, two) {
  if (one.length !== two.length) {
    return false;
  }

  return !one.some(function (value, index) {
    return two[index] !== value;
  });
}

// Plugin that supports table columns resizing.

var TableResizePlugin = function (_Plugin) {
  (0, _inherits3.default)(TableResizePlugin, _Plugin);

  function TableResizePlugin() {
    (0, _classCallCheck3.default)(this, TableResizePlugin);
    return (0, _possibleConstructorReturn3.default)(this, (TableResizePlugin.__proto__ || (0, _getPrototypeOf2.default)(TableResizePlugin)).call(this, {
      key: PLUGIN_KEY,
      state: {
        init: function init(_, state) {
          this.spec.props.nodeViews[(0, _prosemirrorTables.tableNodeTypes)(state.schema).table.name] = createTableView;
          return new ResizeState(-1, null);
        },
        apply: function apply(tr, prev) {
          return prev.apply(tr);
        }
      },
      props: {
        attributes: function attributes(state) {
          var resizeState = PLUGIN_KEY.getState(state);
          return resizeState.cellPos > -1 ? { class: 'resize-cursor' } : null;
        },

        handleDOMEvents: {
          // Move events should be batched to avoid over-handling the mouse
          // event.
          mousemove: batchMouseHandler(handleMouseMove),
          mouseleave: handleMouseLeave,
          mousedown: handleMouseDown
        },
        decorations: function decorations(state) {
          var resizeState = PLUGIN_KEY.getState(state);
          return resizeState.cellPos > -1 ? handleDecorations(state, resizeState) : undefined;
        },

        nodeViews: {}
      }
    }));
  }

  return TableResizePlugin;
}(_prosemirrorState.Plugin);

exports.default = TableResizePlugin;