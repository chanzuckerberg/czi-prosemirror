
import applyMark from './applyMark';
import {Fragment, Schema, } from 'prosemirror-model';
import {MARK_TEXT_SELECTION} from './MarkNames';
import {TextSelection} from 'prosemirror-state';

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
  let deltaFrom = 0;
  let deltaTo = 0;

  // Mark current selection so that we could resume the selection later
  // after changing the whole list.
  let selectionExpanded;
  if (from === to) {
    if (from === 0) {
      return tr;
    }
    // Selection is collapsed, create a temnporary selection that the marks can
    // be applied to.
    selectionExpanded = TextSelection.create(
      doc,
      from - 1,
      to,
    );
    tr = tr.setSelection(selectionExpanded);
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
    from: selectionExpanded ?
      markRange.from + 1 :
      markRange.from,
    to: markRange.to,
  };

  tr = tr.removeMark(markRange.from, markRange.to, markType);
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    selectionRange.from,
    selectionRange.to,
  ));

  return tr;
}
