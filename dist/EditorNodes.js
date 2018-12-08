'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _nodes;

var _NodeNames = require('./NodeNames');

var NodeNames = _interopRequireWildcard(_NodeNames);

var _BlockquoteNodeSpec = require('./BlockquoteNodeSpec');

var _BlockquoteNodeSpec2 = _interopRequireDefault(_BlockquoteNodeSpec);

var _BulletListNodeSpec = require('./BulletListNodeSpec');

var _BulletListNodeSpec2 = _interopRequireDefault(_BulletListNodeSpec);

var _CodeBlockNodeSpec = require('./CodeBlockNodeSpec');

var _CodeBlockNodeSpec2 = _interopRequireDefault(_CodeBlockNodeSpec);

var _DocNodeSpec = require('./DocNodeSpec');

var _DocNodeSpec2 = _interopRequireDefault(_DocNodeSpec);

var _HardBreakNodeSpec = require('./HardBreakNodeSpec');

var _HardBreakNodeSpec2 = _interopRequireDefault(_HardBreakNodeSpec);

var _HeadingNodeSpec = require('./HeadingNodeSpec');

var _HeadingNodeSpec2 = _interopRequireDefault(_HeadingNodeSpec);

var _HorizontalRuleNodeSpec = require('./HorizontalRuleNodeSpec');

var _HorizontalRuleNodeSpec2 = _interopRequireDefault(_HorizontalRuleNodeSpec);

var _ImageNodeSpec = require('./ImageNodeSpec');

var _ImageNodeSpec2 = _interopRequireDefault(_ImageNodeSpec);

var _ListItemNodeSpec = require('./ListItemNodeSpec');

var _ListItemNodeSpec2 = _interopRequireDefault(_ListItemNodeSpec);

var _MathNodeSpec = require('./MathNodeSpec');

var _MathNodeSpec2 = _interopRequireDefault(_MathNodeSpec);

var _OrderedListNodeSpec = require('./OrderedListNodeSpec');

var _OrderedListNodeSpec2 = _interopRequireDefault(_OrderedListNodeSpec);

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _ParagraphNodeSpec2 = _interopRequireDefault(_ParagraphNodeSpec);

var _TableNodesSpecs = require('./TableNodesSpecs');

var _TableNodesSpecs2 = _interopRequireDefault(_TableNodesSpecs);

var _TextNodeSpec = require('./TextNodeSpec');

var _TextNodeSpec2 = _interopRequireDefault(_TextNodeSpec);

var _prosemirrorModel = require('prosemirror-model');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BLOCKQUOTE = NodeNames.BLOCKQUOTE,
    BULLET_LIST = NodeNames.BULLET_LIST,
    CODE_BLOCK = NodeNames.CODE_BLOCK,
    DOC = NodeNames.DOC,
    HARD_BREAK = NodeNames.HARD_BREAK,
    HEADING = NodeNames.HEADING,
    HORIZONTAL_RULE = NodeNames.HORIZONTAL_RULE,
    IMAGE = NodeNames.IMAGE,
    LIST_ITEM = NodeNames.LIST_ITEM,
    MATH = NodeNames.MATH,
    ORDERED_LIST = NodeNames.ORDERED_LIST,
    PARAGRAPH = NodeNames.PARAGRAPH,
    TEXT = NodeNames.TEXT;

// https://github.com/ProseMirror/prosemirror-schema-basic/blob/master/src/schema-basic.js

// !! Be careful with the order of these nodes, which may effect the parsing
// outcome.!!

var nodes = (_nodes = {}, (0, _defineProperty3.default)(_nodes, DOC, _DocNodeSpec2.default), (0, _defineProperty3.default)(_nodes, PARAGRAPH, _ParagraphNodeSpec2.default), (0, _defineProperty3.default)(_nodes, BLOCKQUOTE, _BlockquoteNodeSpec2.default), (0, _defineProperty3.default)(_nodes, HORIZONTAL_RULE, _HorizontalRuleNodeSpec2.default), (0, _defineProperty3.default)(_nodes, HEADING, _HeadingNodeSpec2.default), (0, _defineProperty3.default)(_nodes, CODE_BLOCK, _CodeBlockNodeSpec2.default), (0, _defineProperty3.default)(_nodes, TEXT, _TextNodeSpec2.default), (0, _defineProperty3.default)(_nodes, IMAGE, _ImageNodeSpec2.default), (0, _defineProperty3.default)(_nodes, MATH, _MathNodeSpec2.default), (0, _defineProperty3.default)(_nodes, HARD_BREAK, _HardBreakNodeSpec2.default), (0, _defineProperty3.default)(_nodes, BULLET_LIST, _BulletListNodeSpec2.default), (0, _defineProperty3.default)(_nodes, ORDERED_LIST, _OrderedListNodeSpec2.default), (0, _defineProperty3.default)(_nodes, LIST_ITEM, _ListItemNodeSpec2.default), _nodes);

var marks = {};
var schema = new _prosemirrorModel.Schema({ nodes: nodes, marks: marks });

var EditorNodes = schema.spec.nodes.append(_TableNodesSpecs2.default);

exports.default = EditorNodes;