'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = toggleList;
exports.unwrapNodesFromList = unwrapNodesFromList;

var _nullthrows = require('nullthrows');

var _nullthrows2 = _interopRequireDefault(_nullthrows);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _prosemirrorUtils = require('prosemirror-utils');

var _NodeNames = require('./NodeNames');

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _transformAndPreserveTextSelection = require('./transformAndPreserveTextSelection');

var _transformAndPreserveTextSelection2 = _interopRequireDefault(_transformAndPreserveTextSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_SelectionMemo = require('./transformAndPreserveTextSelection').babelPluginFlowReactPropTypes_proptype_SelectionMemo || require('prop-types').any;

function toggleList(tr, schema, listNodeType) {
  var _tr = tr,
      selection = _tr.selection,
      doc = _tr.doc;

  if (!selection || !doc) {
    return tr;
  }

  var from = selection.from;


  var fromSelection = _prosemirrorState.TextSelection.create(doc, from, from);
  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var heading = schema.nodes[_NodeNames.HEADING];
  var result = (0, _prosemirrorUtils.findParentNodeOfType)(listNodeType)(fromSelection);
  if (result) {
    tr = unwrapNodesFromList(tr, schema, result.pos);
  } else if (paragraph && (0, _prosemirrorUtils.findParentNodeOfType)(paragraph)(fromSelection)) {
    tr = wrapNodesWithList(tr, schema, listNodeType);
  } else if (heading && (0, _prosemirrorUtils.findParentNodeOfType)(heading)(fromSelection)) {
    tr = wrapNodesWithList(tr, schema, listNodeType);
  }

  return tr;
}

function unwrapNodesFromList(tr, schema, listNodePos, unwrapParagraphNode) {
  return (0, _transformAndPreserveTextSelection2.default)(tr, schema, function (memo) {
    return unwrapNodesFromListInternal(memo, listNodePos, unwrapParagraphNode);
  });
}

function wrapNodesWithList(tr, schema, listNodeType) {
  return (0, _transformAndPreserveTextSelection2.default)(tr, schema, function (memo) {
    return wrapNodesWithListInternal(memo, listNodeType);
  });
}

function wrapNodesWithListInternal(memo, listNodeType) {
  var schema = memo.schema;
  var tr = memo.tr;
  var _tr2 = tr,
      doc = _tr2.doc,
      selection = _tr2.selection;

  if (!tr || !selection) {
    return tr;
  }
  var from = selection.from,
      to = selection.to;


  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var heading = schema.nodes[_NodeNames.HEADING];

  var items = null;
  var lists = [];
  doc.nodesBetween(from, to, function (node, pos) {
    var nodeType = node.type;
    var nodeName = nodeType.name;
    if ((0, _isListNode2.default)(node)) {
      if (node.type !== listNodeType) {
        tr = tr.setNodeMarkup(pos, listNodeType, node.attrs, node.marks);
      }
      items && lists.push(items);
      items = null;
      return false;
    }

    if (/table/.test(nodeName)) {
      items && lists.push(items);
      items = null;
      return true;
    }

    if (nodeType === heading || nodeType === paragraph) {
      items = items || [];
      items.push({ node: node, pos: pos });
    } else {
      items && items.length && lists.push(items);
      items = null;
    }
    return true;
  });
  items && items.length && lists.push(items);

  lists = lists.filter(function (items) {
    return items.length > 0;
  });
  if (!lists.length) {
    return tr;
  }

  lists = lists.sort(function (a, b) {
    var pa = (0, _nullthrows2.default)(a[0]).pos;
    var pb = (0, _nullthrows2.default)(b[0]).pos;
    return pa >= pb ? 1 : -1;
  });

  lists.reverse();

  lists.forEach(function (items) {
    tr = wrapItemsWithListInternal(tr, schema, listNodeType, items);
  });

  return tr;
}

function wrapItemsWithListInternal(tr, schema, listNodeType, items) {
  var initialTr = tr;
  var paragraph = schema.nodes[_NodeNames.PARAGRAPH];
  var listItem = schema.nodes[_NodeNames.LIST_ITEM];

  if (!paragraph || !listItem) {
    return tr;
  }

  var paragraphNodes = [];
  items.forEach(function (item) {
    var node = item.node,
        pos = item.pos;
    // Temporarily annotate each node with an unique ID.

    var uniqueID = {};
    var nodeAttrs = (0, _extends3.default)({}, node.attrs, { id: uniqueID });
    // Replace the original node with the node annotated by the uniqueID.
    tr = tr.setNodeMarkup(pos, paragraph, nodeAttrs, node.marks);
    paragraphNodes.push(tr.doc.nodeAt(pos));
  });

  var firstNode = paragraphNodes[0];
  var lastNode = paragraphNodes[paragraphNodes.length - 1];
  if (!firstNode || !lastNode) {
    return initialTr;
  }

  var firstNodeID = firstNode.attrs.id;
  var lastNodeID = lastNode.attrs.id;
  if (!firstNodeID || !lastNodeID) {
    return initialTr;
  }

  var fromPos = null;
  var toPos = null;
  tr.doc.descendants(function (node, pos) {
    var nodeID = node.attrs.id;
    if (nodeID === firstNodeID) {
      fromPos = pos;
    }
    if (nodeID === lastNodeID) {
      toPos = pos + node.nodeSize;
    }
    return fromPos === null || toPos === null;
  });

  if (fromPos === null || toPos === null) {
    return initialTr;
  }

  var listItemNodes = [];
  items.forEach(function (item) {
    var node = item.node;
    // Restore the annotated nodes with the copy of the original ones.

    var paragraphNode = paragraph.create(node.attrs, node.content, node.marks);
    var listItemNode = listItem.create(node.attrs, _prosemirrorModel.Fragment.from(paragraphNode));
    listItemNodes.push(listItemNode);
  });

  var listNodeAttrs = { indent: 0, start: 1 };
  var $fromPos = tr.doc.resolve(fromPos);
  var $toPos = tr.doc.resolve(toPos);

  var hasSameListNodeBefore = $fromPos.nodeBefore && $fromPos.nodeBefore.type === listNodeType && $fromPos.nodeBefore.attrs.indent === 0;

  var hasSameListNodeAfter = $toPos.nodeAfter && $toPos.nodeAfter.type === listNodeType && $toPos.nodeAfter.attrs.indent === 0;

  if (hasSameListNodeBefore) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos - 1, _prosemirrorModel.Fragment.from(listItemNodes));
    if (hasSameListNodeAfter) {
      tr = tr.delete(toPos + 1, toPos + 3);
    }
  } else if (hasSameListNodeAfter) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos + 1, _prosemirrorModel.Fragment.from(listItemNodes));
  } else {
    var listNode = listNodeType.create(listNodeAttrs, _prosemirrorModel.Fragment.from(listItemNodes));
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos, _prosemirrorModel.Fragment.from(listNode));
  }

  return tr;
}

function unwrapNodesFromListInternal(memo, listNodePos, unwrapParagraphNode) {
  var schema = memo.schema;
  var tr = memo.tr;


  if (!tr.doc || !tr.selection) {
    return tr;
  }

  var nodes = schema.nodes;

  var paragraph = nodes[_NodeNames.PARAGRAPH];
  var listItem = nodes[_NodeNames.LIST_ITEM];

  if (!listItem || !paragraph) {
    return tr;
  }

  var listNode = tr.doc.nodeAt(listNodePos);
  if (!(0, _isListNode2.default)(listNode)) {
    return tr;
  }

  var initialSelection = tr.selection;
  var from = initialSelection.from,
      to = initialSelection.to;


  if (from === to && from < 1) {
    return tr;
  }
  var contentBlocksBefore = [];
  var contentBlocksSelected = [];
  var contentBlocksAfter = [];

  tr.doc.nodesBetween(listNodePos, listNodePos + listNode.nodeSize, function (node, pos, parentNode, index) {
    if (node.type !== paragraph) {
      return true;
    }
    var block = {
      node: node,
      pos: pos,
      parentNode: parentNode,
      index: index
    };

    if (pos + node.nodeSize <= from) {
      contentBlocksBefore.push(block);
    } else if (pos > to) {
      contentBlocksAfter.push(block);
    } else {
      contentBlocksSelected.push(block);
    }
    return false;
  });

  if (!contentBlocksSelected.length) {
    return tr;
  }

  tr = tr.delete(listNodePos, listNodePos + listNode.nodeSize);

  var listNodeType = listNode.type;
  var attrs = { indent: listNode.attrs.indent, start: 1 };

  if (contentBlocksAfter.length) {
    var _nodes = contentBlocksAfter.map(function (block) {
      return listItem.create({}, _prosemirrorModel.Fragment.from(block.node));
    });
    var frag = _prosemirrorModel.Fragment.from(listNodeType.create(attrs, _prosemirrorModel.Fragment.from(_nodes)));
    tr = tr.insert(listNodePos, frag);
  }

  if (contentBlocksSelected.length) {
    var _nodes2 = contentBlocksSelected.map(function (block) {
      if (unwrapParagraphNode) {
        return unwrapParagraphNode(block.node);
      } else {
        return block.node;
      }
    });
    var _frag = _prosemirrorModel.Fragment.from(_nodes2);
    tr = tr.insert(listNodePos, _frag);
  }

  if (contentBlocksBefore.length) {
    var _nodes3 = contentBlocksBefore.map(function (block) {
      return listItem.create({}, _prosemirrorModel.Fragment.from(block.node));
    });
    var _frag2 = _prosemirrorModel.Fragment.from(listNodeType.create(attrs, _prosemirrorModel.Fragment.from(_nodes3)));
    tr = tr.insert(listNodePos, _frag2);
  }
  return tr;
}