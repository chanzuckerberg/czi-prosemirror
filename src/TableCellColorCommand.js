// @flow

import ColorEditor from './ui/ColorEditor';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atAnchorRight} from './ui/popUpPosition';
import {setCellAttr} from 'prosemirror-tables';

import type {ColorEditorValue} from './ui/ColorEditor';

const setCellBackgroundBlack = setCellAttr('background', '#000000');

class TableCellColorCommand extends UICommand {
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
    return setCellBackgroundBlack(state.tr);
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
      this._popUp = createPopUp(ColorEditor, null, {
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
    inputs: ?ColorEditorValue,
  ): boolean => {
    if (dispatch) {
      let {tr, selection} = state;
      if (inputs) {
        const {hex} = inputs;
        console.log(hex);
        tr = tr.setSelection(selection);
        const cmd = setCellAttr('background', hex);
        cmd(state, dispatch, view);
        return true;
      }
    }
    return false;
  };
}

export default TableCellColorCommand;
