// @flow

import * as EditorCommand from './EditorCommand';
import * as KeyMaps from './keymaps';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {Transform} from 'prosemirror-transform';

import {keymap} from 'prosemirror-keymap';

type UserKeyCommand = (
  state: EditorState,
  dispatch: ?(tr: Transform) => void,
  view: ?EditorView,
) => void;

type UserKeyMap = {
  [key: string]: UserKeyCommand,
};

const {
  KEY_INDENT_LIST_ITEM_LESS,
  KEY_INDENT_LIST_ITEM_MORE,
  KEY_TABLE_MOVE_TO_NEXT_CELL,
  KEY_TABLE_MOVE_TO_PREV_CELL,
  KEY_REDO,
  KEY_SPLIT_LIST_ITEM,
  KEY_UNDO,
} = KeyMaps;

const {
  HISTORY_REDO,
  HISTORY_UNDO,
  LIST_INDENT_LESS,
  LIST_INDENT_MORE,
  LIST_SPLIT,
  TABLE_MOVE_TO_NEXT_CELL,
  TABLE_MOVE_TO_PREV_CELL,
} = EditorCommand;

export default function createEditorKeyMap(): UserKeyMap {
  const result = {};
  result[KEY_INDENT_LIST_ITEM_LESS.common] = LIST_INDENT_LESS.execute;
  result[KEY_INDENT_LIST_ITEM_MORE.common] = LIST_INDENT_MORE.execute;
  result[KEY_REDO.common] = HISTORY_REDO.execute;
  // result[KEY_SPLIT_LIST_ITEM.common] = LIST_SPLIT.execute;
  result[KEY_UNDO.common] = HISTORY_UNDO.execute;
  result[KEY_TABLE_MOVE_TO_PREV_CELL.common] = TABLE_MOVE_TO_PREV_CELL.execute;
  result[KEY_TABLE_MOVE_TO_NEXT_CELL.common] = TABLE_MOVE_TO_NEXT_CELL.execute;
  return result;
}
