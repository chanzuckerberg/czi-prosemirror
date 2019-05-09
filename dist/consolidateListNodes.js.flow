// @flow

import isListNode from './isListNode';
import {Fragment} from 'prosemirror-model';
import {Node} from 'prosemirror-model';
import {Transform} from 'prosemirror-transform';

type JointInfo = {
  content: Fragment,
  deleteFrom: number,
  deleteTo: number,
  firstListNodePos: number,
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

  let prevJointInfo;

  // Keep the loop running until there's no more list nodes that can be joined.
  while (true) {
    const jointInfo = traverseDocAndFindJointInfo(tr.doc, prevJointInfo);
    if (jointInfo) {
      const {deleteFrom, deleteTo, insertAt, content} = jointInfo;
      tr = tr.delete(deleteFrom, deleteTo);
      tr = tr.insert(insertAt, content);
      prevJointInfo = jointInfo;
    } else {
      break;
    }
  }
  return tr;
}

function traverseDocAndFindJointInfo(
  doc: Node,
  prevJointInfo: ?JointInfo
): ?JointInfo {
  const minFrom = 1;

  const from = prevJointInfo
    ? Math.max(minFrom, prevJointInfo.firstListNodePos)
    : minFrom;

  const to = doc.nodeSize - 2;

  if (to <= from) {
    return null;
  }

  let prevNode = null;
  let jointInfo = null;
  let firstListNodePos = 0;

  // Perform the breadth-first traversal.
  doc.nodesBetween(from, to, (node, pos) => {
    const nodeIsAList = isListNode(node);

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
function resolveJointInfo(
  node: Node,
  pos: number,
  prevNode: ?Node,
  nextTraverseFrom: number
): ?JointInfo {
  if (!prevNode || !canJoinListNodes(node, prevNode)) {
    return null;
  }

  return {
    deleteFrom: pos,
    deleteTo: pos + node.nodeSize,
    insertAt: pos - 1,
    content: node.content,
    nextTraverseFrom,
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
