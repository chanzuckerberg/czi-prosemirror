'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

var _buildEditorPlugins = require('./buildEditorPlugins');

var _buildEditorPlugins2 = _interopRequireDefault(_buildEditorPlugins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Plugin
var EditorPlugins = (0, _buildEditorPlugins2.default)(_EditorSchema2.default);
exports.default = EditorPlugins;