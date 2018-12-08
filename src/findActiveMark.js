// @flow

import {Node, Mark, MarkType} from 'prosemirror-model';

export default function findActiveMark(
  doc: Node,
  from: number,
  to: number,
  markType: MarkType,
): ?Mark {
  let ii = from;
  if (doc.nodeSize <= 2) {
    return null;
  }
  const finder = mark => mark.type === markType;
  from = Math.max(2, from);
  to = Math.min(to, doc.nodeSize - 2);

  while (ii <= to) {
    const node = doc.nodeAt(ii);
    if (!node || !node.marks) {
      ii++;
      continue;
    }
    const mark = node.marks.find(finder);
    if (mark) {
      return mark;
    }
    ii++;
  }
  return null;
}
