'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = adjustAllSelection;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _selectBodyContent = require('./selectBodyContent');

var _selectBodyContent2 = _interopRequireDefault(_selectBodyContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function adjustAllSelection(tr, schema) {
  var selection = tr.selection;

  if (selection instanceof _prosemirrorState.AllSelection) {
    return (0, _selectBodyContent2.default)(tr, schema);
  }
  return tr;
}