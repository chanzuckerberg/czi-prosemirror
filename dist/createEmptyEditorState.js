'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_DOC_JSON = undefined;
exports.default = createEmptyEditorState;

var _prosemirrorState = require('prosemirror-state');

var _EditorPlugins = require('./EditorPlugins');

var _EditorPlugins2 = _interopRequireDefault(_EditorPlugins);

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_DOC_JSON = exports.EMPTY_DOC_JSON = {
  'type': 'doc',
  'content': [{
    'type': 'paragraph',
    'content': [{
      'type': 'text',
      'text': ' '
    }]
  }]
};

var EDITOR_EMPTY_STATE = _prosemirrorState.EditorState.create({
  doc: _EditorSchema2.default.nodeFromJSON(EMPTY_DOC_JSON),
  schema: _EditorSchema2.default,
  plugins: _EditorPlugins2.default
});

function createEmptyEditorState() {
  return EDITOR_EMPTY_STATE;
}