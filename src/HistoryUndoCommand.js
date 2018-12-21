// @flow

import {undo} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import UICommand from './ui/UICommand';

class HistoryUndoCommand extends UICommand {

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return undo(state, dispatch);
  };
}

export default HistoryUndoCommand;
