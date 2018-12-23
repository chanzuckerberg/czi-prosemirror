// @flow

import {EditorState} from 'prosemirror-state';
import {AllSelection, TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import clearMarks from './clearMarks';
import UICommand from './ui/UICommand';

class MarksClearCommand extends UICommand {

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState) => {
    const {selection} = state;
    return !selection.empty && (
      selection instanceof TextSelection ||
      selection instanceof AllSelection
    );
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const tr = clearMarks(
      state.tr.setSelection(state.selection),
      state.schema,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default MarksClearCommand;
