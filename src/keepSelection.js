
import applyMark from './applyMark';
import {Fragment, Schema, } from 'prosemirror-model';
import {MARK_TEXT_SELECTION} from './MarkNames';
import {TextSelection} from 'prosemirror-state';

export type SelectionMemo = {
  findMarkRange: () => {from: number, to: number},
  findSelectionRange: () => {from: number, to: number},
  schema: Schema,
  tr: Transform,
};

export default function keepSelection(
  tr: Transform,
  schema: Schema,
  fn: (memo: SelectionMemo) => Transform,
): Transform {
  const {selection, doc} = tr;
  const markType = schema.marks[MARK_TEXT_SELECTION];
  if (!markType || !selection || !doc) {
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

  const id = {};
  const findMark = mark => mark.attrs.id === id;
  const findMarkRange = () => {
    let markFrom = 0;
    let markTo = tr.doc.nodeSize - 2;
    tr.doc.nodesBetween(
      Math.max(1, from - 4),
      Math.min(to + 4, tr.doc.nodeSize - 2),
      (node, pos) => {
        if (node.marks && node.marks.find(findMark)) {
          markFrom = markFrom || pos;
          markTo = pos + node.nodeSize;
        }
        return true;
      },
    );
    return {
      from: markFrom,
      to: markTo,
    };
  };
  const findSelectionRange = () => {
    const {from, to} = findMarkRange();
    return {
      from: selectionExpanded ? from + 1 : from,
      to,
    };
  };

  tr = applyMark(tr, schema, markType, {id});
  tr = fn({tr, schema, findMarkRange, findSelectionRange});

  const selectionRange = findSelectionRange();
  const markRange = findMarkRange();
  tr = tr.removeMark(markRange.from, markRange.to, markType);
  tr = tr.setSelection(TextSelection.create(
    tr.doc,
    selectionRange.from,
    selectionRange.to,
  ));

  return tr;
}
