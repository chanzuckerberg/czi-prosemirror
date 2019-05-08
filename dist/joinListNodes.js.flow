// @flow

import isListNode from './isListNode';
import nodeAt from './nodeAt';
import {Schema} from 'prosemirror-model';
import {Node, NodeType} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

// Join sibling list nodes with the specific list type and indent level.
// Note that this transform may change the current selection.
export default function joinListNodes(
  tr: Transform,
  schema: Schema,
  listNodeType: NodeType,
  indent: number
): Transform {
  if (!schema.nodes[listNodeType.name]) {
    return tr;
  }

  if (tr.getMeta('dryrun')) {
    // This transform is potentially expensive to perform, so skip it if
    // we're only doing it as "dryrun" to see whether user could update the
    // lists.
    return tr;
  }

  let working = true;
  // Keep the loop running until there's no list nodes that can be joined.
  while (working) {
    const from = 1;
    const to = tr.doc.nodeSize - 2;
    if (to <= from) {
      break;
    }
    let mergeInfo;
    tr.doc.nodesBetween(from, to, (node, pos) => {
      if (mergeInfo) {
        // We've found the list to merge. Stop traversing deeper.
        return false;
      }
      if (!isListNode(node)) {
        // This is not a list node, keep traversing deeper until we've found
        // one.
        return true;
      }

      if (node.type !== listNodeType && node.attrs.indent !== indent) {
        // This list node does matched the spec. Stop the traversing deeper.
        return false;
      }

      const nextSiblingNodePos = pos + node.nodeSize;
      const nextSiblingNode = nodeAt(tr.doc, nextSiblingNodePos);
      if (nextSiblingNode && canJoinListNodes(node, nextSiblingNode)) {
        // The current list node and its next sibling list node can be merged.
        mergeInfo = {
          deleteFrom: nextSiblingNodePos,
          deleteTo: nextSiblingNodePos + nextSiblingNode.nodeSize,
          insertAt: nextSiblingNodePos - 1,
          content: nextSiblingNode.content,
        };
      }

      // Stop the traversing deeper inside the current list node which
      // can only contains inline nodes inside.
      return false;
    });

    if (mergeInfo) {
      // Merge list nodes.
      const {deleteFrom, deleteTo, insertAt, content} = mergeInfo;
      tr = tr.delete(deleteFrom, deleteTo);
      tr = tr.insert(insertAt, content);
      working = true;
    } else {
      working = false;
    }
  }
  return tr;
}

function canJoinListNodes(one: Node, two: Node): boolean {
  return !!(
    one.type === two.type &&
    one.attrs.indent === two.attrs.indent &&
    isListNode(one) &&
    isListNode(two)
  );
}
