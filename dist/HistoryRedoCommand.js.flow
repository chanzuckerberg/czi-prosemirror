// @flow

import {redo} from 'prosemirror-history';
import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import UICommand from './ui/UICommand';

class HistoryRedoCommand extends UICommand {
  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return redo(state, dispatch);
  };
}

export default HistoryRedoCommand;
