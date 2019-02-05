// @flow

import {EditorState, Plugin} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
/* eslint-disable-next-line */
import React from 'react';

import findActionableCell from './findActionableCell';
import {atAnchorTopRight} from './ui/PopUpPosition';
import TableCellTooltip from './ui/TableCellTooltip';
import createPopUp from './ui/createPopUp';

import './ui/czi-pop-up.css';

class TableCellTooltipView {
  _cellElement: null;
  _popUp = null;

  constructor(editorView: EditorView) {
    this.update(editorView, null);
  }

  update(view: EditorView, lastState: EditorState): void {
    const {state} = view;
    const result = findActionableCell(state);

    if (!result) {
      this.destroy();
      return;
    }

    // These is screen coordinate.
    const domFound = view.domAtPos(result.pos + 1, result.pos);
    if (!domFound) {
      this.destroy();
      return;
    }

    const cellEl = domFound.node;
    const popUp = this._popUp;
    const viewPops = {
      editorState: state,
      editorView: view,
    };

    if (popUp && cellEl  === this._cellElement) {
      popUp.update(viewPops);
    } else {
      popUp && popUp.close();
      this._cellElement = cellEl;
      this._popUp = createPopUp(TableCellTooltip, viewPops, {
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
