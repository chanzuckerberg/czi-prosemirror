'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = convertFromJSON;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _EditorPlugins = require('./EditorPlugins');

var _EditorPlugins2 = _interopRequireDefault(_EditorPlugins);

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

var _createEmptyEditorState = require('./createEmptyEditorState');

var _createEmptyEditorState2 = _interopRequireDefault(_createEmptyEditorState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertFromJSON(json, schema, plugins) {
  var effectiveSchema = schema || _EditorSchema2.default;
  var effectivePlugins = plugins || _EditorPlugins2.default;
  if (typeof json === 'string') {
    try {
      json = JSON.parse(json);
    } catch (ex) {
      console.error('convertFromJSON:', ex);
      return (0, _createEmptyEditorState2.default)(schema, plugins);
    }
  }

  if (!json || (typeof json === 'undefined' ? 'undefined' : (0, _typeof3.default)(json)) !== 'object') {
    console.error('convertFromJSON: invalid object', json);
    return (0, _createEmptyEditorState2.default)(schema, plugins);
  }

  return _prosemirrorState.EditorState.create({
    doc: effectiveSchema.nodeFromJSON(json),
    schema: effectiveSchema,
    plugins: effectivePlugins
  });
}