'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createEditorKeyMap;

var _EditorCommands = require('./EditorCommands');

var EditorCommands = _interopRequireWildcard(_EditorCommands);

var _keymaps = require('./keymaps');

var KeyMaps = _interopRequireWildcard(_keymaps);

var _UICommand = require('./ui/UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var KEY_REDO = KeyMaps.KEY_REDO,
    KEY_SPLIT_LIST_ITEM = KeyMaps.KEY_SPLIT_LIST_ITEM,
    KEY_UNDO = KeyMaps.KEY_UNDO,
    KEY_TAB = KeyMaps.KEY_TAB,
    KEY_TAB_SHIFT = KeyMaps.KEY_TAB_SHIFT;
var HISTORY_REDO = EditorCommands.HISTORY_REDO,
    HISTORY_UNDO = EditorCommands.HISTORY_UNDO,
    INDENT_LESS = EditorCommands.INDENT_LESS,
    INDENT_MORE = EditorCommands.INDENT_MORE,
    LIST_SPLIT = EditorCommands.LIST_SPLIT,
    TABLE_MOVE_TO_NEXT_CELL = EditorCommands.TABLE_MOVE_TO_NEXT_CELL,
    TABLE_MOVE_TO_PREV_CELL = EditorCommands.TABLE_MOVE_TO_PREV_CELL;


function bindCommands() {
  for (var _len = arguments.length, commands = Array(_len), _key = 0; _key < _len; _key++) {
    commands[_key] = arguments[_key];
  }

  return function (state, dispatch, view) {
    return commands.some(function (cmd) {
      if (cmd.isEnabled(state, view)) {
        cmd.execute(state, dispatch, view);
        return true;
      }
    });
  };
}

function createEditorKeyMap() {
  var result = {};
  result[KEY_REDO.common] = HISTORY_REDO.execute;
  result[KEY_SPLIT_LIST_ITEM.common] = LIST_SPLIT.execute;
  result[KEY_TAB.common] = bindCommands(TABLE_MOVE_TO_NEXT_CELL, INDENT_MORE);
  result[KEY_TAB_SHIFT.common] = bindCommands(TABLE_MOVE_TO_PREV_CELL, INDENT_LESS);
  result[KEY_UNDO.common] = HISTORY_UNDO.execute;
  return result;
}