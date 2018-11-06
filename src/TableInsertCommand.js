// @flow

import UICommand from './ui/UICommand';
import TableGridSizeEditor from './ui/TableGridSizeEditor';
import createPopUp from './ui/createPopUp';
import insertTable from './insertTable';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atAnchorRight} from './ui/popUpPosition';

import type {TableGridSizeEditorValue} from './ui/TableGridSizeEditor';

class TableInsertCommand extends UICommand {

  _popUp = null;
  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
  }

  getUIEventType = (): string => {
    return UICommand.EventType.MOUSE_ENTER;
  };

  isEnabled = (state: EditorState): boolean => {
    const tr = state;
    const {selection} = state.tr;
    if (selection instanceof TextSelection) {
      return selection.from === selection.to;
    }
    return false;
  };

  waitForUserInput = (
    state: EditorState,
    event: ?SyntheticEvent,
  ): Promise<any> => {
    if (this._popUp) {
      return Promise.resolve(null);
    }
    const target = nullthrows(event).currentTarget;
    if (!(target instanceof HTMLElement)) {
      return Promise.resolve(null);
    }

    const anchor = event ? event.currentTarget : null;
    return new Promise(resolve => {
      this._popUp = createPopUp(TableGridSizeEditor, null, {
        anchor,
        position: atAnchorRight,
        onClose: (val) => {
          if (this._popUp) {
            this._popUp = null;
            resolve(val);
          }
        }
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: ?TableGridSizeEditorValue,
  ): boolean => {
    if (dispatch) {
      let {tr, selection} = state;
      if (inputs) {
        const {rows, cols} = inputs;
        tr = tr.setSelection(selection);
        tr = insertTable(tr, this._schema, rows, cols);
      }
      dispatch(tr);
    }
    return false;
  };
}

export default TableInsertCommand;
