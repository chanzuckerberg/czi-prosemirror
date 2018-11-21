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
import {AllSelection, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {atAnchorRight} from './ui/popUpPosition';

class TextHighlightCommand extends UICommand {

  _popUp = null;

  isEnabled = (state: EditorState): boolean => {
    const {selection, schema} = state;
    if (!(
      selection instanceof TextSelection ||
      selection instanceof AllSelection
    )) {
      // Could be a NodeSelection or CellSelection.
      return false;
    }

    const markType = schema.marks[MARK_TEXT_HIGHLIGHT];
    if (!markType) {
      return false;
    }
    const {from, to} = selection;
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
    hex: ?string,
  ): boolean => {
    if (dispatch && hex !== undefined) {
      let {tr, selection, schema} = state;
      const markType = schema.marks[MARK_TEXT_HIGHLIGHT];
      const attrs = hex ? {highlightColor: hex} : null;
      tr = applyMark(
        tr.setSelection(state.selection),
        schema,
        markType,
        attrs,
      );
      if (tr.docChanged) {
        dispatch && dispatch(tr.scrollIntoView());
        return true;
      }
    }
    return false;
  };
}

export default TextHighlightCommand;
