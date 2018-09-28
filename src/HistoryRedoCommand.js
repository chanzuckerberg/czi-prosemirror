// @flow

import Command from './Command';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import {redo} from 'prosemirror-history';

class HistoryRedoCommand extends Command {
  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return redo(state, dispatch);
  };
}

export default HistoryRedoCommand;
