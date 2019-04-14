'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = createTableResizingPluging;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTables = require('prosemirror-tables');

var _prosemirrorView = require('prosemirror-view');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TABLE_HANDLE_WIDTH = 10;

var TABLE_CELL_MINWIDTH = 25;
var TABLE_VIEW = undefined;
var TABLE_LAST_COLUMN_RESIZABLE = false;

function lookUpTableWrapper(event) {
  var target = event.target;
  if (!target || !target.closest) {
    return null;
  }
  return target.closest('.tableWrapper');
}

function dispatchMouseEvent(type, clientX) {
  requestAnimationFrame(function () {
    var event = new MouseEvent(type, {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: clientX
    });
    window.dispatchEvent(event);
  });
}

function calculateMaxClientX(event, targetTable) {
  var clientX = event.clientX;

  var _targetTable$getBound = targetTable.getBoundingClientRect(),
      left = _targetTable$getBound.left,
      width = _targetTable$getBound.width;

  var offsetX = clientX - left;
  var colgroup = targetTable.querySelector('colgroup');
  var colsCount = colgroup ? colgroup.querySelectorAll('col').length : 0;
  var cx = width - offsetX - colsCount * TABLE_CELL_MINWIDTH;
  return Math.round(clientX + Math.max(0, cx));
}

function createTableResizingPluging() {
  var maxClientX = 0;

  // https://github.com/ProseMirror/prosemirror-tables/blob/master/src/columnresizing.js
  var plugin = (0, _prosemirrorTables.columnResizing)(TABLE_HANDLE_WIDTH, TABLE_CELL_MINWIDTH, TABLE_VIEW, TABLE_LAST_COLUMN_RESIZABLE);

  var captureMouse = function captureMouse(event) {
    console.log([event.clientX, maxClientX]);
    if (event.clientX > maxClientX) {
      // Current mouse event will make table too wide. Stop it and
      // fires a simulated event instead.
      event.stopImmediatePropagation();
      dispatchMouseEvent(event.type, maxClientX);
    } else if (event.type === 'mouseup') {
      window.removeEventListener('mousemove', captureMouse, true);
      window.removeEventListener('mouseup', captureMouse, true);
    }
  };

  var _mousedown = plugin.props.handleDOMEvents.mousedown;

  // This is a workaround to constraint the mousemove to prevent
  // the table become too wide.

  (0, _assign2.default)(plugin.props.handleDOMEvents, {
    mousedown: function mousedown(view, event) {
      var targetTable = lookUpTableWrapper(event);
      maxClientX = targetTable ? calculateMaxClientX(event, targetTable) : Number.MAX_VALUE;
      window.addEventListener('mousemove', captureMouse, true);
      window.addEventListener('mouseup', captureMouse, true);
      _mousedown(view, event);
      return false;
    }
  });

  return plugin;
}