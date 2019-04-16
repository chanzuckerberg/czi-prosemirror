'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorTables = require('prosemirror-tables');

var _TableCellMenuPlugin = require('./TableCellMenuPlugin');

var _TableCellMenuPlugin2 = _interopRequireDefault(_TableCellMenuPlugin);

var _createTableResizingPlugin = require('./createTableResizingPlugin');

var _createTableResizingPlugin2 = _interopRequireDefault(_createTableResizingPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
exports.default = [new _TableCellMenuPlugin2.default(), (0, _createTableResizingPlugin2.default)(), (0, _prosemirrorTables.tableEditing)()];