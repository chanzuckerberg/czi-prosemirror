'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _prosemirrorCommands = require('prosemirror-commands');

var _prosemirrorDropcursor = require('prosemirror-dropcursor');

var _prosemirrorGapcursor = require('prosemirror-gapcursor');

var _prosemirrorHistory = require('prosemirror-history');

var _prosemirrorKeymap = require('prosemirror-keymap');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTables = require('prosemirror-tables');

var ProsemirrorTables = _interopRequireWildcard(_prosemirrorTables);

var _ContentPlaceholderPlugin = require('./ContentPlaceholderPlugin');

var _ContentPlaceholderPlugin2 = _interopRequireDefault(_ContentPlaceholderPlugin);

var _CursorPlaceholderPlugin = require('./CursorPlaceholderPlugin');

var _CursorPlaceholderPlugin2 = _interopRequireDefault(_CursorPlaceholderPlugin);

var _EditorPageLayoutPlugin = require('./EditorPageLayoutPlugin');

var _EditorPageLayoutPlugin2 = _interopRequireDefault(_EditorPageLayoutPlugin);

var _EditorSchema = require('./EditorSchema');

var _EditorSchema2 = _interopRequireDefault(_EditorSchema);

var _ImageUploadPlaceholderPlugin = require('./ImageUploadPlaceholderPlugin');

var _ImageUploadPlaceholderPlugin2 = _interopRequireDefault(_ImageUploadPlaceholderPlugin);

var _LinkTooltipPlugin = require('./LinkTooltipPlugin');

var _LinkTooltipPlugin2 = _interopRequireDefault(_LinkTooltipPlugin);

var _SelectionPlaceholderPlugin = require('./SelectionPlaceholderPlugin');

var _SelectionPlaceholderPlugin2 = _interopRequireDefault(_SelectionPlaceholderPlugin);

var _TablePlugins = require('./TablePlugins');

var _TablePlugins2 = _interopRequireDefault(_TablePlugins);

var _buildInputRules = require('./buildInputRules');

var _buildInputRules2 = _interopRequireDefault(_buildInputRules);

var _createEditorKeyMap = require('./createEditorKeyMap');

var _createEditorKeyMap2 = _interopRequireDefault(_createEditorKeyMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function buildPlugins(schema) {
  var plugins = [new _ContentPlaceholderPlugin2.default(), new _CursorPlaceholderPlugin2.default(), new _EditorPageLayoutPlugin2.default(), new _ImageUploadPlaceholderPlugin2.default(), new _LinkTooltipPlugin2.default(), new _SelectionPlaceholderPlugin2.default(), (0, _buildInputRules2.default)(schema), (0, _prosemirrorDropcursor.dropCursor)(), (0, _prosemirrorGapcursor.gapCursor)(), (0, _prosemirrorHistory.history)(), (0, _prosemirrorKeymap.keymap)((0, _createEditorKeyMap2.default)()), (0, _prosemirrorKeymap.keymap)(_prosemirrorCommands.baseKeymap)].concat(_TablePlugins2.default);

  return plugins;
}

// Plugin
var EditorPlugins = buildPlugins(_EditorSchema2.default);
exports.default = EditorPlugins;