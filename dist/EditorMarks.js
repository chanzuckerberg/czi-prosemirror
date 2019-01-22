'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _nodes, _marks;

var _prosemirrorModel = require('prosemirror-model');

var _CodeMarkSpec = require('./CodeMarkSpec');

var _CodeMarkSpec2 = _interopRequireDefault(_CodeMarkSpec);

var _DocNodeSpec = require('./DocNodeSpec');

var _DocNodeSpec2 = _interopRequireDefault(_DocNodeSpec);

var _EMMarkSpec = require('./EMMarkSpec');

var _EMMarkSpec2 = _interopRequireDefault(_EMMarkSpec);

var _FontSizeMarkSpec = require('./FontSizeMarkSpec');

var _FontSizeMarkSpec2 = _interopRequireDefault(_FontSizeMarkSpec);

var _FontTypeMarkSpec = require('./FontTypeMarkSpec');

var _FontTypeMarkSpec2 = _interopRequireDefault(_FontTypeMarkSpec);

var _LinkMarkSpec = require('./LinkMarkSpec');

var _LinkMarkSpec2 = _interopRequireDefault(_LinkMarkSpec);

var _MarkNames = require('./MarkNames');

var MarkNames = _interopRequireWildcard(_MarkNames);

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _ParagraphNodeSpec2 = _interopRequireDefault(_ParagraphNodeSpec);

var _StrikeMarkSpec = require('./StrikeMarkSpec');

var _StrikeMarkSpec2 = _interopRequireDefault(_StrikeMarkSpec);

var _StrongMarkSpec = require('./StrongMarkSpec');

var _StrongMarkSpec2 = _interopRequireDefault(_StrongMarkSpec);

var _TextColorMarkSpec = require('./TextColorMarkSpec');

var _TextColorMarkSpec2 = _interopRequireDefault(_TextColorMarkSpec);

var _TextHighlightMarkSpec = require('./TextHighlightMarkSpec');

var _TextHighlightMarkSpec2 = _interopRequireDefault(_TextHighlightMarkSpec);

var _TextNoWrapMarkSpec = require('./TextNoWrapMarkSpec');

var _TextNoWrapMarkSpec2 = _interopRequireDefault(_TextNoWrapMarkSpec);

var _TextNodeSpec = require('./TextNodeSpec');

var _TextNodeSpec2 = _interopRequireDefault(_TextNodeSpec);

var _TextSelectionMarkSpec = require('./TextSelectionMarkSpec');

var _TextSelectionMarkSpec2 = _interopRequireDefault(_TextSelectionMarkSpec);

var _TextUnderlineMarkSpec = require('./TextUnderlineMarkSpec');

var _TextUnderlineMarkSpec2 = _interopRequireDefault(_TextUnderlineMarkSpec);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MARK_CODE = MarkNames.MARK_CODE,
    MARK_EM = MarkNames.MARK_EM,
    MARK_FONT_SIZE = MarkNames.MARK_FONT_SIZE,
    MARK_FONT_TYPE = MarkNames.MARK_FONT_TYPE,
    MARK_LINK = MarkNames.MARK_LINK,
    MARK_NO_BREAK = MarkNames.MARK_NO_BREAK,
    MARK_STRIKE = MarkNames.MARK_STRIKE,
    MARK_STRONG = MarkNames.MARK_STRONG,
    MARK_TEXT_COLOR = MarkNames.MARK_TEXT_COLOR,
    MARK_TEXT_HIGHLIGHT = MarkNames.MARK_TEXT_HIGHLIGHT,
    MARK_TEXT_SELECTION = MarkNames.MARK_TEXT_SELECTION,
    MARK_UNDERLINE = MarkNames.MARK_UNDERLINE;

// These nodes are required to build basic marks.

var nodes = (_nodes = {}, (0, _defineProperty3.default)(_nodes, _NodeNames.DOC, _DocNodeSpec2.default), (0, _defineProperty3.default)(_nodes, _NodeNames.PARAGRAPH, _ParagraphNodeSpec2.default), (0, _defineProperty3.default)(_nodes, _NodeNames.TEXT, _TextNodeSpec2.default), _nodes);

var marks = (_marks = {}, (0, _defineProperty3.default)(_marks, MARK_CODE, _CodeMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_EM, _EMMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_FONT_SIZE, _FontSizeMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_FONT_TYPE, _FontTypeMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_LINK, _LinkMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_STRIKE, _StrikeMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_STRONG, _StrongMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_TEXT_COLOR, _TextColorMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_TEXT_HIGHLIGHT, _TextHighlightMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_TEXT_SELECTION, _TextSelectionMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_UNDERLINE, _TextUnderlineMarkSpec2.default), (0, _defineProperty3.default)(_marks, MARK_NO_BREAK, _TextNoWrapMarkSpec2.default), _marks);

var schema = new _prosemirrorModel.Schema({ nodes: nodes, marks: marks });

var EditorMarks = schema.spec.marks;

exports.default = EditorMarks;