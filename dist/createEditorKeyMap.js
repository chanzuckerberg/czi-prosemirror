'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

exports.default = createEditorKeyMap;

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorView = require('prosemirror-view');

var _EditorCommands = require('./EditorCommands');

var EditorCommands = _interopRequireWildcard(_EditorCommands);

var _EditorKeyMap = require('./EditorKeyMap');

var EditorKeyMap = _interopRequireWildcard(_EditorKeyMap);

var _UICommand = require('./ui/UICommand');

var _UICommand2 = _interopRequireDefault(_UICommand);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEY_BACK_DELETE = EditorKeyMap.KEY_BACK_DELETE,
    KEY_FORWARD_DELETE = EditorKeyMap.KEY_FORWARD_DELETE,
    KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = EditorKeyMap.KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE,
    KEY_INSERT_NEW_LINE_IN_LIST_ITEM = EditorKeyMap.KEY_INSERT_NEW_LINE_IN_LIST_ITEM,
    KEY_REDO = EditorKeyMap.KEY_REDO,
    KEY_SPLIT_LIST_ITEM = EditorKeyMap.KEY_SPLIT_LIST_ITEM,
    KEY_TAB_SHIFT = EditorKeyMap.KEY_TAB_SHIFT,
    KEY_TAB = EditorKeyMap.KEY_TAB,
    KEY_TOGGLE_BOLD = EditorKeyMap.KEY_TOGGLE_BOLD,
    KEY_TOGGLE_ITALIC = EditorKeyMap.KEY_TOGGLE_ITALIC,
    KEY_UNDO = EditorKeyMap.KEY_UNDO;
var BLOCKQUOTE_INSERT_NEW_LINE = EditorCommands.BLOCKQUOTE_INSERT_NEW_LINE,
    EM = EditorCommands.EM,
    HISTORY_REDO = EditorCommands.HISTORY_REDO,
    HISTORY_UNDO = EditorCommands.HISTORY_UNDO,
    INDENT_LESS = EditorCommands.INDENT_LESS,
    INDENT_MORE = EditorCommands.INDENT_MORE,
    LIST_ITEM_INSERT_NEW_LINE = EditorCommands.LIST_ITEM_INSERT_NEW_LINE,
    LIST_ITEM_MERGE_DOWN = EditorCommands.LIST_ITEM_MERGE_DOWN,
    LIST_ITEM_MERGE_UP = EditorCommands.LIST_ITEM_MERGE_UP,
    LIST_SPLIT = EditorCommands.LIST_SPLIT,
    TABLE_MOVE_TO_NEXT_CELL = EditorCommands.TABLE_MOVE_TO_NEXT_CELL,
    TABLE_MOVE_TO_PREV_CELL = EditorCommands.TABLE_MOVE_TO_PREV_CELL,
    TEXT_INSERT_TAB_SPACE = EditorCommands.TEXT_INSERT_TAB_SPACE,
    STRONG = EditorCommands.STRONG;


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
      return false;
    });
  };
}

function createEditorKeyMap() {
  var _result;

  var result = (_result = {}, (0, _defineProperty3.default)(_result, KEY_BACK_DELETE.common, LIST_ITEM_MERGE_UP.execute), (0, _defineProperty3.default)(_result, KEY_FORWARD_DELETE.common, LIST_ITEM_MERGE_DOWN.execute), (0, _defineProperty3.default)(_result, KEY_REDO.common, HISTORY_REDO.execute), (0, _defineProperty3.default)(_result, KEY_SPLIT_LIST_ITEM.common, LIST_SPLIT.execute), (0, _defineProperty3.default)(_result, KEY_TAB.common, bindCommands(TABLE_MOVE_TO_NEXT_CELL, TEXT_INSERT_TAB_SPACE, INDENT_MORE)), (0, _defineProperty3.default)(_result, KEY_TAB_SHIFT.common, bindCommands(TABLE_MOVE_TO_PREV_CELL, TEXT_INSERT_TAB_SPACE, INDENT_LESS)), (0, _defineProperty3.default)(_result, KEY_TOGGLE_BOLD.common, STRONG), (0, _defineProperty3.default)(_result, KEY_TOGGLE_ITALIC.common, EM), (0, _defineProperty3.default)(_result, KEY_UNDO.common, HISTORY_UNDO.execute), (0, _defineProperty3.default)(_result, KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE.common, BLOCKQUOTE_INSERT_NEW_LINE.execute), (0, _defineProperty3.default)(_result, KEY_INSERT_NEW_LINE_IN_LIST_ITEM.common, LIST_ITEM_INSERT_NEW_LINE.execute), _result);

  return result;
}