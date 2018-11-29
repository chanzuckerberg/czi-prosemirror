'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.COMMAND_GROUPS = exports.ICON_LABEL_PATTERN = undefined;

var _EditorCommands = require('../EditorCommands');

var EditorCommands = _interopRequireWildcard(_EditorCommands);

var _CommandButton = require('./CommandButton');

var _CommandButton2 = _interopRequireDefault(_CommandButton);

var _CommandMenuButton = require('./CommandMenuButton');

var _CommandMenuButton2 = _interopRequireDefault(_CommandMenuButton);

var _FontSizeCommandMenuButton = require('./FontSizeCommandMenuButton');

var _FontSizeCommandMenuButton2 = _interopRequireDefault(_FontSizeCommandMenuButton);

var _FontTypeCommandMenuButton = require('./FontTypeCommandMenuButton');

var _FontTypeCommandMenuButton2 = _interopRequireDefault(_FontTypeCommandMenuButton);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var ICON_LABEL_PATTERN = exports.ICON_LABEL_PATTERN = /[a-z_]+/;

var BLOCKQUOTE_INFO = EditorCommands.BLOCKQUOTE_INFO,
    BODY_SIZE = EditorCommands.BODY_SIZE,
    CLEAR_FORMAT = EditorCommands.CLEAR_FORMAT,
    CODE = EditorCommands.CODE,
    EM = EditorCommands.EM,
    H1 = EditorCommands.H1,
    H2 = EditorCommands.H2,
    H3 = EditorCommands.H3,
    H4 = EditorCommands.H4,
    H5 = EditorCommands.H5,
    H6 = EditorCommands.H6,
    HISTORY_REDO = EditorCommands.HISTORY_REDO,
    HISTORY_UNDO = EditorCommands.HISTORY_UNDO,
    HR = EditorCommands.HR,
    IMAGE_FROM_URL = EditorCommands.IMAGE_FROM_URL,
    IMAGE_UPLOAD = EditorCommands.IMAGE_UPLOAD,
    INDENT_LESS = EditorCommands.INDENT_LESS,
    INDENT_MORE = EditorCommands.INDENT_MORE,
    LINK_SET_URL = EditorCommands.LINK_SET_URL,
    OL = EditorCommands.OL,
    PRINT = EditorCommands.PRINT,
    STRIKE = EditorCommands.STRIKE,
    STRONG = EditorCommands.STRONG,
    TABLE_ADD_COLUMN_AFTER = EditorCommands.TABLE_ADD_COLUMN_AFTER,
    TABLE_ADD_COLUMN_BEFORE = EditorCommands.TABLE_ADD_COLUMN_BEFORE,
    TABLE_ADD_ROW_AFTER = EditorCommands.TABLE_ADD_ROW_AFTER,
    TABLE_ADD_ROW_BEFORE = EditorCommands.TABLE_ADD_ROW_BEFORE,
    TABLE_CELL_COLOR = EditorCommands.TABLE_CELL_COLOR,
    TABLE_DELETE_COLUMN = EditorCommands.TABLE_DELETE_COLUMN,
    TABLE_DELETE_ROW = EditorCommands.TABLE_DELETE_ROW,
    TABLE_DELETE_TABLE = EditorCommands.TABLE_DELETE_TABLE,
    TABLE_INSERT_TABLE = EditorCommands.TABLE_INSERT_TABLE,
    TABLE_MERGE_CELLS = EditorCommands.TABLE_MERGE_CELLS,
    TABLE_MOVE_TO_NEXT_CELL = EditorCommands.TABLE_MOVE_TO_NEXT_CELL,
    TABLE_MOVE_TO_PREV_CELL = EditorCommands.TABLE_MOVE_TO_PREV_CELL,
    TABLE_SPLIT_CELL = EditorCommands.TABLE_SPLIT_CELL,
    TABLE_TOGGLE_HEADER_CELL = EditorCommands.TABLE_TOGGLE_HEADER_CELL,
    TABLE_TOGGLE_HEADER_COLUMN = EditorCommands.TABLE_TOGGLE_HEADER_COLUMN,
    TABLE_TOGGLE_HEADER_ROW = EditorCommands.TABLE_TOGGLE_HEADER_ROW,
    TEXT_ALIGN_CENTER = EditorCommands.TEXT_ALIGN_CENTER,
    TEXT_ALIGN_JUSTIFY = EditorCommands.TEXT_ALIGN_JUSTIFY,
    TEXT_ALIGN_LEFT = EditorCommands.TEXT_ALIGN_LEFT,
    TEXT_ALIGN_RIGHT = EditorCommands.TEXT_ALIGN_RIGHT,
    TEXT_COLOR = EditorCommands.TEXT_COLOR,
    TEXT_HIGHLIGHT = EditorCommands.TEXT_HIGHLIGHT,
    TEXT_LINE_SPACINGS = EditorCommands.TEXT_LINE_SPACINGS,
    UL = EditorCommands.UL,
    UNDERLINE = EditorCommands.UNDERLINE;
var COMMAND_GROUPS = exports.COMMAND_GROUPS = [{
  undo: HISTORY_UNDO,
  redo: HISTORY_REDO,
  print: PRINT
}, {
  grid_on: [{
    'Insert Table...': TABLE_INSERT_TABLE
  }, {
    'Fill Color...': TABLE_CELL_COLOR
  }, {
    'Insert Column Before': TABLE_ADD_COLUMN_BEFORE,
    'Insert Column After': TABLE_ADD_COLUMN_AFTER,
    'Delete Column': TABLE_DELETE_COLUMN
  }, {
    'Insert Row Before': TABLE_ADD_ROW_BEFORE,
    'Insert Row After': TABLE_ADD_ROW_AFTER,
    'Delete Row': TABLE_DELETE_ROW
  }, {
    'Merge Cells': TABLE_MERGE_CELLS,
    'Split Cells': TABLE_SPLIT_CELL
  },
  // Disable these commands cause user rarely use them.
  {
    'Toggle Header Column': TABLE_TOGGLE_HEADER_COLUMN,
    'Toggle Header Cow': TABLE_TOGGLE_HEADER_ROW,
    'Toggle Header Cells': TABLE_TOGGLE_HEADER_CELL
  }, {
    'Delete Table': TABLE_DELETE_TABLE
  }]
}, {
  'H1 ': H1,
  'H2 ': H2,
  'keyboard_arrow_down': [{
    'Header 3': H3,
    'Header 4': H4,
    'Header 5': H5,
    'Header 6': H6
  }]
}, {
  font_download: _FontTypeCommandMenuButton2.default
}, {
  format_size: _FontSizeCommandMenuButton2.default
}, {
  format_bold: STRONG,
  format_italic: EM,
  format_underline: UNDERLINE,
  format_color_text: TEXT_COLOR,
  border_color: TEXT_HIGHLIGHT
}, {
  link: LINK_SET_URL,
  image: [{
    'Insert image by URL': IMAGE_FROM_URL,
    'Upload image from computer': IMAGE_UPLOAD
  }]
}, {
  format_align_left: TEXT_ALIGN_LEFT,
  format_align_center: TEXT_ALIGN_CENTER,
  format_align_right: TEXT_ALIGN_RIGHT,
  format_align_justify: TEXT_ALIGN_JUSTIFY
}, {
  format_line_spacing: TEXT_LINE_SPACINGS
}, {
  format_list_numbered: OL,
  format_list_bulleted: UL
}, {
  format_indent_increase: INDENT_MORE,
  format_indent_decrease: INDENT_LESS
}, {
  format_clear: CLEAR_FORMAT
}, {
  hr: HR,
  code: CODE,
  format_strikethrough: STRIKE,
  format_quote: BLOCKQUOTE_INFO
}, {
  settings_overscan: BODY_SIZE
}];