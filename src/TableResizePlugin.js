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

import {Node} from 'prosemirror-model';
import {EditorState, Plugin, PluginKey} from 'prosemirror-state';
import {tableNodeTypes} from 'prosemirror-tables/src/schema';
import {TableMap} from 'prosemirror-tables/src/tablemap';
import {TableView} from 'prosemirror-tables/src/tableview';
import {cellAround, pointsAtCell, setAttr} from 'prosemirror-tables/src/util';
import {Transform} from 'prosemirror-transform';
import {Decoration, DecorationSet, EditorView} from 'prosemirror-view';

// This plugin is forked from
// https://github.com/ProseMirror/prosemirror-tables/blob/master/src/columnresizing.js
// and this file has been modified to support the same table resize behaviors
// as Google Doc does.

type DraggingInfo = {
  columnElements: Array<HTMLElement>,
  columnIndex: number,
  startX: number,
  tableElement: HTMLElement,
  tableMarginLeft: number,
  tableMarginRight: number,
  tableWidth: number,
  tableWrapperWidth: number,
};

const PLUGIN_KEY = new PluginKey('tableColumnResizing');
const CELL_MIN_WIDTH = 25;
const HANDLE_WIDTH = 20;

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

function handleMouseMove(view: EditorView, event: MouseEvent): void {
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
  updateHandle(view, cell, forMarginLeft);
}

function handleMouseLeave(view: EditorView): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {cellPos, draggingInfo} = resizeState;
  if (cellPos > -1 && !draggingInfo) {
    updateHandle(view, -1, false);
  }
}

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

  const finish = (event: MouseEvent) => {
    window.removeEventListener('mouseup', finish, true);
    window.removeEventListener('mousemove', move, true);
    handleDragEnd(view, event);
  };

  const move = (event: MouseEvent) => {
    if (event.which) {
      handleDragMove(view, event);
    } else {
      finish(event);
    }
  };

  window.addEventListener('mouseup', finish, true);
  window.addEventListener('mousemove', move, true);
  event.preventDefault();
  return true;
}

function handleDragMove(view: EditorView, event: MouseEvent): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {draggingInfo, forMarginLeft} = resizeState;
  if (!draggingInfo) {
    return;
  }
  const {
    startX,
    columnWidths,
    columnIndex,
    columnElements,
    tableElement,
    tableMarginLeft,
    tableMarginRight,
  } = draggingInfo;

  let totalWidth = 0;
  let ml = tableMarginLeft;

  const dx = event.clientX - startX;
  const lastIndex = columnWidths.length - 1;
  const widths = columnWidths.map((cw, ii) => {
    let ww;
    if (forMarginLeft) {
      if (ii === 0) {
        ww = Math.min(Math.max(CELL_MIN_WIDTH, cw - dx), cw + tableMarginLeft);
        ml = Math.max(0, tableMarginLeft + cw - ww);
      } else {
        ww = cw;
      }
    } else if (ii === columnIndex && ii === lastIndex) {
      ww = Math.min(cw + tableMarginRight, Math.max(CELL_MIN_WIDTH, cw + dx));
    } else if (ii === columnIndex) {
      ww = Math.min(
        Math.max(CELL_MIN_WIDTH, cw + dx),
        cw + (columnWidths[ii + 1] || 0) - CELL_MIN_WIDTH
      );
    } else if (ii === columnIndex + 1) {
      ww = Math.min(
        Math.max(CELL_MIN_WIDTH, cw - dx),
        cw + (columnWidths[ii - 1] || 0) - CELL_MIN_WIDTH
      );
    } else {
      ww = cw;
    }

    totalWidth += ww;
    return ww;
  });
  const tableElementStyle = tableElement.style;
  tableElementStyle.marginLeft = `${ml}px`;
  tableElementStyle.width = Math.round(totalWidth) + 'px';
  tableElementStyle.minWidth = '';
  columnElements.forEach((colEl, ii) => {
    colEl.style.width = Math.round(widths[ii]) + 'px';
  });
}

function handleDragEnd(view: EditorView, event: MouseEvent): void {
  const resizeState = PLUGIN_KEY.getState(view.state);
  const {cellPos, draggingInfo} = resizeState;
  if (!draggingInfo) {
    return;
  }
  const {columnElements} = draggingInfo;
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
  if (tr.docChanged) {
    view.dispatch(tr);
  }
  view.dispatch(view.state.tr.setMeta(PLUGIN_KEY, {setDraggingInfo: null}));
}

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
  let columnIndex = -1;

  const tableMarginLeftStyle = tableEl.style.marginLeft;
  const tableMarginLeft =
    tableMarginLeftStyle && /\d+px/.test(tableMarginLeftStyle)
      ? parseFloat(tableMarginLeftStyle)
      : 0;

  const tableMarginRight = tableWrapperRect.right - tableRect.right;

  const columnWidths = Array.from(colEls).map((colEl, ii) => {
    const sw = colEl.style.width;
    let ww = Math.max(
      CELL_MIN_WIDTH,
      (sw && parseFloat(sw)) || defaultColumnWidth
    );

    if (tableWidth + ww > tableWrapperRect.width) {
      ww -= tableWrapperRect.width - (tableWidth + ww);
    }
    const edgeLeft = tableWidth + ww - HANDLE_WIDTH / 2;
    const edgeRight = tableWidth + ww + HANDLE_WIDTH / 2;
    if (offsetLeft >= edgeLeft && offsetLeft <= edgeRight) {
      columnIndex = ii;
    }
    tableWidth += ww;
    return ww;
  });

  if (forMarginLeft) {
    columnIndex = 0;
  }

  if (columnIndex < 0) {
    return null;
  }

  return {
    columnElements: colEls,
    columnIndex,
    columnWidths,
    startX,
    tableElement: tableEl,
    tableMarginLeft,
    tableMarginRight,
    tableWidth,
    tableWrapperWidth: tableWrapperRect.width,
  };
}

function domCellAround(target: any): ?Element {
  while (target && target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.classList.contains('ProseMirror')
      ? null
      : target.parentElement;
  }
  return target;
}

function edgeCell(view, event, side) {
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

function updateHandle(
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
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(0);
  }
  return result;
}

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

function createTableView(node: Node, view: EditorView): TableView {
  const tableView = new TableView(node, CELL_MIN_WIDTH, view);
  const updateOriginal = tableView.update;
  const updatePatched = function(node: Node): boolean {
    if (!updateOriginal.call(tableView, node)) {
      return false;
    }
    const forMarginLeft = (node.attrs && node.attrs.forMarginLeft) || 0;
    tableView.table.style.forMarginLeft = forMarginLeft
      ? `${forMarginLeft}px`
      : '';
    return true;
  };

  Object.assign(tableView, {
    update: updatePatched,
  });

  updatePatched(node);
  return tableView;
}

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
          mousemove: handleMouseMove,
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
