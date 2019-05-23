'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALL_KEYS = exports.KEY_UNDO = exports.KEY_TOGGLE_UNDERLINE = exports.KEY_TOGGLE_STRIKETHROUGH = exports.KEY_TOGGLE_ORDERED_LIST = exports.KEY_TOGGLE_MONOSPACE = exports.KEY_TOGGLE_ITALIC = exports.KEY_TOGGLE_HEADING_6 = exports.KEY_TOGGLE_HEADING_5 = exports.KEY_TOGGLE_HEADING_4 = exports.KEY_TOGGLE_HEADING_3 = exports.KEY_TOGGLE_HEADING_2 = exports.KEY_TOGGLE_HEADING_1 = exports.KEY_TOGGLE_CODE_BLOCK = exports.KEY_TOGGLE_BULLET_LIST = exports.KEY_TOGGLE_BOLD = exports.KEY_TOGGLE_BLOCK_QUOTE = exports.KEY_TAB_SHIFT = exports.KEY_TAB = exports.KEY_SPLIT_LIST_ITEM = exports.KEY_SPLIT_CODEBLOCK = exports.KEY_SHIFT_BACKSPACE = exports.KEY_SET_NORMAL_TEXT = exports.KEY_REDO = exports.KEY_INSERT_PAGE_BREAK = exports.KEY_INSERT_NEW_LINE_IN_LIST_ITEM = exports.KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = exports.KEY_INSERT_NEW_LINE = exports.KEY_INSERT_HORIZONTAL_RULE = exports.KEY_FORWARD_DELETE = exports.KEY_BACK_DELETE = undefined;
exports.tooltip = tooltip;
exports.findKeymapByDescription = findKeymapByDescription;
exports.findShortcutByDescription = findShortcutByDescription;
exports.findShortcutByKeymap = findShortcutByKeymap;
exports.makeKeyMap = makeKeyMap;
exports.makeKeyMapWithCommon = makeKeyMapWithCommon;

var _browserkeymap = require('browserkeymap');

var _browserkeymap2 = _interopRequireDefault(_browserkeymap);

var _browser = require('./browser');

var _browser2 = _interopRequireDefault(_browser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://tinyurl.com/ybwf3wex

function tooltip(keymap) {
  if (keymap) {
    var shortcut = void 0;
    if (_browser2.default.isMac()) {
      shortcut = keymap.mac.replace(/Cmd/i, '⌘').replace(/Shift/i, '⇧').replace(/Ctrl/i, '^').replace(/Alt/i, '⌥');
    } else {
      shortcut = keymap.windows;
    }
    return keymap.description + ' (' + shortcut + ')';
  }
  return null;
}

function findKeymapByDescription(description) {
  var matches = ALL_KEYS.filter(function (keymap) {
    return keymap.description.toUpperCase() === description.toUpperCase();
  });
  return matches[0];
}

function findShortcutByDescription(description) {
  var keymap = findKeymapByDescription(description);
  if (keymap) {
    return findShortcutByKeymap(keymap);
  }
  return null;
}

function findShortcutByKeymap(keymap) {
  if (_browser2.default.isMac()) {
    return keymap.mac;
  }

  return keymap.windows;
}

function makeKeyMap(description, windows, mac, common) {
  return {
    description: description,
    windows: windows,
    mac: mac,
    common: common
  };
}

function makeKeyMapWithCommon(description, common) {
  var windows = common.replace(/Mod/i, 'Ctrl');
  var mac = common.replace(/Mod/i, 'Cmd');
  return makeKeyMap(description, windows, mac, common);
}

var KEY_BACK_DELETE = exports.KEY_BACK_DELETE = makeKeyMapWithCommon('', 'Backspace');
var KEY_FORWARD_DELETE = exports.KEY_FORWARD_DELETE = makeKeyMapWithCommon('', 'Delete');
var KEY_INSERT_HORIZONTAL_RULE = exports.KEY_INSERT_HORIZONTAL_RULE = makeKeyMapWithCommon('Insert horizontal rule', 'Mod-Shift--');
var KEY_INSERT_NEW_LINE = exports.KEY_INSERT_NEW_LINE = makeKeyMapWithCommon('Insert new line', 'Shift-Enter');
var KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = exports.KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE = makeKeyMapWithCommon('Insert new line in blockquote', 'Shift-Enter');
var KEY_INSERT_NEW_LINE_IN_LIST_ITEM = exports.KEY_INSERT_NEW_LINE_IN_LIST_ITEM = makeKeyMapWithCommon('Insert new line in list item', 'Shift-Enter');
var KEY_INSERT_PAGE_BREAK = exports.KEY_INSERT_PAGE_BREAK = makeKeyMapWithCommon('Insert page break', 'Mod-Enter');
var KEY_REDO = exports.KEY_REDO = makeKeyMapWithCommon('Redo', 'Mod-Shift-z');
var KEY_SET_NORMAL_TEXT = exports.KEY_SET_NORMAL_TEXT = makeKeyMap('Normal text', 'Ctrl-0', 'Cmd-Alt-0');
var KEY_SHIFT_BACKSPACE = exports.KEY_SHIFT_BACKSPACE = makeKeyMapWithCommon('Shift Backspace', 'Shift-Backspace');
var KEY_SPLIT_CODEBLOCK = exports.KEY_SPLIT_CODEBLOCK = makeKeyMapWithCommon('Split code block', 'Enter');
var KEY_SPLIT_LIST_ITEM = exports.KEY_SPLIT_LIST_ITEM = makeKeyMapWithCommon('Split list item', 'Enter');
var KEY_TAB = exports.KEY_TAB = makeKeyMapWithCommon('', 'Tab');
var KEY_TAB_SHIFT = exports.KEY_TAB_SHIFT = makeKeyMapWithCommon('', 'Shift-Tab');
var KEY_TOGGLE_BLOCK_QUOTE = exports.KEY_TOGGLE_BLOCK_QUOTE = makeKeyMap('Block quote', 'Ctrl-7', 'Cmd-Alt-7');
var KEY_TOGGLE_BOLD = exports.KEY_TOGGLE_BOLD = makeKeyMapWithCommon('Toggle bold', 'Mod-b');
var KEY_TOGGLE_BULLET_LIST = exports.KEY_TOGGLE_BULLET_LIST = makeKeyMapWithCommon('Toggle bullet list', 'Mod-Shift-b');
var KEY_TOGGLE_CODE_BLOCK = exports.KEY_TOGGLE_CODE_BLOCK = makeKeyMap('Code block', 'Ctrl-8', 'Cmd-Alt-8');
var KEY_TOGGLE_HEADING_1 = exports.KEY_TOGGLE_HEADING_1 = makeKeyMap('Heading 1', 'Ctrl-1', 'Cmd-Alt-1');
var KEY_TOGGLE_HEADING_2 = exports.KEY_TOGGLE_HEADING_2 = makeKeyMap('Heading 2', 'Ctrl-2', 'Cmd-Alt-2');
var KEY_TOGGLE_HEADING_3 = exports.KEY_TOGGLE_HEADING_3 = makeKeyMap('Heading 3', 'Ctrl-3', 'Cmd-Alt-3');
var KEY_TOGGLE_HEADING_4 = exports.KEY_TOGGLE_HEADING_4 = makeKeyMap('Heading 4', 'Ctrl-4', 'Cmd-Alt-4');
var KEY_TOGGLE_HEADING_5 = exports.KEY_TOGGLE_HEADING_5 = makeKeyMap('Heading 5', 'Ctrl-5', 'Cmd-Alt-5');
var KEY_TOGGLE_HEADING_6 = exports.KEY_TOGGLE_HEADING_6 = makeKeyMap('Heading 5', 'Ctrl-6', 'Cmd-Alt-6');
var KEY_TOGGLE_ITALIC = exports.KEY_TOGGLE_ITALIC = makeKeyMapWithCommon('Toggle italic', 'Mod-i');
var KEY_TOGGLE_MONOSPACE = exports.KEY_TOGGLE_MONOSPACE = makeKeyMapWithCommon('Toggle monospace', 'Mod-Shift-m');
var KEY_TOGGLE_ORDERED_LIST = exports.KEY_TOGGLE_ORDERED_LIST = makeKeyMapWithCommon('Toggle ordered list', 'Mod-Shift-l');
var KEY_TOGGLE_STRIKETHROUGH = exports.KEY_TOGGLE_STRIKETHROUGH = makeKeyMapWithCommon('Toggle strikethrough', 'Mod-Shift-s');
var KEY_TOGGLE_UNDERLINE = exports.KEY_TOGGLE_UNDERLINE = makeKeyMapWithCommon('Toggle underline', 'Mod-u');
var KEY_UNDO = exports.KEY_UNDO = makeKeyMapWithCommon('Undo', 'Mod-z');

var ALL_KEYS = exports.ALL_KEYS = [KEY_BACK_DELETE, KEY_FORWARD_DELETE, KEY_INSERT_HORIZONTAL_RULE, KEY_INSERT_NEW_LINE, KEY_INSERT_NEW_LINE_IN_BLOCKQUOTE, KEY_INSERT_NEW_LINE_IN_LIST_ITEM, KEY_SET_NORMAL_TEXT, KEY_SHIFT_BACKSPACE, KEY_SPLIT_LIST_ITEM, KEY_TAB_SHIFT, KEY_TAB, KEY_TOGGLE_BLOCK_QUOTE, KEY_TOGGLE_BOLD, KEY_TOGGLE_BULLET_LIST, KEY_TOGGLE_BULLET_LIST, KEY_TOGGLE_CODE_BLOCK, KEY_TOGGLE_HEADING_1, KEY_TOGGLE_HEADING_2, KEY_TOGGLE_HEADING_3, KEY_TOGGLE_HEADING_4, KEY_TOGGLE_HEADING_5, KEY_TOGGLE_HEADING_6, KEY_TOGGLE_ITALIC, KEY_TOGGLE_MONOSPACE, KEY_TOGGLE_ORDERED_LIST, KEY_TOGGLE_STRIKETHROUGH, KEY_TOGGLE_UNDERLINE, KEY_UNDO];