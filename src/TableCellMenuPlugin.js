// @flow

import {EditorState, Plugin, PluginKey} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
/* eslint-disable-next-line */
import React from 'react';

import findActionableCell from './findActionableCell';
import {atAnchorTopRight} from './ui/PopUpPosition';
import TableCellMenu from './ui/TableCellMenu';
import bindScrollHandler from './ui/bindScrollHandler';
import createPopUp from './ui/createPopUp';
import isElementFullyVisible from './ui/isElementFullyVisible';

import './ui/czi-pop-up.css';

class TableCellTooltipView {
  _cellElement: null;
  _popUp = null;
  _scrollHandle = null;

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
      if (!view.disabled) {
        this._popUp = createPopUp(TableCellMenu, viewPops, {
          anchor: cellEl,
          autoDismiss: false,
          onClose: this._onClose,
          position: atAnchorTopRight,
        });
        this._onOpen();
      }
    }
  }

  destroy = (): void => {
    this._popUp && this._popUp.close();
    this._popUp = null;
  };

  _onOpen = (): void => {
    const cellEl = this._cellElement;
    if (!cellEl) {
      return;
    }
    this._scrollHandle = bindScrollHandler(cellEl, this._onScroll);
  };

  _onClose = (): void => {
    this._popUp = null;
    this._scrollHandle && this._scrollHandle.dispose();
    this._scrollHandle = null;
  };

  _onScroll = (): void => {
    const popUp = this._popUp;
    const cellEl = this._cellElement;
    if (!popUp || !cellEl) {
      return;
    }
    if (!isElementFullyVisible(cellEl)) {
      popUp.close();
    }
  };
}

// https://prosemirror.net/examples/tooltip/
const SPEC = {
  // [FS] IRAD-1005 2020-07-07
  // Upgrade outdated packages.
  key: new PluginKey('TableCellMenuPlugin'),
  view(editorView: EditorView) {
    return new TableCellTooltipView(editorView);
  },
};

class TableCellMenuPlugin extends Plugin {
  constructor() {
    super(SPEC);
  }
}

export default TableCellMenuPlugin;
