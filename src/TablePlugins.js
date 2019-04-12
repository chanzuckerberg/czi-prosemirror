// @flow

import {tableEditing} from 'prosemirror-tables';

import TableCellMenuPlugin from './TableCellMenuPlugin';
import createTableResizingPluging from './createTableResizingPluging';

// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
export default [
  new TableCellMenuPlugin(),
  createTableResizingPluging(),
  tableEditing(),
];
