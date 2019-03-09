'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = updateIndentLevel;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _NodeNames = require('./NodeNames');

var _ParagraphNodeSpec = require('./ParagraphNodeSpec');

var _compareNumber = require('./compareNumber');

var _compareNumber2 = _interopRequireDefault(_compareNumber);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _transformAndPreserveTextSelection = require('./transformAndPreserveTextSelection');

var _transformAndPreserveTextSelection2 = _interopRequireDefault(_transformAndPreserveTextSelection);

var _clamp = require('./ui/clamp');

var _clamp2 = _interopRequireDefault(_clamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updateIndentLevel(tr, schema, delta) {
  var _tr = tr,
      doc = _tr.doc,
      selection = _tr.selection;

  if (!doc || !selection) {
    return tr;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return tr;
  }

  var nodes = schema.nodes;
  var from = selection.from,
      to = selection.to;

  var listNodePoses = [];

  var blockquote = nodes[_NodeNames.BLOCKQUOTE];
  var heading = nodes[_NodeNames.HEADING];
  var paragraph = nodes[_NodeNames.PARAGRAPH];

  doc.nodesBetween(from, to, function (node, pos) {
    var nodeType = node.type;
    if (nodeType === paragraph || nodeType === heading || nodeType === blockquote) {
      tr = setNodeIndentMarkup(tr, schema, pos, delta);
      return false;
    } else if ((0, _isListNode2.default)(node)) {
      // List is tricky, we'll handle it later.
      listNodePoses.push(pos);
      return false;
    }
    return true;
  });

  if (!listNodePoses.length) {
    return tr;
  }

  // tr = transformAndPreserveTextSelection(tr, schema, (memo) => {
  //   let tr2 = memo.tr;
  //   listNodePoses.sort(compareNumber).reverse().forEach(pos => {
  //     tr2 = setListNodeIndent(
  //       tr2,
  //       memo.schema,
  //       pos,
  //       delta,
  //     );
  //   });
  //   return tr2;
  // });

  tr = (0, _transformAndPreserveTextSelection2.default)(tr, schema, function (memo) {
    var schema = memo.schema;

    var tr2 = memo.tr;
    listNodePoses.sort(_compareNumber2.default).reverse().forEach(function (pos) {
      tr2 = setListNodeIndent(tr2, schema, pos, delta);
    });
    return tr2;
  });

  return tr;
}

function setListNodeIndent(tr, schema, pos, delta) {
  var listItem = schema.nodes[_NodeNames.LIST_ITEM];
  if (!listItem) {
    return tr;
  }

  var _tr2 = tr,
      doc = _tr2.doc,
      selection = _tr2.selection;

  if (!doc) {
    return tr;
  }

  var listNode = doc.nodeAt(pos);
  if (!listNode) {
    return tr;
  }

  var indentNew = (0, _clamp2.default)(_ParagraphNodeSpec.MIN_INDENT_LEVEL, listNode.attrs.indent + delta, _ParagraphNodeSpec.MAX_INDENT_LEVEL);
  if (indentNew === listNode.attrs.indent) {
    return tr;
  }

  var from = selection.from,
      to = selection.to;


  if (from <= pos && to >= pos + listNode.nodeSize) {
    return setNodeIndentMarkup(tr, schema, pos, delta);
  }

  var listNodeType = listNode.type;

  // listNode is partially selected.
  var itemsBefore = [];
  var itemsSelected = [];
  var itemsAfter = [];

  doc.nodesBetween(pos, pos + listNode.nodeSize, function (itemNode, itemPos) {
    if (itemNode.type === listNodeType) {
      return true;
    }

    if (itemNode.type === listItem) {
      var listItemNode = listItem.create(itemNode.attrs, itemNode.content, itemNode.marks);
      if (itemPos + itemNode.nodeSize <= from) {
        itemsBefore.push(listItemNode);
      } else if (itemPos > to) {
        itemsAfter.push(listItemNode);
      } else {
        itemsSelected.push(listItemNode);
      }
      return false;
    }

    return true;
  });

  tr = tr.delete(pos, pos + listNode.nodeSize);
  if (itemsAfter.length) {
    var listNodeNew = listNodeType.create(listNode.attrs, _prosemirrorModel.Fragment.from(itemsAfter));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(listNodeNew));
    tr = mergeSiblingLists(tr, pos);
  }

  if (itemsSelected.length) {
    var listNodeAttrs = (0, _extends3.default)({}, listNode.attrs, {
      indent: indentNew
    });
    var _listNodeNew = listNodeType.create(listNodeAttrs, _prosemirrorModel.Fragment.from(itemsSelected));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(_listNodeNew));
    tr = mergeSiblingLists(tr, pos);
  }

  if (itemsBefore.length) {
    var _listNodeNew2 = listNodeType.create(listNode.attrs, _prosemirrorModel.Fragment.from(itemsBefore));
    tr = tr.insert(pos, _prosemirrorModel.Fragment.from(_listNodeNew2));
    tr = mergeSiblingLists(tr, pos);
  }
  return tr;
}

function mergeSiblingLists(tr, listNodePos) {
  var listNode = tr.doc.nodeAt(listNodePos);
  if (!listNode) {
    return tr;
  }
  var listNodeType = listNode.type;
  var indent = listNode.attrs.indent;
  var fromPos = listNodePos;
  var toPos = listNodePos + listNode.nodeSize;
  var $fromPos = tr.doc.resolve(fromPos);
  var $toPos = tr.doc.resolve(toPos);
  if ($fromPos.nodeBefore && $fromPos.nodeBefore.type === listNodeType && $fromPos.nodeBefore.attrs.indent === indent) {
    var beforeFromPos = fromPos - $fromPos.nodeBefore.nodeSize;
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos - 1, listNode.content);

    listNode = tr.doc.nodeAt(beforeFromPos);
    fromPos = beforeFromPos;
    toPos = beforeFromPos + listNode.nodeSize;
    $fromPos = tr.doc.resolve(fromPos);
    $toPos = tr.doc.resolve(toPos);
  }

  if ($toPos.nodeAfter && $toPos.nodeAfter.type === listNodeType && $toPos.nodeAfter.attrs.indent === indent) {
    tr = tr.delete(fromPos, toPos);
    tr = tr.insert(fromPos + 1, listNode.content);
  }

  return tr;
}

function setNodeIndentMarkup(tr, schema, pos, delta) {
  if (!tr.doc) {
    return tr;
  }
  var node = tr.doc.nodeAt(pos);
  if (!node) {
    return tr;
  }
  var indent = (0, _clamp2.default)(_ParagraphNodeSpec.MIN_INDENT_LEVEL, (node.attrs.indent || 0) + delta, _ParagraphNodeSpec.MAX_INDENT_LEVEL);
  if (indent === node.attrs.indent) {
    return tr;
  }
  var nodeAttrs = (0, _extends3.default)({}, node.attrs, {
    indent: indent
  });
  return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
}