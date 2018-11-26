'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = toggleHeading;

var _adjustAllSelection = require('./adjustAllSelection');

var _adjustAllSelection2 = _interopRequireDefault(_adjustAllSelection);

var _isInsideListItem = require('./isInsideListItem');

var _isInsideListItem2 = _interopRequireDefault(_isInsideListItem);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _NodeNames = require('./NodeNames');

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorCommands = require('prosemirror-commands');

var _toggleList = require('./toggleList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleHeading(tr, schema, level) {
  var nodes = schema.nodes;
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;


  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  var heading = nodes[_NodeNames.HEADING];
  var listItem = nodes[_NodeNames.LIST_ITEM];
  var paragraph = nodes[_NodeNames.PARAGRAPH];

  if (!selection || !doc || !heading || !paragraph || !listItem || !blockquote) {
    return tr;
  }

  tr = (0, _adjustAllSelection2.default)(tr, schema);

  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;

  var startWithHeadingBlock = null;
  var poses = [];
  var docType = doc.type;
  doc.nodesBetween(from, to, function (node, pos, parentNode) {
    var nodeType = node.type;
    var parentNodeType = parentNode.type;

    if (startWithHeadingBlock === null) {
      startWithHeadingBlock = nodeType === heading && node.attrs.level === level;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }
    return !(0, _isListNode2.default)(node);
  });
  // Update from the bottom to avoid disruptive changes in pos.
  poses.sort().reverse().forEach(function (pos) {
    tr = setHeadingNode(tr, schema, pos, startWithHeadingBlock ? null : level);
  });
  return tr;
}

function setHeadingNode(tr, schema, pos, level) {
  var nodes = schema.nodes;

  var heading = nodes[_NodeNames.HEADING];
  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  var listItem = nodes[_NodeNames.LIST_ITEM];
  if (pos >= tr.doc.content.size) {
    // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
    return tr;
  }
  var node = tr.doc.nodeAt(pos);
  if (!node || !heading || !paragraph || !blockquote) {
    return tr;
  }
  var nodeType = node.type;
  if ((0, _isInsideListItem2.default)(tr.doc, pos)) {
    return tr;
  } else if ((0, _isListNode2.default)(node)) {
    // Toggle list
    if (heading && level !== null) {
      tr = (0, _toggleList.unwrapNodesFromList)(tr, schema, pos, function (paragraphNode) {
        var content = paragraphNode.content,
            marks = paragraphNode.marks,
            attrs = paragraphNode.attrs;

        var headingAttrs = (0, _extends3.default)({}, attrs, { level: level });
        return heading.create(headingAttrs, content, marks);
      });
    }
  } else if (nodeType === heading) {
    // Toggle heading
    if (level === null) {
      tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
    } else {
      tr = tr.setNodeMarkup(pos, heading, (0, _extends3.default)({}, node.attrs, { level: level }), node.marks);
    }
  } else if (level && nodeType === paragraph || nodeType === blockquote) {
    tr = tr.setNodeMarkup(pos, heading, (0, _extends3.default)({}, node.attrs, { level: level }), node.marks);
  }
  return tr;
}