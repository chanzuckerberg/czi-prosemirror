// @flow

import UICommand from './ui/UICommand';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {undo} from 'prosemirror-history';

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
