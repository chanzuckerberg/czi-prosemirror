'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNDERLINE = exports.UL = exports.TEXT_LINE_SPACINGS = exports.TEXT_HIGHLIGHT = exports.TEXT_COLOR = exports.TEXT_ALIGN_RIGHT = exports.TEXT_ALIGN_LEFT = exports.TEXT_ALIGN_JUSTIFY = exports.TEXT_ALIGN_CENTER = exports.TABLE_TOGGLE_HEADER_ROW = exports.TABLE_TOGGLE_HEADER_COLUMN = exports.TABLE_TOGGLE_HEADER_CELL = exports.TABLE_SPLIT_CELL = exports.TABLE_MOVE_TO_PREV_CELL = exports.TABLE_MOVE_TO_NEXT_CELL = exports.TABLE_MERGE_CELLS = exports.TABLE_INSERT_TABLE = exports.TABLE_DELETE_TABLE = exports.TABLE_DELETE_ROW = exports.TABLE_DELETE_COLUMN = exports.TABLE_CELL_COLOR = exports.TABLE_ADD_ROW_BEFORE = exports.TABLE_ADD_ROW_AFTER = exports.TABLE_ADD_COLUMN_BEFORE = exports.TABLE_ADD_COLUMN_AFTER = exports.STRONG = exports.STRIKE = exports.PRINT = exports.OL = exports.LIST_SPLIT = exports.LINK_SET_URL = exports.INDENT_MORE = exports.INDENT_LESS = exports.IMAGE_UPLOAD = exports.IMAGE_FROM_URL = exports.HR = exports.HISTORY_UNDO = exports.HISTORY_REDO = exports.H6 = exports.H5 = exports.H4 = exports.H3 = exports.H2 = exports.H1 = exports.EM = exports.DOC_LAYOUT = exports.CODE = exports.CLEAR_FORMAT = exports.BLOCKQUOTE_INFO = undefined;

var _MarkNames = require('./MarkNames');

var MarkNames = _interopRequireWildcard(_MarkNames);

var _prosemirrorTables = require('prosemirror-tables');

var ProsemirrorTables = _interopRequireWildcard(_prosemirrorTables);

var _BlockquoteCommand = require('./BlockquoteCommand');

var _BlockquoteCommand2 = _interopRequireDefault(_BlockquoteCommand);

var _CodeBlockCommand = require('./CodeBlockCommand');

var _CodeBlockCommand2 = _interopRequireDefault(_CodeBlockCommand);

var _DocLayoutCommand = require('./DocLayoutCommand');

var _DocLayoutCommand2 = _interopRequireDefault(_DocLayoutCommand);

var _HeadingCommand = require('./HeadingCommand');

var _HeadingCommand2 = _interopRequireDefault(_HeadingCommand);

var _HistoryRedoCommand = require('./HistoryRedoCommand');

var _HistoryRedoCommand2 = _interopRequireDefault(_HistoryRedoCommand);

var _HistoryUndoCommand = require('./HistoryUndoCommand');

var _HistoryUndoCommand2 = _interopRequireDefault(_HistoryUndoCommand);

var _HorizontalRuleCommand = require('./HorizontalRuleCommand');

var _HorizontalRuleCommand2 = _interopRequireDefault(_HorizontalRuleCommand);

var _ImageFromURLCommand = require('./ImageFromURLCommand');

var _ImageFromURLCommand2 = _interopRequireDefault(_ImageFromURLCommand);

var _ImageUploadCommand = require('./ImageUploadCommand');

var _ImageUploadCommand2 = _interopRequireDefault(_ImageUploadCommand);

var _IndentCommand = require('./IndentCommand');

var _IndentCommand2 = _interopRequireDefault(_IndentCommand);

var _LinkSetURLCommand = require('./LinkSetURLCommand');

var _LinkSetURLCommand2 = _interopRequireDefault(_LinkSetURLCommand);

var _ListSplitCommand = require('./ListSplitCommand');

var _ListSplitCommand2 = _interopRequireDefault(_ListSplitCommand);

var _ListToggleCommand = require('./ListToggleCommand');

var _ListToggleCommand2 = _interopRequireDefault(_ListToggleCommand);

var _MarkToggleCommand = require('./MarkToggleCommand');

var _MarkToggleCommand2 = _interopRequireDefault(_MarkToggleCommand);

var _MarksClearCommand = require('./MarksClearCommand');

var _MarksClearCommand2 = _interopRequireDefault(_MarksClearCommand);

var _PrintCommand = require('./PrintCommand');

var _PrintCommand2 = _interopRequireDefault(_PrintCommand);

var _TableCellColorCommand = require('./TableCellColorCommand');

var _TableCellColorCommand2 = _interopRequireDefault(_TableCellColorCommand);

var _TableInsertCommand = require('./TableInsertCommand');

var _TableInsertCommand2 = _interopRequireDefault(_TableInsertCommand);

var _TextAlignCommand = require('./TextAlignCommand');

var _TextAlignCommand2 = _interopRequireDefault(_TextAlignCommand);

var _TextColorCommand = require('./TextColorCommand');

var _TextColorCommand2 = _interopRequireDefault(_TextColorCommand);

var _TextHighlightCommand = require('./TextHighlightCommand');

var _TextHighlightCommand2 = _interopRequireDefault(_TextHighlightCommand);

var _TextLineSpacingCommand = require('./TextLineSpacingCommand');

var _TextLineSpacingCommand2 = _interopRequireDefault(_TextLineSpacingCommand);

var _createCommand = require('./createCommand');

var _createCommand2 = _interopRequireDefault(_createCommand);

var _prosemirrorCommands = require('prosemirror-commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var addColumnAfter = ProsemirrorTables.addColumnAfter,
    addColumnBefore = ProsemirrorTables.addColumnBefore,
    addRowAfter = ProsemirrorTables.addRowAfter,
    addRowBefore = ProsemirrorTables.addRowBefore,
    columnResizing = ProsemirrorTables.columnResizing,
    deleteColumn = ProsemirrorTables.deleteColumn,
    deleteRow = ProsemirrorTables.deleteRow,
    deleteTable = ProsemirrorTables.deleteTable,
    goToNextCell = ProsemirrorTables.goToNextCell,
    mergeCells = ProsemirrorTables.mergeCells,
    setCellAttr = ProsemirrorTables.setCellAttr,
    splitCell = ProsemirrorTables.splitCell,
    tableEditing = ProsemirrorTables.tableEditing,
    tableNodes = ProsemirrorTables.tableNodes,
    toggleHeaderCell = ProsemirrorTables.toggleHeaderCell,
    toggleHeaderColumn = ProsemirrorTables.toggleHeaderColumn,
    toggleHeaderRow = ProsemirrorTables.toggleHeaderRow;
var MARK_STRONG = MarkNames.MARK_STRONG,
    MARK_EM = MarkNames.MARK_EM,
    MARK_STRIKE = MarkNames.MARK_STRIKE,
    MARK_UNDERLINE = MarkNames.MARK_UNDERLINE;

// Note that Firefox will, by default, add various kinds of controls to
// editable tables, even though those don't work in ProseMirror. The only way
// to turn these off is globally, which you might want to do with the
// following code:

document.execCommand('enableObjectResizing', false, 'false');
document.execCommand('enableInlineTableEditing', false, 'false');

var BLOCKQUOTE_INFO = exports.BLOCKQUOTE_INFO = new _BlockquoteCommand2.default();
var CLEAR_FORMAT = exports.CLEAR_FORMAT = new _MarksClearCommand2.default();
var CODE = exports.CODE = new _CodeBlockCommand2.default();
var DOC_LAYOUT = exports.DOC_LAYOUT = new _DocLayoutCommand2.default();
var EM = exports.EM = new _MarkToggleCommand2.default(MARK_EM);
var H1 = exports.H1 = new _HeadingCommand2.default(1);
var H2 = exports.H2 = new _HeadingCommand2.default(2);
var H3 = exports.H3 = new _HeadingCommand2.default(3);
var H4 = exports.H4 = new _HeadingCommand2.default(4);
var H5 = exports.H5 = new _HeadingCommand2.default(5);
var H6 = exports.H6 = new _HeadingCommand2.default(6);
var HISTORY_REDO = exports.HISTORY_REDO = new _HistoryRedoCommand2.default();
var HISTORY_UNDO = exports.HISTORY_UNDO = new _HistoryUndoCommand2.default();
var HR = exports.HR = new _HorizontalRuleCommand2.default();
var IMAGE_FROM_URL = exports.IMAGE_FROM_URL = new _ImageFromURLCommand2.default();
var IMAGE_UPLOAD = exports.IMAGE_UPLOAD = new _ImageUploadCommand2.default();
var INDENT_LESS = exports.INDENT_LESS = new _IndentCommand2.default(-1);
var INDENT_MORE = exports.INDENT_MORE = new _IndentCommand2.default(1);
var LINK_SET_URL = exports.LINK_SET_URL = new _LinkSetURLCommand2.default();
var LIST_SPLIT = exports.LIST_SPLIT = new _ListSplitCommand2.default();
var OL = exports.OL = new _ListToggleCommand2.default(true);
var PRINT = exports.PRINT = new _PrintCommand2.default();
var STRIKE = exports.STRIKE = new _MarkToggleCommand2.default(MARK_STRIKE);
var STRONG = exports.STRONG = new _MarkToggleCommand2.default(MARK_STRONG);
var TABLE_ADD_COLUMN_AFTER = exports.TABLE_ADD_COLUMN_AFTER = (0, _createCommand2.default)(addColumnAfter);
var TABLE_ADD_COLUMN_BEFORE = exports.TABLE_ADD_COLUMN_BEFORE = (0, _createCommand2.default)(addColumnBefore);
var TABLE_ADD_ROW_AFTER = exports.TABLE_ADD_ROW_AFTER = (0, _createCommand2.default)(addRowAfter);
var TABLE_ADD_ROW_BEFORE = exports.TABLE_ADD_ROW_BEFORE = (0, _createCommand2.default)(addRowBefore);
var TABLE_CELL_COLOR = exports.TABLE_CELL_COLOR = new _TableCellColorCommand2.default();
var TABLE_DELETE_COLUMN = exports.TABLE_DELETE_COLUMN = (0, _createCommand2.default)(deleteColumn);
var TABLE_DELETE_ROW = exports.TABLE_DELETE_ROW = (0, _createCommand2.default)(deleteRow);
var TABLE_DELETE_TABLE = exports.TABLE_DELETE_TABLE = (0, _createCommand2.default)(deleteTable);
var TABLE_INSERT_TABLE = exports.TABLE_INSERT_TABLE = new _TableInsertCommand2.default();
var TABLE_MERGE_CELLS = exports.TABLE_MERGE_CELLS = (0, _createCommand2.default)(mergeCells);
var TABLE_MOVE_TO_NEXT_CELL = exports.TABLE_MOVE_TO_NEXT_CELL = (0, _createCommand2.default)(goToNextCell(1));
var TABLE_MOVE_TO_PREV_CELL = exports.TABLE_MOVE_TO_PREV_CELL = (0, _createCommand2.default)(goToNextCell(-1));
var TABLE_SPLIT_CELL = exports.TABLE_SPLIT_CELL = (0, _createCommand2.default)(splitCell);
var TABLE_TOGGLE_HEADER_CELL = exports.TABLE_TOGGLE_HEADER_CELL = (0, _createCommand2.default)(toggleHeaderCell);
var TABLE_TOGGLE_HEADER_COLUMN = exports.TABLE_TOGGLE_HEADER_COLUMN = (0, _createCommand2.default)(toggleHeaderColumn);
var TABLE_TOGGLE_HEADER_ROW = exports.TABLE_TOGGLE_HEADER_ROW = (0, _createCommand2.default)(toggleHeaderRow);
var TEXT_ALIGN_CENTER = exports.TEXT_ALIGN_CENTER = new _TextAlignCommand2.default('center');
var TEXT_ALIGN_JUSTIFY = exports.TEXT_ALIGN_JUSTIFY = new _TextAlignCommand2.default('justify');
var TEXT_ALIGN_LEFT = exports.TEXT_ALIGN_LEFT = new _TextAlignCommand2.default('left');
var TEXT_ALIGN_RIGHT = exports.TEXT_ALIGN_RIGHT = new _TextAlignCommand2.default('right');
var TEXT_COLOR = exports.TEXT_COLOR = new _TextColorCommand2.default();
var TEXT_HIGHLIGHT = exports.TEXT_HIGHLIGHT = new _TextHighlightCommand2.default();
var TEXT_LINE_SPACINGS = exports.TEXT_LINE_SPACINGS = _TextLineSpacingCommand2.default.createGroup();
var UL = exports.UL = new _ListToggleCommand2.default(false);
var UNDERLINE = exports.UNDERLINE = new _MarkToggleCommand2.default(MARK_UNDERLINE);