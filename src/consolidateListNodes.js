// @flow

import isListNode from './isListNode';
import {Fragment} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

type JointInfo = {
  content: Fragment,
  deleteFrom: number,
  deleteTo: number,
  insertAt: number,
};

// Consolidate list nodes.
// All adjacent list nodes with the same list type and indent level will be
// joined into one list node.
// Note that this transform may change the current user selection.
export default function consolidateListNodes(tr: Transform): Transform {
  if (tr.getMeta('dryrun')) {
    // This transform is potentially expensive to perform, so skip it if
    // the transform is performed as "dryrun".
    return tr;
  }

  // Keep the loop running until there's no more list nodes that can be joined.
  while (true) {
    const jointInfo = traverseDocAndFindJointInfo(tr.doc);
    if (jointInfo) {
      const {deleteFrom, deleteTo, insertAt, content} = jointInfo;
      tr = tr.delete(deleteFrom, deleteTo);
      tr = tr.insert(insertAt, content);
    } else {
      break;
    }
  }
  return tr;
}

function traverseDocAndFindJointInfo(doc: Node): ?JointInfo {
  const from = 1;
  const to = doc.nodeSize - 2;
  if (to <= from) {
    return null;
  }

  let prevNode = null;
  let jointInfo = null;

  // Perform the breadth-first traversal
  doc.nodesBetween(from, to, (node, pos) => {
    let recursive = true;
    if (jointInfo) {
      // We've found the list to merge. Stop traversing deeper.
      recursive = false;
    } else if (isListNode(node)) {
      jointInfo = resolveJointInfo(node, pos, prevNode);
      // Stop the traversing recursively inside the this list node because
      // its content only contains inline nodes.
      recursive = false;
    } else {
      // This is not a list node, will keep traversing deeper until we've found
      // a list node or reach the leaf node.
      recursive = true;
    }
    prevNode = node;
    return recursive;
  });

  return jointInfo;
}

// If two siblings nodes that can be joined as single list, returns
// the information of how to join them.
function resolveJointInfo(
  node: Node,
  pos: number,
  prevNode: ?Node
): ?JointInfo {
  if (!prevNode || !canJoinListNodes(node, prevNode)) {
    return null;
  }

  return {
    deleteFrom: pos,
    deleteTo: pos + node.nodeSize,
    insertAt: pos - 1,
    content: node.content,
  };
}

function canJoinListNodes(one: Node, two: Node): boolean {
  return !!(
    one.type === two.type &&
    one.attrs.indent === two.attrs.indent &&
    isListNode(one) &&
    isListNode(two)
  );
}
