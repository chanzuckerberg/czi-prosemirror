'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FONT_TYPE_NAME_DEFAULT = undefined;
exports.default = findActiveFontType;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _UICommand = require('./UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _findActiveMark = require('../findActiveMark');

var _findActiveMark2 = _interopRequireDefault(_findActiveMark);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _MarkNames = require('../MarkNames');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This should map to `--czi-editor-font-size` at `czi-editor.css`.
var FONT_TYPE_NAME_DEFAULT = exports.FONT_TYPE_NAME_DEFAULT = 'Arial';

function findActiveFontType(state) {
  var schema = state.schema,
      doc = state.doc,
      selection = state.selection;

  var markType = state.schema.marks[_MarkNames.MARK_FONT_TYPE];
  if (!markType) {
    return FONT_TYPE_NAME_DEFAULT;
  }
  var from = selection.from,
      to = selection.to;

  var mark = markType ? (0, _findActiveMark2.default)(doc, from, to, markType) : null;
  return mark && mark.attrs.name || FONT_TYPE_NAME_DEFAULT;
}