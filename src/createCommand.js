// @flow

import Command from './Command';
import {EditorState, Selection} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

type ExecuteCall = (
  state: EditorState,
  dispatch?: ?(tr: Transform) => void,
  view?: ?EditorView,
) => boolean;

export default function createCommand(execute: ExecuteCall): Command {
  class CustomCommand extends Command {
    execute = (
      state: EditorState,
      dispatch: ?(tr: Transform) => void,
      view: ?EditorView,
    ): boolean => {
      let tr = state.tr;
      const passed = execute(state, (nextTr) => {
        tr = nextTr;
        dispatch && dispatch(nextTr);
        return tr.docChanged;
      }, view);
      return passed && tr.docChanged;
    };
  }
  // const command = new Command();
  // const exe = execute;
  // command.execute = function (s, d, v) {
  //   // const passed = ex(state, dispatch, view);
  //   return true;
  // };
  return new CustomCommand();
}
