// @flow

import Command from './Command';
import TableGridSizeSelector from './ui/TableGridSizeSelector';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

import type {TableGridSizeSelectorValue} from './ui/TableGridSizeSelector';

class TableInsertCommand extends Command {

  _popUp = null;

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
    return new Promise(resolve => {
      const viewProps = {
        target,
        position: 'right',
        onSelect: (value) => {
          this._popUp = null;
          resolve(value);
        },
      };
      this._popUp = createPopUp(TableGridSizeSelector, viewProps, () => {
        if (this._popUp) {
          this._popUp = null;
          resolve();
        }
      });
    });
  };

  executeWithUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
    inputs: ?TableGridSizeSelectorValue,
  ): boolean => {
    console.log('>>>', inputs);
    dispatch && dispatch(state.tr);
    return false;
  };
}

export default TableInsertCommand;
