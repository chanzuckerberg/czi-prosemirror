'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

exports.setTextAlign = setTextAlign;

var _UICommand2 = require('./ui/UICommand');

var _UICommand3 = _interopRequireDefault(_UICommand2);

var _noop = require('./noop');

var _noop2 = _interopRequireDefault(_noop);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _toggleHeading = require('./toggleHeading');

var _toggleHeading2 = _interopRequireDefault(_toggleHeading);

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorView = require('prosemirror-view');

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _prosemirrorCommands = require('prosemirror-commands');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setTextAlign(tr, schema, alignment) {
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  if (!selection || !doc) {
    return tr;
  }
  var from = selection.from,
      to = selection.to,
      empty = selection.empty;
  var nodes = schema.nodes;


  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  var listItem = nodes[_NodeNames.LIST_ITEM];
  var heading = nodes[_NodeNames.HEADING];
  var paragraph = nodes[_NodeNames.PARAGRAPH];

  var tasks = [];
  alignment = alignment || null;

  var allowedNodeTypes = new _set2.default([blockquote, heading, listItem, paragraph]);

  doc.nodesBetween(from, to, function (node, pos, parentNode) {
    var nodeType = node.type;
    var align = node.attrs.align || null;
    if (align !== alignment && allowedNodeTypes.has(nodeType)) {
      tasks.push({
        node: node,
        pos: pos,
        nodeType: nodeType
      });
    }
    return true;
  });

  if (!tasks.length) {
    return tr;
  }

  tasks.forEach(function (job) {
    var node = job.node,
        pos = job.pos,
        nodeType = job.nodeType;

    var attrs = void 0;
    if (alignment) {
      attrs = (0, _extends3.default)({}, attrs, {
        align: alignment
      });
    } else {
      attrs = (0, _extends3.default)({}, attrs, {
        align: null
      });
    }
    tr = tr.setNodeMarkup(pos, nodeType, attrs, node.marks);
  });

  return tr;
}

var TextAlignCommand = function (_UICommand) {
  (0, _inherits3.default)(TextAlignCommand, _UICommand);

  function TextAlignCommand(alignment) {
    (0, _classCallCheck3.default)(this, TextAlignCommand);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TextAlignCommand.__proto__ || (0, _getPrototypeOf2.default)(TextAlignCommand)).call(this));

    _this.isActive = function (state) {
      var selection = state.selection,
          doc = state.doc,
          schema = state.schema;
      var from = selection.from,
          to = selection.to;
      var nodes = schema.nodes;

      var paragraph = nodes[_NodeNames.PARAGRAPH];
      var heading = nodes[_NodeNames.HEADING];
      var blockquote = nodes[_NodeNames.BLOCKQUOTE];
      var keepLooking = true;
      var active = false;
      doc.nodesBetween(from, to, function (node, pos) {
        var nodeType = node.type;
        if (keepLooking && node.attrs.align === _this._alignment) {
          keepLooking = false;
          active = true;
        }
        return keepLooking;
      });
      return active;
    };

    _this.isEnabled = function (state) {
      var selection = state.selection;

      return selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection;
    };

    _this.execute = function (state, dispatch, view) {
      var schema = state.schema,
          selection = state.selection;

      var tr = setTextAlign(state.tr.setSelection(selection), schema, _this._alignment);
      if (tr.docChanged) {
        dispatch && dispatch(tr);
        return true;
      } else {
        return false;
      }
    };

    _this._alignment = alignment;
    return _this;
  }

  return TextAlignCommand;
}(_UICommand3.default);

exports.default = TextAlignCommand;