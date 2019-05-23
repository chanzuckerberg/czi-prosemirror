'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = consolidateListNodes;

var _isOrderedListNode = require('./isOrderedListNode');

var _isOrderedListNode2 = _interopRequireDefault(_isOrderedListNode);

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Consolidate list nodes.
// All adjacent list nodes with the same list type and indent level will be
// joined into one list node.
// Note that this transform may change the current user selection.
function consolidateListNodes(tr) {
  if (tr.getMeta('dryrun')) {
    // This transform is potentially expensive to perform, so skip it if
    // the transform is performed as "dryrun".
    return tr;
  }

  var prevJointInfo = void 0;

  // Keep the loop running until there's no more list nodes that can be joined.
  while (true) {
    var jointInfo = traverseDocAndFindJointInfo(tr.doc, prevJointInfo);
    if (jointInfo) {
      var _deleteFrom = jointInfo.deleteFrom,
          _deleteTo = jointInfo.deleteTo,
          _insertAt = jointInfo.insertAt,
          _content = jointInfo.content;

      tr = tr.delete(_deleteFrom, _deleteTo);
      tr = tr.insert(_insertAt, _content);
      prevJointInfo = jointInfo;
    } else {
      tr = linkOrderedListCounters(tr);
      break;
    }
  }
  return tr;
}

/**
 * This ensures that the adjacent ordered lists within the same indent level
 * share the same counter.
 *
 * For example, the following three lists:
 *   --------
 *   1. AAA
 *   2. BBB
 *   --------
 *     a. CCC
 *     d. DDD
 *   --------
 *   1. EEE
 *   2. FFF
 *   --------
 * Will transform into
 *   --------
 *   1. AAA
 *   2. BBB
 *   --------
 *     a. CCC
 *     d. DDD
 *   --------
 *   3. EEE
 *   4. FFF
 *   --------
 * This means that the t1st and the 3rd lists are linked.
 */


function linkOrderedListCounters(tr) {
  var from = 1;
  var to = tr.doc.nodeSize - 2;
  if (from >= to) {
    return tr;
  }

  var listsBefore = null;
  tr.doc.nodesBetween(from, to, function (node, pos, parentNode) {
    var willTraverseNodeChildren = true;
    if ((0, _isListNode2.default)(node)) {
      // List Node can't be nested, no need to travere its children.
      willTraverseNodeChildren = false;
      var indent = node.attrs.indent || 0;
      var start = node.attrs.start || 1;
      if (listsBefore) {
        if (start === 1 && (0, _isOrderedListNode2.default)(node)) {
          // Look backward until we could find another ordered list node to
          // link with.
          var counterIsLinked = void 0;
          listsBefore.some(function (list, index) {
            if (list.node.type !== node.type && list.indent === indent) {
              // This encounters different type of list node (e.g a bullet
              // list node), we need to restart the counter.
              // ------
              // 1. AAA
              // 2. BBB
              // ------
              // -. CCC
              // -. DDD
              // ------
              // 1. DDD <- Counter restarts here.
              // 2. EEE
              // ------
              counterIsLinked = false;
              return true;
            } else if (list.indent < indent) {
              // This encounters an ordered list node that has less indent.
              // we need to restart the counter.
              // ------
              // 1. AAA
              // 2. BBB
              // ------
              //   1. DDD <- Counter restarts here.
              //   2. EEE
              // ------
              counterIsLinked = false;
              return true;
            } else if (list.indent === indent) {
              // This encounters an ordered list node that has same indent.
              // Do not Restart the counter.
              // ------
              // 1. AAA
              // 2. BBB
              // ------
              // 3. DDD <- Counter continues here.
              // 4. EEE
              // ------
              counterIsLinked = true;
              return true;
            }
            return false;
          });

          if (counterIsLinked !== undefined) {
            tr = setCounterLinked(tr, pos, counterIsLinked);
          }
        }
      } else {
        // Found the first list.
        // ------
        // 1. AAA <- Counter restarts here.
        // 2. BBB
        listsBefore = [];
        if ((0, _isOrderedListNode2.default)(node)) {
          tr = setCounterLinked(tr, pos, false);
        }
      }
      listsBefore.unshift({ parentNode: parentNode, indent: indent, node: node });
    } else {
      // Not traversing withing any list node. No lists need to be updated.
      listsBefore = null;
    }
    return willTraverseNodeChildren;
  });
  return tr;
}

function setCounterLinked(tr, pos, linked) {
  var node = tr.doc.nodeAt(pos);
  var currentValue = node.attrs.counterReset || null;
  var nextValue = linked ? 'none' : null;
  if (nextValue !== currentValue) {
    var nodeAttrs = (0, _extends3.default)({}, node.attrs, { counterReset: nextValue });
    tr = tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
  }
  return tr;
}

function traverseDocAndFindJointInfo(doc, prevJointInfo) {
  var minFrom = 1;

  var from = prevJointInfo ? Math.max(minFrom, prevJointInfo.firstListNodePos) : minFrom;

  var to = doc.nodeSize - 2;

  if (to <= from) {
    return null;
  }

  var prevNode = null;
  var jointInfo = null;
  var firstListNodePos = 0;

  // Perform the breadth-first traversal.
  doc.nodesBetween(from, to, function (node, pos) {
    if (jointInfo) {
      // We've found the list to merge. Stop traversing deeper.
      return false;
    } else if ((0, _isListNode2.default)(node)) {
      firstListNodePos = firstListNodePos === 0 ? pos : firstListNodePos;
      jointInfo = resolveJointInfo(node, pos, prevNode, firstListNodePos);
      prevNode = node;
      // Stop the traversing recursively inside the this list node because
      // its content only contains inline nodes.
      return false;
    } else {
      prevNode = node;
      // This is not a list node, will keep traversing deeper until we've found
      // a list node or reach the leaf node.
      return true;
    }
  });

  if (jointInfo) {
    // Reduce the range of the next traversal so it could run faster.
    jointInfo.firstListNodePos = firstListNodePos;
  }

  return jointInfo;
}

// If two siblings nodes that can be joined as single list, returns
// the information of how to join them.
function resolveJointInfo(node, pos, prevNode, firstListNodePos) {
  if (!prevNode || !canJoinListNodes(node, prevNode)) {
    return null;
  }

  return {
    deleteFrom: pos,
    deleteTo: pos + node.nodeSize,
    insertAt: pos - 1,
    content: node.content,
    firstListNodePos: firstListNodePos
  };
}

function canJoinListNodes(one, two) {
  return !!(one.type === two.type && one.attrs.indent === two.attrs.indent && (0, _isListNode2.default)(one) && (0, _isListNode2.default)(two));
}