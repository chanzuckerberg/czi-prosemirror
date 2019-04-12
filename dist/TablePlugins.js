'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorTables = require('prosemirror-tables');

var _TableCellMenuPlugin = require('./TableCellMenuPlugin');

var _TableCellMenuPlugin2 = _interopRequireDefault(_TableCellMenuPlugin);

var _createTableResizingPluging = require('./createTableResizingPluging');

var _createTableResizingPluging2 = _interopRequireDefault(_createTableResizingPluging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
exports.default = [new _TableCellMenuPlugin2.default(), (0, _createTableResizingPluging2.default)(), (0, _prosemirrorTables.tableEditing)()];