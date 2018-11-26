'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEmptyEditorState;

var _EditorPlugins = require('./EditorPlugins');

var _EditorPlugins2 = _interopRequireDefault(_EditorPlugins);

var _prosemirrorState = require('prosemirror-state');

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EDITOR_EMPTY_STATE = _prosemirrorState.EditorState.create({
  schema: _EditorSchema2.default,
  plugins: _EditorPlugins2.default
});

function createEmptyEditorState() {
  return EDITOR_EMPTY_STATE;
}