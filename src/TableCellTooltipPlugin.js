// @flow

import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
/* eslint-disable-next-line */
import React from 'react';

import findActionableCell from './findActionableCell';
import {atAnchorTopRight} from './ui/PopUpPosition';
import TableCellTooltip from './ui/TableCellTooltip';
import createPopUp from './ui/createPopUp';
import {fromHTMlElement} from './ui/rects';

import './ui/czi-pop-up.css';

function isElementFullyVisible(el: HTMLElement): boolean {
  const {x, y, w, h} = fromHTMlElement(el);
  // Only checks the top-left point.
  const nwEl = (w && h) ? document.elementFromPoint(x + 1, y + 1) : null;
  if (!nwEl) {
    return false;
  }

  if (nwEl === el) {
    return true;
  }

  if (el.contains(nwEl)) {
    return true;
  }

  return false;
}

class TableCellTooltipView {
  _cellElement: null;
  _popUp = null;

  constructor(editorView: EditorView) {
    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {
    const {state, readOnly} = view;
    const result = findActionableCell(state);

    if (!result || readOnly) {
      this.destroy();
      return;
    }

    // These is screen coordinate.
    const domFound = view.domAtPos(result.pos + 1);
    if (!domFound) {
      this.destroy();
      return;
    }

    let cellEl = domFound.node;
    const popUp = this._popUp;
    const viewPops = {
      editorState: state,
      editorView: view,
    };

    if (cellEl && !isElementFullyVisible(cellEl)) {
      cellEl = null;
    }

    if (!cellEl) {
      // Closes the popup.
      popUp && popUp.close();
      this._cellElement = null;
    } else if (popUp && cellEl === this._cellElement) {
      // Updates the popup.
      popUp.update(viewPops);
    } else {
      // Creates a new popup.
      popUp && popUp.close();
      this._cellElement = cellEl;
      this._popUp =
        createPopUp(TableCellTooltip, viewPops, {
          anchor: cellEl,
          autoDismiss: false,
          onClose: this._onClose,
          position: atAnchorTopRight,
        });
    }
  }

  destroy = (): void => {
    this._popUp && this._popUp.close();
    this._popUp = null;
  };

  _onClose = (): void => {
    this._popUp = null;
  };
}

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  view(editorView: EditorView) {
    return new TableCellTooltipView(editorView);
  }
};

class TableCellTooltipPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default TableCellTooltipPlugin;
