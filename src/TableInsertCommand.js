// @flow

import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import insertTable from './insertTable';
import {atAnchorRight} from './ui/PopUpPosition';
import TableGridSizeEditor from './ui/TableGridSizeEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';

import type {TableGridSizeEditorValue} from './ui/TableGridSizeEditor';

class TableInsertCommand extends UICommand {
  _popUp = null;

  shouldRespondToUIEvent = (e: SyntheticEvent | MouseEvent): boolean => {
    return e.type === UICommand.EventType.MOUSEENTER;
  };

  isEnabled = (state: EditorState): boolean => {
    const tr = state;
    const {selection} = tr;
    if (selection instanceof TextSelection) {
      return selection.from === selection.to;
    }
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    event: ?SyntheticEvent
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(undefined);
    }
    const target = nullthrows(event).currentTarget;
    if (!(target instanceof HTMLElement)) {
      return Promise.resolve(undefined);
    }

    const anchor = event ? event.currentTarget : null;
    return new Promise(resolve => {
      this._popUp = createPopUp(TableGridSizeEditor, null, {
        anchor,
        position: atAnchorRight,
        onClose: val => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        },
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: ?TableGridSizeEditorValue
  ): boolean => {
    if (dispatch) {
      const {selection, schema} = state;
      let {tr} = state;
      if (inputs) {
        const {rows, cols} = inputs;
        tr = tr.setSelection(selection);
        tr = insertTable(tr, schema, rows, cols);
      }
      dispatch(tr);
    }
    return false;
  };
}

export default TableInsertCommand;
