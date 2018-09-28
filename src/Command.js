// @flow

import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

class Command {

  isActive = (state: EditorState): boolean => {
    return false;
  };

  isEnabled = (state: EditorState): boolean => {
    return this.execute(state);
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    return false;
  };
}

export default Command;
