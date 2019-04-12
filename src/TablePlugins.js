// @flow

import {Plugin} from 'prosemirror-state';
import {columnResizing, tableEditing} from 'prosemirror-tables';

import TableCellMenuPlugin from './TableCellMenuPlugin';

const TABLE_HANDLE_WIDTH = 5;
const TABLE_CELL_MINWIDTH = 25;
const TABLE_VIEW = undefined;
const TABLE_LAST_COLUMN_RESIZABLE = false;

function lookUpTable(event: Event): ?Element {
  const target: any = event.target;
  if (!target || !target.closest) {
    return null;
  }
  return target.closest('table');
}


function createResizingPluging(): Plugin {
  const plugin = columnResizing(
    TABLE_HANDLE_WIDTH,
    TABLE_CELL_MINWIDTH,
    TABLE_VIEW,
    TABLE_LAST_COLUMN_RESIZABLE,
  );
  // https://github.com/ProseMirror/prosemirror-tables/blob/master/src/columnresizing.js
  const {mousedown, mousemove, mouseleave} = plugin.props.handleDOMEvents;
  let mouseX = 0;
  let mouseXMax = 0;
  let targetTable = null;
  Object.assign(plugin.props.handleDOMEvents, {
    mousemove(view, event) {
      targetTable && mousemove(view, event);
    },
    mouseleave(view) {
      targetTable = null;
      mouseleave(view);
    },
    mousedown(view, event) {
      targetTable = lookUpTable(event);
      if (targetTable) {
        const tableRect = targetTable.getBoundingClientRect();
        console.log(event.clientX, tableRect.left, event);
        mousedown(view, event);
      }
    },
  });
  return plugin;
}



// Tables
// https://github.com/ProseMirror/prosemirror-tables/blob/master/demo.js
export default [
  new TableCellMenuPlugin(),
  createResizingPluging(),
  tableEditing(),
];
