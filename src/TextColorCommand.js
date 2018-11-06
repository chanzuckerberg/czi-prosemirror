// @flow

import ColorEditor from './ui/ColorEditor';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_COLOR} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atAnchorRight} from './ui/popUpPosition';

import type {ColorEditorValue} from './ui/ColorEditor';

class TextColorCommand extends UICommand {
  _popUp = null;
  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
  }

  shouldRespondToUIEvent = (e: (SyntheticEvent | MouseEvent)): boolean => {
    return e.type === UICommand.EventType.MOUSEENTER;
  };

  isEnabled = (state: EditorState): boolean => {
    const markType = this._schema.marks[MARK_COLOR];
    if (!markType) {
      return false;
    }
    const {from, to} = state.selection;
    return from < to;
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
        const markType = this._schema.marks[MARK_COLOR];
        const attrs = {color: hex};
        const tr = applyMark(
          state.tr.setSelection(state.selection),
          this._schema,
          markType,
          attrs,
        );
        if (tr.docChanged) {
          dispatch && dispatch(tr.scrollIntoView());
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  };
}

export default TextColorCommand;
