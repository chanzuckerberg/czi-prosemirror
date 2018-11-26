'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toggleBlockquote;

var _adjustAllSelection = require('./adjustAllSelection');

var _adjustAllSelection2 = _interopRequireDefault(_adjustAllSelection);

var _isInsideListItem = require('./isInsideListItem');

var _isInsideListItem2 = _interopRequireDefault(_isInsideListItem);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorModel = require('prosemirror-model');

var _NodeNames = require('./NodeNames');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorCommands = require('prosemirror-commands');

var _toggleList = require('./toggleList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toggleBlockquote(tr, schema) {
  var nodes = schema.nodes;
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  var heading = nodes[_NodeNames.HEADING];
  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var listItem = nodes[_NodeNames.LIST_ITEM];

  if (!selection || !doc || !heading || !paragraph || !listItem || !heading) {
    return tr;
  }

  tr = (0, _adjustAllSelection2.default)(tr, schema);

  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;

  var startWithBlockQuote = null;
  var poses = [];
  var docType = doc.type;
  doc.nodesBetween(from, to, function (node, pos, parentNode) {
    var nodeType = node.type;
    var parentNodeType = parentNode.type;

    if (startWithBlockQuote === null) {
      startWithBlockQuote = nodeType === blockquote;
    }

    if (parentNodeType !== listItem) {
      poses.push(pos);
    }
    return !(0, _isListNode2.default)(node);
  });
  // Update from the bottom to avoid disruptive changes in pos.
  poses.sort().reverse().forEach(function (pos) {
    tr = setBlockquoteNode(tr, schema, pos);
  });
  return tr;
}

function setBlockquoteNode(tr, schema, pos) {
  var nodes = schema.nodes;

  var heading = nodes[_NodeNames.HEADING];
  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var blockquote = nodes[_NodeNames.BLOCKQUOTE];

  if (pos >= tr.doc.content.size) {
    // Workaround to handle the edge case that pos was shifted caused by `toggleList`.
    return tr;
  }
  var node = tr.doc.nodeAt(pos);

  if (!node || !heading || !paragraph) {
    return tr;
  }

  var nodeType = node.type;
  if ((0, _isInsideListItem2.default)(tr.doc, pos)) {
    return tr;
  } else if ((0, _isListNode2.default)(node)) {
    // Toggle list
    if (blockquote) {
      tr = (0, _toggleList.unwrapNodesFromList)(tr, schema, pos, function (paragraphNode) {
        var content = paragraphNode.content,
            marks = paragraphNode.marks,
            attrs = paragraphNode.attrs;

        return blockquote.create(attrs, content, marks);
      });
    }
  } else if (nodeType === blockquote) {
    // Toggle heading
    tr = tr.setNodeMarkup(pos, paragraph, node.attrs, node.marks);
  } else if (nodeType === paragraph || nodeType === heading) {
    tr = tr.setNodeMarkup(pos, blockquote, node.attrs, node.marks);
  }
  return tr;
}