// @flow

import ColorEditor from './ui/ColorEditor';
import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_TEXT_HIGHLIGHT} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atAnchorRight} from './ui/popUpPosition';

import type {ColorEditorValue} from './ui/ColorEditor';

class TextHighlightCommand extends UICommand {
  _popUp = null;
  _schema: Schema;

  constructor(
    schema: Schema,
    level: number,
  ) {
    super();
    this._schema = schema;
  }

  isEnabled = (state: EditorState): boolean => {
    if (!(state.selection instanceof TextSelection)) {
      // Could be a NodeSelection or CellSelection.
      return false;
    }

    const markType = this._schema.marks[MARK_TEXT_HIGHLIGHT];
    if (!markType) {
      return false;
    }
    const {from, to} = state.selection;
    return from < to;
  };

  waitForUserInput = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
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
        const markType = this._schema.marks[MARK_TEXT_HIGHLIGHT];
        const attrs = {highlightColor: hex};
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

export default TextHighlightCommand;
