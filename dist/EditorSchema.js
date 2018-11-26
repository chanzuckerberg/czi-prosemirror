'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EditorMarks = require('./EditorMarks');

var _EditorMarks2 = _interopRequireDefault(_EditorMarks);

var _EditorNodes = require('./EditorNodes');

var _EditorNodes2 = _interopRequireDefault(_EditorNodes);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EditorSchema = new _prosemirrorModel.Schema({
  nodes: _EditorNodes2.default,
  marks: _EditorMarks2.default
});

exports.default = EditorSchema;