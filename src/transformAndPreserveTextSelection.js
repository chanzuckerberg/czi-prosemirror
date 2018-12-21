import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import {MARK_TEXT_SELECTION} from './MarkNames';
import applyMark from './applyMark';

export type SelectionMemo = {
  schema: Schema,
  tr: Transform,
};

// Perform the transform without losing the perceived text selection.
// The way it works is that this will annotate teh current selection with
// temporary marks and restores the selection with those marks after performing
// the transform.
export default function transformAndPreserveTextSelection(
  tr: Transform,
  schema: Schema,
  fn: (memo: SelectionMemo) => Transform,
): Transform {
  const {selection, doc} = tr;
  const markType = schema.marks[MARK_TEXT_SELECTION];
  if (!markType || !selection || !doc) {
    return tr;
  }

  if (!(selection instanceof TextSelection)) {
    return tr;
  }

  const {from, to} = selection;

  // Mark current selection so that we could resume the selection later
  // after changing the whole list.
  let fromOffset = 0;
  let toOffset = 0;
  if (from === to) {
    if (from === 0) {
      return tr;
    }
    // Selection is collapsed, create a temporary selection that the marks can
    // be applied to.
    const currentNode = tr.doc.nodeAt(from);
    const prevNode = tr.doc.nodeAt(from - 1);
    const nextNode = tr.doc.nodeAt(from + 1);

    // Ensure that the mark is applied to the same type of node.
    if (prevNode && currentNode && currentNode.type === prevNode.type) {
      fromOffset = -1;
    } else if (nextNode && currentNode && currentNode.type === nextNode.type) {
      toOffset = 1;
    } else if (nextNode) {
      // Could not find the same type of node, assume the next node is safe to use.
      toOffset = 1;
    } else if (prevNode) {
       // Could not find the same type of node, assume the next node is safe to use.
      fromOffset = -1;
    } else {
      // Selection can't be safely preserved.
      return tr;
    }
    tr = tr.setSelection(TextSelection.create(
      doc,
      from + fromOffset,
      to + toOffset,
    ));
  }

   // This is an unique ID (by reference).
  const id = {};
  const findMark = mark => mark.attrs.id === id;

  const findMarkRange = () => {
    let markFrom = 0;
    let markTo = 0;
    tr.doc.descendants((node, pos) => {
      if (node.marks && node.marks.find(findMark)) {
        markFrom = markFrom === 0 ? pos : markFrom;
        markTo = pos + node.nodeSize;
      }
      return true;
    });
    return {
      from: markFrom,
      to: markTo,
    };
  };

  tr = applyMark(tr, schema, markType, {id});
  tr = fn({tr, schema});

  const markRange = findMarkRange();
  const selectionRange = {
    from: Math.max(0, markRange.from - fromOffset),
    to: Math.max(0, markRange.to - toOffset),
  };

  selectionRange.to = Math.max(0, selectionRange.from, selectionRange.to);

  tr = tr.removeMark(markRange.from, markRange.to, markType);
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    selectionRange.from,
    selectionRange.to,
  ));


  return tr;
}
