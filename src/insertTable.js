// @flow

import {Fragment, Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import {PARAGRAPH, TABLE, TABLE_CELL, TABLE_ROW} from './NodeNames';

const ZERO_WIDTH_SPACE_CHAR = '\u200b';

export default function insertTable(
  tr: Transform,
  schema: Schema,
  rows: number,
  cols: number,
): Transform {
  if (!tr.selection || !tr.doc) {
    return tr;
  }
  const {from, to} = tr.selection;
  if (from !== to) {
    return tr;
  }

  const {nodes} = schema;
  const cell = nodes[TABLE_CELL];
  const paragraph = nodes[PARAGRAPH];
  const row = nodes[TABLE_ROW];
  const table = nodes[TABLE];
  if (!(cell && paragraph && row && table)) {
    return tr;
  }

  const rowNodes = [];
  for (let rr = 0; rr < rows; rr++) {
    const cellNodes = [];
    for (let cc = 0; cc < cols; cc++) {
      const textNode = schema.text(ZERO_WIDTH_SPACE_CHAR);
      const paragraphNode = paragraph.create({}, Fragment.from(textNode));
      const cellNode = cell.create({}, Fragment.from(paragraphNode));
      cellNodes.push(cellNode);
    }
    const rowNode = row.create({}, Fragment.from(cellNodes));
    rowNodes.push(rowNode);
  }
  const tableNode = table.create({}, Fragment.from(rowNodes));
  tr = tr.insert(from,  Fragment.from(tableNode));

  const selection = TextSelection.create(
    tr.doc,
    from + 5,
    from + 5,
  );

  tr = tr.setSelection(selection);
  return tr;
}
