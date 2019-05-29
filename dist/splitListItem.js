'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = splitListItem;

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorState = require('prosemirror-state');

var _prosemirrorTransform = require('prosemirror-transform');

var _NodeNames = require('./NodeNames');

var _prosemirrorUtils = require('prosemirror-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Build a command that splits a non-empty textblock at the top level
// of a list item by also splitting that list item.
function splitListItem(tr, schema) {
  var nodeType = schema.nodes[_NodeNames.LIST_ITEM];
  if (!nodeType) {
    return tr;
  }

  var _tr = tr,
      selection = _tr.selection;

  if (!selection) {
    return tr;
  }

  var $from = selection.$from,
      $to = selection.$to,
      node = selection.node;

  if (node && node.isBlock || $from.depth < 2 || !$from.sameParent($to)) {
    return tr;
  }

  var grandParent = $from.node(-1);
  if (grandParent.type !== nodeType) {
    return tr;
  }

  if ($from.parent.content.size == 0) {
    // In an empty block. If this is a nested list, the wrapping
    // list item should be split. Otherwise, bail out and let next
    // command handle lifting.
    // if (
    //   $from.depth == 2 ||
    //   $from.node(-3).type !== nodeType ||
    //   $from.index(-2) != $from.node(-2).childCount - 1
    // ) {
    //   return tr;
    // }

    // let wrap = Fragment.empty;
    // const keepItem = $from.index(-1) > 0;
    // // Build a fragment containing empty versions of the structure
    // // from the outer list item to the parent node of the cursor
    // for (let d = $from.depth - (keepItem ? 1 : 2); d >= $from.depth - 3; d--) {
    //   wrap = Fragment.from($from.node(d).copy(wrap));
    // }

    // // Add a second list item with an empty default start node
    // wrap = wrap.append(Fragment.from(nodeType.createAndFill()));
    // tr = tr.replace(
    //   $from.before(keepItem ? null : -1),
    //   $from.after(-3),
    //   new Slice(wrap, keepItem ? 3 : 2, 2)
    // );

    // const pos = $from.pos + (keepItem ? 3 : 2);
    // tr = tr.setSelection(selection.constructor.near(tr.doc.resolve(pos)));
    return insertParagraphAndSplitBlankListItem(tr, schema);
  }

  var nextType = $to.pos == $from.end() ? grandParent.contentMatchAt($from.indexAfter(-1)).defaultType : null;

  tr = tr.delete($from.pos, $to.pos);
  var types = nextType && [null, { type: nextType }];
  if (!(0, _prosemirrorTransform.canSplit)(tr.doc, $from.pos, 2, types)) {
    return tr;
  }

  return tr.split($from.pos, 2, types);
}

function insertParagraphAndSplitBlankListItem(tr, schema) {
  var listItemType = schema.nodes[_NodeNames.LIST_ITEM];
  var orderedListType = schema.nodes[_NodeNames.ORDERED_LIST];
  var bulletListType = schema.nodes[_NodeNames.BULLET_LIST];
  var paragraphType = schema.nodes[_NodeNames.PARAGRAPH];
  if (!listItemType || !paragraphType) {
    // Schema does not support the nodes expected.
    return tr;
  }
  var listItemFound = (0, _prosemirrorUtils.findParentNodeOfType)(listItemType)(tr.selection);
  if (!listItemFound || listItemFound.node.textContent !== '') {
    // Selection cursor is not inside an empty list item.
    return tr;
  }

  var listFound = orderedListType && (0, _prosemirrorUtils.findParentNodeOfType)(orderedListType)(tr.selection) || bulletListType && (0, _prosemirrorUtils.findParentNodeOfType)(bulletListType)(tr.selection);

  if (!listFound) {
    // Selection isn't inside an list.
    return tr;
  }

  var $listItemPos = tr.doc.resolve(listItemFound.pos);
  var listItemIndex = $listItemPos.index($listItemPos.depth);
  if (listFound.node.childCount < 3 || listItemIndex < 1 || listItemIndex >= listFound.node.childCount - 1) {
    // - The list must have at least three list items
    // - The cursor must be after the first list item and before the last list
    //   item.
    // If both conditions don't match, bails out.
    return tr;
  }

  var sliceFrom = listItemFound.pos + listItemFound.node.nodeSize;
  var sliceTo = listFound.pos + listFound.node.nodeSize - 1;
  var slicedItems = tr.doc.slice(sliceFrom, sliceTo, false);

  var deleteFrom = listItemFound.pos;
  var deleteTo = listFound.pos + listFound.node.nodeSize;
  tr = tr.delete(deleteFrom, deleteTo);
  var sourceListNode = listFound.node;
  var listAttrs = (0, _extends3.default)({}, sourceListNode.attrs);
  if (orderedListType === sourceListNode.type) {
    listAttrs.counterReset = 'none';
  }

  var insertFrom = deleteFrom + 1;
  var listNode = sourceListNode.type.create(listAttrs, slicedItems.content);
  tr = tr.insert(insertFrom, listNode);
  var paragraph = paragraphType.create({}, _prosemirrorModel.Fragment.empty);
  tr = tr.insert(insertFrom, paragraph);
  tr = tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, insertFrom));
  return tr;
}