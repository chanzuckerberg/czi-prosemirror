// @flow

// Copyright (C) 2015-2016 by Marijn Haverbeke <marijnh@gmail.com> and others
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// License about this file:
// This file is originally forked from
// https://github.com/ProseMirror/prosemirror-tables/blob/0e74c6a1761651ccf3701eb8529fa9187ad5c91d/src/columnresizing.js
// and most of the original codes had been modified to support the bevaviors
// that czi-prosemirror needs.
// The plugin provides the following behaviors:
// - Let user resize a column without changing the total width of the table.
// - Let user set the left margin of the table.
// - Let user set the right margin of the table.

import {Decoration, DecorationSet, EditorView} from 'prosemirror-view';
import {EditorState, Plugin, PluginKey} from 'prosemirror-state';
import {Node} from 'prosemirror-model';
import {TableMap} from 'prosemirror-tables/src/tablemap';
import {TableView} from 'prosemirror-tables/src/tableview';
import {Transform} from 'prosemirror-transform';
import {cellAround, pointsAtCell, setAttr} from 'prosemirror-tables/src/util';
import {findParentNodeOfTypeClosestToPos} from 'prosemirror-utils';
import {tableNodeTypes} from 'prosemirror-tables/src/schema';
import nullthrows from 'nullthrows';

type DraggingInfo = {
  columnElements: Array<HTMLElement>,
  startX: number,
  tableElement: HTMLElement,
  tableMarginLeft: number,
  tableMarginRight: number,
  tableWidth: number,
  tableWrapperWidth: number,
  taregtColumnIndex: number,
};

type PointerEvent = {
  target: EventTarget,
  clientX: number,
  clientY: number,
};

const PLUGIN_KEY = new PluginKey('tableColumnResizing');
const CELL_MIN_WIDTH = 25;
const HANDLE_WIDTH = 20;

// The immutable plugin state that stores the information for resizing.
class ResizeState {
  cellPos: ?number;
  forMarginLeft: ?boolean;
  draggingInfo: ?DraggingInfo;

  constructor(
    cellPos: ?number,
    forMarginLeft: ?boolean,
    draggingInfo: ?DraggingInfo
  ) {
    this.cellPos = cellPos;
    this.draggingInfo = draggingInfo;
    this.forMarginLeft = forMarginLeft;
  }

  apply(tr: Transform): ResizeState {
    let state = this;
    const action = tr.getMeta(PLUGIN_KEY);
    if (action && typeof action.setCellPos === 'number') {
      return new ResizeState(action.setCellPos, action.setForMarginLeft, null);
    }

    if (action && action.setDraggingInfo !== undefined) {
      return new ResizeState(
        state.cellPos,
        state.forMarginLeft,
        action.setDraggingInfo
      );
    }

    if (state.cellPos && state.cellPos > -1 && tr.docChanged) {
      let cellPos = tr.mapping.map(state.cellPos, -1);
      if (!pointsAtCell(tr.doc.resolve(cellPos))) {
        cellPos = null;
      }
      state = new ResizeState(
        cellPos,
        cellPos ? state.forMarginLeft : false,
        state.draggingInfo
      );
    }
    return state;
  }
}

// Function that handles the mousemove event inside table cell.
function handleMouseMove(view: EditorView, event: PointerEvent): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  if (resizeState.draggingInfo) {
    return;
  }

  const target = domCellAround(event.target);
  let forMarginLeft = false;
  let cell = -1;

  if (target instanceof HTMLElement) {
    const {left, right} = target.getBoundingClientRect();
    const offsetLeft = event.clientX - left;
    if (offsetLeft <= HANDLE_WIDTH) {
      if (target.cellIndex === 0) {
        forMarginLeft = true;
        cell = edgeCell(view, event, 'right');
      } else {
        cell = edgeCell(view, event, 'left');
      }
    } else if (right - event.clientX <= HANDLE_WIDTH) {
      cell = edgeCell(view, event, 'right');
    }
  }

  if (
    cell === resizeState.cellPos &&
    forMarginLeft === resizeState.forMarginLeft
  ) {
    return;
  }

  if (cell !== -1) {
    const $cell = view.state.doc.resolve(cell);
    if (!$cell) {
      return;
    }
  }
  updateResizeHandle(view, cell, forMarginLeft);
}

// Function that handles the mouseleave event from the table cell.
function handleMouseLeave(view: EditorView): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {cellPos, draggingInfo} = resizeState;
  if (cellPos > -1 && !draggingInfo) {
    updateResizeHandle(view, -1, false);
  }
}

// Function that handles the mousedown event from the table cell.
function handleMouseDown(view: EditorView, event: MouseEvent): boolean {
  const resizeState = PLUGIN_KEY.getState(view.state);
  if (resizeState.cellPos === -1 || resizeState.draggingInfo) {
    return false;
  }
  view.dispatch(
    view.state.tr.setMeta(PLUGIN_KEY, {
      setDraggingInfo: calculateDraggingInfo(view, event, resizeState),
    })
  );

  // Move events should be batched to avoid over-handling the mouse
  // event.
  const dragMove = batchMouseHandler(handleDragMove);

  const finish = (event: MouseEvent) => {
    window.removeEventListener('mouseup', finish, true);
    window.removeEventListener('mousemove', move, true);
    handleDragEnd(view, event);
  };

  const move = (event: MouseEvent) => {
    if (event.which) {
      dragMove(view, event);
    } else {
      finish(event);
    }
  };

  window.addEventListener('mouseup', finish, true);
  window.addEventListener('mousemove', move, true);
  event.preventDefault();
  return true;
}

// Function that handles the mouse event while resizing the table cell.
// This will temporarily updates the table's style until the resize ends.
function handleDragMove(view: EditorView, event: PointerEvent): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {draggingInfo, forMarginLeft} = resizeState;
  if (!draggingInfo) {
    return;
  }
  const {
    startX,
    columnWidths,
    taregtColumnIndex,
    columnElements,
    tableElement,
    tableMarginLeft,
    tableMarginRight,
  } = draggingInfo;

  let totalWidth = 0;
  let ml = tableMarginLeft;

  const dx = event.clientX - startX;
  const lastIndex = columnWidths.length - 1;
  const widths = columnWidths.map((cw, index) => {
    let ww;
    if (forMarginLeft) {
      if (index === 0) {
        // Resize the first column.
        ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + tableMarginLeft);
        // Resize table's left margin.
        ml = Math.max(0, tableMarginLeft + cw - ww);
      } else {
        // The rest columns remain the same,
        ww = cw;
      }
    } else if (index === taregtColumnIndex && index === lastIndex) {
      // Resize the last column.
      ww = Math.min(cw + tableMarginRight, Math.max(CELL_MIN_WIDTH, cw + dx));
    } else if (index === taregtColumnIndex) {
      // Resize the column.
      ww = Math.min(
        Math.max(CELL_MIN_WIDTH, cw + dx),
        cw + (columnWidths[index + 1] || 0) - CELL_MIN_WIDTH
      );
    } else if (index === taregtColumnIndex + 1) {
      // Resize the column's previous column.
      ww = Math.min(
        Math.max(CELL_MIN_WIDTH, cw - dx),
        cw + (columnWidths[index - 1] || 0) - CELL_MIN_WIDTH
      );
    } else {
      // This column does not resize.
      ww = cw;
    }

    totalWidth += ww;
    return ww;
  });

  const tableElementStyle = tableElement.style;
  tableElementStyle.marginLeft = `${ml}px`;
  tableElementStyle.width = Math.round(totalWidth) + 'px';
  tableElementStyle.minWidth = '';
  columnElements.forEach((colEl, index) => {
    colEl.style.width = Math.round(widths[index]) + 'px';
  });
}

// Function that handles the mouse event while stop resizing the table cell.
function handleDragEnd(view: EditorView, event: PointerEvent): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {cellPos, draggingInfo} = resizeState;
  if (!draggingInfo) {
    return;
  }
  const {columnElements, tableElement} = draggingInfo;
  const widths = Array.from(columnElements).map(colEl => {
    return parseFloat(colEl.style.width);
  });

  const $cell = view.state.doc.resolve(cellPos);
  const start = $cell.start(-1);
  const table = $cell.node(-1);
  const map = TableMap.get(table);
  let tr = view.state.tr;
  for (let row = 0; row < map.height; row++) {
    for (let col = 0; col < widths.length; col++) {
      const width = widths[col];
      const mapIndex = row * map.width + col;
      if (row && map.map[mapIndex] == map.map[mapIndex - map.width]) {
        // Rowspanning cell that has already been handled
        continue;
      }
      const pos = map.map[mapIndex];
      const {attrs} = table.nodeAt(pos);
      const index = attrs.colspan == 1 ? 0 : col - map.colCount(pos);

      if (attrs.colwidth && attrs.colwidth[index] === width) {
        continue;
      }

      const colwidth = attrs.colwidth
        ? attrs.colwidth.slice()
        : zeroes(attrs.colspan);
      colwidth[index] = width;
      tr = tr.setNodeMarkup(
        start + pos,
        null,
        setAttr(attrs, 'colwidth', colwidth)
      );
    }
  }

  const marginLeft = parseFloat(tableElement.style.marginLeft) || null;
  if (table.attrs.marginLeft !== marginLeft) {
    const nodeType = table.type;
    const attrs = {
      ...table.attrs,
      marginLeft,
    };
    const tableLookup = findParentNodeOfTypeClosestToPos(
      $cell,
      view.state.schema.nodes[nodeType.name]
    );
    const tablePos = nullthrows(tableLookup && tableLookup.pos);
    tr = tr.setNodeMarkup(tablePos, nodeType, attrs);
  }

  if (tr.docChanged) {
    // Let editor know the change.
    view.dispatch(tr);
  }
  // Hides the resize handle bars.
  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {setDraggingInfo: null}));
}

// Helper that prepares the information needed before the resizing starts.
function calculateDraggingInfo(
  view: EditorView,
  event: MouseEvent,
  resizeState: ResizeState
): ?DraggingInfo {
  const {cellPos, forMarginLeft} = resizeState;
  const dom = view.domAtPos(cellPos);
  const tableEl = dom.node.closest('table');
  const tableWrapper = tableEl.closest('.tableWrapper');
  const colEls = tableEl.querySelectorAll('colgroup > col');
  const tableWrapperRect = tableWrapper.getBoundingClientRect();
  const tableRect = tableEl.getBoundingClientRect();
  const defaultColumnWidth = tableWrapperRect.width / colEls.length;
  const startX = event.clientX;
  const offsetLeft = startX - tableRect.left;

  let tableWidth = 0;
  let taregtColumnIndex = -1;

  const tableMarginLeftStyle = tableEl.style.marginLeft;
  const tableMarginLeft =
    tableMarginLeftStyle && /\d+px/.test(tableMarginLeftStyle)
      ? parseFloat(tableMarginLeftStyle)
      : 0;

  const tableMarginRight = tableWrapperRect.right - tableRect.right;

  // Calculate the inital width of each column.
  // Calculate the inital width of the table.
  // Find out the target column to resize.
  const columnWidths = Array.from(colEls).map((colEl, ii) => {
    const cssWidth = colEl.style.width;
    let colWidth = Math.max(
      CELL_MIN_WIDTH,
      (cssWidth && parseFloat(cssWidth)) || defaultColumnWidth
    );

    if (tableWidth + colWidth > tableWrapperRect.width) {
      // column is too wide, make it fit.
      colWidth -= tableWrapperRect.width - (tableWidth + colWidth);
    }

    // The edges of the column's right border.
    const edgeLeft = tableWidth + colWidth - HANDLE_WIDTH / 2;
    const edgeRight = tableWidth + colWidth + HANDLE_WIDTH / 2;
    if (offsetLeft >= edgeLeft && offsetLeft <= edgeRight) {
      // This is the column to resize.
      taregtColumnIndex = ii;
    }
    tableWidth += colWidth;
    return colWidth;
  });

  if (forMarginLeft) {
    // Both the first column and the table's left margin should resize.
    taregtColumnIndex = 0;
  }

  if (taregtColumnIndex < 0) {
    // Nothing to resize. This happens when the mouse isn't nearby any position
    // that is alllowed to resize a column.
    return null;
  }

  return {
    columnElements: colEls,
    taregtColumnIndex,
    columnWidths,
    startX,
    tableElement: tableEl,
    tableMarginLeft,
    tableMarginRight,
    tableWidth,
    tableWrapperWidth: tableWrapperRect.width,
  };
}

// Helper that finds the closest cell element from a given event target.
function domCellAround(target: any): ?Element {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror')
      ? null
      : target.parentElement;
  }
  return target;
}

// Helper that resolves the prose-mirror node postion of a cell from a given
// event target.
function edgeCell(view: EditorView, event: PointerEvent, side: string): number {
  const {pos} = view.posAtCoords({left: event.clientX, top: event.clientY});
  const $cell = cellAround(view.state.doc.resolve(pos));
  if (!$cell) {
    return -1;
  }
  if (side == 'right') {
    return $cell.pos;
  }
  const map = TableMap.get($cell.node(-1));
  const start = $cell.start(-1);
  const index = map.map.indexOf($cell.pos - start);
  return index % map.width == 0 ? -1 : start + map.map[index - 1];
}

// Update the resize handler (UI) state.
function updateResizeHandle(
  view: EditorView,
  cellPos: number,
  forMarginLeft: boolean
): void {
  view.dispatch(
    view.state.tr.setMeta(PLUGIN_KEY, {
      setCellPos: cellPos,
      setForMarginLeft: forMarginLeft,
    })
  );
}

function zeroes(n: number): Array<number> {
  const result = new Array(n);
  result.fill(0);
  return result;
}

// Get the decorations that renders the resize handle bars.
function handleDecorations(
  state: EditorState,
  resizeState: ResizeState
): DecorationSet {
  if (!resizeState.cellPos) {
    return DecorationSet.create(state.doc, []);
  }
  const decorations = [];
  const $cell = state.doc.resolve(resizeState.cellPos);
  const table = $cell.node(-1);

  const map = TableMap.get(table);
  const start = $cell.start(-1);
  const col = map.colCount($cell.pos - start) + $cell.nodeAfter.attrs.colspan;
  for (let row = 0; row < map.height; row++) {
    const index = col + row * map.width - 1;
    // For positions that are have either a different cell or the end
    // of the table to their right, and either the top of the table or
    // a different cell above them, add a decoration
    if (
      (col === map.width || map.map[index] !== map.map[index + 1]) &&
      (row === 0 || map.map[index - 1] !== map.map[index - 1 - map.width])
    ) {
      const cellPos = map.map[index];
      const pos = start + cellPos + table.nodeAt(cellPos).nodeSize - 1;
      const dom = document.createElement('div');
      let className = 'column-resize-handle';
      if (resizeState.forMarginLeft) {
        className += ' for-margin-left';
      }
      dom.className = className;
      decorations.push(Decoration.widget(pos, dom));
    }
  }
  return DecorationSet.create(state.doc, decorations);
}

// Creates a custom table view that renders the margin-left style.
function createTableView(node: Node, view: EditorView): TableView {
  const tableView = new TableView(node, CELL_MIN_WIDTH, view);
  const updateOriginal = tableView.update;
  const updatePatched = function(node: Node): boolean {
    if (!updateOriginal.call(tableView, node)) {
      return false;
    }
    const marginLeft = (node.attrs && node.attrs.marginLeft) || 0;
    tableView.table.style.marginLeft = marginLeft ? `${marginLeft}px` : '';
    return true;
  };

  Object.assign(tableView, {
    update: updatePatched,
  });

  updatePatched(node);
  return tableView;
}

function batchMouseHandler(
  handler: (view: EditorView, pe: PointerEvent) => void
): (view: EditorView, me: MouseEvent) => void {
  let target = null;
  let clientX = 0;
  let clientY = 0;
  let view = null;
  const onMouseEvent = () => {
    if (view && target) {
      const pointerEvent = {
        target,
        clientX,
        clientY,
      };
      handler(view, pointerEvent);
    }
  };
  return function(ev: EditorView, me: MouseEvent) {
    target = me.target;
    clientX = me.clientX;
    clientY = me.clientY;
    view = ev;
    requestAnimationFrame(onMouseEvent);
  };
}

// Plugin that supports table columns resizing.
export default class TableResizePlugin extends Plugin {
  spec: Object;

  constructor() {
    super({
      key: PLUGIN_KEY,
      state: {
        init(_: any, state: EditorState): ResizeState {
          this.spec.props.nodeViews[
            tableNodeTypes(state.schema).table.name
          ] = createTableView;
          return new ResizeState(-1, null);
        },
        apply(tr: Transform, prev: EditorState): EditorState {
          return prev.apply(tr);
        },
      },
      props: {
        attributes(state: EditorState): ?Object {
          const resizeState = PLUGIN_KEY.getState(state);
          return resizeState.cellPos > -1 ? {class: 'resize-cursor'} : null;
        },
        handleDOMEvents: {
          // Move events should be batched to avoid over-handling the mouse
          // event.
          mousemove: batchMouseHandler(handleMouseMove),
          mouseleave: handleMouseLeave,
          mousedown: handleMouseDown,
        },
        decorations(state: EditorState): ?DecorationSet {
          const resizeState = PLUGIN_KEY.getState(state);
          return resizeState.cellPos > -1
            ? handleDecorations(state, resizeState)
            : undefined;
        },
        nodeViews: {},
      },
    });
  }
}
