// @flow

import * as EditorCommands from './EditorCommands';
import * as KeyMaps from './keymaps';

import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';
import UICommand from './ui/UICommand';

type UserKeyCommand = (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => boolean;

type UserKeyMap = {
  [key: string]: UserKeyCommand,
};

const {
  KEY_BACK_DELETE,
  KEY_FORWARD_DELETE,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_TAB_SHIFT,
  KEY_TAB,
  KEY_UNDO,
} = KeyMaps;

const {
  HISTORY_REDO,
  HISTORY_UNDO,
  INDENT_LESS,
  INDENT_MORE,
  LIST_ITEM_MERGE_DOWN,
  LIST_ITEM_MERGE_UP,
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
  const result = {
    [KEY_BACK_DELETE.common]: LIST_ITEM_MERGE_UP.execute,
    [KEY_FORWARD_DELETE.common]: LIST_ITEM_MERGE_DOWN.execute,
    [KEY_REDO.common]: HISTORY_REDO.execute,
    [KEY_SPLIT_LIST_ITEM.common]: LIST_SPLIT.execute,
    [KEY_TAB.common]: bindCommands(
      TABLE_MOVE_TO_NEXT_CELL,
      INDENT_MORE,
    ),
    [KEY_TAB_SHIFT.common]: bindCommands(
      TABLE_MOVE_TO_PREV_CELL,
      INDENT_LESS,
    ),
    [KEY_UNDO.common]: HISTORY_UNDO.execute,
  };

  return result;
}
