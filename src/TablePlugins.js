// @flow

import {tableEditing} from 'prosemirror-tables';

import TableCellMenuPlugin from './TableCellMenuPlugin';
import createTableResizingPlugin from './createTableResizingPlugin';

// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
export default [
  new TableCellMenuPlugin(),
  createTableResizingPlugin(),
  tableEditing(),
];
