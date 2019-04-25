// @flow

import {EditorState} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';
import {EditorView} from 'prosemirror-view';

import UICommand from './ui/UICommand';

type ExecuteCall = (
  state: EditorState,
  dispatch?: ?(tr: Transform) => void,
  view?: ?EditorView
) => boolean;

export default function createCommand(execute: ExecuteCall): UICommand {
  class CustomCommand extends UICommand {
    isEnabled = (state: EditorState): boolean => {
      return this.execute(state);
    };

    execute = (
      state: EditorState,
      dispatch: ?(tr: Transform) => void,
      view: ?EditorView
    ): boolean => {
      const tr = state.tr;
      let endTr = tr;
      execute(
        state,
        nextTr => {
          endTr = nextTr;
          dispatch && dispatch(endTr);
        },
        view
      );
      return endTr.docChanged || tr !== endTr;
    };
  }
  return new CustomCommand();
}
