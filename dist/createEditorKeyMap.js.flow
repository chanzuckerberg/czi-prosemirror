// @flow

import * as EditorCommands from './EditorCommands';
import * as KeyMaps from './keymaps';
import UICommand from './ui/UICommand';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

type UserKeyCommand = (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => boolean;

type UserKeyMap = {
  [key: string]: UserKeyCommand,
};

const {
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_UNDO,
  KEY_TAB,
  KEY_TAB_SHIFT,
} = KeyMaps;

const {
  HISTORY_REDO,
  HISTORY_UNDO,
  INDENT_LESS,
  INDENT_MORE,
  LIST_SPLIT,
  TABLE_MOVE_TO_NEXT_CELL,
  TABLE_MOVE_TO_PREV_CELL,
} = EditorCommands;

function bindCommands(...commands: Array<UICommand>): UserKeyCommand {
  return function(
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean {
    return commands.some(cmd => {
      if (cmd.isEnabled(state, view)) {
        cmd.execute(state, dispatch, view);
        return true;
      }
      return false;
    });
  };
}

export default function createEditorKeyMap(): UserKeyMap {
  const result = {};
  result[KEY_REDO.common] = HISTORY_REDO.execute;
  result[KEY_SPLIT_LIST_ITEM.common] = LIST_SPLIT.execute;
  result[KEY_TAB.common] = bindCommands(
    TABLE_MOVE_TO_NEXT_CELL,
    INDENT_MORE,
  );
  result[KEY_TAB_SHIFT.common] = bindCommands(
    TABLE_MOVE_TO_PREV_CELL,
    INDENT_LESS,
  );
  result[KEY_UNDO.common] = HISTORY_UNDO.execute;
  return result;
}
