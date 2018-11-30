// @flow

import {Node, Mark, MarkType} from 'prosemirror-model';

type Result = {
  mark: Mark,
  from: {
    node: Node,
    pos: number,
  },
  to: {
    node: Node,
    pos: number,
  },
};

// If nodes within the same range have the same mark, returns
// the first node.
export default function findNodesWithSameMark(
  doc: Node,
  from: number,
  to: number,
  markType: MarkType,
): ?Result {
  let ii = from;
  const finder = mark => mark.type === markType;
  let firstMark = null;
  let fromNode = null;
  let toNode = null;
  let passed = true;

  let fromPos = from;
  let toPos = to;

  doc.nodesBetween(from, to, (node, pos) => {
    if (node.marks) {
      const mark = node.marks.length ? node.marks.find(finder) : null;
      if (!mark) {
        passed = false;
      } else if (firstMark && mark !== firstMark) {
        passed = false;
      }

      if (firstMark === null && mark) {
        firstMark = mark;
        fromPos = pos;
        toPos = pos;
        fromNode = node;
        toNode = node;
      }

      if (firstMark && mark) {
        toPos = pos;
        toNode = node;
      }
    }
    return passed;
  });

  if (!firstMark) {
    return null;
  }

  return {
    mark: firstMark,
    from: {
      node: fromNode,
      pos: fromPos,
    },
    to: {
      node: toNode,
      pos: toPos,
    },
  };
}
