'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = joinListNodes;

var _isListNode = require('./isListNode');

var _isListNode2 = _interopRequireDefault(_isListNode);

var _nodeAt = require('./nodeAt');

var _nodeAt2 = _interopRequireDefault(_nodeAt);

var _prosemirrorModel = require('prosemirror-model');

var _prosemirrorTransform = require('prosemirror-transform');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Join sibling list nodes with the specific list type and indent level.
// Note that this transform may change the current selection.
function joinListNodes(tr, schema, listNodeType, indent) {
  if (!schema.nodes[listNodeType.name]) {
    return tr;
  }

  if (tr.getMeta('dryrun')) {
    // This transform is potentially expensive to perform, so skip it if
    // we're only doing it as "dryrun" to see whether user could update the
    // lists.
    return tr;
  }

  var working = true;
  // Keep the loop running until there's no list nodes that can be joined.

  var _loop = function _loop() {
    var from = 1;
    var to = tr.doc.nodeSize - 2;
    if (to <= from) {
      return 'break';
    }
    var mergeInfo = void 0;
    tr.doc.nodesBetween(from, to, function (node, pos) {
      if (mergeInfo) {
        // We've found the list to merge. Stop traversing deeper.
        return false;
      }
      if (!(0, _isListNode2.default)(node)) {
        // This is not a list node, keep traversing deeper until we've found
        // one.
        return true;
      }

      if (node.type !== listNodeType && node.attrs.indent !== indent) {
        // This list node does matched the spec. Stop the traversing deeper.
        return false;
      }

      var nextSiblingNodePos = pos + node.nodeSize;
      var nextSiblingNode = (0, _nodeAt2.default)(tr.doc, nextSiblingNodePos);
      if (nextSiblingNode && canJoinListNodes(node, nextSiblingNode)) {
        // The current list node and its next sibling list node can be merged.
        mergeInfo = {
          deleteFrom: nextSiblingNodePos,
          deleteTo: nextSiblingNodePos + nextSiblingNode.nodeSize,
          insertAt: nextSiblingNodePos - 1,
          content: nextSiblingNode.content
        };
      }

      // Stop the traversing deeper inside the current list node which
      // can only contains inline nodes inside.
      return false;
    });

    if (mergeInfo) {
      // Merge list nodes.
      var _mergeInfo = mergeInfo,
          deleteFrom = _mergeInfo.deleteFrom,
          deleteTo = _mergeInfo.deleteTo,
          insertAt = _mergeInfo.insertAt,
          content = _mergeInfo.content;

      tr = tr.delete(deleteFrom, deleteTo);
      tr = tr.insert(insertAt, content);
      working = true;
    } else {
      working = false;
    }
  };

  while (working) {
    var _ret = _loop();

    if (_ret === 'break') break;
  }
  return tr;
}

function canJoinListNodes(one, two) {
  return !!(one.type === two.type && one.attrs.indent === two.attrs.indent && (0, _isListNode2.default)(one) && (0, _isListNode2.default)(two));
}