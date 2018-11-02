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
  const command = new Command();
  command.execute = execute.bind(null);
  return command;
}
