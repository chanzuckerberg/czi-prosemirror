// @flow

import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {setCellAttr} from 'prosemirror-tables';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import ColorEditor from './ui/ColorEditor';
import {atAnchorRight} from './ui/PopUpPosition';
import UICommand from './ui/UICommand';
import createPopUp from './ui/createPopUp';

const setCellBackgroundBlack = setCellAttr('background', '#000000');

class TableBackgroundColorCommand extends UICommand {
  _popUp = null;

  shouldRespondToUIEvent = (e: SyntheticEvent | MouseEvent): boolean => {
    return e.type === UICommand.EventType.MOUSEENTER;
  };

  isEnabled = (state: EditorState): boolean => {
    return setCellBackgroundBlack(state.tr);
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
      this._popUp = createPopUp(ColorEditor, null, {
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
    hex: ?string
  ): boolean => {
    if (dispatch && hex !== undefined) {
      const cmd = setCellAttr('background', hex);
      cmd(state, dispatch, view);
      return true;
    }
    return false;
  };

  cancel(): void {
    this._popUp && this._popUp.close(undefined);
  }
}

export default TableBackgroundColorCommand;
