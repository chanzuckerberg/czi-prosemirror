'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEmptyEditorStateschema;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _convertFromJSON = require('./convertFromJSON');

var _convertFromJSON2 = _interopRequireDefault(_convertFromJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_DOC_JSON = {
  'type': 'doc',
  'content': [{
    'type': 'paragraph',
    'content': [{
      'type': 'text',
      'text': ' '
    }]
  }]
};

function createEmptyEditorStateschema(schema, plugins) {
  // TODO: Check if schema support doc and paragraph nodes.
  return (0, _convertFromJSON2.default)(EMPTY_DOC_JSON, schema, plugins);
}