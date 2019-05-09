'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = consolidateListNodes;

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
      break;
    }
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
    var nodeIsAList = (0, _isListNode2.default)(node);

    if (nodeIsAList) {
      firstListNodePos = firstListNodePos === 0 ? pos : firstListNodePos;
    }

    if (jointInfo) {
      // We've found the list to merge. Stop traversing deeper.
      return false;
    } else if (nodeIsAList) {
      jointInfo = resolveJointInfo(node, pos, prevNode, from);
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
function resolveJointInfo(node, pos, prevNode, nextTraverseFrom) {
  if (!prevNode || !canJoinListNodes(node, prevNode)) {
    return null;
  }

  return {
    deleteFrom: pos,
    deleteTo: pos + node.nodeSize,
    insertAt: pos - 1,
    content: node.content,
    nextTraverseFrom: nextTraverseFrom
  };
}

function canJoinListNodes(one, two) {
  return !!(one.type === two.type && one.attrs.indent === two.attrs.indent && (0, _isListNode2.default)(one) && (0, _isListNode2.default)(two));
}